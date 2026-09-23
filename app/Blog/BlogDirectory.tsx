'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type BlogPreview = { id: string; title: string; slug: string; excerpt: string | null; cover_emoji: string | null; category: string | null; content: string; created_at: string }

export default function BlogDirectory({ posts }: { posts: BlogPreview[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map((post) => post.category || 'General')))], [posts])
  const visible = posts.filter((post) => {
    const text = `${post.title} ${post.excerpt || ''} ${post.category || ''}`.toLowerCase()
    return (category === 'All' || (post.category || 'General') === category) && (!query.trim() || text.includes(query.trim().toLowerCase()))
  })
  const featured = visible[0]
  const remaining = visible.slice(1)
  const readingTime = (post: BlogPreview) => Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 220))
  const date = (post: BlogPreview) => new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <section className="blog-directory">
      <div className="blog-directory-controls">
        <input className="blog-search" aria-label="Search blog posts" placeholder="Find an idea, topic, or story..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="blog-category-filters">{categories.map((item) => <button key={item} type="button" className={item === category ? 'blog-filter active' : 'blog-filter'} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <span className="blog-directory-count">{visible.length} {visible.length === 1 ? 'story' : 'stories'} to explore</span>
      </div>

      {visible.length === 0 ? <p style={{ color: '#5C6B7A' }}>No posts match that search yet.</p> : <>
        {featured && <Link href={`/Blog/${featured.slug}`} className="blog-featured"><div><span className="blog-featured-label">START HERE · FEATURED READING</span><h2>{featured.title}</h2>{featured.excerpt && <p>{featured.excerpt}</p>}<span className="blog-featured-meta">{readingTime(featured)} min read <i>·</i> {date(featured)}</span><span className="blog-featured-cta">Open the reading room →</span></div><div className="blog-featured-art" aria-hidden="true">{featured.cover_emoji || '✨'}</div></Link>}
        {remaining.length > 0 && <><p className="blog-latest-label">LATEST FROM THE JOURNAL</p><div className="blog-grid blog-grid--after-featured">{remaining.map((post, index) => <article key={post.id} className="blog-card" style={{ animationDelay: `${index * 0.05}s` }}><Link href={`/Blog/${post.slug}`}><div className="blog-card-emoji">{post.cover_emoji || '✨'}</div><span className="blog-card-category">{post.category || 'General'}</span><h2>{post.title}</h2>{post.excerpt && <p>{post.excerpt}</p>}<span className="blog-card-meta">{readingTime(post)} min read <i>·</i> {date(post)}</span><span className="blog-read-more">Read story →</span></Link></article>)}</div></>}
      </>}
    </section>
  )
}
