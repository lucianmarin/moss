import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';

const SNAP_THRESHOLD = 14;

function getWorkspaceBounds(shellMode, winWidth, winHeight) {
  let minX = 0;
  let minY = 0;
  const maxRight = window.innerWidth;
  let maxBottom = window.innerHeight;

  if (shellMode === 'advanced') {
    const topbarEl = document.querySelector('.moss-topbar');
    minY = topbarEl ? Math.round(topbarEl.getBoundingClientRect().bottom) : 36;
  } else if (shellMode === 'basic') {
    const dockEl = document.querySelector('.moss-v2-left-dock');
    minX = dockEl ? Math.round(dockEl.getBoundingClientRect().right) : 54;
  } else if (shellMode === 'v1-classic') {
    maxBottom = window.innerHeight - 42;
  }

  const maxX = Math.max(minX, maxRight - winWidth);
  const maxY = Math.max(minY, maxBottom - winHeight);

  return { minX, minY, maxX, maxY, maxRight, maxBottom };
}

export default function WindowFrame({
  appId,
  children,
  className = '',
  resizable = true,
  minWidth = 280,
  minHeight = 90,
  framelessShadow = false
}) {
  const {
    windows,
    focusedApp,
    shellMode,
    isMobile,
    animationStyle,
    focusWindow,
    updateWindowRect
  } = useOS();

  const win = windows[appId];
  const isFocused = focusedApp === appId;

  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const wrapperRef = useRef(null);
  const dragStateRef = useRef(null);
  const resizeStateRef = useRef(null);
  const tiltResetTimerRef = useRef(null);

  useEffect(() => {
    if (!isDragging) {
      setTilt({ rx: 0, ry: 0 });
    }
  }, [isDragging]);

  useEffect(() => {
    return () => {
      if (tiltResetTimerRef.current) {
        clearTimeout(tiltResetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (!win || win.status !== 'open') return;
    const el = wrapperRef.current;
    const winW = el ? el.offsetWidth : win.rect.width;
    const winH = el ? el.offsetHeight : win.rect.height;
    const { minX, minY, maxX, maxY } = getWorkspaceBounds(shellMode, winW, winH);

    const clampedX = Math.max(minX, Math.min(maxX, win.rect.x));
    const clampedY = Math.max(minY, Math.min(maxY, win.rect.y));

    if (clampedX !== win.rect.x || clampedY !== win.rect.y) {
      updateWindowRect(appId, { x: clampedX, y: clampedY });
    }
  }, [isMobile, shellMode, appId, win?.status, win?.rect.x, win?.rect.y, win?.rect.width, win?.rect.height, updateWindowRect]);

  if (!win || win.status === 'closed' || win.status === 'minimized') {
    return null;
  }

  const handleHeaderMouseDown = (e) => {
    if (e.target.closest('button, input, a, select, textarea, [data-no-drag="true"]')) {
      return;
    }
    focusWindow(appId);
    if (isMobile) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);

    const el = wrapperRef.current;
    const winW = el ? el.offsetWidth : win.rect.width;
    const winH = el ? el.offsetHeight : win.rect.height;

    dragStateRef.current = {
      grabOffsetX: e.clientX - win.rect.x,
      grabOffsetY: e.clientY - win.rect.y,
      lastX: e.clientX,
      lastY: e.clientY,
      winW,
      winH
    };

    const handleMouseMove = (moveEvent) => {
      if (!dragStateRef.current) return;
      const vx = moveEvent.clientX - dragStateRef.current.lastX;
      const vy = moveEvent.clientY - dragStateRef.current.lastY;
      dragStateRef.current.lastX = moveEvent.clientX;
      dragStateRef.current.lastY = moveEvent.clientY;

      const currentEl = wrapperRef.current;
      const currentW = currentEl ? currentEl.offsetWidth : dragStateRef.current.winW;
      const currentH = currentEl ? currentEl.offsetHeight : dragStateRef.current.winH;

      const { minX, minY, maxX, maxY } = getWorkspaceBounds(
        shellMode,
        currentW,
        currentH
      );

      let rawX = moveEvent.clientX - dragStateRef.current.grabOffsetX;
      let rawY = moveEvent.clientY - dragStateRef.current.grabOffsetY;

      if (rawX < minX) {
        rawX = minX;
        dragStateRef.current.grabOffsetX = moveEvent.clientX - minX;
      } else if (rawX > maxX) {
        rawX = maxX;
        dragStateRef.current.grabOffsetX = moveEvent.clientX - maxX;
      }

      if (rawY < minY) {
        rawY = minY;
        dragStateRef.current.grabOffsetY = moveEvent.clientY - minY;
      } else if (rawY > maxY) {
        rawY = maxY;
        dragStateRef.current.grabOffsetY = moveEvent.clientY - maxY;
      }

      let stickyX = rawX;
      if (Math.abs(rawX - minX) <= SNAP_THRESHOLD) {
        stickyX = minX;
      } else if (Math.abs(rawX - maxX) <= SNAP_THRESHOLD) {
        stickyX = maxX;
      }

      let stickyY = rawY;
      if (Math.abs(rawY - minY) <= SNAP_THRESHOLD) {
        stickyY = minY;
      } else if (Math.abs(rawY - maxY) <= SNAP_THRESHOLD) {
        stickyY = maxY;
      }

      const isStuckAtEdge =
        stickyX === minX ||
        stickyX === maxX ||
        stickyY === minY ||
        stickyY === maxY;

      updateWindowRect(appId, { x: stickyX, y: stickyY });

      if (tiltResetTimerRef.current) {
        clearTimeout(tiltResetTimerRef.current);
      }

      if (isStuckAtEdge) {
        setTilt({ rx: 0, ry: 0 });
      } else {
        setTilt({
          rx: Math.max(-7, Math.min(7, -vy * 0.28)),
          ry: Math.max(-9, Math.min(9, vx * 0.32))
        });
        tiltResetTimerRef.current = setTimeout(() => {
          setTilt({ rx: 0, ry: 0 });
        }, 70);
      }
    };

    const handleMouseUp = () => {
      if (tiltResetTimerRef.current) {
        clearTimeout(tiltResetTimerRef.current);
      }
      dragStateRef.current = null;
      setIsDragging(false);
      setTilt({ rx: 0, ry: 0 });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e) => {
    if (isMobile) return;
    e.stopPropagation();
    e.preventDefault();
    focusWindow(appId);

    resizeStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: win.rect.width,
      origH: win.rect.height,
      origX: win.rect.x,
      origY: win.rect.y
    };

    const handleMouseMove = (moveEvent) => {
      if (!resizeStateRef.current) return;
      const dw = moveEvent.clientX - resizeStateRef.current.startX;
      const dh = moveEvent.clientY - resizeStateRef.current.startY;
      const { maxRight, maxBottom } = getWorkspaceBounds(
        shellMode,
        resizeStateRef.current.origW,
        resizeStateRef.current.origH
      );

      const maxAllowedW = Math.max(minWidth, maxRight - resizeStateRef.current.origX);
      const maxAllowedH = Math.max(minHeight, maxBottom - resizeStateRef.current.origY);

      let nextW = Math.max(
        minWidth,
        Math.min(maxAllowedW, resizeStateRef.current.origW + dw)
      );
      let nextH = Math.max(
        minHeight,
        Math.min(maxAllowedH, resizeStateRef.current.origH + dh)
      );

      if (Math.abs(maxAllowedW - nextW) <= SNAP_THRESHOLD) {
        nextW = maxAllowedW;
      }
      if (Math.abs(maxAllowedH - nextH) <= SNAP_THRESHOLD) {
        nextH = maxAllowedH;
      }

      updateWindowRect(appId, {
        width: nextW,
        height: nextH
      });
    };

    const handleMouseUp = () => {
      resizeStateRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const animClass =
    win.animPhase !== 'idle'
      ? `moss-win-${win.animPhase} anim-style-${animationStyle}`
      : '';

  const isPlayer = appId === 'player';
  const lastRunningFullscreenApp = Object.values(windows)
    .filter((w) => w.id !== 'player' && w.status === 'open')
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id;

  const isVisibleOnMobile =
    isPlayer ||
    appId === lastRunningFullscreenApp ||
    win.animPhase === 'minimizing' ||
    win.animPhase === 'closing';

  const windowStyle = isMobile
    ? {
        left: '0px',
        top: '0px',
        width: shellMode === 'basic' ? 'calc(100% - 54px)' : '100%',
        height: isPlayer ? 'auto' : shellMode === 'advanced' ? 'calc(100% - 36px)' : '100%',
        zIndex: win.zIndex,
        '--origin-dx': `${win.animVector?.dx || -140}px`,
        '--origin-dy': `${win.animVector?.dy || -90}px`,
        '--drag-rx': '0deg',
        '--drag-ry': '0deg'
      }
    : {
        left: `${win.rect.x}px`,
        top: `${win.rect.y}px`,
        width: `${win.rect.width}px`,
        height: resizable ? `${win.rect.height}px` : 'auto',
        zIndex: win.zIndex,
        '--origin-dx': `${win.animVector?.dx || -140}px`,
        '--origin-dy': `${win.animVector?.dy || -90}px`,
        '--drag-rx': `${tilt.rx}deg`,
        '--drag-ry': `${tilt.ry}deg`
      };

  return (
    <div
      ref={wrapperRef}
      className={`moss-window-wrapper ${isFocused ? 'is-focused' : 'is-unfocused'} ${!isVisibleOnMobile ? 'is-mobile-hidden' : ''} ${isDragging ? 'is-dragging' : ''} ${animClass} ${className}`}
      style={windowStyle}
      onMouseDown={() => {
        if (
          document.activeElement instanceof HTMLIFrameElement &&
          appId !== 'chrome'
        ) {
          document.activeElement.blur();
        }
        focusWindow(appId);
      }}
    >
      <div
        className={`moss-window-surface ${framelessShadow ? 'moss-player-surface' : ''}`}
        onMouseDown={handleHeaderMouseDown}
      >
        {children}
        {resizable && !isMobile && (
          <div
            className="moss-resize-handle"
            onMouseDown={handleResizeMouseDown}
            title="Drag to resize window"
          />
        )}
      </div>
    </div>
  );
}
