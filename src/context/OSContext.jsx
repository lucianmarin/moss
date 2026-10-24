import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { AUDIO_TRACKS, INITIAL_CODE_FILES } from '../assets/mediaAssets';

const OSContext = createContext(null);

export const APP_ORDER = [
  'chrome',
  'player',
  'whatsapp',
  'code',
  'twitter',
  'finder',
  'settings'
];

export const APP_DEFINITIONS = {
  chrome: {
    id: 'chrome',
    title: 'Chrome',
    brandColor: '#0c92ff',
    menus: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Profiles', 'Window', 'Help'],
    defaultRect: { x: 84, y: 215, width: 540, height: 405 }
  },
  player: {
    id: 'player',
    title: 'Player',
    brandColor: '#4d2608',
    menus: ['File', 'Playback', 'Audio', 'Playlist', 'Window', 'Help'],
    defaultRect: { x: 430, y: 66, width: 416, height: 92 }
  },
  whatsapp: {
    id: 'whatsapp',
    title: 'WhatsApp',
    brandColor: '#009988',
    menus: ['File', 'Edit', 'View', 'Chats', 'Calls', 'Window', 'Help'],
    defaultRect: { x: 650, y: 215, width: 326, height: 390 }
  },
  code: {
    id: 'code',
    title: 'Code',
    brandColor: '#535659',
    menus: ['File', 'Edit', 'Selection', 'View', 'Run', 'Window', 'Help'],
    defaultRect: { x: 185, y: 72, width: 455, height: 300 }
  },
  twitter: {
    id: 'twitter',
    title: 'Twitter',
    brandColor: '#6e6e6e',
    menus: ['File', 'Timeline', 'Mentions', 'Trends', 'Window', 'Help'],
    defaultRect: { x: 875, y: 66, width: 320, height: 305 }
  },
  finder: {
    id: 'finder',
    title: 'Finder',
    brandColor: '#2d3138',
    menus: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'],
    defaultRect: { x: 210, y: 135, width: 590, height: 400 }
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    brandColor: '#3b4048',
    menus: ['File', 'Edit', 'View', 'System', 'Window', 'Help'],
    defaultRect: { x: 260, y: 150, width: 540, height: 415 }
  }
};

const INITIAL_WINDOWS = {
  chrome: {
    id: 'chrome',
    status: 'open',
    animPhase: 'idle',
    animVector: { dx: -60, dy: -40 },
    zIndex: 24,
    rect: { x: 76, y: 250, width: 575, height: 415 },
    activeTab: 'YouTube'
  },
  whatsapp: {
    id: 'whatsapp',
    status: 'open',
    animPhase: 'idle',
    animVector: { dx: -520, dy: -220 },
    zIndex: 25,
    rect: { x: 645, y: 310, width: 325, height: 385 },
    activeTab: 'Mike'
  },
  player: {
    id: 'player',
    status: 'open',
    animPhase: 'idle',
    animVector: { dx: -320, dy: 40 },
    zIndex: 26,
    rect: { x: 205, y: 58, width: 416, height: 92 },
    activeTab: 'Now Playing'
  },
  code: {
    id: 'code',
    status: 'open',
    animPhase: 'idle',
    animVector: { dx: -140, dy: -80 },
    zIndex: 22,
    rect: { x: 205, y: 168, width: 430, height: 275 },
    activeTab: 'count.html'
  },
  twitter: {
    id: 'twitter',
    status: 'open',
    animPhase: 'idle',
    animVector: { dx: -520, dy: -90 },
    zIndex: 23,
    rect: { x: 650, y: 58, width: 320, height: 240 },
    activeTab: 'timeline'
  },
  settings: {
    id: 'settings',
    status: 'minimized',
    animPhase: 'idle',
    animVector: { dx: -190, dy: -85 },
    zIndex: 19,
    rect: { x: 250, y: 135, width: 550, height: 415 },
    activeTab: 'Appearance'
  },
  finder: {
    id: 'finder',
    status: 'minimized',
    animPhase: 'idle',
    animVector: { dx: -160, dy: -65 },
    zIndex: 18,
    rect: { x: 200, y: 125, width: 600, height: 410 },
    activeTab: 'design'
  }
};

export function OSProvider({ children }) {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [focusedApp, setFocusedApp] = useState('chrome');
  // Two UI modes: 'advanced' (Top bar + drop down app switcher) and 'basic' (Left side dock)
  const [shellMode, setShellMode] = useState('advanced'); // 'advanced' | 'basic'
  const [wallpaper, setWallpaper] = useState('v1-mountain'); // Default: Alpine Mist ('v1-mountain')
  const [animationStyle, setAnimationStyle] = useState('spring-morph'); // 'spring-morph' | 'genie-fold' | 'quantum-snap'
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showDualPlayer, setShowDualPlayer] = useState(false);

  // Shared Code Editor files so Finder can open files directly into Code Editor
  const [codeFiles, setCodeFiles] = useState(INITIAL_CODE_FILES);

  // Global Audio Player State (streams https://streamssleu.chilltrax.com/stream?sid=1)
  const audioRef = useRef(null);
  const lastSongKeyRef = useRef(null);
  const [tracks, setTracks] = useState(AUDIO_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [songChangeCount, setSongChangeCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(133); // 2:13 matching moss-v1-player.jpg
  const [duration, setDuration] = useState(210);
  const [volume, setVolume] = useState(20); // Matches '20' in moss-v1-code.jpg!

  // System Tweets / Notifications shared between Twitter app & V1 Ticker
  const [tweets, setTweets] = useState([
    {
      id: 't1',
      author: 'lucianmarin',
      time: '2s',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies libero ac neque dapibus adipiscing.',
      category: 'timeline'
    },
    {
      id: 't2',
      author: 'mike',
      time: '15m',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      text: 'Cras commodo magna sed enim ultrices nec cursus tellus egestas. Donec nec dolor felis. Suspendisse fermentum sapien id eros mollis sed venenatis tellus tempor.',
      category: 'timeline'
    },
    {
      id: 't3',
      author: 'lucianmarin',
      time: '1h',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      text: "It can't happen that soon. Wait for it a little longer.",
      category: 'mentions'
    }
  ]);

  const topZRef = useRef(30);
  const timersRef = useRef({});

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Poll live song metadata from the Chilltrax stream (ICY metadata + station info)
  const fetchStreamMetadata = useCallback(async () => {
    try {
      let data = null;
      const res = await fetch(`/api/stream-meta?t=${Date.now()}`, { cache: 'no-store' }).catch(
        () => null
      );
      if (res && res.ok) {
        const json = await res.json().catch(() => null);
        if (json && json.ok && json.artist && json.title) {
          data = json;
        }
      }

      if (!data) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          'https://www.chilltrax.com/php/GetSongInformationNew.php'
        )}&t=${Date.now()}`;
        const fallbackRes = await fetch(proxyUrl, { cache: 'no-store' }).catch(() => null);
        if (fallbackRes && fallbackRes.ok) {
          const info = await fallbackRes.json().catch(() => null);
          if (info && info.artist && info.title) {
            data = {
              artist: info.artist,
              title: info.title,
              cover: null
            };
          }
        }
      }

      if (data && data.artist && data.title) {
        const songKey = `${data.artist} — ${data.title}`;
        if (lastSongKeyRef.current === null) {
          lastSongKeyRef.current = songKey;
        } else if (lastSongKeyRef.current !== songKey) {
          lastSongKeyRef.current = songKey;
          setSongChangeCount((c) => c + 1);
        }

        setTracks((prev) =>
          prev.map((t) => ({
            ...t,
            artist: data.artist,
            title: data.title,
            cover: data.cover || t.cover || null,
            trackNum: lastSongKeyRef.current ? undefined : t.trackNum
          }))
        );
      }
    } catch {
      // Ignore transient network errors
    }
  }, []);

  useEffect(() => {
    fetchStreamMetadata();
    const interval = setInterval(fetchStreamMetadata, 15000);
    return () => clearInterval(interval);
  }, [fetchStreamMetadata]);

  // Sync volume with HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume / 100));
    }
  }, [volume]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      fetchStreamMetadata();
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  }, [isPlaying, fetchStreamMetadata]);

  const selectTrack = useCallback(async (index, autoPlay = true) => {
    const nextIdx = (index + tracks.length) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    const audio = audioRef.current;
    if (audio) {
      if (autoPlay) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    }
  }, [tracks.length]);

  const seekAudio = useCallback((newTime) => {
    const clamped = Math.max(0, Math.min(duration || 210, newTime));
    setCurrentTime(clamped);
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = clamped;
    }
  }, [duration]);

  const toggleStarTrack = useCallback((trackId) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, starred: !t.starred } : t))
    );
  }, []);

  // Compute origin delta vector from DOM trigger (Switcher stack card or Dock icon) to window center
  const computeOriginVector = useCallback((appId, winRect, preferSource = 'auto') => {
    if (typeof document === 'undefined') return { dx: -160, dy: -120 };
    const winCenterX = winRect.x + winRect.width / 2;
    const winCenterY = winRect.y + winRect.height / 2;

    const switcherEl = document.querySelector(`[data-switcher-item="${appId}"]`);
    const switcherTriggerEl = document.querySelector('[data-app-switcher-trigger="true"]');
    const dockEl = document.querySelector(`[data-dock-item="${appId}"]`);
    const stackContainer = document.querySelector('[data-switcher-stack="true"]');

    let targetEl = null;
    if (preferSource === 'switcher') {
      targetEl = switcherEl || stackContainer || switcherTriggerEl || dockEl;
    } else if (preferSource === 'dock') {
      targetEl = dockEl || switcherEl || stackContainer || switcherTriggerEl;
    } else {
      targetEl = switcherEl || dockEl || stackContainer || switcherTriggerEl;
    }

    if (targetEl) {
      const bounds = targetEl.getBoundingClientRect();
      const originX = bounds.left + bounds.width / 2;
      const originY = bounds.top + bounds.height / 2;
      return {
        dx: Math.round(originX - winCenterX),
        dy: Math.round(originY - winCenterY)
      };
    }

    // Fallback to top-left switcher stack position
    return {
      dx: Math.round(90 - winCenterX),
      dy: Math.round(95 - winCenterY)
    };
  }, []);

  const clearAppTimer = (appId) => {
    if (timersRef.current[appId]) {
      clearTimeout(timersRef.current[appId]);
      delete timersRef.current[appId];
    }
  };

  const focusWindow = useCallback((appId) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setFocusedApp(appId);
    setWindows((prev) => {
      const target = prev[appId];
      if (!target) return prev;
      return {
        ...prev,
        [appId]: {
          ...target,
          zIndex: nextZ
        }
      };
    });
  }, []);

  const openWindow = useCallback((appId, options = {}) => {
    const { source = 'auto', tab = null } = options;
    clearAppTimer(appId);
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setFocusedApp(appId);
    setOverviewOpen(false);
    setSwitcherOpen(false);

    setWindows((prev) => {
      const win = prev[appId];
      if (!win) return prev;
      const vector = computeOriginVector(appId, win.rect, source);
      const alreadyVisible = win.status === 'open' && win.animPhase === 'idle';

      return {
        ...prev,
        [appId]: {
          ...win,
          status: 'open',
          animPhase: alreadyVisible ? 'pulse' : 'opening',
          animVector: vector,
          zIndex: nextZ,
          activeTab: tab || win.activeTab
        }
      };
    });

    timersRef.current[appId] = setTimeout(() => {
      setWindows((prev) => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          animPhase: 'idle'
        }
      }));
    }, 520);
  }, [computeOriginVector]);

  const minimizeWindow = useCallback((appId, source = 'switcher') => {
    clearAppTimer(appId);
    setWindows((prev) => {
      const win = prev[appId];
      if (!win || win.status !== 'open') return prev;
      const vector = computeOriginVector(appId, win.rect, source);
      return {
        ...prev,
        [appId]: {
          ...win,
          animPhase: 'minimizing',
          animVector: vector
        }
      };
    });

    timersRef.current[appId] = setTimeout(() => {
      setWindows((prev) => {
        const next = {
          ...prev,
          [appId]: {
            ...prev[appId],
            status: 'minimized',
            animPhase: 'idle'
          }
        };
        const remainingOpen = Object.values(next)
          .filter((w) => w.status === 'open')
          .sort((a, b) => b.zIndex - a.zIndex);
        if (remainingOpen.length > 0) {
          setFocusedApp(remainingOpen[0].id);
        }
        return next;
      });
    }, 440);
  }, [computeOriginVector]);

  const closeWindow = useCallback((appId) => {
    clearAppTimer(appId);
    setWindows((prev) => {
      const win = prev[appId];
      if (!win || win.status !== 'open') return prev;
      const vector = computeOriginVector(appId, win.rect, 'dock');
      return {
        ...prev,
        [appId]: {
          ...win,
          animPhase: 'closing',
          animVector: vector
        }
      };
    });

    timersRef.current[appId] = setTimeout(() => {
      setWindows((prev) => {
        const next = {
          ...prev,
          [appId]: {
            ...prev[appId],
            status: 'closed',
            animPhase: 'idle'
          }
        };
        const remainingOpen = Object.values(next)
          .filter((w) => w.status === 'open')
          .sort((a, b) => b.zIndex - a.zIndex);
        if (remainingOpen.length > 0) {
          setFocusedApp(remainingOpen[0].id);
        }
        return next;
      });
    }, 390);
  }, [computeOriginVector]);

  const toggleWindowFromDock = useCallback((appId) => {
    const win = windows[appId];
    if (!win) return;
    if (win.status === 'open' && win.animPhase === 'idle') {
      if (focusedApp === appId) {
        minimizeWindow(appId, 'dock');
      } else {
        openWindow(appId, { source: 'dock' });
      }
    } else {
      openWindow(appId, { source: 'dock' });
    }
  }, [windows, focusedApp, minimizeWindow, openWindow]);

  const updateWindowRect = useCallback((appId, partialRect) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        rect: {
          ...prev[appId].rect,
          ...partialRect
        }
      }
    }));
  }, []);

  const setWindowTab = useCallback((appId, tabName) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        activeTab: tabName
      }
    }));
  }, []);

  // Switch between the two UI modes: 'advanced' (Top bar + drop down switcher) and 'basic' (Left side dock)
  const applyWorkspacePreset = useCallback((mode) => {
    setOverviewOpen(false);
    setSwitcherOpen(false);
    if (mode === 'basic') {
      setShellMode('basic');
    } else {
      setShellMode('advanced');
    }
  }, []);

  const value = {
    windows,
    focusedApp,
    shellMode,
    setShellMode,
    wallpaper,
    setWallpaper,
    animationStyle,
    setAnimationStyle,
    switcherOpen,
    setSwitcherOpen,
    overviewOpen,
    setOverviewOpen,
    notificationsOpen,
    setNotificationsOpen,
    showDualPlayer,
    setShowDualPlayer,
    codeFiles,
    setCodeFiles,
    tracks,
    currentTrack,
    currentTrackIndex,
    songChangeCount,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    togglePlay,
    selectTrack,
    seekAudio,
    toggleStarTrack,
    tweets,
    setTweets,
    focusWindow,
    openWindow,
    minimizeWindow,
    closeWindow,
    toggleWindowFromDock,
    updateWindowRect,
    setWindowTab,
    applyWorkspacePreset
  };

  return (
    <OSContext.Provider value={value}>
      {children}
      {/* Persistent HTML5 Audio Engine streaming https://streamssleu.chilltrax.com/stream?sid=1 */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="none"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && Number.isFinite(d) && !Number.isNaN(d)) {
            setDuration(Math.floor(d));
          }
        }}
        onTimeUpdate={(e) => {
          const t = Math.floor(e.currentTarget.currentTime);
          if (t > 0) {
            setCurrentTime(133 + t);
          }
        }}
      />
    </OSContext.Provider>
  );
}

export const useOS = () => {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used within OSProvider');
  return ctx;
};
