'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

type ReadingExperienceProps = { title: string; category: string | null; emoji: string | null; content: string; excerpt: string | null; publishedAt: string }
type Heading = { id: string; label: string }
type RelatedPost = { id: string; title: string; slug: string; excerpt: string | null; cover_emoji: string | null; category: string | null }

export default function ReadingExperience({ title, category, emoji, content, excerpt, publishedAt, related }: ReadingExperienceProps & { related: RelatedPost[] }) {
  const articleRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [headings, setHeadings] = useState<Heading[]>([])
  const [showTop, setShowTop] = useState(false)
  const minutes = useMemo(() => Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length / 220)), [content])
  const publishedDate = useMemo(() => new Date(publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), [publishedAt])

  useEffect(() => {
    const article = articleRef.current
    if (article) setHeadings(Array.from(article.querySelectorAll('h2')).map((heading, index) => {
      const id = heading.id || `section-${index + 1}`
      heading.id = id
      return { id, label: heading.textContent || `Section ${index + 1}` }
    }))
    const updateScroll = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight
      setProgress(maximum > 0 ? Math.min(100, Math.round((window.scrollY / maximum) * 100)) : 0)
      setShowTop(window.scrollY > 500)
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  return <main className="reading-experience">
    <div className="reading-progress" style={{ width: `${progress}%` }} />
    <header className="reading-hero"><div className="reading-hero-inner">
      <Link href="/Blog" className="reading-back">← Back to all stories</Link>
      <div className="reading-emoji" aria-hidden="true">{emoji || '✨'}</div>
      <span className="reading-kicker">{category || 'THE READING ROOM'}</span>
      <h1>{title}</h1>
      {excerpt && <p className="reading-dek">{excerpt}</p>}
      <div className="reading-meta"><strong>{minutes} MIN READ</strong><span>·</span><span>By Pragati Singh</span><span>·</span><span>{publishedDate}</span></div>
    </div></header>
    <div className={`reading-hero-image reading-hero-image--${(category || 'journal').toLowerCase().replace(/[^a-z]/g, '').slice(0, 14)}`} aria-hidden="true"><span>THE PRESENCE<br />JOURNAL</span></div>
    <div className="reading-layout">
      {headings.length > 0 && <aside className="reading-toc"><p className="reading-toc-title">IN THIS GUIDE</p>{headings.map((heading) => <button type="button" key={heading.id} onClick={() => document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })}>{heading.label}</button>)}</aside>}
      <article ref={articleRef} className="reading-article" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
    <section className="reading-service"><p className="eyebrow">EXPLORE THIS WORK</p><h2>Begin with what your system is asking for.</h2><p>Nervous System Regulation is a practical one-to-one space for mapping the patterns beneath anxiety, reactivity, sleep and repeated survival responses.</p><Link href="/services/nervous-system-regulation" className="button button--ink">Explore 1:1 counselling <span>↗</span></Link></section>
    {related.length > 0 && <section className="reading-related"><div className="reading-related-heading"><p className="eyebrow">CONTINUE READING</p><h2>More to sit with.</h2></div><div className="reading-related-grid">{related.map((post) => <Link href={`/Blog/${post.slug}`} key={post.id} className="reading-related-card"><span>{post.cover_emoji || '✦'}</span><p>{post.category || 'Journal'}</p><h3>{post.title}</h3><b>Read story ↗</b></Link>)}</div></section>}
    {showTop && <button type="button" className="reading-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>}
  </main>
}
