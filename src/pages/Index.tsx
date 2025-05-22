
import React, { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartLine, Clock, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { state, loadInitialData } = useAppContext();
  
  // Load initial data if needed
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  // Get tasks due today
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = state.tasks.filter(task => task.dueDate === today);
  const completedTodayCount = todayTasks.filter(task => task.completed).length;
  
  // Get today's study minutes
  const todayStudyLog = state.studyLogs.find(log => log.date === today);
  const todayMinutes = todayStudyLog ? todayStudyLog.minutes : 0;
  
  // Get unlocked badges
  const unlockedBadgesCount = state.badges.filter(badge => badge.unlocked).length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SmartStudy</h1>
          <p className="text-muted-foreground">您的個人學習助手</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-catcoin text-white">
            <span className="mr-1">🪙</span> {state.catcoins} 貓幣
          </Badge>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">今日待辦</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTodayCount}/{todayTasks.length} 完成
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayTasks.length > 0 
                ? `已完成 ${Math.round(completedTodayCount / todayTasks.length * 100)}%` 
                : '今天沒有任務'}
            </p>
            <Link to="/tasks">
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                查看任務
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">今日學習</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMinutes} 分鐘</div>
            <p className="text-xs text-muted-foreground mt-1">
              番茄鐘完成數: {state.pomodorosCompleted}
            </p>
            <Link to="/pomodoro">
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                開始學習
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">成就解鎖</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unlockedBadgesCount}/{state.badges.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {unlockedBadgesCount > 0
                ? `已解鎖 ${Math.round(unlockedBadgesCount / state.badges.length * 100)}%` 
                : '尚未解鎖任何成就'}
            </p>
            <Link to="/achievements">
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                查看成就
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">學習統計</CardTitle>
            <ChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.studyLogs.length} 天
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              總共學習時間: {Math.round(state.studyLogs.reduce((acc, log) => acc + log.minutes, 0) / 60)} 小時
            </p>
            <Link to="/stats">
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                查看統計
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Tasks Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">最近任務</h2>
        <div className="bg-white rounded-lg shadow">
          {state.tasks.slice(0, 3).map((task) => (
            <div 
              key={task.id} 
              className="p-4 border-b last:border-0 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  task.completed ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : ''}`}>
                    {task.name}
                  </p>
                  <p className="text-sm text-gray-500">{task.subject}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {new Date(task.dueDate).toLocaleDateString('zh-TW')}
              </Badge>
            </div>
          ))}
          
          <div className="p-4 text-center">
            <Link to="/tasks">
              <Button variant="link" size="sm">查看所有任務</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Motivation Section */}
      <div className="mt-8 bg-gradient-to-r from-primary/10 to-purple-100 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">今日學習格言</h3>
        <p className="text-gray-700 italic">
          "學習不是為了應付考試，而是為了成為更好的自己。持續每天進步一點點，就能走得更遠。"
        </p>
        <div className="mt-4">
          <Link to="/pomodoro">
            <Button>開始今日學習</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
