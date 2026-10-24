import React, { useEffect } from 'react';
import { OSProvider, useOS } from './context/OSContext';
import TopBar from './components/TopBar';
import LeftDock from './components/LeftDock';
import RightHud from './components/RightHud';
import SpatialOverview from './components/SpatialOverview';
import BrowserApp from './apps/BrowserApp';
import WhatsAppApp from './apps/WhatsAppApp';
import PlayerApp from './apps/PlayerApp';
import CodeEditorApp from './apps/CodeEditorApp';
import TwitterApp from './apps/TwitterApp';
import FinderApp from './apps/FinderApp';
import SettingsApp from './apps/SettingsApp';

function DesktopEnvironment() {
  const {
    wallpaper,
    shellMode,
    isMobile,
    setOverviewOpen,
    setNotificationsOpen,
    setSwitcherOpen
  } = useOS();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOverviewOpen((v) => !v);
        setNotificationsOpen(false);
        setSwitcherOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOverviewOpen, setNotificationsOpen, setSwitcherOpen]);

  return (
    <main className={`moss-desktop wallpaper-${wallpaper} mode-${shellMode} ${isMobile ? 'is-mobile' : ''}`}>
      {/* V2 Top System Bar & Top-Left Switcher Stack */}
      <TopBar />

      {/* V2 Floating Left Dock */}
      <LeftDock />

      {/* Desktop Spatial Window Canvas */}
      <div
        className="moss-canvas"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setNotificationsOpen(false);
            setSwitcherOpen(false);
          }
        }}
      >
        <BrowserApp />
        <WhatsAppApp />
        <PlayerApp />
        <CodeEditorApp />
        <TwitterApp />
        <FinderApp />
        <SettingsApp />
      </div>

      {/* V1 Right-Edge Quick Tiles + Volume Flyout + V1 Bottom Ticker */}
      <RightHud />

      {/* Spatial Overview (Exposé) */}
      <SpatialOverview />
    </main>
  );
}

export default function App() {
  return (
    <OSProvider>
      <DesktopEnvironment />
    </OSProvider>
  );
}
