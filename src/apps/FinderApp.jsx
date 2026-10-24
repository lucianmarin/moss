import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { DESIGN_GALLERY } from '../assets/mediaAssets';
import { DriveTriangleIcon, CircleCloseIcon } from '../components/MossIcons';

export default function FinderApp() {
  const {
    windows,
    shellMode,
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

  return (
    <WindowFrame appId="finder" minWidth={450} minHeight={310}>
      <div className="moss-finder-window">
        <div
          className="moss-v2-header moss-finder-header"
          onDoubleClick={() => minimizeWindow('finder', 'switcher')}
        >
          <div className="moss-v2-header-left">
            <span className="moss-v2-app-logo">
              <DriveTriangleIcon size={20} strokeWidth={2} />
            </span>
            <div className="moss-v2-tabs" data-no-drag="true">
              {[
                { id: 'design', label: 'design/' },
                { id: 'music', label: 'music/' },
                { id: 'code', label: 'src/code/' }
              ].map((t) => (
                <button
                  key={t.id}
                  className={`moss-v2-tab ${activeTab === t.id ? 'is-active' : ''}`}
                  onClick={() => setWindowTab('finder', t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="moss-v2-header-actions" data-no-drag="true">
            <button
              className="moss-win-action-btn moss-minimize-btn"
              onClick={() => minimizeWindow('finder', 'switcher')}
              title="Minimize Finder to Top Stack"
            >
              <span className="moss-min-line" />
            </button>
            <button
              className="moss-win-action-btn"
              onClick={() => closeWindow('finder')}
              title="Close Finder"
            >
              <CircleCloseIcon
                size={20}
                variant={shellMode === 'basic' ? 'square' : 'circle'}
              />
            </button>
          </div>
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
                      style={{ background: tr.theme.bg }}
                    >
                      <span style={{ color: tr.theme.badgeBg }}>▶</span>
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
                {codeFiles.map((file) => (
                  <div key={file.id} className="moss-finder-track-card">
                    <div className="moss-finder-track-swatch" style={{ background: '#0c92ff' }}>
                      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>
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
