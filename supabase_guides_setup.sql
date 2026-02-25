-- ==========================================
-- 为“发现页 - 养宠指南”补充更丰富的内容数据
-- ==========================================

-- 如果表不存在则先创建（以防万一）
create table if not exists public.guides (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null, -- 'dog' or 'cat'
  cover_image text,
  content text,
  status text default '已发布'
);

-- 安全起见，先清理旧的测试数据（可选，如果您想保留之前的可以注释掉这一行）
-- truncate table public.guides;

insert into public.guides (title, category, cover_image, content, status)
values 
  -- 狗狗分类
  (
    '狗狗接回家第一天，你应该做对这几件事', 
    'dog', 
    'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800', 
    '1. 准备好安静的角落：给它一个固定的航空箱或垫子。2. 规律进食：第一餐不要喂太饱。3. 熟悉气味：带一件带有母犬或原家庭气味的旧衣服。4. 观察排泄：及时引导到指定位置。', 
    '已发布'
  ),
  (
    '为什么你的狗狗总是乱拆家？', 
    'dog', 
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800', 
    '拆家通常是精力旺盛或分离焦虑的表现。解决方法：1. 增加户外运动量；2. 使用益智漏食玩具转移注意力；3. 笼内训练建立安全感。坚持一周，你会发现明显的改善！', 
    '已发布'
  ),
  (
    '金毛、拉布拉多等大型犬的饮食禁忌', 
    'dog', 
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', 
    '大型犬容易出现骨骼问题。禁忌：1. 严禁长期喂食高草酸盐食物；2. 巧克力、葡萄、洋葱是剧毒；3. 不要直接喂食尖锐的禽类骨头。科学喂养，毛孩子才能陪你更久。', 
    '已发布'
  ),

  -- 猫咪分类
  (
    '猫咪接回家不要马上洗澡！新手最易犯的错', 
    'cat', 
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800', 
    '新到家的猫咪免疫力低且应激严重，洗澡可能诱发猫传腹等致命疾病。建议：1. 至少隔离观察一周；2. 驱虫完成后；3. 待猫咪完全放松并信任主人后再考虑清洁。', 
    '已发布'
  ),
  (
    '如何优雅地给“主子”剪指甲而不被抓？', 
    'cat', 
    'https://images.unsplash.com/photo-1573865667647-5c573c756d75?w=800', 
    '1. 趁它睡觉或迷糊时开始；2. 轻轻按压肉垫弹出爪尖；3. 避开粉红色的血线。如果猫咪反抗强烈，可以尝试用毛巾裹起来“卷饼”法。', 
    '已发布'
  ),
  (
    '揭秘：为什么猫咪总是喜欢半夜跑酷？', 
    'cat', 
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800', 
    '这是猫咪捕猎天性的释放。因为它们是晨昏性动物，半夜精力最足。改善方案：在睡觉前进行高强度的逗猫棒互动 15 分钟，并喂食少量夜宵，让它进入“进食-清理-睡觉”的自然循环。', 
    '已发布'
  );
