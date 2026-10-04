import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ViewTab } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { TodayView } from './components/dashboard/TodayView';
import { InsightsView } from './components/insights/InsightsView';
import { CoursesView } from './components/courses/CoursesView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { MilestoneModal } from './components/common/MilestoneModal';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ViewTab>('today');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { milestoneToCelebrate, clearCelebration } = useData();

  return (
    <div className="flex min-h-screen bg-[#082226] text-[#FFFFFA]">
      {/* Desktop / Tablet Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
        {/* Mobile Top Header */}
        <MobileNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* View Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'today' && <TodayView />}
          {currentTab === 'insights' && <InsightsView />}
          {currentTab === 'courses' && <CoursesView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Milestone Celebration Modal */}
      <MilestoneModal
        days={milestoneToCelebrate}
        onClose={clearCelebration}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainLayout />
      </DataProvider>
    </AuthProvider>
  );
}
