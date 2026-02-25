-- ==========================================
-- 为系统增加真实的“我的收藏”功能数据表
-- ==========================================

create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, post_id) -- 核心：保证同一个人对同一个帖子只能收藏一次
);

-- 开启收藏表的 RLS
alter table public.favorites enable row level security;

-- 允许登录用户创建收藏（只能为自己创建）
create policy "允许用户添加收藏" on public.favorites 
  for insert with check ( auth.uid() = user_id );

-- 允许用户删除自己的收藏
create policy "允许用户删除收藏" on public.favorites 
  for delete using ( auth.uid() = user_id );

-- 允许用户读取自己的收藏
create policy "允许用户查看自己的收藏" on public.favorites 
  for select using ( auth.uid() = user_id );

