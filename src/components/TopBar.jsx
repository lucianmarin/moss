import React, { useState, useEffect, useRef } from 'react';
import { useOS, APP_DEFINITIONS, APP_ORDER } from '../context/OSContext';
import {
  BoltIcon,
  ChromeIcon,
  PlayPrismIcon,
  WhatsAppIcon,
  CodeNewsIcon,
  TwitterBirdIcon,
  DriveTriangleIcon,
  SettingsGearIcon
} from './MossIcons';

export const APP_ICON_MAP = {
  chrome: <ChromeIcon size={17} strokeWidth={1.9} />,
  player: <PlayPrismIcon size={17} strokeWidth={1.9} />,
  whatsapp: <WhatsAppIcon size={17} strokeWidth={1.9} />,
  code: <CodeNewsIcon size={17} />,
  twitter: <TwitterBirdIcon size={16} filled={false} />,
  finder: <DriveTriangleIcon size={17} strokeWidth={1.8} />,
  settings: <SettingsGearIcon size={17} strokeWidth={1.9} />
};

export default function TopBar() {
  const {
    windows,
    focusedApp,
    shellMode,
    switcherOpen,
    setSwitcherOpen,
    overviewOpen,
    setOverviewOpen,
    notificationsOpen,
    setNotificationsOpen,
    volume,
    setVolume,
    openWindow,
    minimizeWindow,
    applyWorkspacePreset,
    tweets
  } = useOS();

  const [activeMenu, setActiveMenu] = useState(null);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clockText, setClockText] = useState('19:42');
  const searchInputRef = useRef(null);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setClockText(`${hh}:${mm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleOutsideClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [searchOpen]);

  const hasSearchQuery = searchQuery.trim().length > 0;
  const filteredApps = hasSearchQuery
    ? APP_ORDER.filter((appId) => {
        const def = APP_DEFINITIONS[appId];
        const q = searchQuery.trim().toLowerCase();
        return (
          def.title.toLowerCase().includes(q) ||
          appId.toLowerCase().includes(q)
        );
      })
    : [];

  const handleLaunchFromSearch = (appId) => {
    openWindow(appId, { source: 'switcher' });
    setSearchOpen(false);
    setSearchQuery('');
  };

  const currentAppDef = APP_DEFINITIONS[focusedApp] || APP_DEFINITIONS.chrome;

  if (shellMode !== 'advanced') {
    return null;
  }

  return (
    <>
      <header className="moss-topbar" onMouseLeave={() => setActiveMenu(null)}>
        <div className="moss-topbar-left">
          <div className="moss-os-search-wrap" ref={searchWrapRef}>
            <button
              type="button"
              className={`moss-bolt-icon-static moss-bolt-btn ${searchOpen ? 'is-active' : ''}`}
              title="Moss — Search Apps"
              onClick={() => {
                setSearchOpen((v) => !v);
                setSwitcherOpen(false);
                setActiveMenu(null);
                setNotificationsOpen(false);
              }}
            >
              <BoltIcon size={17} />
            </button>

            {searchOpen && (
              <div className="moss-os-search-popover">
                <form
                  className="moss-os-search-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (filteredApps.length > 0) {
                      handleLaunchFromSearch(filteredApps[0]);
                    }
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="moss-os-search-input"
                    placeholder="Search apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.stopPropagation();
                        setSearchOpen(false);
                      }
                    }}
                  />
                </form>
                {hasSearchQuery && (
                  <div className="moss-os-search-results">
                    {filteredApps.length > 0 ? (
                      filteredApps.map((appId) => {
                        const def = APP_DEFINITIONS[appId];
                        return (
                          <button
                            key={appId}
                            type="button"
                            className="moss-os-search-item"
                            onClick={() => handleLaunchFromSearch(appId)}
                          >
                            <span className="moss-switcher-card-icon">{APP_ICON_MAP[appId]}</span>
                            <span>{def.title}</span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="moss-os-search-empty">No matching apps</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            data-app-switcher-trigger="true"
            className={`moss-active-app-name ${switcherOpen ? 'is-active' : ''}`}
            onClick={() => {
              setSwitcherOpen((v) => !v);
              setSearchOpen(false);
              setActiveMenu(null);
            }}
            title="Click to open App Switcher"
          >
            {currentAppDef.title}
          </button>

          <nav className="moss-menubar">
            {currentAppDef.menus.map((menuLabel) => (
              <div key={menuLabel} className="moss-menu-item-wrap">
                <button
                  className={`moss-menu-trigger ${activeMenu === menuLabel ? 'is-open' : ''}`}
                  onClick={() => setActiveMenu(activeMenu === menuLabel ? null : menuLabel)}
                  onMouseEnter={() => activeMenu && setActiveMenu(menuLabel)}
                >
                  {menuLabel}
                </button>
                {activeMenu === menuLabel && (
                  <div className="moss-menu-dropdown">
                    <button
                      onClick={() => {
                        openWindow(focusedApp, { source: 'switcher' });
                        setActiveMenu(null);
                      }}
                    >
                      Bring {currentAppDef.title} to Front
                    </button>
                    <button
                      onClick={() => {
                        minimizeWindow(focusedApp, 'switcher');
                        setActiveMenu(null);
                      }}
                    >
                      Minimize {currentAppDef.title}
                    </button>
                    <div className="moss-menu-divider" />
                    <div className="moss-menu-section-label">UI Mode</div>
                    <button
                      onClick={() => {
                        applyWorkspacePreset('advanced');
                        setActiveMenu(null);
                      }}
                    >
                      ✓ Advanced (Top bar)
                    </button>
                    <button
                      onClick={() => {
                        applyWorkspacePreset('basic');
                        setActiveMenu(null);
                      }}
                    >
                      Switch to Basic (Dock)
                    </button>
                    <div className="moss-menu-divider" />
                    <button
                      onClick={() => {
                        openWindow('settings', { source: 'switcher' });
                        setActiveMenu(null);
                      }}
                    >
                      Open System Settings...
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="moss-topbar-right">
          {/* Volume Control in Menu Bar */}
          <div className="moss-topbar-volume-wrap">
            <button
              className={`moss-tray-btn ${volumeOpen ? 'is-active' : ''}`}
              onClick={() => {
                setVolumeOpen((v) => !v);
                setNotificationsOpen(false);
              }}
              title={`System Volume (${volume}%)`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
                {volume >= 50 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                {volume === 0 && <line x1="22" y1="9" x2="16" y2="15" />}
              </svg>
            </button>

            {volumeOpen && (
              <div className="moss-menubar-volume-flyout">
                <button
                  className="moss-vol-mute-badge"
                  onClick={() => setVolume(volume === 0 ? 20 : 0)}
                  title="Mute / Unmute"
                >
                  {volume}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="moss-vol-slider"
                />
              </div>
            )}
          </div>

          {/* Workspace / Calendar / Overview toggle icon */}
          <button
            className={`moss-tray-btn ${overviewOpen ? 'is-active' : ''}`}
            onClick={() => setOverviewOpen((v) => !v)}
            title="Spatial Window Overview (Exposé)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="17" rx="2.5" />
              <line x1="3" y1="9.5" x2="21" y2="9.5" />
              <line x1="8" y1="2.5" x2="8" y2="5.5" />
              <line x1="16" y1="2.5" x2="16" y2="5.5" />
            </svg>
          </button>

          {/* Notification Bell icon */}
          <button
            className={`moss-tray-btn ${notificationsOpen ? 'is-active' : ''}`}
            onClick={() => {
              setNotificationsOpen((v) => !v);
              setVolumeOpen(false);
            }}
            title="Notifications & Activity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <button
            className="moss-clock-btn"
            onClick={() => openWindow('settings', { source: 'switcher' })}
            title="System Clock — Click to open Settings"
          >
            {clockText}
          </button>
        </div>
      </header>

      {/* Drop-Down App Switcher Stack with all V1 & V2 apps, icons, and names */}
      {switcherOpen && (
        <aside className="moss-v2-switcher-stack" data-switcher-stack="true">
          {APP_ORDER.map((appId) => {
            const def = APP_DEFINITIONS[appId];
            const win = windows[appId];
            const isOpen = win?.status === 'open';
            const isMinimized = win?.status === 'minimized';
            const isFocused = focusedApp === appId && isOpen;
            return (
              <button
                key={appId}
                data-switcher-item={appId}
                className={`moss-switcher-card ${isOpen ? 'is-running' : ''} ${isMinimized ? 'is-minimized' : ''} ${isFocused ? 'is-focused' : ''}`}
                onClick={() => {
                  openWindow(appId, { source: 'switcher' });
                  setSwitcherOpen(false);
                }}
              >
                <span className="moss-switcher-card-left">
                  <span className="moss-switcher-card-icon">{APP_ICON_MAP[appId]}</span>
                  <span className="moss-switcher-card-label">{def.title}</span>
                </span>
                {isOpen && <span className="moss-switcher-dot is-open" title="Open on workspace" />}
                {isMinimized && <span className="moss-switcher-dot" title="Minimized" />}
              </button>
            );
          })}
        </aside>
      )}

      {/* Notification Center Popover */}
      {notificationsOpen && (
        <div className="moss-notifications-popover">
          <div className="moss-notif-header">
            <span>Moss Activity Stream</span>
            <button onClick={() => setNotificationsOpen(false)}>Clear</button>
          </div>
          {tweets.map((item) => (
            <div
              key={item.id}
              className="moss-notif-card"
              onClick={() => {
                openWindow('twitter', { source: 'switcher' });
                setNotificationsOpen(false);
              }}
            >
              <img src={item.avatar} alt={item.author} className="moss-notif-avatar" />
              <div>
                <div className="moss-notif-meta">
                  <strong>@{item.author}</strong> <span>{item.time}</span>
                </div>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
