import React, { useState } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { CodeNewsIcon } from '../components/MossIcons';

export default function CodeEditorApp() {
  const {
    windows,
    codeFiles,
    setCodeFiles,
    setWindowTab,
    minimizeWindow,
    closeWindow,
    openWindow
  } = useOS();

  const win = windows.code;
  const activeTab = win?.activeTab || 'count.html';

  const [menuOpen, setMenuOpen] = useState(false);
  const [livePreview, setLivePreview] = useState(false);
  const [sampleInput, setSampleInput] = useState(
    'Moss OS blends V2 shell ergonomics with V1 window design.'
  );
  const [compactNames, setCompactNames] = useState(false);

  const currentFile =
    codeFiles.find((f) => f.id === activeTab || f.name === activeTab) || codeFiles[0];

  const handleCodeChange = (newText) => {
    setCodeFiles((prev) =>
      prev.map((f) => (f.id === currentFile.id ? { ...f, content: newText } : f))
    );
  };

  const handleNewFile = () => {
    const idx = codeFiles.length + 1;
    const newId = `note-${idx}.js`;
    setCodeFiles((prev) => [
      ...prev,
      {
        id: newId,
        name: newId,
        shortName: newId,
        language: 'js',
        content: `// Moss OS Interaction Script\nconst windowSpring = { stiffness: 360, damping: 28 };\nconsole.log("Ready:", windowSpring);`
      }
    ]);
    setWindowTab('code', newId);
    setMenuOpen(false);
  };

  return (
    <WindowFrame appId="code" minWidth={380} minHeight={240}>
      <div className="moss-code-window">
        {/* V1 Header Bar (matches moss-v1-code.jpg & moss-v1-twitter.jpg) */}
        <div
          className="moss-code-header"
          onDoubleClick={() => minimizeWindow('code', 'switcher')}
        >
          <div className="moss-code-tabs">
            {codeFiles.map((file) => {
              const isActive = file.id === currentFile.id;
              return (
                <button
                  key={file.id}
                  className={`moss-code-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => setWindowTab('code', file.id)}
                >
                  {compactNames ? file.shortName : file.name}
                </button>
              );
            })}
          </div>

          <div className="moss-code-header-right">
            <button
              className="moss-code-plusminus"
              onClick={() => minimizeWindow('code', 'switcher')}
              title="Minimize Code Editor (_)"
            >
              _
            </button>
            <button
              className="moss-code-plusminus"
              onClick={handleNewFile}
              title="New Tab (+)"
            >
              +
            </button>
            <button
              className={`moss-code-blue-btn ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              title="Code App Menu (New, Share, Settings, Quit)"
            >
              <CodeNewsIcon size={18} />
            </button>
          </div>

          {menuOpen && (
            <div className="moss-v1-code-dropdown" data-no-drag="true">
              <button onClick={handleNewFile}>New</button>
              <button
                onClick={() => {
                  setLivePreview((v) => !v);
                  setMenuOpen(false);
                }}
              >
                {livePreview ? 'Editor' : 'Share'}
              </button>
              <button
                onClick={() => {
                  setCompactNames((v) => !v);
                  openWindow('settings', { source: 'switcher' });
                  setMenuOpen(false);
                }}
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  closeWindow('code');
                }}
              >
                Quit
              </button>
            </div>
          )}
        </div>

        {/* Code Editor Body */}
        <div className="moss-code-body" data-no-drag="true">
          <textarea
            className="moss-code-textarea"
            value={currentFile.content}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck={false}
          />

          <div className="moss-code-statusbar">
            <span>
              {currentFile.name} • {currentFile.content.length} chars
            </span>
            <div className="moss-code-status-actions">
              <button onClick={() => setCompactNames((v) => !v)}>
                {compactNames ? 'Full Tab Names' : 'V1 Short Names (ctnr.html)'}
              </button>
              <button
                className={livePreview ? 'is-active' : ''}
                onClick={() => setLivePreview((v) => !v)}
              >
                {livePreview ? 'Hide charCount() Runner' : '▶ Run charCount()'}
              </button>
            </div>
          </div>

          {livePreview && (
            <div className="moss-code-live-runner">
              <div className="moss-runner-label">
                Live Execution: <code>$(&quot;#link-description&quot;).charCount()</code>
              </div>
              <div className="moss-runner-row">
                <input
                  id="link-description"
                  type="text"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  placeholder="Type to test character counter..."
                />
                <span
                  className={`moss-char-counter ${sampleInput.length > 50 ? 'warning' : ''}`}
                >
                  {sampleInput.length} / 50
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}
