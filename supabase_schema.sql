-- 宠物领养/寻宠系统建表 SQL
-- 请将以下所有代码复制到 Supabase 的 "SQL Editor" 中直接执行 (Run)

-- 1. 扩展存储用户的基本信息
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  status text default '正常', -- '正常' | '已封禁'
  role text default 'user',   -- 'user' | 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 开启扩展用户信息表的 RLS (行级安全策略)
alter table public.profiles enable row level security;
create policy "允许所有人读取公开用户信息" on public.profiles for select using ( true );
create policy "允许用户更新自己的信息" on public.profiles for update using ( auth.uid() = id );
create policy "允许用户插入自己的信息" on public.profiles for insert with check ( auth.uid() = id );

-- * 自动为新注册的 auth.users 生成 profiles 记录的触发器
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?u=' || new.id)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================

-- 2. 帖子表 (涵盖寻宠、捡到、送养)
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_type text not null, -- 'lost' | 'found' | 'adopt'
  pet_type text not null, -- 'dog' | 'cat' | 'other'
  title text not null,
  description text,
  images text[] default '{}',
  location text,
  status text default '展示中', -- '展示中' | '已结案' | '后台下架'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 开启帖子表的 RLS
alter table public.posts enable row level security;
create policy "所有人都可以查看展示中的帖子" on public.posts 
  for select using ( status = '展示中' or auth.role() = 'admin' );
create policy "登录用户可以创建帖子" on public.posts 
  for insert with check ( auth.uid() = user_id );
create policy "用户可以更新自己的帖子" on public.posts 
  for update using ( auth.uid() = user_id );
create policy "用户可以删除自己的帖子" on public.posts 
  for delete using ( auth.uid() = user_id );

-- ==============================================================================

-- 3. 首页 Banner 轮播图表
create table public.banners (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  position_label text not null, -- '紧急寻宠' | '每日推荐' 
  target_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.banners enable row level security;
create policy "所有人都可以查看 Banner" on public.banners for select using ( true );
-- (注：后台管理修改Banner权限等后面靠代码校验，平时 RLS 也可限制为 admin 才能 insert)

-- ==============================================================================

-- 4. 养宠指南文章表
create table public.guides (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null,
  cover_image text,
  content text, 
  status text default '草稿', -- '草稿' | '已发布'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.guides enable row level security;
create policy "所有人都可以查看已发布的文章" on public.guides 
  for select using ( status = '已发布' );

-- ==============================================================================

-- 5. 用户反馈表
create table public.feedbacks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null,
  images text[] default '{}',
  admin_note text,
  status text default '待处理', -- '待处理' | '已处理'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.feedbacks enable row level security;
create policy "允许登录用户提交反馈" on public.feedbacks 
  for insert with check ( auth.uid() = user_id );
create policy "允许用户查看自己的反馈" on public.feedbacks 
  for select using ( auth.uid() = user_id );
