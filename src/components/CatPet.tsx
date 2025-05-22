
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Cat } from 'lucide-react';

interface CatPetProps {
  mood: 'happy' | 'neutral' | 'sad';
  accessories: string[];
  catcoins: number;
}

const CatPet: React.FC<CatPetProps> = ({ mood, accessories, catcoins }) => {
  // Render different cat expressions based on mood
  const renderCatFace = () => {
    switch (mood) {
      case 'happy':
        return (
          <div className="text-5xl animate-bounce-slow">😺</div>
        );
      case 'neutral':
        return (
          <div className="text-5xl">😐</div>
        );
      case 'sad':
        return (
          <div className="text-5xl">😿</div>
        );
      default:
        return <Cat size={64} />;
    }
  };

  // Render accessories
  const renderAccessories = () => {
    if (accessories.length === 0) {
      return null;
    }

    return (
      <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2">
        {accessories.includes('hat') && (
          <div className="text-2xl">🎩</div>
        )}
        {accessories.includes('glasses') && (
          <div className="text-2xl absolute top-10 left-1/2 transform -translate-x-1/2">
            👓
          </div>
        )}
        {accessories.includes('bowtie') && (
          <div className="text-2xl absolute top-20 left-1/2 transform -translate-x-1/2">
            🎀
          </div>
        )}
      </div>
    );
  };

  // Return mood message based on mood
  const getMoodMessage = () => {
    switch (mood) {
      case 'happy':
        return '貓咪看起來很開心！繼續努力學習吧！';
      case 'neutral':
        return '貓咪心情普通，多學習一會兒吧！';
      case 'sad':
        return '貓咪看起來有點難過，你最近是不是沒好好學習？';
      default:
        return '貓咪在觀察你的學習狀況...';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        {renderAccessories()}
        <div className={cn(
          "w-40 h-40 rounded-full bg-gradient-to-b flex items-center justify-center relative overflow-hidden",
          mood === 'happy' ? 'from-yellow-100 to-yellow-200' : 
          mood === 'sad' ? 'from-blue-100 to-blue-200' : 
          'from-gray-100 to-gray-200'
        )}>
          {renderCatFace()}
        </div>
      </div>
      
      <Badge variant="outline" className="bg-catcoin text-white mb-4">
        <span className="mr-1">🪙</span> {catcoins} 貓幣
      </Badge>
      
      <p className="text-center text-gray-700 mb-6">
        {getMoodMessage()}
      </p>
      
      <div className="text-sm text-gray-500 text-center">
        {accessories.length > 0 ? (
          <p>已裝備: {accessories.join(', ')}</p>
        ) : (
          <p>貓咪還沒有任何配飾，去商店看看吧！</p>
        )}
      </div>
    </div>
  );
};

export default CatPet;
