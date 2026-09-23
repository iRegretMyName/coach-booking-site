import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(Boolean).map((line) => line.split(/=(.*)/s).slice(0, 2)))
const archive = 'C:\\Users\\xspac\\Downloads\\Blogs.zip'
const powerShell = `Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip=[System.IO.Compression.ZipFile]::OpenRead('${archive}'); $entry=$zip.GetEntry('chat.md'); $reader=[System.IO.StreamReader]::new($entry.Open()); $text=$reader.ReadToEnd(); $reader.Dispose(); $zip.Dispose(); [Console]::OutputEncoding=[System.Text.Encoding]::UTF8; Write-Output $text`
const chat = execFileSync('powershell', ['-NoProfile', '-Command', powerShell], { encoding: 'utf8', maxBuffer: 8_000_000 })

const categories = [
  [1, 10, 'Nervous System & Reality', '✦'],
  [11, 15, 'Home, Environment & Lineage', '⌂'],
  [16, 20, 'Relationships, Money & Receiving', '∞'],
  [21, 30, 'Creation & Becoming', '☼'],
]
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const fallbackHeadings = {
  3: ['When safety feels unfamiliar', 'What your system is really responding to', 'A gentler place to begin'],
  4: ['Memory is more than a thought', 'How the body keeps the old story close', 'Creating a new experience of safety'],
  5: ['Why reaction arrives before reason', 'From survival response to conscious choice', 'Practice the pause, not perfection'],
}
const toHtml = (number, text) => {
  const blocks = []
  let paragraph = []
  const flush = () => {
    if (paragraph.length) blocks.push(`<p>${paragraph.map(escape).join(' ')}</p>`)
    paragraph = []
  }
  for (const rawLine of text.trim().split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) { flush(); continue }
    if (/^\d+\.\s+/.test(line)) {
      flush()
      blocks.push(`<h2>${escape(line.replace(/^\d+\.\s+/, ''))}</h2>`)
      continue
    }
    if (/^P\.S\./i.test(line)) {
      flush()
      blocks.push(`<aside class="article-practice"><span>THE PRACTICE</span><p>${escape(line.replace(/^P\.S\.\s*/i, ''))}</p>`)
      continue
    }
    if (/^\[Book Your|^\[Take The/i.test(line)) {
      if (blocks.at(-1)?.startsWith('<aside')) blocks.push(`<p class="article-practice-action">${escape(line.replace(/[\[\]]/g, ''))}</p></aside>`)
      else blocks.push(`<p class="article-cta-line">${escape(line.replace(/[\[\]]/g, ''))}</p>`)
      continue
    }
    paragraph.push(line)
    if (paragraph.join(' ').length > 470) flush()
  }
  flush()
  if (!blocks.some((block) => block.includes('article-practice'))) blocks.push('<aside class="article-practice"><span>THE PRACTICE</span><p>Before you move on, place both feet on the floor. Take one slower breath than usual, notice one sound in the room, and ask: what would help my system feel 5% safer right now?</p><p class="article-practice-action">Reflection: You do not need to solve everything today. Begin by noticing what is here.</p></aside>')
  if (!blocks.some((block) => block.startsWith('<h2>')) && fallbackHeadings[number]) {
    const headings = fallbackHeadings[number]
    const rebuilt = []
    let paragraphCount = 0
    for (const block of blocks) {
      rebuilt.push(block)
      if (block.startsWith('<p>')) {
        paragraphCount += 1
        if (paragraphCount === 2 || paragraphCount === 4 || paragraphCount === 6) {
          const heading = headings.shift()
          if (heading) rebuilt.push(`<h2>${heading}</h2>`)
        }
      }
    }
    return rebuilt.join('\n')
  }
  return blocks.join('\n')
}

const requestedCount = Number(process.argv[2] || 30)
const matches = [...chat.matchAll(/^BLOG #(\d+):\s*(.+)\r?\n([\s\S]*?)(?=^BLOG #\d+:|(?![\s\S]))/gm)]
const posts = matches.slice(0, requestedCount).map((match) => {
  const number = Number(match[1])
  const [from, to, category, emoji] = categories.find(([start, end]) => number >= start && number <= end)
  let body = match[3]
  body = body.split(/\r?\n(?:￼\r?\n)?(?:This is your style|\[\d{1,2}:\d{2}.*?\]\s+\*\*Mum:\*\*|Ready for Blog|Want me to)/i)[0]
  body = body.replace(/\r?\n￼\r?\n/g, '\n\n').trim()
  return { title: match[2].trim(), slug: `${String(number).padStart(2, '0')}-${slugify(match[2])}`, excerpt: body.replace(/\s+/g, ' ').slice(0, 190).trim() + '…', cover_emoji: emoji, category, content: toHtml(number, body), published: true, sort_order: number * 10 }
})

if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount > 30 || posts.length !== requestedCount) throw new Error(`Expected ${requestedCount} blogs, found ${posts.length}. No changes made.`)
const endpoint = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blog_posts`
const headers = { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' }
const insert = await fetch(`${endpoint}?on_conflict=slug`, { method: 'POST', headers, body: JSON.stringify(posts) })
if (!insert.ok) throw new Error(`Import failed: ${await insert.text()}`)
const inserted = await insert.json()
if (inserted.length !== requestedCount) throw new Error('Import did not return every requested blog; old posts were not removed.')
const allPosts = await fetch(`${endpoint}?select=id,title`, { headers })
if (!allPosts.ok) throw new Error(`Could not check existing posts: ${await allPosts.text()}`)
const importedTitles = new Set(posts.map((post) => post.title))
const oldIds = (await allPosts.json()).filter((post) => !importedTitles.has(post.title)).map((post) => post.id)
const removeOld = oldIds.length ? await fetch(`${endpoint}?id=in.(${oldIds.join(',')})`, { method: 'DELETE', headers: { ...headers, Prefer: 'return=representation' } }) : new Response('[]', { status: 200 })
if (!removeOld.ok) throw new Error(`New blogs were added, but old-post cleanup failed: ${await removeOld.text()}`)
console.log(`Imported ${inserted.length} blogs and removed ${(await removeOld.json()).length} old blog(s).`)
