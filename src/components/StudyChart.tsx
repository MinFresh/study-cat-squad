
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudyLog {
  date: string;
  minutes: number;
}

interface StudyChartProps {
  data: StudyLog[];
  period: 'week' | 'month' | 'all';
}

const StudyChart: React.FC<StudyChartProps> = ({ data, period }) => {
  // Format dates for display
  const formatChartData = (logs: StudyLog[]) => {
    return logs.map(log => {
      const date = new Date(log.date);
      return {
        ...log,
        formattedDate: date.toLocaleDateString('zh-TW', { 
          month: 'short', 
          day: 'numeric' 
        }),
        hours: parseFloat((log.minutes / 60).toFixed(1)),
      };
    });
  };

  // Filter data based on period
  const getFilteredData = () => {
    const now = new Date();
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    switch (period) {
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return sortedData.filter(log => new Date(log.date) >= weekAgo);
      
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return sortedData.filter(log => new Date(log.date) >= monthAgo);
      
      case 'all':
      default:
        return sortedData;
    }
  };

  const chartData = formatChartData(getFilteredData());

  // Calculate statistics
  const totalMinutes = chartData.reduce((sum, item) => sum + item.minutes, 0);
  const totalHours = parseFloat((totalMinutes / 60).toFixed(1));
  const avgMinutesPerDay = chartData.length > 0 
    ? parseFloat((totalMinutes / chartData.length).toFixed(1)) 
    : 0;
  const maxMinutes = chartData.length > 0 
    ? Math.max(...chartData.map(item => item.minutes)) 
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>學習時間統計</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">總學習時間</p>
            <p className="text-2xl font-bold">{totalHours} 小時</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">平均每天</p>
            <p className="text-2xl font-bold">{avgMinutesPerDay} 分鐘</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700">最高紀錄</p>
            <p className="text-2xl font-bold">{maxMinutes} 分鐘</p>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{ 
                  value: '分鐘', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} 分鐘`, '學習時間']}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="minutes"
                name="學習時間"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyChart;
