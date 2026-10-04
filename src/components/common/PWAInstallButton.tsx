import React, { useState } from 'react';
import { Smartphone, Download, Check, X, Shield, Terminal, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'banner' | 'sidebar' | 'compact' }> = ({
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  // If already running in standalone native mode, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowAndroidModal(true);
      }
    } else {
      setShowAndroidModal(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className="bg-[#4D2A00]/90 border border-[#CC6F00]/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B0F03] border border-[#F2A900]/70 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#F2A900]" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#F9E6A8]">
                Install Daily Discipline on Android
              </p>
              <p className="text-[11px] text-[#F9E6A8]/70">
                Runs fullscreen without browser bars, with offline caching and daily streak protection.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 bg-[#CC6F00] hover:bg-[#F2A900] text-[#1B0F03] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Android App</span>
          </button>
        </div>
      ) : variant === 'sidebar' ? (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#4D2A00]/70 border border-[#6E3B00] hover:border-[#F2A900] text-xs font-bold text-[#F9E6A8] transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#F2A900] group-hover:scale-110 transition-transform" />
            <span>Install on Android</span>
          </div>
          <span className="text-[10px] text-[#F2A900] bg-[#1B0F03] px-2 py-0.5 rounded border border-[#6E3B00]">
            APK / App
          </span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#4D2A00] border border-[#CC6F00]/70 hover:border-[#F2A900] text-xs font-semibold text-[#F9E6A8] transition-colors"
          title="Install as Android App"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>Install App</span>
        </button>
      )}

      {/* Android & APK Installation Instructions Modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 bg-[#1B0F03]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#4D2A00] border border-[#6E3B00] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAndroidModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#F9E6A8]/60 hover:text-[#F9E6A8] hover:bg-[#331C00]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1B0F03] border border-[#F2A900] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#F2A900]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F9E6A8] tracking-tight">
                  Install Daily Discipline for Android
                </h2>
                <span className="text-xs text-[#F2A900] font-semibold">
                  Native WebAPK & Standalone App Package
                </span>
              </div>
            </div>

            {/* Method 1: Instant 1-Tap Android WebAPK (Recommended) */}
            <div className="bg-[#1B0F03]/90 border border-[#CC6F00]/60 rounded-xl p-4 mb-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#F2A900]">
                  Option 1: Direct Android Install (No Sideloading Required)
                </span>
                <span className="text-[10px] bg-[#CC6F00] text-[#1B0F03] px-2 py-0.5 rounded font-bold">
                  Recommended
                </span>
              </div>

              <p className="text-xs text-[#F9E6A8]/85 leading-relaxed">
                Android Chromium creates and installs a real native <strong>WebAPK</strong> directly onto your phone with zero developer tools:
              </p>

              <ol className="text-xs text-[#F9E6A8]/80 flex flex-col gap-2 pl-4 list-decimal">
                <li>
                  Open this link in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your Android phone.
                </li>
                <li>
                  Tap the browser menu <strong>(⋮ three dots)</strong> in the top right.
                </li>
                <li>
                  Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </li>
                <li>
                  Android will generate and install the native <strong>Daily Discipline</strong> APK with full app permissions, standalone fullscreen mode, and app launcher icon.
                </li>
              </ol>

              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowAndroidModal(false);
                  }}
                  className="mt-2 py-2.5 bg-[#F2A900] hover:bg-[#CC6F00] text-[#1B0F03] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Launch Android Install Prompt Now</span>
                </button>
              )}
            </div>

            {/* Method 2: Build Standalone Signed APK with Capacitor or Bubblewrap */}
            <div className="bg-[#1B0F03]/60 border border-[#6E3B00]/70 rounded-xl p-4 flex flex-col gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#F9E6A8]/80 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#F2A900]" />
                Option 2: Generate Signed `.apk` File (Google Play / Sideload)
              </span>

              <p className="text-xs text-[#F9E6A8]/70 leading-relaxed">
                To build an offline `.apk` or `.aab` package for the Google Play Store or APK sideloading, you can run Google's official Bubblewrap or Capacitor CLI:
              </p>

              <div className="bg-[#100902] border border-[#6E3B00] rounded-lg p-2.5 font-mono text-[11px] text-[#F2A900] overflow-x-auto select-all">
                # 1. Build the production web bundle<br />
                npm run build<br /><br />
                # 2. Package into native Android APK via Bubblewrap (TWA)<br />
                npx @bubblewrap/cli init --manifest=http://localhost:3000/manifest.webmanifest<br />
                npx @bubblewrap/cli build
              </div>

              <span className="text-[11px] text-[#F9E6A8]/60 mt-1">
                Produces a release <code className="text-[#F2A900]">app-release-signed.apk</code> ready to install on any Android device.
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#6E3B00]/60 flex items-center justify-end">
              <button
                onClick={() => setShowAndroidModal(false)}
                className="px-4 py-2 bg-[#331C00] hover:bg-[#6E3B00] text-[#F9E6A8] text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
