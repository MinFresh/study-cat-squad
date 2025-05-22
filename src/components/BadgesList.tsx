
import React from 'react';
import { Badge } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BadgesListProps {
  badges: Badge[];
}

const BadgesList: React.FC<BadgesListProps> = ({ badges }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <Card 
          key={badge.id}
          className={cn(
            "transition-all duration-300",
            badge.unlocked 
              ? "border-success bg-success/5" 
              : "border-gray-200 bg-gray-50 opacity-60"
          )}
        >
          <CardContent className="pt-6 pb-4 px-4 flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
              badge.unlocked ? "bg-success/10" : "bg-gray-200"
            )}>
              {badge.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium mb-1 flex items-center gap-2">
                {badge.name}
                {badge.unlocked && (
                  <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded">
                    已解鎖
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BadgesList;
