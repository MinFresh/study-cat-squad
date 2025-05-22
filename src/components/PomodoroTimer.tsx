
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  onComplete: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
  // Constants
  const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
  const BREAK_TIME = 5 * 60; // 5 minutes in seconds
  
  // States
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const { toast } = useToast();

  // Effect for the timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      if (!isBreak) {
        // Completed a pomodoro
        toast({
          title: "番茄鐘完成！",
          description: "做得好！現在休息一下吧。",
        });
        onComplete();
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
        setProgress(100);
      } else {
        // Completed a break
        toast({
          title: "休息時間結束！",
          description: "現在可以開始下一個番茄鐘了。",
        });
        setIsBreak(false);
        setTimeLeft(POMODORO_TIME);
        setProgress(100);
        setIsActive(false);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, onComplete, toast, BREAK_TIME]);

  // Update progress bar
  useEffect(() => {
    const totalTime = isBreak ? BREAK_TIME : POMODORO_TIME;
    const progressValue = (timeLeft / totalTime) * 100;
    setProgress(progressValue);
  }, [timeLeft, isBreak, POMODORO_TIME, BREAK_TIME]);

  // Handle start/pause
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Handle reset
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(POMODORO_TIME);
    setProgress(100);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {isBreak ? '休息時間' : '專心時間'}
        </h2>
        <p className="text-gray-500 text-sm">
          {isBreak ? '放鬆一下，準備下一個番茄鐘' : '專注完成當前任務'}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-56 h-56 rounded-full border-8 flex items-center justify-center relative">
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-primary"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (progress / 100) * 264}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dashoffset 1s" }}
              />
            </svg>
          </div>
          <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="rounded-full w-12 h-12"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={toggleTimer}
            className={`rounded-full w-16 h-16 ${
              isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            size="icon"
          >
            {isActive ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
