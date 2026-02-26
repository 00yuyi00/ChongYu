import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight, MapPin, Dog, Cat, Upload } from 'lucide-react';

export default function PublishPage() {
  const navigate = useNavigate();
  const [publishType, setPublishType] = useState<'seek' | 'found' | 'adopt'>('seek');
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [hasReward, setHasReward] = useState(false);

  // Form State
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nickname: '',
    breed: '',
    age: '',
    location: '',
    description: '',
    phone: '',
    isPrivate: true,
    rewardAmount: '',
    vaccine: 'unknown',
    sterilization: 'unknown',
    requirements: [] as string[],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 9) {
        alert('最多只能上传9张照片');
        return;
      }
      setFiles([...files, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file as Blob));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.location || !formData.description || !formData.phone) {
      alert('请填写必要信息（位置、描述、联系方式）');
      return;
    }
    if (files.length === 0) {
      alert('请至少上传一张宠物照片');
      return;
    }

    // 传递数据到协议页
    navigate('/agreement', {
      state: {
        postData: {
          ...formData,
          publishType,
          petType,
        },
        files: files // 注意：File 对象无法通过序列化存储，但可以在内存路由 state 中短期传递
      }
    });
  };

  const toggleRequirement = (req: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(req)
        ? prev.requirements.filter(r => r !== req)
        : [...prev.requirements, req]
    }));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col relative pb-24">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">发布信息</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between relative">
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-500/30">1</div>
            <span className="text-xs mt-1 text-amber-500 font-medium">基本信息</span>
          </div>
          <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800 -mt-5 mx-2"></div>
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-xs mt-1 text-zinc-400">签署协议</span>
          </div>
          <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800 -mt-5 mx-2"></div>
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-xs mt-1 text-zinc-400">发布成功</span>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 space-y-6">
        {/* Type Tabs */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex">
          <button
            onClick={() => setPublishType('seek')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${publishType === 'seek' ? 'bg-white dark:bg-zinc-700 text-amber-500 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'}`}
          >
            我要寻宠
          </button>
          <button
            onClick={() => setPublishType('found')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${publishType === 'found' ? 'bg-white dark:bg-zinc-700 text-amber-500 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'}`}
          >
            我捡到宠
          </button>
          <button
            onClick={() => setPublishType('adopt')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${publishType === 'adopt' ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30' : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'}`}
          >
            我要送养
          </button>
        </div>

        {/* Photos */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">添加照片 <span className="text-xs font-normal text-zinc-400">(最多9张)</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="aspect-square relative group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl border border-zinc-200 dark:border-zinc-700" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg"
                >
                  ✕
                </button>
              </div>
            ))}
            {previews.length < 9 && (
              <label className="aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors group relative">
                <Upload className="text-zinc-400 group-hover:text-zinc-500 w-8 h-8 transition-colors" />
                <span className="text-[10px] text-zinc-400 group-hover:text-zinc-500 mt-1 transition-colors">上传照片</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Pet Type */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">宠物类型</h2>
          <div className="flex space-x-4">
            <label className="flex-1 relative cursor-pointer group">
              <input
                type="radio"
                name="pet_type"
                value="dog"
                checked={petType === 'dog'}
                onChange={() => setPetType('dog')}
                className="peer hidden"
              />
              <div className="w-full py-4 border-2 border-transparent bg-white dark:bg-zinc-800 rounded-2xl text-center peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-900/10 transition-all shadow-sm">
                <Dog className="block mx-auto mb-1 w-6 h-6 text-zinc-400 peer-checked:text-amber-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 peer-checked:text-amber-500">狗狗</span>
              </div>
            </label>
            <label className="flex-1 relative cursor-pointer group">
              <input
                type="radio"
                name="pet_type"
                value="cat"
                checked={petType === 'cat'}
                onChange={() => setPetType('cat')}
                className="peer hidden"
              />
              <div className="w-full py-4 border-2 border-transparent bg-white dark:bg-zinc-800 rounded-2xl text-center peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-900/10 transition-all shadow-sm">
                <Cat className="block mx-auto mb-1 w-6 h-6 text-zinc-400 peer-checked:text-amber-500" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 peer-checked:text-amber-500">猫咪</span>
              </div>
            </label>
          </div>
        </div>

        {/* Common Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">位置信息</label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="定位当前所在位置"
                className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-4 px-5 text-sm shadow-sm placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 pr-10"
              />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">详细描述</label>
            <textarea
              rows={4}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请详细描述宠物的特征、丢失/发现经过等..."
              className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-4 px-5 text-sm shadow-sm placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 resize-none"
            />
            <div className="text-right text-xs text-zinc-400 px-1">{formData.description.length}/500</div>
          </div>
        </div>

        {/* Adoption Specific Fields */}
        {publishType === 'adopt' && (
          <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">送养信息</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">昵称</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="宠物昵称"
                  className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-3 px-4 text-sm shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">年龄</label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="如: 1岁"
                  className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-3 px-4 text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">品种</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="品种（看不出来写疑似）"
                className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-4 px-5 text-sm shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">领养要求</label>
              <div className="flex flex-wrap gap-2">
                {['同城领养', '接受回访', '封窗', '有养宠经验', '全家同意'].map((req) => (
                  <button
                    key={req}
                    onClick={() => toggleRequirement(req)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${formData.requirements.includes(req)
                      ? 'bg-amber-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seek Specific Fields */}
        {publishType === 'seek' && (
          <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">悬赏金</h3>
              <div
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${hasReward ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                onClick={() => setHasReward(!hasReward)}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hasReward ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>

            {hasReward && (
              <div className="relative animate-in slide-in-from-top-2 fade-in duration-200">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">¥</span>
                <input
                  type="number"
                  value={formData.rewardAmount}
                  onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
                  placeholder="输入金额"
                  className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-4 pl-8 pr-5 text-sm shadow-sm"
                />
              </div>
            )}

            <div className="space-y-2 mt-4">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">品种</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="品种（看不出来写疑似）"
                className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-4 px-5 text-sm shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Found Specific Fields */}
        {publishType === 'found' && (
          <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">捡到信息</h3>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 ml-1">品种</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="品种（看不出来写疑似）"
                className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-4 px-5 text-sm shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">联系方式</h3>
          <div className="space-y-2">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入手机号"
              className="w-full bg-white dark:bg-zinc-800 border-none focus:ring-2 focus:ring-amber-500 rounded-2xl py-4 px-5 text-sm shadow-sm"
            />
            <div className="flex items-center space-x-2 px-1">
              <input
                type="checkbox"
                id="private"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="private" className="text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer select-none">
                仅注册用户可见
              </label>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-md z-20">
        <button
          onClick={handleNext}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/30 transition-transform active:scale-[0.98]"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
