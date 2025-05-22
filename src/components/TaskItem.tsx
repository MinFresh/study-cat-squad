
import React from 'react';
import { Task } from '@/contexts/AppContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onUncomplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onUncomplete }) => {
  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      onComplete(task.id);
    } else {
      onUncomplete(task.id);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5:
        return 'bg-red-100 text-red-800 border-red-200';
      case 4:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 1:
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const priorityLabel = (priority: number) => {
    switch (priority) {
      case 5:
        return '高優先';
      case 4:
        return '重要';
      case 3:
        return '中等';
      case 2:
        return '低';
      case 1:
      default:
        return '選修';
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-lg border mb-2 transition-all",
      task.completed ? "bg-gray-50 opacity-70" : "bg-white"
    )}>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleCheckboxChange}
          className="h-5 w-5"
        />
        
        <div className={cn(task.completed && "line-through text-gray-500")}>
          <div className="font-medium">{task.name}</div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>{task.subject}</span>
            <span>•</span>
            <span>截止日期: {task.dueDate}</span>
          </div>
        </div>
      </div>
      
      <Badge className={getPriorityColor(task.priority)}>
        {priorityLabel(task.priority)}
      </Badge>
    </div>
  );
};

export default TaskItem;
