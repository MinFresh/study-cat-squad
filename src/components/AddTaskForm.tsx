
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';

type FormValues = {
  name: string;
  subject: string;
  dueDate: string;
  priority: string;
};

const AddTaskForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { addTask } = useAppContext();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>();

  // Get today's date in YYYY-MM-DD format for the default date
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = (data: FormValues) => {
    addTask({
      name: data.name,
      subject: data.subject,
      dueDate: data.dueDate,
      priority: parseInt(data.priority, 10),
    });
    
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          新增任務
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增學習任務</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">任務名稱</Label>
            <Input 
              id="name" 
              placeholder="例如：複習第三章" 
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">任務名稱不能為空</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">科目</Label>
            <Select 
              onValueChange={(value) => setValue('subject', value)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇科目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="數學">數學</SelectItem>
                <SelectItem value="英文">英文</SelectItem>
                <SelectItem value="科學">科學</SelectItem>
                <SelectItem value="歷史">歷史</SelectItem>
                <SelectItem value="地理">地理</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
            <input 
              type="hidden" 
              {...register("subject", { required: true })}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">請選擇科目</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">截止日期</Label>
            <Input 
              id="dueDate" 
              type="date" 
              defaultValue={today}
              {...register("dueDate", { required: true })}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">請選擇日期</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">優先級</Label>
            <Select 
              onValueChange={(value) => setValue('priority', value)}
              defaultValue="3"
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇優先級" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">高優先（5）</SelectItem>
                <SelectItem value="4">重要（4）</SelectItem>
                <SelectItem value="3">中等（3）</SelectItem>
                <SelectItem value="2">低（2）</SelectItem>
                <SelectItem value="1">選修（1）</SelectItem>
              </SelectContent>
            </Select>
            <input 
              type="hidden" 
              {...register("priority", { required: true })}
            />
            {errors.priority && (
              <p className="text-sm text-red-500">請選擇優先級</p>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              取消
            </Button>
            <Button type="submit">新增任務</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
