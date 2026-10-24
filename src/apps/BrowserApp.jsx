import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { ChromeIcon, CircleCloseIcon, CubeV1Icon } from '../components/MossIcons';

const TAB_URLS = {
  Google: 'https://google.com/',
  Subreply: 'https://subreply.com/lucianmarin',
  'Hacker News': 'https://news.ycombinator.com/',
  Journal: 'https://lucianmarin.com/archive/design-the-flying-car'
};

const SUBREPLY_POSTS = [
  {
    id: 1,
    handle: 'lucianmarin',
    time: '14m ago',
    text: 'Moss V2 replaces window titlebars with brand-colored tab headers. Every pixel of vertical space belongs to content and navigation.',
    replies: 12
  },
  {
    id: 2,
    handle: 'mike',
    time: '42m ago',
    text: 'The top-left minimized app stack in V2 feels much faster than scanning a crowded bottom taskbar.',
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
    targetTab: 'Journal'
  },
  {
    id: 102,
    title: 'Design the Flying Car: Reflections on engineering, interfaces, and simplicity',
    domain: 'lucianmarin.com',
    points: 312,
    author: 'lucianmarin',
    time: '4 hours ago',
    comments: 89,
    targetTab: 'Journal'
  },
  {
    id: 103,
    title: 'Why chromeless brand-header windows reduce cognitive load in multitasking OSes',
    domain: 'subreply.com',
    points: 245,
    author: 'mike',
    time: '5 hours ago',
    comments: 72,
    targetTab: 'Subreply'
  },
  {
    id: 104,
    title: 'Physics-driven FLIP and 3D perspective animations for spatial window management',
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
    shellMode,
    setWindowTab,
    minimizeWindow,
    closeWindow,
    openWindow
  } = useOS();

  const win = windows.chrome;
  const activeTab = win?.activeTab || 'Google';

  const [urlInput, setUrlInput] = useState(TAB_URLS[activeTab] || 'https://google.com/');
  const [googleQuery, setGoogleQuery] = useState('');
  const [journalSection, setJournalSection] = useState('Journal');
  const [v1ChromeStyle, setV1ChromeStyle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subreplyList, setSubreplyList] = useState(SUBREPLY_POSTS);
  const [newSubreply, setNewSubreply] = useState('');
  const [upvotedIds, setUpvotedIds] = useState({});

  const isV1Look = v1ChromeStyle || shellMode === 'v1-classic';

  const switchTab = (tabName) => {
    setWindowTab('chrome', tabName);
    setUrlInput(TAB_URLS[tabName] || 'https://google.com/');
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    const q = googleQuery.trim().toLowerCase();
    if (!q) return;
    if (q.includes('journal') || q.includes('flying') || q.includes('lucian')) {
      switchTab('Journal');
    } else if (q.includes('hacker') || q.includes('hn') || q.includes('news')) {
      switchTab('Hacker News');
    } else if (q.includes('subreply') || q.includes('social')) {
      switchTab('Subreply');
    } else {
      switchTab('Hacker News');
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const val = urlInput.toLowerCase();
    if (val.includes('subreply')) switchTab('Subreply');
    else if (val.includes('ycombinator') || val.includes('news')) switchTab('Hacker News');
    else if (val.includes('lucianmarin') || val.includes('journal') || val.includes('youtube')) switchTab('Journal');
    else switchTab('Google');
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

  const tabOrder = ['Google', 'Subreply', 'Hacker News', 'Journal'];

  return (
    <WindowFrame appId="chrome" minWidth={420} minHeight={300}>
      <div className="moss-browser-window">
        {/* V2 Chromeless Blue Header or V1 Classic Slate Tab Header */}
        {!isV1Look ? (
          <div
            className="moss-v2-header moss-chrome-header"
            onDoubleClick={() => minimizeWindow('chrome', 'switcher')}
          >
            <div className="moss-v2-header-left">
              <span className="moss-v2-app-logo">
                <ChromeIcon size={21} strokeWidth={2} />
              </span>
              <div className="moss-v2-tabs" data-no-drag="true">
                {tabOrder.map((tab) => (
                  <button
                    key={tab}
                    className={`moss-v2-tab ${activeTab === tab ? 'is-active' : ''}`}
                    onClick={() => switchTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="moss-v2-header-actions" data-no-drag="true">
              <button
                className="moss-win-action-btn moss-minimize-btn"
                onClick={() => minimizeWindow('chrome', 'switcher')}
                title="Minimize Chrome to Top Stack"
              >
                <span className="moss-min-line" />
              </button>
              <button
                className="moss-win-action-btn"
                onClick={() => closeWindow('chrome')}
                title="Close Chrome"
              >
                <CircleCloseIcon
                  size={20}
                  variant={shellMode === 'basic' ? 'square' : 'circle'}
                />
              </button>
            </div>
          </div>
        ) : (
          /* V1 Browser Header (from moss-v1-browser.jpg & moss-v1-laptop.jpg) */
          <div
            className="moss-v1-browser-top"
            onDoubleClick={() => minimizeWindow('chrome', 'dock')}
          >
            <div className="moss-v1-nav-arrows" data-no-drag="true">
              <button onClick={() => switchTab('Google')} title="Back">←</button>
              <button onClick={() => switchTab('Journal')} title="Forward">→</button>
            </div>
            <div className="moss-v1-tabs" data-no-drag="true">
              {[
                { label: 'YouTube', target: 'Journal' },
                { label: 'Facebook', target: 'Subreply' },
                { label: 'Reddit', target: 'Hacker News' }
              ].map((t) => (
                <button
                  key={t.label}
                  className={`moss-v1-tab ${activeTab === t.target ? 'is-active' : ''}`}
                  onClick={() => switchTab(t.target)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              className="moss-v1-cube-btn"
              data-no-drag="true"
              onClick={() => setV1ChromeStyle(false)}
              title="Switch to Moss V2 Blue Header"
            >
              <CubeV1Icon size={20} />
            </button>
          </div>
        )}

        {/* Sub-toolbar / Address Bar */}
        {!isV1Look ? (
          <div className="moss-chrome-toolbar" data-no-drag="true">
            <form className="moss-url-form" onSubmit={handleUrlSubmit}>
              <svg className="moss-url-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                <circle cx="11" cy="11" r="7.5" />
                <line x1="20" y1="20" x2="16.35" y2="16.35" />
              </svg>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="moss-url-input"
                aria-label="Browser URL"
              />
            </form>

            <div className="moss-toolbar-controls">
              <button
                onClick={() => {
                  const idx = tabOrder.indexOf(activeTab);
                  const prev = tabOrder[(idx - 1 + tabOrder.length) % tabOrder.length];
                  switchTab(prev);
                }}
                title="Previous Tab"
              >
                ←
              </button>
              <button
                onClick={() => {
                  const idx = tabOrder.indexOf(activeTab);
                  const next = tabOrder[(idx + 1) % tabOrder.length];
                  switchTab(next);
                }}
                title="Next Tab"
              >
                →
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                title="Browser Options & V1/V2 Chrome Toggle"
              >
                ☰
              </button>
            </div>

            {menuOpen && (
              <div className="moss-browser-dropdown">
                <button
                  onClick={() => {
                    setV1ChromeStyle((v) => !v);
                    setMenuOpen(false);
                  }}
                >
                  {isV1Look ? 'Use Moss V2 Header' : 'Use Moss V1 Classic Header'}
                </button>
                <button
                  onClick={() => {
                    switchTab('Journal');
                    setMenuOpen(false);
                  }}
                >
                  Open Lucian Marin Journal (V1)
                </button>
                <button
                  onClick={() => {
                    openWindow('code', { source: 'switcher' });
                    setMenuOpen(false);
                  }}
                >
                  Inspect Source in Code Editor
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="moss-v1-address-bar" data-no-drag="true">
            <div className="moss-v1-url-box">
              <span className="moss-v1-https">https://</span>
              <span className="moss-v1-url-rest">lucianmarin.com/archive/design-the-flying-car</span>
              <span className="moss-v1-tag-icon">🏷</span>
            </div>
            <div className="moss-v1-bookmarks">
              <button onClick={() => switchTab('Journal')}>Bookmarks ▾</button>
              <button onClick={() => switchTab('Hacker News')}>News ▾</button>
              <button onClick={() => switchTab('Subreply')}>Family ▾</button>
              <button onClick={() => openWindow('twitter')}>Social ▾</button>
              <button onClick={() => switchTab('Google')}>Later</button>
            </div>
          </div>
        )}

        {/* Browser Body Content */}
        <div className="moss-browser-content" data-no-drag="true">
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
                  onClick={() => switchTab('Subreply')}
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

          {activeTab === 'Subreply' && (
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

          {activeTab === 'Hacker News' && (
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

          {activeTab === 'Journal' && (
            /* Exact recreation of moss-v1-browser.jpg & moss-v1-laptop.jpg */
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
        </div>
      </div>
    </WindowFrame>
  );
}
