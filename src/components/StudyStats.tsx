
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudyLog } from '@/contexts/AppContext';

interface StudyStatsProps {
  studyLogs: StudyLog[];
  pomodorosCompleted: number;
}

const StudyStats: React.FC<StudyStatsProps> = ({ studyLogs, pomodorosCompleted }) => {
  // Calculate total study time in minutes
  const totalMinutes = studyLogs.reduce((total, log) => total + log.minutes, 0);
  
  // Calculate average study time per day
  const averageMinutes = studyLogs.length > 0 
    ? Math.round(totalMinutes / studyLogs.length) 
    : 0;
  
  // Get study streak
  const calculateStreak = () => {
    const today = new Date();
    let currentStreak = 0;
    
    // Sort logs by date in descending order
    const sortedLogs = [...studyLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      // Check if the dates match (ignoring time)
      if (
        logDate.getFullYear() === expectedDate.getFullYear() &&
        logDate.getMonth() === expectedDate.getMonth() &&
        logDate.getDate() === expectedDate.getDate()
      ) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  };
  
  const streak = calculateStreak();
  
  // Format hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}小時 ${mins}分鐘`;
    } else {
      return `${mins}分鐘`;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>總學習時間</CardDescription>
          <CardTitle>{formatTime(totalMinutes)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            相當於 {Math.round(totalMinutes / 60 * 10) / 10} 小時
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>平均每日學習</CardDescription>
          <CardTitle>{formatTime(averageMinutes)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            已記錄 {studyLogs.length} 天的學習數據
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>學習連續天數</CardDescription>
          <CardTitle>{streak} 天</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            連續學習可以獲得成就獎勵
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>完成番茄鐘</CardDescription>
          <CardTitle>{pomodorosCompleted} 個</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            每個番茄鐘 25 分鐘專注學習
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyStats;
