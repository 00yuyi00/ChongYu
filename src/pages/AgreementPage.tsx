import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';

export default function AgreementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [canAgree, setCanAgree] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 获取从 PublishPage 传来的数据
  const { postData, files } = (location.state as any) || {};

  useEffect(() => {
    if (!postData || !files) {
      navigate('/publish');
    }
  }, [postData, files, navigate]);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) { // 10px threshold
        setCanAgree(true);
      }
    }
  };

  const handleSubmit = async () => {
    if (!agreed || isPublishing || !user) return;

    try {
      setIsPublishing(true);

      // 1. 循环上传图片到存储桶
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImage(file, 'posts');
        imageUrls.push(url);
      }

      // 2. 将数据插入数据库
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        post_type: postData.publishType,
        pet_type: postData.petType,
        // 标题只使用昵称或品种，不带后缀
        title: postData.nickname || postData.breed || '寻宠/送养信息',
        description: postData.description,
        images: imageUrls,
        location: postData.location,
        status: '展示中',
        // 新增字段
        nickname: postData.nickname || '',
        breed: postData.breed || '',
        age: postData.age || '',
        phone: postData.phone || '',
        is_private: postData.isPrivate || false,
        reward_amount: postData.rewardAmount || '',
        vaccine: postData.vaccine || 'unknown',
        sterilization: postData.sterilization || 'unknown',
        requirements: postData.requirements || []
      });

      if (error) throw error;

      navigate('/publish/success');
    } catch (err: any) {
      console.error('Publish Error:', err);
      alert('发布失败，请检查网络或重试: ' + (err.message || ''));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col relative pb-24">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">真实性承诺书</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between relative">
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-xs mt-1 text-zinc-400">基本信息</span>
          </div>
          <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800 -mt-5 mx-2"></div>
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-500/30">2</div>
            <span className="text-xs mt-1 text-amber-500 font-medium">签署协议</span>
          </div>
          <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800 -mt-5 mx-2"></div>
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs mt-1 text-zinc-400">发布成功</span>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col px-5 pb-10">
        <div className="mt-2 mb-4">
          <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">签署承诺协议</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            为了保障平台用户的真实权益，请您在发布前认真阅读并签署以下承诺协议。
          </p>
        </div>

        <div className="flex-grow bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 mb-6 shadow-sm overflow-hidden flex flex-col h-96">
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="overflow-y-auto pr-2 space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-6 h-full"
          >
            <p className="font-bold text-center text-zinc-900 dark:text-white mb-4">宠物遇见（Chongyu）平台信息真实性承诺书</p>
            <p>1. 本人作为“宠物遇见”平台的用户，在此郑重承诺：在平台内发布的所有宠物领养、寻宠启事及相关文字、图片信息均为真实有效，无虚假夸大、隐瞒真相或误导他人的内容。</p>
            <p>2. 本人承诺所发布的宠物信息来源合法。若是宠物领养，承诺拥有合法的处置权；若是寻宠，承诺所述丢失情况真实。严禁利用本平台进行任何形式的非法宠物买卖、诈骗或涉及侵权的行为。</p>
            <p>3. 本人深知诚信发布的重要性。若因本人发布虚假信息导致平台其他用户遭受损失、产生纠纷，或对平台声誉造成影响，本人愿意承担由此产生的一切法律责任及经济赔偿责任。</p>
            <p>4. 本人同意并授权“宠物遇见”平台在必要时对本人提交的信息进行核实。若发现违规行为，平台有权采取包括但不限于删除信息、封禁账号等处理措施。</p>
            <p>5. 关于个人隐私：平台将严格保护您的个人信息。您所签署的协议仅作为平台存证，非法律诉讼需求不会向第三方泄露。</p>
            <p>6. 承诺人确认：在签署本承诺书前，已充分阅读、理解并同意本协议的所有条款。</p>
            <p>7. 本协议自您点击“同意”之日起生效。</p>
            <p>8. 平台保留随时修改本协议的权利，修改后的协议一旦公布即有效代替原来的协议。</p>
            <p>9. 如您不同意本协议及/或随时对其的修改，您可以主动停止使用“宠物遇见”平台提供的服务。</p>
            <p>10. 本协议的解释权归“宠物遇见”平台所有。</p>
            <div className="pt-8 pb-4">
              <p className="text-right font-medium">承诺人（签署）：<span className="border-b border-zinc-300 dark:border-zinc-600 px-8 inline-block w-24"></span></p>
              <p className="text-right text-xs text-zinc-400 mt-2">签署日期：{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 mb-8">
          <input
            type="checkbox"
            id="agree"
            disabled={!canAgree}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 text-amber-500 border-zinc-300 dark:border-zinc-700 rounded focus:ring-amber-500 bg-white dark:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor="agree" className={`text-sm select-none ${canAgree ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
            {canAgree ? '我已阅读并同意签署该协议，且保证以上内容真实有效。' : '请阅读完协议内容后勾选'}
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3.5 px-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold active:opacity-70 transition-all"
          >
            上一步
          </button>
          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className={`flex-[2] py-3.5 px-6 rounded-full font-bold shadow-lg transition-all ${agreed
              ? 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600 active:scale-[0.98]'
              : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed shadow-none'
              }`}
          >
            提交发布
          </button>
        </div>
      </main>
    </div>
  );
}
