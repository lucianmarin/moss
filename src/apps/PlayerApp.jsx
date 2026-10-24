import React from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';

function formatSeconds(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

function AlbumArtwork({ artType, cover, isPlaying, onClick }) {
  if (artType === 'caribou') {
    // Dark mode disc from moss-v1-player.jpg (Caribou — Jamelia)
    return (
      <div
        className={`moss-player-art moss-art-caribou ${isPlaying ? 'is-spinning' : ''}`}
        onClick={onClick}
        title="Click to Play / Pause (Chilltrax Live Stream)"
      >
        <div
          className="moss-caribou-disc"
          style={
            cover
              ? {
                  backgroundImage: `url(${cover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }
              : undefined
          }
        >
          <div className="moss-play-overlay">{isPlaying ? '❚❚' : '▶'}</div>
        </div>
      </div>
    );
  }

  // Light mode vinyl burst artwork from moss-v1-player.jpg (Castanets)
  return (
    <div
      className={`moss-player-art moss-art-castanets ${isPlaying ? 'is-spinning' : ''}`}
      onClick={onClick}
      title="Click to Play / Pause (Chilltrax Live Stream)"
    >
      <div
        className="moss-castanets-ring"
        style={
          cover
            ? {
                backgroundImage: `url(${cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }
            : undefined
        }
      >
        <div className="moss-castanets-center">
          <div className="moss-play-overlay">{isPlaying ? '❚❚' : '▶'}</div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerApp() {
  const {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    selectTrack,
    seekAudio,
    toggleStarTrack,
    showDualPlayer,
    setShowDualPlayer,
    minimizeWindow,
    closeWindow
  } = useOS();

  const progressPct = duration > 0 ? Math.min(100, ((currentTime % duration) / duration) * 100) : 62;
  const lightTheme = tracks[0]?.theme || currentTrack.theme;
  const darkTheme = tracks[1]?.theme || currentTrack.theme;
  const activeTheme = showDualPlayer ? darkTheme : lightTheme;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekAudio(ratio * (duration || 210));
  };

  return (
    <WindowFrame
      appId="player"
      resizable={false}
      framelessShadow={true}
      className="moss-player-frame"
    >
      <div className="moss-player-stack">
        {/* Horizontal Media Bar (switches between Light and Dark designs from moss-v1-player.jpg) */}
        <div
          className="moss-v1-player-bar"
          style={{ background: activeTheme.bg }}
          onDoubleClick={() => minimizeWindow('player', 'dock')}
        >
          {/* Floating micro window controls on top-right hover */}
          <div className="moss-player-micro-controls" data-no-drag="true">
            <button
              onClick={() => selectTrack(currentTrackIndex - 1, true)}
              title="Previous Track"
            >
              ⏮
            </button>
            <button onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={() => selectTrack(currentTrackIndex + 1, true)}
              title="Next Track"
            >
              ⏭
            </button>
            <button
              onClick={() => setShowDualPlayer((v) => !v)}
              title={showDualPlayer ? 'Switch to Light Player Mode' : 'Switch to Dark Player Mode'}
            >
              {showDualPlayer ? '☀' : '☾'}
            </button>
            <button
              onClick={() => minimizeWindow('player', 'switcher')}
              title="Minimize Player"
            >
              —
            </button>
            <button onClick={() => closeWindow('player')} title="Close Player">
              ×
            </button>
          </div>

          <div data-no-drag="true">
            <AlbumArtwork
              artType={activeTheme.artType}
              cover={currentTrack.cover}
              isPlaying={isPlaying}
              onClick={togglePlay}
            />
          </div>

          <div className="moss-player-middle">
            <div className="moss-player-star-row" data-no-drag="true">
              <button
                className="moss-player-star-btn"
                style={{ color: activeTheme.starColor }}
                onClick={() => toggleStarTrack(currentTrack.id)}
                title="Favorite Track"
              >
                {currentTrack.starred ? '★' : '☆'}
              </button>
              <span className="moss-player-audio-pill" onClick={togglePlay}>
                {isPlaying ? 'LIVE STREAM' : 'PLAY STREAM'}
              </span>
            </div>

            <div className="moss-player-title-row" onClick={togglePlay} data-no-drag="true">
              <span
                className="moss-player-artist"
                style={{ color: activeTheme.titleColor }}
              >
                {currentTrack.artist}
              </span>
              <span
                className="moss-player-track"
                style={{ color: activeTheme.subtitleColor }}
              >
                {currentTrack.title}
              </span>
            </div>

            <div
              className="moss-player-progress-track"
              style={{ background: activeTheme.progressTrack }}
              onClick={handleProgressClick}
              data-no-drag="true"
              title="Click to seek audio"
            >
              <div
                className="moss-player-progress-fill"
                style={{
                  width: `${progressPct}%`,
                  background: activeTheme.progressFill
                }}
              />
            </div>
          </div>

          <div
            className="moss-player-right-badge"
            style={{
              background: activeTheme.badgeBg,
              color: activeTheme.badgeText
            }}
            onClick={() => setShowDualPlayer((v) => !v)}
            data-no-drag="true"
            title="Click to switch between Light and Dark Player designs"
          >
            <div className="moss-player-track-index">
              <strong>9</strong>
              <span style={{ color: activeTheme.badgeMuted }}>
                /{showDualPlayer ? '9' : '13'}
              </span>
            </div>
            <div className="moss-player-time">
              {formatSeconds(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
