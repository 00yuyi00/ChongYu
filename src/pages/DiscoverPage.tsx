import React from 'react';
import { ChevronRight, Bookmark, BookOpen, Compass } from 'lucide-react';
import { MOCK_PETS } from '../data/mockData';
import PetCard from '../components/PetCard';
import { useNavigate } from 'react-router-dom';

export default function DiscoverPage() {
  const navigate = useNavigate();
  // Mock favorites - take first 2 pets as example, or empty array to test empty state
  const favoritePets = MOCK_PETS.slice(0, 3);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24 relative flex flex-col">
      <header className="pt-12 px-5 pb-4 bg-white dark:bg-zinc-900 sticky top-0 z-30">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">发现</h1>
      </header>

      <main className="px-5 space-y-8">
        {/* My Favorites */}
        <section>
          <div
            onClick={() => navigate('/profile/favorites')}
            className="flex justify-between items-center mb-4 cursor-pointer group"
          >
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">我的收藏 ({favoritePets.length})</h2>
            <div className="text-zinc-400 group-hover:text-amber-500 transition-colors flex items-center">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {favoritePets.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
              {favoritePets.map(pet => (
                <div key={pet.id} className="w-72 shrink-0">
                  <PetCard {...pet} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl h-48 flex flex-col items-center justify-center space-y-3 border border-zinc-200 dark:border-zinc-700/50">
              <div className="bg-white/50 dark:bg-zinc-700/50 p-4 rounded-full">
                <Bookmark className="text-zinc-400 w-8 h-8" />
              </div>
              <p className="text-zinc-400 text-sm font-medium">暂无收藏的毛孩子</p>
            </div>
          )}
        </section>

        {/* Pet Guides */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">养宠指南</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFF9E6] dark:bg-[#2C281A] p-5 rounded-3xl relative overflow-hidden h-44 flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer shadow-sm">
              <div className="z-10">
                <h3 className="text-[#8B6E2F] dark:text-[#E6C37A] font-bold text-lg">狗狗养宠指南</h3>
                <p className="text-[#8B6E2F]/70 dark:text-[#E6C37A]/70 text-xs mt-1">新手养狗必看攻略</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-40 group-hover:scale-110 transition-transform">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXOLyeGqouUYyYqwbv58AlbXH6jKbXxqeiuAdH60GJE05wDKxVR5dyaSoopJdkDG38DkC9ZFNi9ikeHDlDEqqYxbqyRWoWC9_MYWEDzHrNE0iQx7CFzenODKD6pidPHw2hq4Xb3AZRck20sIuR6DFz8pEPtt2mCYNoPvz3sninkrlWwnQDVg37kSMAURxgYqVvaiLtLbAg1gcbxfta2toaBqim-boIZLrlfzavpd_22n7v9Fh9QA8DxDVjC2E7R-SjNZNeGx04YvsV"
                  alt="Dog Icon"
                  className="w-24 h-24"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="z-10 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#8B6E2F] dark:text-[#E6C37A]" />
                <span className="text-[10px] text-[#8B6E2F] dark:text-[#E6C37A] font-medium">12 篇文章</span>
              </div>
            </div>
            <div className="bg-[#E6F4FF] dark:bg-[#1A232E] p-5 rounded-3xl relative overflow-hidden h-44 flex flex-col justify-between group active:scale-95 transition-transform cursor-pointer shadow-sm">
              <div className="z-10">
                <h3 className="text-[#2F658B] dark:text-[#7ABCE6] font-bold text-lg">猫咪养宠指南</h3>
                <p className="text-[#2F658B]/70 dark:text-[#7ABCE6]/70 text-xs mt-1">给主人的猫科秘籍</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-40 group-hover:scale-110 transition-transform">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA25y-51bOL1YZ_Je3bd9V00W10h4AEhygR7-4CylWLwUXBvMSNX4b9X8SgZfIgvVlz_ON-3Vbqr4xcrJhgaPURwQ8npeTel3Jo9Dmv1CYiGt_8yBHRIh1rMf-Q9MTmygxm7Qlr75RkJa0fdg0aPTbTCffO7zL4TcS78s6Mmj523lknsk3yGYwrFbQRApk4Ht2_-IlPkjqEgZWbSuhBhVPsmfg1MLlTfrllYsI_mvPqHTvTWFyRsh9FhOfaYQUJ1bDas__VYI3A9M6K"
                  alt="Cat Icon"
                  className="w-24 h-24"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="z-10 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#2F658B] dark:text-[#7ABCE6]" />
                <span className="text-[10px] text-[#2F658B] dark:text-[#7ABCE6] font-medium">18 篇文章</span>
              </div>
            </div>
          </div>
        </section>

        {/* Explore More Placeholder */}
        <section className="pt-4">
          <div
            onClick={() => alert('该功能还在努力开发中，敬请期待！')}
            className="bg-white dark:bg-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.98] transition-all border border-zinc-100 dark:border-zinc-700/50 hover:border-amber-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">探索更多</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">线下活动、周边商城等</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
          </div>
        </section>
      </main>
    </div>
  );
}
