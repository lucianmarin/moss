import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { TwitterBirdIcon } from '../components/MossIcons';

const TWITTER_TAB_CONFIG = {
  timeline: { id: 'timeline', title: 'Timeline', isBird: true },
  mentions: { id: 'mentions', title: '@ Mentions', label: '@' },
  trends: { id: 'trends', title: '# Trends & Topics', label: '#' },
  starred: { id: 'starred', title: '★ Favorites', label: '★' },
  lists: { id: 'lists', title: '≡ Lists', label: '≡' }
};

const DEFAULT_TABS = ['timeline', 'mentions', 'trends'];
const EXTRA_TABS = ['starred', 'lists'];
const ALL_TABS_ORDER = ['timeline', 'mentions', 'trends', 'starred', 'lists'];

export default function TwitterApp() {
  const {
    windows,
    tweets,
    setTweets,
    setWindowTab,
    minimizeWindow
  } = useOS();

  const win = windows.twitter;
  const activeTab = TWITTER_TAB_CONFIG[win?.activeTab] ? win.activeTab : 'timeline';

  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [tweetText, setTweetText] = useState('');

  const handleNewTwitterTab = () => {
    const nextToOpen =
      EXTRA_TABS.find((t) => !tabs.includes(t)) ||
      ALL_TABS_ORDER.find((t) => !tabs.includes(t));

    if (nextToOpen) {
      setTabs((prev) => [...prev, nextToOpen]);
      setWindowTab('twitter', nextToOpen);
    } else {
      const idx = tabs.indexOf(activeTab);
      const nextFallback = tabs[(idx + 1) % tabs.length] || 'timeline';
      setWindowTab('twitter', nextFallback);
    }
  };

  const handlePostTweet = (e) => {
    e.preventDefault();
    if (!tweetText.trim()) return;
    setTweets((prev) => [
      {
        id: `tw-${Date.now()}`,
        author: 'lucianmarin',
        time: '1s',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        text: tweetText.trim(),
        category: activeTab === 'mentions' ? 'mentions' : 'timeline'
      },
      ...prev
    ]);
    setTweetText('');
  };

  const filteredTweets =
    activeTab === 'mentions'
      ? tweets.filter((t) => t.category === 'mentions' || t.author === 'lucianmarin')
      : activeTab === 'starred'
        ? tweets.filter((_, idx) => idx % 2 === 0)
        : tweets;

  return (
    <WindowFrame appId="twitter" minWidth={290} minHeight={250}>
      <div className="moss-v1-twitter-window">
        {/* Left Vertical Rail (exact match to moss-v1-twitter.jpg & moss-v1-laptop.jpg) */}
        <aside
          className="moss-twitter-rail"
          onDoubleClick={() => minimizeWindow('twitter', 'switcher')}
        >
          <div className="moss-twitter-rail-tabs">
            {tabs.map((tabId) => {
              const cfg = TWITTER_TAB_CONFIG[tabId];
              return (
                <button
                  key={tabId}
                  className={`moss-twitter-rail-btn ${activeTab === tabId ? 'is-active' : ''}`}
                  onClick={() => setWindowTab('twitter', tabId)}
                  title={cfg?.title || tabId}
                >
                  {cfg?.isBird ? <TwitterBirdIcon size={20} /> : cfg?.label || tabId}
                </button>
              );
            })}
          </div>

          <div className="moss-twitter-rail-bottom" data-no-drag="true">
            <button
              onClick={() => minimizeWindow('twitter', 'switcher')}
              title="Minimize Twitter (_)"
            >
              _
            </button>
            <button
              onClick={handleNewTwitterTab}
              title="New Tab (+)"
            >
              +
            </button>
          </div>
        </aside>

        {/* Right Feed Column */}
        <div className="moss-twitter-main">
          {activeTab !== 'trends' ? (
            <div className="moss-twitter-feed" data-no-drag="true">
              {filteredTweets.map((tweet) => (
                <article key={tweet.id} className="moss-tweet-card">
                  <div className="moss-tweet-text-col">
                    <div className="moss-tweet-meta">
                      <span className="moss-tweet-time">{tweet.time}</span>
                      <strong className="moss-tweet-author">
                        @{tweet.author.replace(/^@/, '')}
                      </strong>
                    </div>
                    <p className="moss-tweet-body">{tweet.text}</p>
                  </div>
                  <img
                    src={tweet.avatar}
                    alt={tweet.author}
                    className="moss-tweet-avatar"
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="moss-twitter-trends" data-no-drag="true">
              <div className="moss-trend-title">Trending in Design & HCI</div>
              {[
                { tag: '#MossOS', count: '2.4k tweets', desc: 'Experimental OS UI/UX design' },
                { tag: '#Subreply', count: '940 tweets', desc: 'Minimalist text social network' },
                { tag: '#FlyingCar', count: '610 tweets', desc: 'Lucian Marin Journal essay' },
                { tag: '#Chilltrax', count: '420 tweets', desc: 'Now streaming in Moss Media Player' }
              ].map((tr) => (
                <div
                  key={tr.tag}
                  className="moss-trend-row"
                  onClick={() => setWindowTab('twitter', 'timeline')}
                >
                  <strong>{tr.tag}</strong>
                  <span>{tr.count}</span>
                  <p>{tr.desc}</p>
                </div>
              ))}
            </div>
          )}

          <form
            className="moss-twitter-composer"
            onSubmit={handlePostTweet}
            data-no-drag="true"
          >
            <button
              type="button"
              className="moss-wa-attach-btn"
              onClick={() => setTweetText((t) => `${t} [photo.jpg] `.trimStart())}
              title="Attach Media"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <input
              type="text"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              placeholder="Compose tweet"
              className="moss-wa-input"
            />
          </form>
        </div>
      </div>
    </WindowFrame>
  );
}
