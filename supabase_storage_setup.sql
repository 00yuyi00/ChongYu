-- ==========================================
-- 宠物图片存储桶 (pet-media) 设置脚本
-- ==========================================

-- 1. 创建公开的存储桶 (如果不存在)
insert into storage.buckets (id, name, public)
values ('pet-media', 'pet-media', true)
on conflict (id) do nothing;

-- 2. 注意：Supabase 中默认已经启用了 storage.objects 的行级安全
-- 且直接 alter 可能会因为权限（非 postgres 用户/owner）报错 42501，故跳过此步
-- alter table storage.objects enable row level security;

-- 3. 允许公开访问图片 (任何人都可以查看、下载)
create policy "Public Access for Posters" 
  on storage.objects for select 
  using ( bucket_id = 'pet-media' );

-- 4. 允许已登录用户上传图片
create policy "Authenticated Users can Upload" 
  on storage.objects for insert 
  with check ( 
    bucket_id = 'pet-media' 
    and auth.role() = 'authenticated'
  );

-- 5. 允许自己删除自己的图片 (可选)
create policy "Users can delete own uploads"
  on storage.objects for delete
  using ( 
    bucket_id = 'pet-media' 
    and auth.uid() = owner 
  );
