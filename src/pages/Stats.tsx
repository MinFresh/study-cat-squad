
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import StudyChart from '@/components/StudyChart';
import StudyStats from '@/components/StudyStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

const Stats = () => {
  const { state } = useAppContext();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  
  // Analyze study logs to get subject distribution
  const analyzeSubjectDistribution = () => {
    const completedTasks = state.tasks.filter(task => task.completed);
    const subjectCounts = completedTasks.reduce((acc, task) => {
      if (!acc[task.subject]) {
        acc[task.subject] = 0;
      }
      acc[task.subject]++;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(subjectCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([subject, count]) => ({
        subject,
        count,
        percentage: Math.round((count / completedTasks.length) * 100)
      }));
  };
  
  // Get subject distribution
  const subjectDistribution = analyzeSubjectDistribution();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">學習統計</h1>
      <p className="text-muted-foreground mb-8">視覺化你的學習數據和進度</p>
      
      <StudyStats 
        studyLogs={state.studyLogs}
        pomodorosCompleted={state.pomodorosCompleted}
      />
      
      <div className="mt-8 mb-4">
        <Tabs defaultValue="week" onValueChange={(value) => setPeriod(value as 'week' | 'month' | 'all')}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">學習時間</h2>
            <TabsList>
              <TabsTrigger value="week">週視圖</TabsTrigger>
              <TabsTrigger value="month">月視圖</TabsTrigger>
              <TabsTrigger value="all">總覽</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="week">
            <StudyChart data={state.studyLogs} period="week" />
          </TabsContent>
          <TabsContent value="month">
            <StudyChart data={state.studyLogs} period="month" />
          </TabsContent>
          <TabsContent value="all">
            <StudyChart data={state.studyLogs} period="all" />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>科目分布</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectDistribution.length > 0 ? (
              <div className="space-y-4">
                {subjectDistribution.map(({ subject, count, percentage }) => (
                  <div key={subject}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{subject}</span>
                      <span className="text-sm text-muted-foreground">{count} 任務</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                尚未完成任何任務
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>學習成效分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">專注時間分布</h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="bg-primary/10 rounded-full px-3 py-1 text-sm">
                    早晨 <span className="font-medium">30%</span>
                  </div>
                  <div className="bg-primary/10 rounded-full px-3 py-1 text-sm">
                    下午 <span className="font-medium">45%</span>
                  </div>
                  <div className="bg-primary/10 rounded-full px-3 py-1 text-sm">
                    晚上 <span className="font-medium">25%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">學習效率分析</h3>
                <p className="text-sm text-muted-foreground">
                  根據您的學習數據，建議在早晨和下午安排較難的科目，晚上安排較輕鬆的復習。每個番茄鐘後的休息對提高長時間學習的效果很重要。
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">建議</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>增加數學科目的學習時間</li>
                  <li>建議在早上 9-11 點學習較難的內容</li>
                  <li>嘗試使用間隔式學習法提高記憶效果</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
