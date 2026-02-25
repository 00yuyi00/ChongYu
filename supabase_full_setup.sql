-- ==========================================
-- 1. 创建消息表
-- ==========================================
create table if not exists public.messages (
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

-- 开启实时通知
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.messages;

-- ==========================================
-- 2. 种子数据 (种子用户、帖子、初始消息)
-- ==========================================

-- 虚拟用户 (Profiles)
insert into public.profiles (id, name, avatar_url)
values 
  ('00000000-0000-0000-0000-000000000001', '宠物医生-陈医生', 'https://i.pravatar.cc/150?u=chen'),
  ('00000000-0000-0000-0000-000000000002', '领养达人-莉莉', 'https://i.pravatar.cc/150?u=lily'),
  ('00000000-0000-0000-0000-000000000003', '救助者-老王', 'https://i.pravatar.cc/150?u=wang')
on conflict (id) do update set 
  name = excluded.name, 
  avatar_url = excluded.avatar_url;

-- 虚拟帖子 (Posts)
insert into public.posts (user_id, post_type, pet_type, title, description, images, location, status)
values 
  ('00000000-0000-0000-0000-000000000001', 'adopt', 'cat', '精美好养的英短蓝猫', '性格极好，希望能找个温暖的家。', '{"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500"}', '上海市静安区', '展示中'),
  ('00000000-0000-0000-0000-000000000002', 'seek', 'dog', '重金悬赏寻柯基', '在静安公园附近走丢，万分焦急！', '{"https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500"}', '上海市黄浦区', '展示中'),
  ('00000000-0000-0000-0000-000000000003', 'found', 'cat', '捡到一只三花猫', '在小区地下室发现，寻找原主人。', '{"https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500"}', '成都市武侯区', '展示中');

-- 初始对话记录 (Messages)
insert into public.messages (sender_id, receiver_id, content)
values 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '你好陈医生，那只蓝猫还在吗？'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '在的，目前有多位领养人在咨询。');
