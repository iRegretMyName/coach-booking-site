-- Run once in Supabase SQL Editor before using manual post ordering.
alter table public.blog_posts
  add column if not exists sort_order integer not null default 0;

with numbered_posts as (
  select id, row_number() over (order by created_at desc) * 10 as new_sort_order
  from public.blog_posts
)
update public.blog_posts as post
set sort_order = numbered_posts.new_sort_order
from numbered_posts
where post.id = numbered_posts.id and post.sort_order = 0;

create index if not exists blog_posts_sort_order_idx
  on public.blog_posts (published, sort_order);
