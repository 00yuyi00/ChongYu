-- 消息系统表
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 开启消息表的 RLS
alter table public.messages enable row level security;

-- 允许参与者查看消息
create policy "用户可以查看与自己相关的消息" on public.messages
  for select using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- 仅允许本人发送消息
create policy "用户可以执行发送消息" on public.messages
  for insert with check ( auth.uid() = sender_id );

-- 实时通知权限（如果需要 Realtime）
alter publication supabase_realtime add table public.messages;
