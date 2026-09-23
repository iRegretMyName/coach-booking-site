import ReadingExperience from '../ReadingExperience'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()

  if (!post) notFound()

  const { data: related } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_emoji, category')
    .eq('published', true)
    .neq('id', post.id)
    .order('sort_order', { ascending: true })
    .limit(3)

  return <ReadingExperience title={post.title} category={post.category} emoji={post.cover_emoji} content={post.content} excerpt={post.excerpt} publishedAt={post.created_at} related={related || []} />
}
