import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { DESIGN_GALLERY } from '../assets/mediaAssets';
import { DriveTriangleIcon } from '../components/MossIcons';

export default function FinderApp() {
  const {
    windows,
    codeFiles,
    tracks,
    setWindowTab,
    minimizeWindow,
    closeWindow,
    openWindow,
    selectTrack
  } = useOS();

  const win = windows.finder;
  const activeTab = win?.activeTab || 'design';
  const [selectedDesign, setSelectedDesign] = useState(DESIGN_GALLERY[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  const finderTabs = [
    { id: 'design', label: 'design/' },
    { id: 'music', label: 'music/' },
    { id: 'code', label: 'src/code/' }
  ];

  return (
    <WindowFrame appId="finder" minWidth={450} minHeight={310}>
      <div className="moss-finder-window">
        {/* V1 Header Bar matching Chrome and Code apps */}
        <div
          className="moss-code-header"
          onDoubleClick={() => minimizeWindow('finder', 'switcher')}
        >
          <div className="moss-code-tabs">
            {finderTabs.map((t) => (
              <button
                key={t.id}
                className={`moss-code-tab ${activeTab === t.id ? 'is-active' : ''}`}
                onClick={() => setWindowTab('finder', t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="moss-code-header-right">
            <button
              className="moss-code-plusminus"
              onClick={() => minimizeWindow('finder', 'switcher')}
              title="Minimize Finder (_)"
            >
              _
            </button>
            <button
              className={`moss-code-blue-btn ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              title="Finder Menu (New, Share, Settings, Quit)"
            >
              <DriveTriangleIcon size={18} strokeWidth={2} />
            </button>
          </div>

          {menuOpen && (
            <div className="moss-v1-code-dropdown" data-no-drag="true">
              <button
                onClick={() => {
                  setWindowTab('finder', 'design');
                  setMenuOpen(false);
                }}
              >
                New
              </button>
              <button
                onClick={() => {
                  setWindowTab('finder', 'music');
                  setMenuOpen(false);
                }}
              >
                Share
              </button>
              <button
                onClick={() => {
                  openWindow('settings', { source: 'switcher' });
                  setMenuOpen(false);
                }}
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  closeWindow('finder');
                }}
              >
                Quit
              </button>
            </div>
          )}
        </div>

        <div className="moss-finder-body" data-no-drag="true">
          {activeTab === 'design' && (
            <div className="moss-finder-split">
              <div className="moss-finder-file-list">
                {DESIGN_GALLERY.map((item) => (
                  <button
                    key={item.id}
                    className={`moss-finder-row ${selectedDesign?.id === item.id ? 'is-selected' : ''}`}
                    onClick={() => setSelectedDesign(item)}
                  >
                    <span className={`moss-era-tag era-${item.era.toLowerCase()}`}>
                      {item.era}
                    </span>
                    <span className="moss-finder-filename">{item.name}</span>
                  </button>
                ))}
              </div>

              {selectedDesign && (
                <div className="moss-finder-preview">
                  <div className="moss-finder-preview-img-wrap">
                    <img src={selectedDesign.src} alt={selectedDesign.title} />
                  </div>
                  <div className="moss-finder-preview-meta">
                    <h3>{selectedDesign.title}</h3>
                    <p>{selectedDesign.description}</p>
                    <div className="moss-finder-meta-tags">
                      <span>{selectedDesign.dimensions}</span>
                      <span>{selectedDesign.size}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'music' && (
            <div className="moss-finder-music-pane">
              <div className="moss-finder-music-banner">
                <strong>https://streamssleu.chilltrax.com/stream?sid=1</strong>
                <span>Connected to Live Chilltrax Stream</span>
              </div>
              <div className="moss-finder-track-grid">
                {tracks.map((tr, idx) => (
                  <div key={tr.id} className="moss-finder-track-card">
                    <div
                      className="moss-finder-track-swatch"
                      style={{
                        background: idx % 2 === 0 ? '#0088cc' : '#b9dcf2',
                        color: idx % 2 === 0 ? '#ffffff' : '#005f8f'
                      }}
                    >
                      <span>▶</span>
                    </div>
                    <div className="moss-finder-track-info">
                      <strong>
                        {tr.artist} — {tr.title}
                      </strong>
                      <span>
                        {`${tr.album} • Track ${tr.trackNum}/${tr.totalTracks}`}
                      </span>
                    </div>
                    <button
                      className="moss-finder-action-btn"
                      onClick={() => {
                        selectTrack(idx, true);
                        openWindow('player', { source: 'switcher' });
                      }}
                    >
                      Play Stream
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="moss-finder-music-pane">
              <div className="moss-finder-music-banner">
                <strong>Moss V1 Code Editor Workspace Files</strong>
                <span>Click any file to open in the Code Editor</span>
              </div>
              <div className="moss-finder-track-grid">
                {codeFiles.map((file, idx) => (
                  <div key={file.id} className="moss-finder-track-card">
                    <div
                      className="moss-finder-track-swatch"
                      style={{
                        background: idx % 2 === 0 ? '#005f8f' : '#0088cc',
                        color: '#ffffff'
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>
                        {file.language.toUpperCase()}
                      </span>
                    </div>
                    <div className="moss-finder-track-info">
                      <strong>{file.name}</strong>
                      <span>{file.content.split('\n').length} lines • Editable source</span>
                    </div>
                    <button
                      className="moss-finder-action-btn"
                      onClick={() => openWindow('code', { source: 'switcher', tab: file.id })}
                    >
                      Open in Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}
