import React, { useState } from 'react';
import { useOS, APP_DEFINITIONS } from '../context/OSContext';
import {
  ChromeIcon,
  PlayPrismIcon,
  WhatsAppIcon,
  CodeNewsIcon,
  TwitterBirdIcon,
  DriveTriangleIcon,
  SettingsGearIcon,
  CursorArrowIcon,
  LayersStackIcon
} from './MossIcons';

export default function LeftDock() {
  const {
    windows,
    focusedApp,
    shellMode,
    overviewOpen,
    setOverviewOpen,
    volume,
    setVolume,
    toggleWindowFromDock,
    openWindow,
    applyWorkspacePreset
  } = useOS();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dockVolOpen, setDockVolOpen] = useState(false);

  if (shellMode !== 'basic') {
    return null;
  }

  // Unified V1 & V2 apps in the Left Dock with icons and names
  const dockItems = [
    { id: 'chrome', name: APP_DEFINITIONS.chrome.title, icon: <ChromeIcon size={24} /> },
    { id: 'player', name: APP_DEFINITIONS.player.title, icon: <PlayPrismIcon size={22} /> },
    { id: 'whatsapp', name: APP_DEFINITIONS.whatsapp.title, icon: <WhatsAppIcon size={23} /> },
    { id: 'code', name: APP_DEFINITIONS.code.title, icon: <CodeNewsIcon size={22} /> },
    { id: 'twitter', name: APP_DEFINITIONS.twitter.title, icon: <TwitterBirdIcon size={21} filled={false} /> },
    { id: 'finder', name: APP_DEFINITIONS.finder.title, icon: <DriveTriangleIcon size={22} /> },
    { id: 'settings', name: APP_DEFINITIONS.settings.title, icon: <SettingsGearIcon size={22} /> }
  ];

  return (
    <aside className="moss-v2-left-dock">
      <div className="moss-dock-apps">
        {dockItems.map((item) => {
          const win = windows[item.id];
          const isOpen = win?.status === 'open';
          const isFocused = focusedApp === item.id && isOpen;

          return (
            <button
              key={item.id}
              data-dock-item={item.id}
              className={`moss-dock-btn ${isOpen ? 'is-open' : 'is-dormant'} ${isFocused ? 'is-focused' : ''}`}
              onClick={() => toggleWindowFromDock(item.id)}
              title={item.name}
            >
              {item.icon}
              <span className="moss-dock-tooltip">{item.name}</span>
              {win?.status === 'minimized' && <span className="moss-dock-minimized-pip" />}
            </button>
          );
        })}
      </div>

      <div className="moss-dock-footer">
        {/* Volume Control in Left Dock */}
        <div className="moss-dock-volume-wrap">
          <button
            className={`moss-dock-vol-btn ${dockVolOpen ? 'is-active' : ''}`}
            onClick={() => {
              setDockVolOpen((v) => !v);
              setMenuOpen(false);
            }}
            title={`Volume (${volume}%)`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
              {volume >= 50 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
              {volume === 0 && <line x1="22" y1="9" x2="16" y2="15" />}
            </svg>
          </button>

          {dockVolOpen && (
            <div className="moss-dock-volume-flyout">
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

        <div className="moss-dock-utility-row">
          <button
            className={`moss-dock-util-btn ${!overviewOpen ? 'is-active' : ''}`}
            onClick={() => setOverviewOpen(false)}
            title="Pointer / Canvas Focus Mode"
          >
            <CursorArrowIcon size={14} />
          </button>
          <button
            className={`moss-dock-util-btn ${overviewOpen ? 'is-active' : ''}`}
            onClick={() => setOverviewOpen((v) => !v)}
            title="Spatial Layer Overview"
          >
            <LayersStackIcon size={14} />
          </button>
        </div>

        <div className="moss-dock-clock-row">
          <div
            className="moss-dock-vertical-clock"
            onClick={() => openWindow('settings', { source: 'dock' })}
            title="Moss V2 Vertical Clock (19:20)"
          >
            <span>19</span>
            <span>20</span>
          </div>

          <button
            className="moss-dock-more-btn"
            onClick={() => {
              setMenuOpen((v) => !v);
              setDockVolOpen(false);
            }}
            title="Switch UI Mode"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {menuOpen && (
          <div className="moss-dock-popup">
            <div className="moss-dock-popup-title">UI Mode</div>
            <button
              onClick={() => {
                applyWorkspacePreset('basic');
                setMenuOpen(false);
              }}
            >
              ✓ Basic (Dock)
            </button>
            <button
              onClick={() => {
                applyWorkspacePreset('advanced');
                setMenuOpen(false);
              }}
            >
              Switch to Advanced (Top bar)
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
