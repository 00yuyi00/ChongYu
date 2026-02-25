import { supabase } from './supabase';

/**
 * 统一的图片上传工具函数
 * @param file 原始 File 对象或 Blob
 * @param folder 存储桶内的文件夹路径 (如 'posts' 或 'avatars')
 * @returns 成功返回公开访问 URL，失败抛出错误
 */
export async function uploadImage(file: File | Blob, folder: string): Promise<string> {
    const fileExt = file.type.split('/')[1] || 'jpg';
    const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('pet-media')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error('图片上传到云端失败');
    }

    const { data } = supabase.storage
        .from('pet-media')
        .getPublicUrl(filePath);

    return data.publicUrl;
}
