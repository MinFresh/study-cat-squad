
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for our app data
export type Task = {
  id: string;
  subject: string;
  name: string;
  completed: boolean;
  dueDate: string;
  priority: number;
};

export type StudyLog = {
  date: string;
  minutes: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type PetStatus = {
  mood: 'happy' | 'neutral' | 'sad';
  accessories: string[];
};

// The main app state
type AppState = {
  tasks: Task[];
  studyLogs: StudyLog[];
  catcoins: number;
  badges: Badge[];
  petStatus: PetStatus;
  pomodorosCompleted: number;
};

// Context value including state and update functions
type AppContextValue = {
  state: AppState;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  addStudyMinutes: (minutes: number) => void;
  incrementPomodoro: () => void;
  addCatcoins: (amount: number) => void;
  spendCatcoins: (amount: number) => boolean;
  unlockBadge: (badgeId: string) => void;
  setPetMood: (mood: PetStatus['mood']) => void;
  addPetAccessory: (accessory: string) => void;
  loadInitialData: () => void;
};

// Create context with default values
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Default badges
const defaultBadges: Badge[] = [
  {
    id: 'early-bird',
    name: '早起貓貓',
    description: '早上 6 點前開始學習',
    icon: '🌅',
    unlocked: false,
  },
  {
    id: 'pomodoro-master',
    name: '番茄高手',
    description: '完成 10 個番茄鐘',
    icon: '🍅',
    unlocked: false,
  },
  {
    id: 'consistent-learner',
    name: '持之以恆',
    description: '連續七天學習',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'math-wizard',
    name: '數學達人',
    description: '完成 20 個數學任務',
    icon: '🧮',
    unlocked: false,
  },
  {
    id: 'night-owl',
    name: '夜貓子',
    description: '晚上 10 點後學習 2 小時',
    icon: '🦉',
    unlocked: false,
  },
];

// Default app state
const defaultState: AppState = {
  tasks: [],
  studyLogs: [],
  catcoins: 0,
  badges: defaultBadges,
  petStatus: {
    mood: 'neutral',
    accessories: [],
  },
  pomodorosCompleted: 0,
};

// Sample exam data for default tasks
const examData = [
  { subject: '數學', priority: 5 },
  { subject: '英文', priority: 4 },
  { subject: '歷史', priority: 3 },
  { subject: '科學', priority: 4 },
  { subject: '地理', priority: 2 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Try to load state from localStorage
    const savedState = localStorage.getItem('smartStudyState');
    return savedState ? JSON.parse(savedState) : defaultState;
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('smartStudyState', JSON.stringify(state));
  }, [state]);

  // Generate some default tasks if none exist
  const loadInitialData = () => {
    if (state.tasks.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      
      // Generate default tasks based on exam data
      const defaultTasks = examData.map((exam, index) => ({
        id: `default-task-${index}`,
        subject: exam.subject,
        name: `學習${exam.subject}`,
        completed: false,
        dueDate: today,
        priority: exam.priority,
      }));
      
      setState(prev => ({ ...prev, tasks: defaultTasks }));
    }
    
    // Generate some example study logs if none exist
    if (state.studyLogs.length === 0) {
      const today = new Date();
      const logs = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        logs.push({
          date: date.toISOString().split('T')[0],
          minutes: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        });
      }
      
      setState(prev => ({ ...prev, studyLogs: logs }));
    }
  };

  // Add a new task
  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
    };
    
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  // Mark a task as complete and award catcoins
  const completeTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ),
      catcoins: prev.catcoins + 10, // Award 10 catcoins for completing a task
    }));
  };

  // Mark a task as incomplete (and remove catcoins)
  const uncompleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, completed: false } : task
      ),
      catcoins: Math.max(0, prev.catcoins - 10), // Remove 10 catcoins but not below 0
    }));
  };

  // Record study minutes for the current day
  const addStudyMinutes = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setState(prev => {
      const existingLog = prev.studyLogs.find(log => log.date === today);
      
      if (existingLog) {
        // Update existing log
        return {
          ...prev,
          studyLogs: prev.studyLogs.map(log => 
            log.date === today 
              ? { ...log, minutes: log.minutes + minutes }
              : log
          ),
        };
      } else {
        // Create new log for today
        return {
          ...prev,
          studyLogs: [...prev.studyLogs, { date: today, minutes }],
        };
      }
    });

    // Check for consistent learner badge
    checkForConsistentLearner();
  };

  // Increment the pomodoro counter
  const incrementPomodoro = () => {
    setState(prev => {
      const newCount = prev.pomodorosCompleted + 1;
      
      // Check for Pomodoro Master badge
      if (newCount === 10) {
        return {
          ...prev,
          pomodorosCompleted: newCount,
          badges: prev.badges.map(badge => 
            badge.id === 'pomodoro-master' 
              ? { ...badge, unlocked: true }
              : badge
          ),
        };
      }
      
      return {
        ...prev,
        pomodorosCompleted: newCount,
      };
    });
  };

  // Add catcoins
  const addCatcoins = (amount: number) => {
    setState(prev => ({
      ...prev,
      catcoins: prev.catcoins + amount,
    }));
  };

  // Spend catcoins if user has enough
  const spendCatcoins = (amount: number): boolean => {
    if (state.catcoins >= amount) {
      setState(prev => ({
        ...prev,
        catcoins: prev.catcoins - amount,
      }));
      return true;
    }
    return false;
  };

  // Unlock a badge
  const unlockBadge = (badgeId: string) => {
    setState(prev => ({
      ...prev,
      badges: prev.badges.map(badge => 
        badge.id === badgeId ? { ...badge, unlocked: true } : badge
      ),
    }));
  };

  // Set pet mood
  const setPetMood = (mood: PetStatus['mood']) => {
    setState(prev => ({
      ...prev,
      petStatus: { ...prev.petStatus, mood },
    }));
  };

  // Add a pet accessory
  const addPetAccessory = (accessory: string) => {
    // Check if already has this accessory
    if (state.petStatus.accessories.includes(accessory)) {
      return;
    }
    
    setState(prev => ({
      ...prev,
      petStatus: { 
        ...prev.petStatus, 
        accessories: [...prev.petStatus.accessories, accessory],
        mood: 'happy', // Pet is happy with a new accessory!
      },
    }));
  };

  // Check for continuous 7-day learning streak
  const checkForConsistentLearner = () => {
    const sortedLogs = [...state.studyLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (sortedLogs.length < 7) return;
    
    const today = new Date();
    let consecutiveDays = 0;
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      if (sortedLogs.some(log => log.date === dateString && log.minutes > 0)) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    
    if (consecutiveDays >= 7) {
      // Unlock consistent learner badge
      unlockBadge('consistent-learner');
    }
  };

  // Calculate pet mood based on recent study activity
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const todayLog = state.studyLogs.find(log => log.date === today);
    const yesterdayLog = state.studyLogs.find(log => log.date === yesterdayStr);
    
    // Determine pet mood based on study activity
    if (todayLog && todayLog.minutes > 60) {
      setPetMood('happy');
    } else if (!todayLog && (!yesterdayLog || yesterdayLog.minutes < 30)) {
      setPetMood('sad');
    } else {
      setPetMood('neutral');
    }
  }, [state.studyLogs]);

  // Check for early bird badge
  useEffect(() => {
    const checkEarlyBird = () => {
      const now = new Date();
      const hours = now.getHours();
      
      if (hours < 6) {
        unlockBadge('early-bird');
      }
    };
    
    checkEarlyBird();
  }, []);

  // Check for night owl badge
  useEffect(() => {
    const checkNightOwl = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Check if it's past 10 PM and user has studied for 2+ hours today
      if (hours >= 22) {
        const today = now.toISOString().split('T')[0];
        const todayLog = state.studyLogs.find(log => log.date === today);
        
        if (todayLog && todayLog.minutes >= 120) {
          unlockBadge('night-owl');
        }
      }
    };
    
    // Check night owl status every hour
    const interval = setInterval(checkNightOwl, 3600000); 
    return () => clearInterval(interval);
  }, [state.studyLogs]);

  // Check for math wizard badge
  useEffect(() => {
    const mathTasks = state.tasks.filter(
      task => task.subject === '數學' && task.completed
    );
    
    if (mathTasks.length >= 20) {
      unlockBadge('math-wizard');
    }
  }, [state.tasks]);

  return (
    <AppContext.Provider
      value={{
        state,
        addTask,
        completeTask,
        uncompleteTask,
        addStudyMinutes,
        incrementPomodoro,
        addCatcoins,
        spendCatcoins,
        unlockBadge,
        setPetMood,
        addPetAccessory,
        loadInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
