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
    <aside className="hidden lg:flex flex-col w-64 bg-[#082226] border-r border-[#247B7B]/60 p-4 justify-between h-screen sticky top-0 shrink-0">
      {/* Brand Zone */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#0D5C63] border border-[#44A1A0] flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-[#78CDD7]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-[#FFFFFA] leading-none uppercase">
              Daily Discipline
            </h1>
            <span className="text-[10px] text-[#78CDD7] font-semibold tracking-widest uppercase">
              Performance Core
            </span>
          </div>
        </div>

        {/* Mini Streak Pill in Sidebar */}
        <div className="bg-[#0D5C63]/60 border border-[#247B7B]/50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#78CDD7]" />
            <span className="text-xs text-[#FFFFFA]/80 font-medium">Active Streak</span>
          </div>
          <span className="text-xs font-bold text-[#78CDD7] tabular-nums">
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
                    ? 'bg-[#44A1A0] text-[#082226] shadow-md font-bold'
                    : 'text-[#FFFFFA]/70 hover:text-[#FFFFFA] hover:bg-[#0D5C63]/50'
                }`}
              >
                <span className={isActive ? 'text-[#082226]' : 'text-[#78CDD7]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile / Footer */}
      <div className="pt-4 border-t border-[#247B7B]/40 flex flex-col gap-2">
        {user ? (
          <div className="bg-[#0D5C63]/40 border border-[#247B7B]/40 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#247B7B] border border-[#78CDD7]/50 flex items-center justify-center font-bold text-xs text-[#FFFFFA] shrink-0">
                {user.avatar || user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-semibold text-[#FFFFFA] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#FFFFFA]/50 truncate font-mono">
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[#FFFFFA]/50 hover:text-red-300 hover:bg-[#103b41] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 bg-[#44A1A0] hover:bg-[#78CDD7] text-[#082226] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In / Create Account</span>
          </button>
        )}
      </div>
    </aside>
  );
};
