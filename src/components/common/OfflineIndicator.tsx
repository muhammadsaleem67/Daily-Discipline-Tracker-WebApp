import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed bottom-20 lg:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold shadow-xl transition-all border ${
        isOnline
          ? 'bg-[#CC6F00] text-[#1B0F03] border-[#F2A900]'
          : 'bg-[#4D2A00] text-[#F9E6A8] border-[#CC6F00]'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>Back online — Standalone storage active</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>Offline Mode — All daily routines work completely offline</span>
        </>
      )}
    </div>
  );
};
