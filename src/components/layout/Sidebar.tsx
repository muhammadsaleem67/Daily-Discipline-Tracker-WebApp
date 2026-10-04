import React from 'react';
import {
  LayoutDashboard,
  BarChart2,
  GraduationCap,
  Settings,
  LogOut,
  Flame,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { ViewTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
}) => {
  const { user, logout } = useAuth();
  const { streak } = useData();

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'today',
      label: 'Today',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#1B0F03] border-r border-[#6E3B00]/70 p-4 justify-between h-screen sticky top-0 shrink-0">
      {/* Brand Zone */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#4D2A00] border border-[#CC6F00] flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-[#F2A900]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-[#F9E6A8] leading-none uppercase">
              Daily Discipline
            </h1>
            <span className="text-[10px] text-[#F2A900] font-semibold tracking-widest uppercase">
              Performance Core
            </span>
          </div>
        </div>

        {/* Mini Streak Pill in Sidebar */}
        <div className="bg-[#4D2A00]/70 border border-[#6E3B00]/60 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#F2A900]" />
            <span className="text-xs text-[#F9E6A8]/80 font-medium">Active Streak</span>
          </div>
          <span className="text-xs font-bold text-[#F2A900] tabular-nums">
            {streak.currentStreak} Days
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#CC6F00] text-[#1B0F03] shadow-md font-bold'
                    : 'text-[#F9E6A8]/75 hover:text-[#F9E6A8] hover:bg-[#4D2A00]/50'
                }`}
              >
                <span className={isActive ? 'text-[#1B0F03]' : 'text-[#F2A900]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile / Footer */}
      <div className="pt-4 border-t border-[#6E3B00]/50 flex flex-col gap-2">
        {user ? (
          <div className="bg-[#4D2A00]/50 border border-[#6E3B00]/50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#6E3B00] border border-[#F2A900]/50 flex items-center justify-center font-bold text-xs text-[#F9E6A8] shrink-0">
                {user.avatar || user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-semibold text-[#F9E6A8] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#F9E6A8]/50 truncate font-mono">
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[#F9E6A8]/50 hover:text-[#F2A900] hover:bg-[#331C00] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 bg-[#CC6F00] hover:bg-[#F2A900] text-[#1B0F03] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In / Create Account</span>
          </button>
        )}
      </div>
    </aside>
  );
};
