import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { TwitterBirdIcon } from '../components/MossIcons';

export default function TwitterApp() {
  const {
    windows,
    tweets,
    setTweets,
    setWindowTab,
    minimizeWindow,
    closeWindow
  } = useOS();

  const win = windows.twitter;
  const activeTab = win?.activeTab || 'timeline';

  const [tweetText, setTweetText] = useState('');

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
      : tweets;

  return (
    <WindowFrame appId="twitter" minWidth={290} minHeight={250}>
      <div className="moss-v1-twitter-window">
        {/* Left Vertical Rail (exact match to moss-v1-twitter.jpg & moss-v1-laptop.jpg) */}
        <aside
          className="moss-twitter-rail"
          onDoubleClick={() => minimizeWindow('twitter', 'switcher')}
        >
          <div className="moss-twitter-rail-tabs" data-no-drag="true">
            <button
              className={`moss-twitter-rail-btn ${activeTab === 'timeline' ? 'is-active' : ''}`}
              onClick={() => setWindowTab('twitter', 'timeline')}
              title="Timeline"
            >
              <TwitterBirdIcon size={20} />
            </button>
            <button
              className={`moss-twitter-rail-btn ${activeTab === 'mentions' ? 'is-active' : ''}`}
              onClick={() => setWindowTab('twitter', 'mentions')}
              title="@ Mentions"
            >
              @
            </button>
            <button
              className={`moss-twitter-rail-btn ${activeTab === 'trends' ? 'is-active' : ''}`}
              onClick={() => setWindowTab('twitter', 'trends')}
              title="# Trends & Topics"
            >
              #
            </button>
          </div>

          <div className="moss-twitter-rail-bottom" data-no-drag="true">
            <button
              onClick={() => minimizeWindow('twitter', 'switcher')}
              title="Minimize Twitter"
            >
              —
            </button>
            <button onClick={() => closeWindow('twitter')} title="Close Twitter">
              ×
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
                      <strong className="moss-tweet-author">{tweet.author}</strong>
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
            <input
              type="text"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              placeholder="Compose tweet as @lucianmarin..."
            />
          </form>
        </div>
      </div>
    </WindowFrame>
  );
}
