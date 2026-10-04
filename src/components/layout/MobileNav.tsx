import React from 'react';
import { LayoutDashboard, BarChart2, GraduationCap, Settings, User } from 'lucide-react';
import { ViewTab } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenAuth: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
}) => {
  const { user } = useAuth();

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
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1B0F03] border-b border-[#6E3B00]/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#4D2A00] border border-[#CC6F00] flex items-center justify-center">
            <span className="font-black text-xs text-[#F2A900]">DD</span>
          </div>
          <span className="font-extrabold text-sm tracking-wider text-[#F9E6A8] uppercase">
            Daily Discipline
          </span>
        </div>

        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4D2A00] border border-[#6E3B00] text-xs font-semibold text-[#F9E6A8]"
        >
          <User className="w-3.5 h-3.5 text-[#F2A900]" />
          <span className="truncate max-w-[80px]">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
        </button>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B0F03]/95 border-t border-[#6E3B00]/70 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] rounded-xl transition-all ${
                isActive
                  ? 'text-[#F2A900]'
                  : 'text-[#F9E6A8]/60 hover:text-[#F9E6A8]'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-[#4D2A00] scale-110' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
