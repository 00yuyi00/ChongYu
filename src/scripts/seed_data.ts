import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!; // Note: In a real seed script you'd use SERVICE_ROLE_KEY to bypass RLS, but here we use ANON for convenience if RLS allows public insert for testing
const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_USERS = [
    { id: '00000000-0000-0000-0000-000000000001', name: '宠物医生-陈医生', avatar_url: 'https://i.pravatar.cc/150?u=chen' },
    { id: '00000000-0000-0000-0000-000000000002', name: '资深领养人-莉莉', avatar_url: 'https://i.pravatar.cc/150?u=lily' },
    { id: '00000000-0000-0000-0000-000000000003', name: '救助者-老王', avatar_url: 'https://i.pravatar.cc/150?u=wang' },
    { id: '00000000-0000-0000-0000-000000000004', name: '爱心志愿者', avatar_url: 'https://i.pravatar.cc/150?u=volunteer' },
];

const PETS = [
    {
        user_id: TEST_USERS[0].id,
        post_type: 'adopt',
        pet_type: 'cat',
        title: '温顺英短求领养',
        description: '性格超级温顺，已经驱虫打疫苗。因为要出国实在带不走，希望能找个好人家。',
        images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500'],
        location: '上海市静安区',
        status: '展示中'
    },
    {
        user_id: TEST_USERS[1].id,
        post_type: 'seek',
        pet_type: 'dog',
        title: '重金寻柯基',
        description: '在人民广场附近走丢，名字叫球球，身穿黄色背心，重金悬赏。',
        images: ['https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500'],
        location: '上海市黄浦区',
        status: '展示中'
    },
    {
        user_id: TEST_USERS[2].id,
        post_type: 'found',
        pet_type: 'cat',
        title: '捡到一只流浪橘猫',
        description: '在小区地下室发现，目前在宠物店暂存，寻找失主或领养。',
        images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500'],
        location: '成都市武侯区',
        status: '展示中'
    },
    {
        user_id: TEST_USERS[3].id,
        post_type: 'adopt',
        pet_type: 'dog',
        title: '聪明边牧待领养',
        description: '一岁大，掌握基本指令，精力旺盛，适合有运动习惯的家庭。',
        images: ['https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=500'],
        location: '北京市朝阳区',
        status: '展示中'
    }
];

async function seed() {
    console.log('🚀 Starting Seeding...');

    // 1. Seed Profiles (Using upsert to avoid conflicts)
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert(TEST_USERS.map(u => ({ id: u.id, name: u.name, avatar_url: u.avatar_url })), { onConflict: 'id' });

    if (profileError) console.error('Profile Seed Error:', profileError);
    else console.log('✅ Profiles seeded.');

    // 2. Seed Posts
    const { error: postError } = await supabase
        .from('posts')
        .insert(PETS);

    if (postError) console.error('Post Seed Error:', postError);
    else console.log('✅ Posts seeded.');

    // 3. Seed initial messages
    const { error: msgError } = await supabase
        .from('messages')
        .insert([
            { sender_id: TEST_USERS[1].id, receiver_id: TEST_USERS[0].id, content: '你好，陈医生，这只英短多大了？' },
            { sender_id: TEST_USERS[0].id, receiver_id: TEST_USERS[1].id, content: '大概一岁半。' },
        ]);

    if (msgError) console.error('Message Seed Error:', msgError);
    else console.log('✅ Messages seeded.');

    console.log('🏁 Seeding finished!');
}

seed();
