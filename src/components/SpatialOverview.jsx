import React from 'react';
import { useOS, APP_DEFINITIONS } from '../context/OSContext';

export default function SpatialOverview() {
  const {
    overviewOpen,
    setOverviewOpen,
    windows,
    openWindow,
    applyWorkspacePreset,
    shellMode
  } = useOS();

  if (!overviewOpen) return null;

  const allApps = Object.keys(APP_DEFINITIONS);

  return (
    <div className="moss-overview-backdrop" onClick={() => setOverviewOpen(false)}>
      <div className="moss-overview-container" onClick={(e) => e.stopPropagation()}>
        <div className="moss-overview-header">
          <div>
            <h2>Moss Spatial Workspace</h2>
            <p>Click any application card to unfold it onto the canvas</p>
          </div>
          <div className="moss-overview-presets">
            {[
              { id: 'advanced', label: 'Advanced (Top bar)' },
              { id: 'basic', label: 'Basic (Dock)' }
            ].map((p) => (
              <button
                key={p.id}
                className={shellMode === p.id ? 'is-active' : ''}
                onClick={() => applyWorkspacePreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="moss-overview-grid">
          {allApps.map((appId) => {
            const def = APP_DEFINITIONS[appId];
            const win = windows[appId];
            return (
              <button
                key={appId}
                className={`moss-overview-card status-${win?.status}`}
                onClick={() => openWindow(appId, { source: 'switcher' })}
              >
                <div className="moss-overview-card-top">
                  <span>{def.title}</span>
                  <span className="moss-overview-badge">{win?.status}</span>
                </div>
                <div className="moss-overview-card-body">
                  <strong>Active Tab: {win?.activeTab}</strong>
                  <span>
                    {win?.status === 'open'
                      ? 'Visible on Canvas — Click to Focus'
                      : 'Minimized / Dormant — Click to Unfold'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
