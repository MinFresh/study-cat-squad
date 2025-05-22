
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const Pomodoro = () => {
  const { state, incrementPomodoro, addStudyMinutes } = useAppContext();
  
  // Get incomplete tasks
  const incompleteTasks = state.tasks.filter(task => !task.completed);
  
  // Handle pomodoro completion
  const handlePomodoroComplete = () => {
    incrementPomodoro();
    addStudyMinutes(25); // Add 25 minutes to study log
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">番茄鐘</h1>
      <p className="text-muted-foreground mb-8">使用番茄鐘技巧，提高學習效率</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
        <div className="md:col-span-2">
          <PomodoroTimer onComplete={handlePomodoroComplete} />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">番茄鐘統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">今日完成</p>
                  <p className="font-medium">{state.pomodorosCompleted} 個</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">學習時間</p>
                  <p className="font-medium">{state.pomodorosCompleted * 25} 分鐘</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">獲得貓幣</p>
                  <p className="font-medium">{state.pomodorosCompleted * 5} 枚</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">番茄鐘說明</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>1. 設定 25 分鐘專注時間</p>
              <p>2. 期間專心完成一項任務</p>
              <p>3. 結束後休息 5 分鐘</p>
              <p>4. 每完成 4 個番茄鐘，休息 15-30 分鐘</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">本次可以完成的任務</h2>
        
        {incompleteTasks.length > 0 ? (
          <div className="space-y-3">
            {incompleteTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="p-3 bg-white rounded-lg border flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-sm text-muted-foreground">{task.subject}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            目前沒有待辦任務，請先在任務頁面添加
          </div>
        )}
      </div>
    </div>
  );
};

export default Pomodoro;
