import BlogDirectory, { type BlogPreview } from './BlogDirectory'
import { supabase } from '@/lib/supabase'

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_emoji, category, content, created_at')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <div className="blog-page">
      <header className="blog-page-hero">
        <span className="blog-page-eyebrow">THE PRESENCE JOURNAL</span>
        <h1>Knowledge that helps you come home to yourself.</h1>
        <p>Thoughtful guides on nervous system regulation, sound and mantra, relationships, karma and spiritual growth.</p>
      </header>

      {(!posts || posts.length === 0) && (
        <p style={{ color: '#5C6B7A' }}>No posts yet — check back soon.</p>
      )}
      {posts && posts.length > 0 && <BlogDirectory posts={posts as BlogPreview[]} />}
    </div>
  )
}
