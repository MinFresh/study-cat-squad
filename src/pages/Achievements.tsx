
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import BadgesList from '@/components/BadgesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Check } from 'lucide-react';

const Achievements = () => {
  const { state } = useAppContext();
  
  // Count unlocked badges
  const unlockedCount = state.badges.filter(badge => badge.unlocked).length;
  const totalCount = state.badges.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">成就系統</h1>
      <p className="text-muted-foreground mb-8">解鎖成就，獲取獎勵</p>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            成就進度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <div className="text-sm font-medium">{progressPercentage}%</div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              已解鎖 {unlockedCount} 個成就，共 {totalCount} 個
            </p>
          </div>
          
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">提示</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>完成學習任務可獲得 Catcoin</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>使用番茄鐘專注學習</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>嘗試在不同時間段學習</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>連續學習可解鎖特殊成就</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">所有成就</h2>
      <BadgesList badges={state.badges} />
    </div>
  );
};

export default Achievements;
