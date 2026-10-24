import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { CubeV1Icon } from '../components/MossIcons';

const TAB_URLS = {
  YouTube: 'https://youtube.com/video/apparat-songc',
  Facebook: 'https://subreply.com/lucianmarin',
  Reddit: 'https://news.ycombinator.com/',
  Google: 'https://google.com/'
};

const SUBREPLY_POSTS = [
  {
    id: 1,
    handle: 'lucianmarin',
    time: '14m ago',
    text: 'Moss combines V1 window chrome and spatial minimalism with V2 shell modes.',
    replies: 12
  },
  {
    id: 2,
    handle: 'mike',
    time: '42m ago',
    text: 'The V1 browser layout with the green https:// prefix and tag icon is timeless.',
    replies: 5
  },
  {
    id: 3,
    handle: 'trisha',
    time: '2h ago',
    text: 'Listening to Chilltrax on the horizontal Moss player bar while testing the spring window animations.',
    replies: 9
  }
];

const HN_STORIES = [
  {
    id: 101,
    title: 'Show HN: Moss OS — Experimental UI/UX desktop environment in React',
    domain: 'lucianmarin.com',
    points: 428,
    author: 'lucianmarin',
    time: '2 hours ago',
    comments: 164,
    targetTab: 'YouTube'
  },
  {
    id: 102,
    title: 'Design the Flying Car: Reflections on engineering, interfaces, and simplicity',
    domain: 'lucianmarin.com',
    points: 312,
    author: 'lucianmarin',
    time: '4 hours ago',
    comments: 89,
    targetTab: 'YouTube'
  },
  {
    id: 103,
    title: 'Why spatial minimalism reduces cognitive load in multitasking OSes',
    domain: 'subreply.com',
    points: 245,
    author: 'mike',
    time: '5 hours ago',
    comments: 72,
    targetTab: 'Facebook'
  },
  {
    id: 104,
    title: 'Physics-driven 3D perspective animations for spatial window management',
    domain: 'github.com/lucianmarin/moss',
    points: 198,
    author: 'trisha',
    time: '6 hours ago',
    comments: 41,
    targetTab: 'Google'
  }
];

export default function BrowserApp() {
  const {
    windows,
    setWindowTab,
    minimizeWindow,
    closeWindow,
    openWindow
  } = useOS();

  const win = windows.chrome;
  const activeTab = win?.activeTab || 'YouTube';

  const [urlInput, setUrlInput] = useState(
    TAB_URLS[activeTab] || 'https://youtube.com/video/apparat-songc'
  );
  const [tabs, setTabs] = useState(['YouTube', 'Facebook', 'Reddit']);
  const [googleQuery, setGoogleQuery] = useState('');
  const [journalSection, setJournalSection] = useState('Journal');
  const [menuOpen, setMenuOpen] = useState(false);
  const [subreplyList, setSubreplyList] = useState(SUBREPLY_POSTS);
  const [newSubreply, setNewSubreply] = useState('');
  const [upvotedIds, setUpvotedIds] = useState({});

  const tabOrder = ['YouTube', 'Facebook', 'Reddit', 'Google'];

  const switchTab = (tabName) => {
    const resolved = tabOrder.includes(tabName) ? tabName : 'YouTube';
    if (!tabs.includes(resolved)) {
      setTabs((prev) => [...prev, resolved]);
    }
    setWindowTab('chrome', resolved);
    setUrlInput(TAB_URLS[resolved] || 'https://youtube.com/video/apparat-songc');
  };

  const handleNewBrowserTab = () => {
    if (!tabs.includes('Google')) {
      setTabs((prev) => [...prev, 'Google']);
    }
    setWindowTab('chrome', 'Google');
    setUrlInput(TAB_URLS.Google);
    setMenuOpen(false);
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    const q = googleQuery.trim().toLowerCase();
    if (!q) return;
    if (q.includes('journal') || q.includes('flying') || q.includes('lucian') || q.includes('youtube')) {
      switchTab('YouTube');
    } else if (q.includes('reddit') || q.includes('hacker') || q.includes('news')) {
      switchTab('Reddit');
    } else if (q.includes('facebook') || q.includes('subreply') || q.includes('social')) {
      switchTab('Facebook');
    } else {
      switchTab('Reddit');
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const val = urlInput.toLowerCase();
    if (val.includes('subreply') || val.includes('facebook')) switchTab('Facebook');
    else if (val.includes('ycombinator') || val.includes('news') || val.includes('reddit')) switchTab('Reddit');
    else if (val.includes('google')) switchTab('Google');
    else switchTab('YouTube');
  };

  const handleAddSubreply = (e) => {
    e.preventDefault();
    if (!newSubreply.trim()) return;
    setSubreplyList((prev) => [
      {
        id: Date.now(),
        handle: 'lucianmarin',
        time: 'just now',
        text: newSubreply.trim(),
        replies: 1
      },
      ...prev
    ]);
    setNewSubreply('');
  };

  return (
    <WindowFrame appId="chrome" minWidth={440} minHeight={300}>
      <div className="moss-browser-window">
        {/* V1 Browser Top Header Bar with draggable bar space and _ / + / Cube controls */}
        <div
          className="moss-v1-browser-top"
          onDoubleClick={() => minimizeWindow('chrome', 'switcher')}
        >
          <div className="moss-v1-browser-left">
            <div className="moss-v1-nav-arrows">
              <button
                className="moss-v1-arrow-back"
                onClick={() => {
                  const idx = tabs.indexOf(activeTab);
                  const prev = tabs[(idx - 1 + tabs.length) % tabs.length] || 'YouTube';
                  switchTab(prev);
                }}
                title="Back"
              >
                ←
              </button>
              <button
                className="moss-v1-arrow-fwd"
                onClick={() => {
                  const idx = tabs.indexOf(activeTab);
                  const next = tabs[(idx + 1) % tabs.length] || 'YouTube';
                  switchTab(next);
                }}
                title="Forward"
              >
                →
              </button>
            </div>

            <div className="moss-v1-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`moss-v1-tab ${activeTab === tab ? 'is-active' : ''}`}
                  onClick={() => switchTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="moss-code-header-right">
            <button
              className="moss-code-plusminus"
              onClick={() => minimizeWindow('chrome', 'switcher')}
              title="Minimize Chrome (_)"
            >
              _
            </button>
            <button
              className="moss-code-plusminus"
              onClick={handleNewBrowserTab}
              title="New Tab (+)"
            >
              +
            </button>
            <button
              className="moss-v1-cube-btn"
              onClick={() => setMenuOpen((v) => !v)}
              title="Browser Menu"
            >
              <CubeV1Icon size={20} />
            </button>
          </div>

          {menuOpen && (
            <div className="moss-v1-code-dropdown" data-no-drag="true">
              <button onClick={handleNewBrowserTab}>New</button>
              <button
                onClick={() => {
                  switchTab('Facebook');
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
                  closeWindow('chrome');
                }}
              >
                Quit
              </button>
            </div>
          )}
        </div>

        {/* Exact moss-v1-browser.jpg Address & Bookmarks Bar */}
        <div className="moss-v1-address-bar">
          <form className="moss-v1-url-box" onSubmit={handleUrlSubmit}>
            <span className="moss-v1-https">https://</span>
            <input
              type="text"
              value={urlInput.replace(/^https?:\/\//, '')}
              onChange={(e) => setUrlInput(`https://${e.target.value}`)}
              className="moss-v1-url-input"
              aria-label="Browser URL"
            />
            <span className="moss-v1-tag-icon" title="Tag Page">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <circle cx="7" cy="7" r="1.5" />
              </svg>
            </span>
          </form>

          <div className="moss-v1-bookmarks">
            <button onClick={() => switchTab('YouTube')}>
              Bookmarks <span className="moss-v1-caret">▾</span>
            </button>
            <button onClick={() => switchTab('Reddit')}>
              News <span className="moss-v1-caret">▾</span>
            </button>
            <button onClick={() => switchTab('Facebook')}>
              Family <span className="moss-v1-caret">▾</span>
            </button>
            <button onClick={() => openWindow('twitter')}>
              Social <span className="moss-v1-caret">▾</span>
            </button>
            <button onClick={() => switchTab('Google')}>Later</button>
          </div>
        </div>

        {/* Browser Body Content */}
        <div className="moss-browser-content" data-no-drag="true">
          {(activeTab === 'YouTube' || activeTab === 'Journal') && (
            /* Exact recreation of moss-v1-browser.jpg Journal Page */
            <div className="moss-v1-journal-page">
              <nav className="moss-journal-nav">
                {['Journal', 'Archive', 'Links', 'Work', 'Themes', 'About'].map((sec) => (
                  <button
                    key={sec}
                    className={`moss-journal-nav-item ${journalSection === sec ? 'is-active' : ''}`}
                    onClick={() => setJournalSection(sec)}
                  >
                    {sec}
                  </button>
                ))}
              </nav>

              <div className="moss-journal-hero">
                <h1>{journalSection}</h1>
              </div>

              <article className="moss-journal-article">
                <h2>Design the Flying Car</h2>
                <div className="moss-journal-date">
                  <span>1 NOV 2012</span>
                  <span>5:00 PM</span>
                </div>
                <p>
                  I could be a high school math teacher, I could be working for Intel, I could be
                  doing research on electronic components and so on... but life made me chose a
                  different path: crafting digital interfaces that strip away visual noise until only
                  human intent remains.
                </p>
                <p>
                  In Moss OS, the operating system steps back. Windows carry their own identity in a
                  single header strip, minimized tasks fold cleanly into a spatial corner stack, and
                  ambient audio lives right on the canvas.
                </p>
              </article>
            </div>
          )}

          {activeTab === 'Facebook' && (
            <div className="moss-subreply-page">
              <div className="moss-subreply-header">
                <div>
                  <h2>Subreply</h2>
                  <p>Minimalist text communities designed by Lucian Marin</p>
                </div>
                <span className="moss-subreply-badge">@lucianmarin</span>
              </div>

              <form className="moss-subreply-composer" onSubmit={handleAddSubreply}>
                <input
                  type="text"
                  value={newSubreply}
                  onChange={(e) => setNewSubreply(e.target.value)}
                  placeholder="Write a reply to the Moss community..."
                />
                <button type="submit">Post</button>
              </form>

              <div className="moss-subreply-feed">
                {subreplyList.map((post) => (
                  <article key={post.id} className="moss-subreply-card">
                    <div className="moss-subreply-meta">
                      <strong>@{post.handle}</strong>
                      <span>{post.time}</span>
                    </div>
                    <p>{post.text}</p>
                    <div className="moss-subreply-actions">
                      <button onClick={() => openWindow('twitter')}>
                        ↩ {post.replies} replies
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Reddit' && (
            <div className="moss-hn-page">
              <div className="moss-hn-banner">
                <span className="moss-hn-y">Y</span>
                <strong>Hacker News</strong>
                <span className="moss-hn-links">new | past | comments | ask | show | jobs</span>
              </div>
              <div className="moss-hn-list">
                {HN_STORIES.map((story, idx) => {
                  const upvoted = !!upvotedIds[story.id];
                  return (
                    <div key={story.id} className="moss-hn-item">
                      <span className="moss-hn-rank">{idx + 1}.</span>
                      <button
                        className={`moss-hn-vote ${upvoted ? 'is-upvoted' : ''}`}
                        onClick={() =>
                          setUpvotedIds((prev) => ({ ...prev, [story.id]: !prev[story.id] }))
                        }
                        title="Upvote"
                      >
                        ▲
                      </button>
                      <div className="moss-hn-body">
                        <div
                          className="moss-hn-title"
                          onClick={() => switchTab(story.targetTab)}
                        >
                          {story.title} <span className="moss-hn-domain">({story.domain})</span>
                        </div>
                        <div className="moss-hn-subtext">
                          {story.points + (upvoted ? 1 : 0)} points by {story.author} {story.time} |{' '}
                          <button onClick={() => switchTab(story.targetTab)}>
                            {story.comments} comments
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'Google' && (
            <div className="moss-google-page">
              <div className="moss-google-top-icons">
                <button
                  className="moss-google-icon-btn"
                  onClick={() => openWindow('finder', { source: 'switcher' })}
                  title="Moss Apps Grid"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  className="moss-google-icon-btn"
                  onClick={() => switchTab('Facebook')}
                  title="Profile & Recent Activity"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="10" cy="8" r="4" />
                    <path d="M3 20c0-3.5 3.2-6 7-6" />
                    <circle cx="17.5" cy="16.5" r="4" />
                    <polyline points="17.5 14.5 17.5 16.5 19 17.5" />
                  </svg>
                </button>
              </div>

              <div className="moss-google-center">
                <h1 className="moss-google-logo" aria-label="Google">
                  <span style={{ color: '#2b84f3' }}>G</span>
                  <span style={{ color: '#ea4335' }}>o</span>
                  <span style={{ color: '#fbbc05' }}>o</span>
                  <span style={{ color: '#2b84f3' }}>g</span>
                  <span style={{ color: '#34a853' }}>l</span>
                  <span style={{ color: '#ea4335' }}>e</span>
                </h1>

                <form onSubmit={handleGoogleSubmit} className="moss-google-search-wrap">
                  <input
                    type="text"
                    value={googleQuery}
                    onChange={(e) => setGoogleQuery(e.target.value)}
                    placeholder=""
                    className="moss-google-pill-input"
                    aria-label="Search Google"
                  />
                </form>
              </div>

              <div className="moss-google-footer">2022 Google, Inc.</div>
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}
