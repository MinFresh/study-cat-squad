
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cat, Calendar, Clock, ChartLine, Award, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { name: '首頁', path: '/', icon: Home },
    { name: '任務', path: '/tasks', icon: Calendar },
    { name: '番茄鐘', path: '/pomodoro', icon: Clock },
    { name: '統計', path: '/stats', icon: ChartLine },
    { name: '成就', path: '/achievements', icon: Award },
    { name: '貓咪', path: '/pet', icon: Cat },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center text-xs",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary transition-colors"
              )}
            >
              <item.icon size={20} />
            </Link>
          ))}
        </nav>

        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 p-6 bg-white border-r border-gray-200">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <Cat className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">SmartStudy</h1>
          </Link>
          
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
