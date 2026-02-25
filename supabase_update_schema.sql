-- ==========================================
-- 补充 posts 表缺失的字段，并确保 favorites/messages 存在
-- ==========================================

-- 1. 为 posts 表添加在 PublishPage 中收集的新字段
alter table public.posts 
  add column if not exists nickname text,
  add column if not exists breed text,
  add column if not exists age text,
  add column if not exists phone text,
  add column if not exists is_private boolean default false,
  add column if not exists reward_amount text,
  add column if not exists vaccine text default 'unknown',
  add column if not exists sterilization text default 'unknown',
  add column if not exists requirements text[] default '{}';

-- 2. 确保 favorites 表存在及 RLS 配置
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, post_id) -- 核心：保证同一个人对同一个帖子只能收藏一次
);

alter table public.favorites enable row level security;

-- 如果策略已存在，这里会忽略建新策略失败的报错，或者最好用 do block 包装。为了简单起见，我们假设是新建或重置。
-- 为了避免重复创建策略报错，我们先 drop。生产环境慎用此方法，但这里是快速修复。
drop policy if exists "允许用户添加收藏" on public.favorites;
drop policy if exists "允许用户删除收藏" on public.favorites;
drop policy if exists "允许用户查看自己的收藏" on public.favorites;

create policy "允许用户添加收藏" on public.favorites 
  for insert with check ( auth.uid() = user_id );

create policy "允许用户删除收藏" on public.favorites 
  for delete using ( auth.uid() = user_id );

create policy "允许用户查看自己的收藏" on public.favorites 
  for select using ( auth.uid() = user_id );

-- 3. 确保 messages 表存在及 RLS / Realtime 配置
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

drop policy if exists "用户可以查看与自己相关的消息" on public.messages;
drop policy if exists "用户可以执行发送消息" on public.messages;

create policy "用户可以查看与自己相关的消息" on public.messages
  for select using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "用户可以执行发送消息" on public.messages
  for insert with check ( auth.uid() = sender_id );

-- 开启实时通知权限（如果需要 Realtime）
-- 注意：如果 publication 已建立或已包含该表，这里可能会报错，但可以忽略
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
