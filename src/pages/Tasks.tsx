
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Tasks = () => {
  const { state, completeTask, uncompleteTask, loadInitialData } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load initial data if needed
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  // Filter tasks by tab and search
  const filterTasks = (tasks: typeof state.tasks, status: 'all' | 'active' | 'completed') => {
    return tasks
      .filter(task => {
        if (status === 'active') return !task.completed;
        if (status === 'completed') return task.completed;
        return true;
      })
      .filter(task => {
        if (!searchQuery) return true;
        return (
          task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  };
  
  // Group tasks by date
  const groupTasksByDate = (tasks: typeof state.tasks) => {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.dueDate]) {
        acc[task.dueDate] = [];
      }
      acc[task.dueDate].push(task);
      return acc;
    }, {} as Record<string, typeof state.tasks>);
    
    // Sort dates
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
  };
  
  // Get today's and overdue tasks
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = (date: string) => date < today;
  
  // Handler for the "Add New Task" button
  const handleAddTaskClick = () => {
    const addTaskButton = document.querySelector('[aria-label="新增任務"]');
    if (addTaskButton instanceof HTMLElement) {
      addTaskButton.click();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">學習任務</h1>
          <p className="text-muted-foreground">管理你的學習計劃和作業</p>
        </div>
        <AddTaskForm />
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索任務或科目..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">所有任務</TabsTrigger>
          <TabsTrigger value="active">待完成</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList>
        
        {['all', 'active', 'completed'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-8">
            {groupTasksByDate(filterTasks(state.tasks, tab as 'all' | 'active' | 'completed')).map(([date, tasks]) => (
              <Card key={date} className={isOverdue(date) && tab !== 'completed' ? 'border-red-200' : ''}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center">
                      {date === today ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                          今天
                        </span>
                      ) : isOverdue(date) && tab !== 'completed' ? (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                          已逾期
                        </span>
                      ) : null}
                      <span>
                        {new Date(date).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long',
                        })}
                      </span>
                    </div>
                    <span className="text-sm font-normal text-muted-foreground">
                      {tasks.filter(t => t.completed).length}/{tasks.length} 已完成
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 pt-0">
                  {tasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onComplete={completeTask}
                      onUncomplete={uncompleteTask}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
            
            {filterTasks(state.tasks, tab as 'all' | 'active' | 'completed').length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">尚無任務</p>
                <Button variant="outline" onClick={handleAddTaskClick}>
                  添加新任務
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Tasks;
