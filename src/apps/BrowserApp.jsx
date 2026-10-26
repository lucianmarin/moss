import React, { useState, useRef, useEffect } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { ChromeIcon, ArrowBackIcon, ArrowForwardIcon } from '../components/MossIcons';

const TAB_CONFIG = {
  News: {
    id: 'News',
    label: 'News',
    url: 'https://news.lucianmarin.com'
  },
  Math: {
    id: 'Math',
    label: 'Math',
    url: 'https://math.lucianmarin.com'
  },
  Zero: {
    id: 'Zero',
    label: 'Zero',
    url: 'https://zero.lucianmarin.com'
  },
  Lucian: {
    id: 'Lucian',
    label: 'Lucian',
    url: 'https://lucianmarin.com'
  },
  Subreply: {
    id: 'Subreply',
    label: 'Subreply',
    url: 'https://subreply.com/trending'
  }
};

const ALL_TABS_ORDER = ['News', 'Math', 'Zero', 'Lucian', 'Subreply'];
const DEFAULT_TABS = ['News', 'Math', 'Zero'];
const EXTRA_TABS = ['Lucian', 'Subreply'];

const BOOKMARKS_LIST = [
  { label: 'news.lucianmarin.com', url: 'https://news.lucianmarin.com', tab: 'News' },
  { label: 'math.lucianmarin.com', url: 'https://math.lucianmarin.com', tab: 'Math' },
  { label: 'zero.lucianmarin.com', url: 'https://zero.lucianmarin.com', tab: 'Zero' },
  { label: 'lucianmarin.com', url: 'https://lucianmarin.com', tab: 'Lucian' },
  { label: 'subreply.com/trending', url: 'https://subreply.com/trending', tab: 'Subreply' }
];

export default function BrowserApp() {
  const {
    windows,
    focusedApp,
    focusWindow,
    setWindowTab,
    minimizeWindow,
    closeWindow,
    openWindow
  } = useOS();

  const win = windows.chrome;
  const activeTab = TAB_CONFIG[win?.activeTab] ? win.activeTab : 'News';
  const isFocused = focusedApp === 'chrome';
  const iframeRef = useRef(null);

  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [tabUrls, setTabUrls] = useState({
    News: TAB_CONFIG.News.url,
    Math: TAB_CONFIG.Math.url,
    Zero: TAB_CONFIG.Zero.url,
    Lucian: TAB_CONFIG.Lucian.url,
    Subreply: TAB_CONFIG.Subreply.url
  });
  const [urlInput, setUrlInput] = useState(TAB_CONFIG[activeTab].url);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openBookmarkFolder, setOpenBookmarkFolder] = useState(null);

  useEffect(() => {
    const handleWindowBlur = () => {
      if (document.activeElement === iframeRef.current) {
        focusWindow('chrome');
        setOpenBookmarkFolder(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, [focusWindow]);

  const switchTab = (tabName, customUrl) => {
    const resolved = TAB_CONFIG[tabName] ? tabName : 'News';
    if (!tabs.includes(resolved)) {
      setTabs((prev) => [...prev, resolved]);
    }
    const nextUrl = customUrl || tabUrls[resolved] || TAB_CONFIG[resolved].url;
    if (customUrl) {
      setTabUrls((prev) => ({ ...prev, [resolved]: customUrl }));
    }
    setWindowTab('chrome', resolved);
    setUrlInput(nextUrl);
  };

  const handleNewBrowserTab = () => {
    const nextToOpen =
      EXTRA_TABS.find((t) => !tabs.includes(t)) ||
      ALL_TABS_ORDER.find((t) => !tabs.includes(t));

    if (nextToOpen) {
      setTabs((prev) => [...prev, nextToOpen]);
      setWindowTab('chrome', nextToOpen);
      setUrlInput(tabUrls[nextToOpen] || TAB_CONFIG[nextToOpen].url);
    } else {
      const nextFallback = activeTab === 'Lucian' ? 'Subreply' : 'Lucian';
      setWindowTab('chrome', nextFallback);
      setUrlInput(tabUrls[nextFallback] || TAB_CONFIG[nextFallback].url);
    }
    setMenuOpen(false);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const raw = urlInput.trim();
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const lower = normalized.toLowerCase();

    if (lower.includes('news.lucianmarin.com')) {
      switchTab('News', normalized);
    } else if (lower.includes('math.lucianmarin.com')) {
      switchTab('Math', normalized);
    } else if (lower.includes('zero.lucianmarin.com')) {
      switchTab('Zero', normalized);
    } else if (lower.includes('subreply.com')) {
      switchTab('Subreply', normalized);
    } else if (lower.includes('lucianmarin.com')) {
      switchTab('Lucian', normalized);
    } else {
      setTabUrls((prev) => ({ ...prev, [activeTab]: normalized }));
      setUrlInput(normalized);
    }
  };

  const activeIframeUrl = tabUrls[activeTab] || TAB_CONFIG[activeTab].url;

  return (
    <WindowFrame appId="chrome" minWidth={440} minHeight={300}>
      <div className="moss-browser-window">
        {/* V1 Browser Top Header Bar with draggable bar space and _ / + / Chrome controls */}
        <div
          className="moss-v1-browser-top"
          onDoubleClick={() => minimizeWindow('chrome', 'switcher')}
        >
          <div className="moss-v1-browser-left">
            <div className="moss-v1-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`moss-v1-tab ${activeTab === tab ? 'is-active' : ''}`}
                  onClick={() => switchTab(tab)}
                >
                  {TAB_CONFIG[tab]?.label || tab}
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
              <ChromeIcon size={19} strokeWidth={2} />
            </button>
          </div>

          {menuOpen && (
            <div className="moss-v1-code-dropdown" data-no-drag="true">
              <button onClick={handleNewBrowserTab}>New</button>
              <button
                onClick={() => {
                  switchTab('Subreply');
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

        {/* Address & Bookmarks Bar */}
        <div className="moss-v1-address-bar">
          <div className="moss-v1-nav-arrows" data-no-drag="true">
            <button
              className="moss-v1-arrow-back"
              onClick={() => {
                const idx = tabs.indexOf(activeTab);
                const prev = tabs[(idx - 1 + tabs.length) % tabs.length] || 'News';
                switchTab(prev);
              }}
              title="Back"
            >
              <ArrowBackIcon size={15} />
            </button>
            <button
              className="moss-v1-arrow-fwd"
              onClick={() => {
                const idx = tabs.indexOf(activeTab);
                const next = tabs[(idx + 1) % tabs.length] || 'News';
                switchTab(next);
              }}
              title="Forward"
            >
              <ArrowForwardIcon size={15} />
            </button>
          </div>

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

          <div className="moss-v1-bookmarks" data-no-drag="true">
            <div className="moss-v1-bookmark-folder">
              <button
                type="button"
                className={openBookmarkFolder === 'Bookmarks' ? 'is-open' : ''}
                onClick={() =>
                  setOpenBookmarkFolder((prev) =>
                    prev === 'Bookmarks' ? null : 'Bookmarks'
                  )
                }
              >
                Bookmarks <span className="moss-v1-caret">▾</span>
              </button>
              {openBookmarkFolder === 'Bookmarks' && (
                <div className="moss-v1-bookmark-dropdown">
                  {BOOKMARKS_LIST.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        switchTab(item.tab, item.url);
                        setOpenBookmarkFolder(null);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Iframe Browser Body */}
        <div
          className="moss-browser-content"
          data-no-drag="true"
          onMouseDown={() => {
            focusWindow('chrome');
            if (openBookmarkFolder) setOpenBookmarkFolder(null);
            if (menuOpen) setMenuOpen(false);
          }}
        >
          {(!isFocused || openBookmarkFolder || menuOpen) && (
            <div
              className="moss-iframe-focus-shield"
              onMouseDown={() => {
                focusWindow('chrome');
                if (openBookmarkFolder) setOpenBookmarkFolder(null);
                if (menuOpen) setMenuOpen(false);
              }}
            />
          )}
          <iframe
            ref={iframeRef}
            key={activeTab}
            src={activeIframeUrl}
            title={`Moss Browser - ${activeTab}`}
            className="moss-browser-iframe"
          />
        </div>
      </div>
    </WindowFrame>
  );
}
