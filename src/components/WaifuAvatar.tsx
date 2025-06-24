
import React from 'react';

interface WaifuAvatarProps {
  waifu: {
    name: string;
    personality: string;
    avatar: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

const WaifuAvatar: React.FC<WaifuAvatarProps> = ({ waifu, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-waifu-lightPink to-waifu-pink rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-float`}>
      <span className="animate-pulse-heart">
        {waifu.avatar}
      </span>
    </div>
  );
};

export default WaifuAvatar;
