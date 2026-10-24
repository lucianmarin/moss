import React from 'react';
import { useOS } from '../context/OSContext';
import { TwitterBirdIcon, CodeNewsIcon, CubeV1Icon } from './MossIcons';

export default function RightHud() {
  const {
    shellMode,
    openWindow,
    tweets,
    windows
  } = useOS();

  const latestTweet = tweets[tweets.length - 1] || tweets[0];

  if (shellMode !== 'v1-classic') {
    return null;
  }

  return (
    <>
      <div className="moss-v1-watermark-clock">3:03 AM</div>
      <footer className="moss-v1-bottom-bar">
        <div
          className="moss-v1-ticker-left"
          onClick={() => openWindow('twitter', { source: 'dock' })}
        >
          <span className="moss-v1-badge-red">13</span>
          <span className="moss-v1-ticker-bird">
            <TwitterBirdIcon size={18} />
          </span>
          <div className="moss-v1-ticker-text">
            <strong>@{latestTweet.author}</strong> {latestTweet.text}
          </div>
        </div>

        <div className="moss-v1-bar-clock">3:03 AM</div>

        <div className="moss-v1-bar-tray">
          <button
            className={windows.code?.status === 'open' ? 'is-active' : ''}
            onClick={() => openWindow('code', { source: 'dock' })}
            title="Code Editor"
          >
            <CodeNewsIcon size={18} />
          </button>
          <button
            className={windows.twitter?.status === 'open' ? 'is-active' : ''}
            onClick={() => openWindow('twitter', { source: 'dock' })}
            title="Twitter"
          >
            <TwitterBirdIcon size={18} />
          </button>
          <button
            className={windows.chrome?.status === 'open' ? 'is-active' : ''}
            onClick={() => openWindow('chrome', { source: 'dock', tab: 'Journal' })}
            title="Browser (Journal)"
          >
            <CubeV1Icon size={18} />
          </button>
        </div>
      </footer>
    </>
  );
}
