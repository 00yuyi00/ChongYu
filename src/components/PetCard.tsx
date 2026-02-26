import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PetCardProps {
  id: string;
  name: string;
  breed: string;
  location: string;
  time: string;
  imageUrl: string;
  tags?: { text: string; color: string }[];
  reward?: string;
  isUrgent?: boolean;
  postType?: 'seek' | 'found' | 'adopt' | 'lost';
}

const PetCard: React.FC<PetCardProps> = ({
  id,
  name,
  breed,
  location,
  time,
  imageUrl,
  tags,
  reward,
  isUrgent,
  postType,
}) => {
  // Logic for title: seek/found/lost shows breed, adopt shows name
  const rawTitle = (postType === 'adopt' ? name : (breed || name)) || '宠物';
  // Remove punctuation
  const cleanTitle = rawTitle.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()（）！，。？：；“”‘’]/g, "").trim();

  // Label for reward area
  const rewardLabel = postType === 'adopt' ? '领养费' : '赏金';

  return (
    <Link to={`/detail/${id}`} className="block">
      <div className="flex bg-white dark:bg-zinc-800 rounded-2xl p-3 shadow-sm border border-zinc-100 dark:border-zinc-700/50 active:scale-[0.98] transition-transform">
        <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src={imageUrl}
            alt={cleanTitle}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isUrgent && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-2 py-0.5 font-bold rounded-br-lg">
              急寻
            </div>
          )}
        </div>
        <div className="ml-4 flex flex-col justify-between py-1 flex-1 min-w-0">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 truncate">
                {cleanTitle}
              </h3>
            </div>
            <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{location}</span>
            </div>
            <div className="text-zinc-400 text-[10px] mt-1">{time}</div>
          </div>

          <div className="flex justify-between items-end mt-2">
            <div className="flex flex-col">
              <span className="text-amber-500 font-bold text-lg">
                {rewardLabel}: {reward || '详议'}
              </span>
            </div>
            <button className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
              查看详情
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;
