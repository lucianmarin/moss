import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { SettingsGearIcon } from '../components/MossIcons';

export default function SettingsApp() {
  const {
    windows,
    shellMode,
    wallpaper,
    setWallpaper,
    animationStyle,
    setAnimationStyle,
    showDualPlayer,
    setShowDualPlayer,
    volume,
    setVolume,
    setWindowTab,
    minimizeWindow,
    closeWindow,
    applyWorkspacePreset,
    openWindow
  } = useOS();

  const win = windows.settings;
  const activeTab = win?.activeTab || 'Appearance';
  const [menuOpen, setMenuOpen] = useState(false);

  const settingsTabs = ['Appearance', 'Interaction & Physics', 'Audio & V1'];

  return (
    <WindowFrame appId="settings" minWidth={440} minHeight={320}>
      <div className="moss-settings-window">
        {/* V1 Header Bar matching Chrome and Code apps */}
        <div
          className="moss-code-header"
          onDoubleClick={() => minimizeWindow('settings', 'switcher')}
        >
          <div className="moss-code-tabs">
            {settingsTabs.map((tab) => (
              <button
                key={tab}
                className={`moss-code-tab ${activeTab === tab ? 'is-active' : ''}`}
                onClick={() => setWindowTab('settings', tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="moss-code-header-right">
            <button
              className="moss-code-plusminus"
              onClick={() => minimizeWindow('settings', 'switcher')}
              title="Minimize Settings (_)"
            >
              _
            </button>
            <button
              className="moss-code-plusminus"
              onClick={() => {
                const idx = settingsTabs.indexOf(activeTab);
                const next = settingsTabs[(idx + 1) % settingsTabs.length];
                setWindowTab('settings', next);
              }}
              title="Next Settings Tab (+)"
            >
              +
            </button>
            <button
              className={`moss-code-blue-btn ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              title="Settings Menu (New, Share, Settings, Quit)"
            >
              <SettingsGearIcon size={18} strokeWidth={2} />
            </button>
          </div>

          {menuOpen && (
            <div className="moss-v1-code-dropdown" data-no-drag="true">
              <button
                onClick={() => {
                  setWindowTab('settings', 'Appearance');
                  setMenuOpen(false);
                }}
              >
                New
              </button>
              <button
                onClick={() => {
                  setWindowTab('settings', 'Interaction & Physics');
                  setMenuOpen(false);
                }}
              >
                Share
              </button>
              <button
                onClick={() => {
                  setWindowTab('settings', 'Audio & V1');
                  setMenuOpen(false);
                }}
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  closeWindow('settings');
                }}
              >
                Quit
              </button>
            </div>
          )}
        </div>

        <div className="moss-settings-body" data-no-drag="true">
          {activeTab === 'Appearance' && (
            <div className="moss-settings-section">
              <h3>UI Mode</h3>
              <p className="moss-settings-hint">
                Switch between Advanced mode (Top bar with drop-down app switcher) and Basic mode
                (Left side floating dock).
              </p>
              <div className="moss-preset-grid">
                {[
                  {
                    id: 'advanced',
                    title: 'Advanced (Top bar)',
                    desc: 'Top menu bar with drop-down app switcher stack'
                  },
                  {
                    id: 'basic',
                    title: 'Basic (Dock)',
                    desc: 'Floating left-side vertical dock with app icons and labels'
                  }
                ].map((p) => (
                  <button
                    key={p.id}
                    className={`moss-preset-card ${shellMode === p.id ? 'is-active' : ''}`}
                    onClick={() => applyWorkspacePreset(p.id)}
                  >
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </button>
                ))}
              </div>

              <h3>Desktop Wallpaper</h3>
              <div className="moss-swatch-row">
                {[
                  { id: 'v1-mountain', label: 'Alpine Mist (Default)', color: '#8d9598' },
                  { id: 'v2-gray', label: 'Neutral Gray (#808080)', color: '#808080' },
                  { id: 'moss-forest', label: 'Deep Moss Slate', color: '#475652' },
                  { id: 'obsidian', label: 'Carbon Studio', color: '#24272b' }
                ].map((w) => (
                  <button
                    key={w.id}
                    className={`moss-swatch-btn ${wallpaper === w.id ? 'is-active' : ''}`}
                    onClick={() => setWallpaper(w.id)}
                  >
                    <span className="moss-swatch-circle" style={{ background: w.color }} />
                    <span>{w.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Interaction & Physics' && (
            <div className="moss-settings-section">
              <h3>Window Lifecycle Animation Engine</h3>
              <p className="moss-settings-hint">
                Controls how windows unfold from their trigger origin, fold into the top-left
                switcher stack on minimize, and implode on close.
              </p>
              <div className="moss-preset-grid">
                {[
                  {
                    id: 'spring-morph',
                    title: '3D Spring Morph (Recommended)',
                    desc: 'Elastic 3D perspective unfold with origin vector trajectory'
                  },
                  {
                    id: 'genie-fold',
                    title: 'Origami Perspective Fold',
                    desc: 'Deep rotational fold toward switcher stack or dock icon'
                  },
                  {
                    id: 'quantum-snap',
                    title: 'Crisp Velocity Snap',
                    desc: 'Ultra-fast low-latency spatial scaling with motion blur'
                  }
                ].map((a) => (
                  <button
                    key={a.id}
                    className={`moss-preset-card ${animationStyle === a.id ? 'is-active' : ''}`}
                    onClick={() => setAnimationStyle(a.id)}
                  >
                    <strong>{a.title}</strong>
                    <span>{a.desc}</span>
                  </button>
                ))}
              </div>

              <div className="moss-demo-actions">
                <button onClick={() => openWindow('code', { source: 'switcher' })}>
                  Launch Code Editor (V1)
                </button>
                <button onClick={() => openWindow('twitter', { source: 'switcher' })}>
                  Launch Twitter (V1)
                </button>
                <button onClick={() => openWindow('player', { source: 'dock' })}>
                  Launch Media Player
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Audio & V1' && (
            <div className="moss-settings-section">
              <h3>System Audio & V1 Modules</h3>
              <div className="moss-settings-control-row">
                <label>Master Audio Volume ({volume}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>

              <div className="moss-settings-toggle-row">
                <label>
                  <input
                    type="checkbox"
                    checked={showDualPlayer}
                    onChange={(e) => setShowDualPlayer(e.target.checked)}
                  />
                  <span>Show Dual V1 Media Player Bars (Castanets + Caribou)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}
