'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Post = { id: string; title: string; slug: string; excerpt: string | null; content: string; cover_emoji: string | null; category: string | null; published: boolean; sort_order: number; created_at: string }
type Editor = { title: string; slug: string; excerpt: string; content: string; emoji: string; category: string; published: boolean }
const emptyEditor: Editor = { title: '', slug: '', excerpt: '', content: '', emoji: '✨', category: 'General', published: false }
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function fetchPosts() {
    const result = await supabase.from('blog_posts').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false })
    if (result.error) setError(result.error.message)
    if (result.data) setPosts(result.data as Post[])
    setLoading(false)
  }
  useEffect(() => { void fetchPosts() }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map((post) => post.category || 'General')))], [posts])
  const shownPosts = useMemo(() => posts.filter((post) => {
    const matchesSearch = !query.trim() || `${post.title} ${post.excerpt || ''} ${post.slug}`.toLowerCase().includes(query.trim().toLowerCase())
    const matchesCategory = categoryFilter === 'All' || (post.category || 'General') === categoryFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' ? post.published : !post.published)
    return matchesSearch && matchesCategory && matchesStatus
  }), [categoryFilter, posts, query, statusFilter])

  function updateEditor(field: keyof Editor, value: string | boolean) { setEditor((current) => current ? { ...current, [field]: value } : current) }
  function startNew() { setEditingId(null); setEditor(emptyEditor); setError('') }
  function startEdit(post: Post) { setEditingId(post.id); setEditor({ title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content, emoji: post.cover_emoji || '✨', category: post.category || 'General', published: post.published }); setError('') }

  async function savePost(event: React.FormEvent) {
    event.preventDefault()
    if (!editor || !editor.title.trim() || !editor.slug.trim() || !editor.content.trim()) { setError('Title, URL slug, and content are required.'); return }
    setSaving(true); setError('')
    const values = { title: editor.title.trim(), slug: slugify(editor.slug), excerpt: editor.excerpt.trim() || null, content: editor.content, cover_emoji: editor.emoji.trim() || '✨', category: editor.category.trim() || 'General', published: editor.published }
    const result = editingId ? await supabase.from('blog_posts').update(values).eq('id', editingId) : await supabase.from('blog_posts').insert({ ...values, sort_order: posts.length ? Math.max(...posts.map((post) => post.sort_order || 0)) + 10 : 10 })
    setSaving(false)
    if (result.error) { setError(result.error.message); return }
    setEditor(null); setEditingId(null); await fetchPosts()
  }

  async function saveOrder(ordered: Post[]) {
    setPosts(ordered)
    const results = await Promise.all(ordered.map((post, index) => supabase.from('blog_posts').update({ sort_order: (index + 1) * 10 }).eq('id', post.id)))
    const failure = results.find((result) => result.error)
    if (failure?.error) { setError(failure.error.message); await fetchPosts() }
  }
  async function move(id: string, direction: -1 | 1) {
    const index = posts.findIndex((post) => post.id === id); const target = index + direction
    if (index < 0 || target < 0 || target >= posts.length) return
    const ordered = [...posts]; [ordered[index], ordered[target]] = [ordered[target], ordered[index]]; await saveOrder(ordered)
  }
  async function top(id: string) { const post = posts.find((item) => item.id === id); if (post) await saveOrder([post, ...posts.filter((item) => item.id !== id)]) }
  async function toggle(post: Post) { const result = await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id); if (result.error) setError(result.error.message); else await fetchPosts() }
  async function remove(id: string) { const result = await supabase.from('blog_posts').delete().eq('id', id); if (result.error) setError(result.error.message); else setPosts((current) => current.filter((post) => post.id !== id)); setConfirmingDelete(null) }

  const input = { padding: '.65rem .75rem', borderRadius: '7px', border: '1px solid #D9D2C5', backgroundColor: '#fff', color: '#1E2A3A', width: '100%', font: 'inherit' }
  const primary = { border: 'none', borderRadius: '6px', backgroundColor: '#3611d2', color: '#F5EDDC', cursor: 'pointer', fontWeight: 600, padding: '.55rem .8rem' }
  if (loading) return <p style={{ color: '#5C6B7A' }}>Loading blog posts...</p>

  return <section className="blog-manager">
    <div className="blog-manager-header"><div><h2>Blog manager</h2><p>Write, publish, organize, and maintain posts.</p></div><button type="button" style={primary} onClick={startNew}>+ New post</button></div>
    <div className="blog-stats"><div><strong>{posts.length}</strong><span>All posts</span></div><div><strong>{posts.filter((post) => post.published).length}</strong><span>Published</span></div><div><strong>{posts.filter((post) => !post.published).length}</strong><span>Drafts</span></div></div>
    {editor && <form className="blog-editor" onSubmit={savePost}>
      <div className="blog-editor-titlebar"><h3>{editingId ? 'Edit post' : 'Create post'}</h3><button type="button" onClick={() => setEditor(null)}>Close</button></div>
      <div className="blog-editor-grid"><label>Title<input style={input} value={editor.title} onChange={(event) => { updateEditor('title', event.target.value); if (!editingId) updateEditor('slug', slugify(event.target.value)) }} /></label><label>URL slug<input style={input} value={editor.slug} onChange={(event) => updateEditor('slug', event.target.value)} /></label><label>Category<input style={input} value={editor.category} onChange={(event) => updateEditor('category', event.target.value)} /></label><label>Emoji<input style={input} value={editor.emoji} onChange={(event) => updateEditor('emoji', event.target.value)} /></label></div>
      <label>Short preview<textarea style={{ ...input, minHeight: '72px' }} value={editor.excerpt} onChange={(event) => updateEditor('excerpt', event.target.value)} /></label>
      <label>Post content<textarea style={{ ...input, minHeight: '220px' }} value={editor.content} onChange={(event) => updateEditor('content', event.target.value)} placeholder="Basic HTML such as <p>, <h2>, and <strong> is supported." /></label>
      <label className="publish-toggle"><input type="checkbox" checked={editor.published} onChange={(event) => updateEditor('published', event.target.checked)} /> Publish this post now</label>
      {error && <p className="blog-error">{error}</p>}<button type="submit" disabled={saving} style={primary}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create post'}</button>
    </form>}
    <div className="blog-manager-controls"><input style={input} placeholder="Search titles, summaries, or URLs..." value={query} onChange={(event) => setQuery(event.target.value)} /><select style={input} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select><select style={input} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select></div>
    {error && !editor && <p className="blog-error">{error}</p>}<p className="blog-order-hint">Use ↑ and ↓ to set the public Blog page order. “Top” puts a post first.</p>
    <div className="blog-post-list">{shownPosts.length === 0 ? <p style={{ color: '#5C6B7A' }}>No posts match those filters.</p> : shownPosts.map((post) => <article className="blog-manager-card" key={post.id}><div className="blog-position">{posts.findIndex((item) => item.id === post.id) + 1}</div><div className="blog-post-summary"><span className="blog-card-emoji">{post.cover_emoji || '✨'}</span><div><div className="blog-post-heading"><h3>{post.title}</h3><span className={post.published ? 'post-status published' : 'post-status draft'}>{post.published ? 'Published' : 'Draft'}</span></div><p>{post.category || 'General'} · /{post.slug}</p>{post.excerpt && <small>{post.excerpt}</small>}</div></div><div className="blog-manager-actions"><button type="button" onClick={() => void move(post.id, -1)}>↑</button><button type="button" onClick={() => void move(post.id, 1)}>↓</button><button type="button" onClick={() => void top(post.id)}>Top</button><button type="button" onClick={() => startEdit(post)}>Edit</button><button type="button" onClick={() => void toggle(post)}>{post.published ? 'Unpublish' : 'Publish'}</button>{confirmingDelete === post.id ? <><button type="button" className="delete-confirm" onClick={() => void remove(post.id)}>Confirm delete</button><button type="button" onClick={() => setConfirmingDelete(null)}>Cancel</button></> : <button type="button" className="delete-button" onClick={() => setConfirmingDelete(post.id)}>Delete</button>}</div></article>)}</div>
  </section>
}
