import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';

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
    animationStyle,
    focusWindow,
    updateWindowRect
  } = useOS();

  const win = windows[appId];
  const isFocused = focusedApp === appId;

  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const dragStateRef = useRef(null);
  const resizeStateRef = useRef(null);

  useEffect(() => {
    if (!isDragging) {
      setTilt({ rx: 0, ry: 0 });
    }
  }, [isDragging]);

  if (!win || win.status === 'closed' || win.status === 'minimized') {
    return null;
  }

  const handleHeaderMouseDown = (e) => {
    if (e.target.closest('button, input, a, select, textarea, [data-no-drag="true"]')) {
      return;
    }
    e.preventDefault();
    focusWindow(appId);
    setIsDragging(true);

    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      origX: win.rect.x,
      origY: win.rect.y
    };

    const handleMouseMove = (moveEvent) => {
      if (!dragStateRef.current) return;
      const dx = moveEvent.clientX - dragStateRef.current.startX;
      const dy = moveEvent.clientY - dragStateRef.current.startY;
      const vx = moveEvent.clientX - dragStateRef.current.lastX;
      const vy = moveEvent.clientY - dragStateRef.current.lastY;
      dragStateRef.current.lastX = moveEvent.clientX;
      dragStateRef.current.lastY = moveEvent.clientY;

      const clampedY = Math.max(36, Math.min(window.innerHeight - 60, dragStateRef.current.origY + dy));
      const clampedX = Math.max(12, Math.min(window.innerWidth - 120, dragStateRef.current.origX + dx));

      updateWindowRect(appId, { x: clampedX, y: clampedY });
      setTilt({
        rx: Math.max(-7, Math.min(7, -vy * 0.28)),
        ry: Math.max(-9, Math.min(9, vx * 0.32))
      });
    };

    const handleMouseUp = () => {
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
    e.stopPropagation();
    e.preventDefault();
    focusWindow(appId);

    resizeStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: win.rect.width,
      origH: win.rect.height
    };

    const handleMouseMove = (moveEvent) => {
      if (!resizeStateRef.current) return;
      const dw = moveEvent.clientX - resizeStateRef.current.startX;
      const dh = moveEvent.clientY - resizeStateRef.current.startY;
      updateWindowRect(appId, {
        width: Math.max(minWidth, resizeStateRef.current.origW + dw),
        height: Math.max(minHeight, resizeStateRef.current.origH + dh)
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

  return (
    <div
      className={`moss-window-wrapper ${isFocused ? 'is-focused' : 'is-unfocused'} ${isDragging ? 'is-dragging' : ''} ${animClass} ${className}`}
      style={{
        left: `${win.rect.x}px`,
        top: `${win.rect.y}px`,
        width: `${win.rect.width}px`,
        height: resizable ? `${win.rect.height}px` : 'auto',
        zIndex: win.zIndex,
        '--origin-dx': `${win.animVector?.dx || -140}px`,
        '--origin-dy': `${win.animVector?.dy || -90}px`,
        '--drag-rx': `${tilt.rx}deg`,
        '--drag-ry': `${tilt.ry}deg`
      }}
      onMouseDown={() => focusWindow(appId)}
    >
      <div
        className={`moss-window-surface ${framelessShadow ? 'moss-player-surface' : ''}`}
        onMouseDown={handleHeaderMouseDown}
      >
        {children}
        {resizable && (
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
