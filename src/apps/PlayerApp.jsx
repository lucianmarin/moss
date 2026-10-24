import React from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';

function formatSeconds(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

function AlbumArtwork({ artType, isPlaying, onClick }) {
  if (artType === 'caribou') {
    // Psychedelic concentric rings artwork from moss-v1-player.jpg (Caribou — Jamelia)
    return (
      <div
        className={`moss-player-art moss-art-caribou ${isPlaying ? 'is-spinning' : ''}`}
        onClick={onClick}
        title="Click to Play / Pause (Chilltrax Live Stream)"
      >
        <div className="moss-caribou-disc">
          <div className="moss-play-overlay">{isPlaying ? '❚❚' : '▶'}</div>
        </div>
      </div>
    );
  }

  // Organic brown/ice-blue vinyl burst artwork from moss-v1-player.jpg (Castanets / Sleaze)
  return (
    <div
      className={`moss-player-art moss-art-castanets ${isPlaying ? 'is-spinning' : ''}`}
      onClick={onClick}
      title="Click to Play / Pause (Chilltrax Live Stream)"
    >
      <div className="moss-castanets-ring">
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
  const secondaryTrack = tracks[1] || tracks[0];

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
        {/* Primary Horizontal Media Bar (exact match to moss-v1-player.jpg) */}
        <div
          className="moss-v1-player-bar"
          style={{ background: currentTrack.theme.bg }}
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
              title="Next Track (Switch Castanets / Caribou / Chilltrax)"
            >
              ⏭
            </button>
            <button
              onClick={() => setShowDualPlayer((v) => !v)}
              title="Toggle V1 Dual Player Bars"
            >
              ⧉
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
              artType={currentTrack.theme.artType}
              isPlaying={isPlaying}
              onClick={togglePlay}
            />
          </div>

          <div className="moss-player-middle">
            <div className="moss-player-star-row" data-no-drag="true">
              <button
                className="moss-player-star-btn"
                style={{ color: currentTrack.theme.starColor }}
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
                style={{ color: currentTrack.theme.titleColor }}
              >
                {currentTrack.artist}
              </span>
              <span
                className="moss-player-track"
                style={{ color: currentTrack.theme.subtitleColor }}
              >
                {currentTrack.title}
              </span>
            </div>

            <div
              className="moss-player-progress-track"
              style={{ background: currentTrack.theme.progressTrack }}
              onClick={handleProgressClick}
              data-no-drag="true"
              title="Click to seek audio"
            >
              <div
                className="moss-player-progress-fill"
                style={{
                  width: `${progressPct}%`,
                  background: currentTrack.theme.progressFill
                }}
              />
            </div>
          </div>

          <div
            className="moss-player-right-badge"
            style={{
              background: currentTrack.theme.badgeBg,
              color: currentTrack.theme.badgeText
            }}
            onClick={() => selectTrack(currentTrackIndex + 1, true)}
            data-no-drag="true"
            title="Click to cycle tracks (Castanets / Caribou / Chilltrax)"
          >
            <div className="moss-player-track-index">
              <strong>{currentTrack.trackNum}</strong>
              <span style={{ color: currentTrack.theme.badgeMuted }}>
                /{currentTrack.totalTracks}
              </span>
            </div>
            <div className="moss-player-time">
              {formatSeconds(currentTime)}
            </div>
          </div>
        </div>

        {/* Optional Secondary Companion Bar (Caribou — Jamelia, matching moss-v1-player.jpg) */}
        {showDualPlayer && (
          <div
            className="moss-v1-player-bar moss-secondary-player-bar"
            style={{ background: secondaryTrack.theme.bg }}
            onClick={() => selectTrack(2, true)}
            data-no-drag="true"
          >
            <AlbumArtwork
              artType="caribou"
              isPlaying={isPlaying && currentTrackIndex === 2}
              onClick={() => selectTrack(2, true)}
            />
            <div className="moss-player-middle">
              <div className="moss-player-star-row">
                <span style={{ color: secondaryTrack.theme.starColor, fontSize: '13px' }}>☆</span>
              </div>
              <div className="moss-player-title-row">
                <span
                  className="moss-player-artist"
                  style={{ color: secondaryTrack.theme.titleColor }}
                >
                  {secondaryTrack.artist}
                </span>
                <span
                  className="moss-player-track"
                  style={{ color: secondaryTrack.theme.subtitleColor }}
                >
                  {secondaryTrack.title}
                </span>
              </div>
              <div
                className="moss-player-progress-track"
                style={{ background: secondaryTrack.theme.progressTrack }}
              >
                <div
                  className="moss-player-progress-fill"
                  style={{ width: '44%', background: secondaryTrack.theme.progressFill }}
                />
              </div>
            </div>
            <div
              className="moss-player-right-badge"
              style={{
                background: secondaryTrack.theme.badgeBg,
                color: secondaryTrack.theme.badgeText
              }}
            >
              <div className="moss-player-track-index">
                <strong>9</strong>
                <span style={{ color: secondaryTrack.theme.badgeMuted }}>/9</span>
              </div>
              <div className="moss-player-time">1:23</div>
            </div>
          </div>
        )}
      </div>
    </WindowFrame>
  );
}
