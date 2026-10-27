import { useEffect, useState } from 'react';

interface WebExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'snapshot' | 'pgn' | 'fen' | 'share' | 'json' | 'bundle' | 'licenses';

interface WizardChessAPI {
  getFEN?: () => string;
  getPGN?: () => string;
  captureCanvasScreenshot?: () => string;
  getGameStateJSON?: () => string;
  getShareableWebURL?: () => string;
}

export function WebExportModal({ isOpen, onClose }: WebExportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('snapshot');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [fenString, setFenString] = useState<string>('');
  const [pgnString, setPgnString] = useState<string>('');
  const [jsonString, setJsonString] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? '' : current));
    }, 2400);
  };

  const refreshExportData = () => {
    const win = window as unknown as { wizardChess?: WizardChessAPI };
    const api = win.wizardChess;
    if (!api) return;

    if (api.captureCanvasScreenshot) {
      try {
        const snap = api.captureCanvasScreenshot();
        setScreenshotUrl(snap);
      } catch (err) {
        console.warn('Screenshot capture failed', err);
      }
    }

    if (api.getFEN) {
      setFenString(api.getFEN());
    }

    if (api.getPGN) {
      setPgnString(api.getPGN());
    }

    if (api.getGameStateJSON) {
      setJsonString(api.getGameStateJSON());
    }

    if (api.getShareableWebURL) {
      setShareUrl(api.getShareableWebURL());
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshExportData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`${label} copied to clipboard!`);
    }
  };

  const handleDownloadScreenshot = () => {
    if (!screenshotUrl) return;
    const a = document.createElement('a');
    a.href = screenshotUrl;
    a.download = `wizard-chess-sanctum-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Saved high-res PNG screenshot!');
  };

  const handleCopyScreenshot = async () => {
    if (!screenshotUrl) return;
    try {
      const res = await fetch(screenshotUrl);
      const blob = await res.blob();
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('Screenshot image copied to clipboard!');
      } else {
        await copyToClipboard(screenshotUrl, 'Image Data URL');
      }
    } catch {
      await copyToClipboard(screenshotUrl, 'Image Data URL');
    }
  };

  return (
    <div className="web-export-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Web Export Dialog">
      <div className="web-export-panel" onClick={(e) => e.stopPropagation()}>
        {toastMessage && <div className="web-export-toast">{toastMessage}</div>}

        <div className="web-export-header">
          <div className="web-export-title-wrap">
            <span className="web-export-ornament">✦</span>
            <h2 className="web-export-title">Web Export Sanctum</h2>
            <span className="web-export-subtitle">Portable Chess Data, 3D Renders &amp; Web Distribution</span>
          </div>
          <button
            type="button"
            className="web-export-close-btn"
            id="btn-web-export-close"
            onClick={onClose}
            aria-label="Close Export Dialog"
          >
            ✕
          </button>
        </div>

        <nav className="web-export-tabs" aria-label="Export Formats">
          <button
            type="button"
            className={`web-export-tab ${activeTab === 'snapshot' ? 'active' : ''}`}
            onClick={() => setActiveTab('snapshot')}
          >
            📸 3D Snapshot
          </button>
          <button
            type="button"
            className={`web-export-tab ${activeTab === 'pgn' ? 'active' : ''}`}
            onClick={() => setActiveTab('pgn')}
          >
            📜 PGN Moves
          </button>
          <button
            type="button"
            className={`web-export-tab ${activeTab === 'fen' ? 'active' : ''}`}
            onClick={() => setActiveTab('fen')}
          >
            ♟️ FEN State
          </button>
          <button
            type="button"
            className={`web-export-tab ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            🔗 Web Link
          </button>
          <button
            type="button"
            className={`web-export-tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            📋 Match JSON
          </button>
          <button
            type="button"
            className={`web-export-tab ${activeTab === 'bundle' ? 'active' : ''}`}
            onClick={() => setActiveTab('bundle')}
          >
            📦 Web Bundle
          </button>
          <button
            type="button"
            className={`web-export-tab ${activeTab === 'licenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('licenses')}
          >
            ⚖️ Licenses
          </button>
        </nav>

        <div className="web-export-body">
          {/* TAB 1: 3D SNAPSHOT */}
          {activeTab === 'snapshot' && (
            <div className="export-tab-pane">
              <div className="export-pane-desc">
                High-definition rendering captured directly from the Three.js WebGL canvas in the Gothic Sanctum.
              </div>
              <div className="snapshot-preview-container">
                {screenshotUrl ? (
                  <img
                    src={screenshotUrl}
                    alt="Wizard Chess 3D Sanctuary Board Preview"
                    className="snapshot-preview-img"
                  />
                ) : (
                  <div className="snapshot-loading">Generating 3D Canvas Frame...</div>
                )}
              </div>
              <div className="export-actions-row">
                <button
                  type="button"
                  className="export-action-btn primary"
                  onClick={handleDownloadScreenshot}
                >
                  Download PNG Snapshot
                </button>
                <button
                  type="button"
                  className="export-action-btn secondary"
                  onClick={handleCopyScreenshot}
                >
                  Copy Image to Clipboard
                </button>
                <button
                  type="button"
                  className="export-action-btn ghost"
                  onClick={refreshExportData}
                  title="Retake camera frame snapshot"
                >
                  ↻ Retake Snapshot
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PGN NOTATION */}
          {activeTab === 'pgn' && (
            <div className="export-tab-pane">
              <div className="export-pane-desc">
                Portable Game Notation (PGN) including metadata headers, piece moves, captures, and check status.
              </div>
              <pre className="export-code-block">{pgnString || 'No moves recorded yet.'}</pre>
              <div className="export-actions-row">
                <button
                  type="button"
                  className="export-action-btn primary"
                  onClick={() => downloadFile(`wizard-chess-${Date.now()}.pgn`, pgnString, 'text/plain;charset=utf-8')}
                >
                  Download .PGN File
                </button>
                <button
                  type="button"
                  className="export-action-btn secondary"
                  onClick={() => copyToClipboard(pgnString, 'PGN text')}
                >
                  Copy PGN
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FEN STATE */}
          {activeTab === 'fen' && (
            <div className="export-tab-pane">
              <div className="export-pane-desc">
                Forsyth–Edwards Notation (FEN) representing the exact piece arrangement, active turn, and castling rights.
              </div>
              <div className="export-code-box">
                <code className="export-inline-code">{fenString || 'Loading FEN...'}</code>
              </div>
              <div className="export-info-card">
                <strong>Standard Chess FEN:</strong> Can be imported directly into Lichess, Chess.com, Stockfish engines, or loaded back into Wizard Chess via URL parameters.
              </div>
              <div className="export-actions-row">
                <button
                  type="button"
                  className="export-action-btn primary"
                  onClick={() => downloadFile(`wizard-chess-pos-${Date.now()}.fen`, fenString, 'text/plain;charset=utf-8')}
                >
                  Download .FEN File
                </button>
                <button
                  type="button"
                  className="export-action-btn secondary"
                  onClick={() => copyToClipboard(fenString, 'FEN string')}
                >
                  Copy FEN
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SHAREABLE WEB LINK */}
          {activeTab === 'share' && (
            <div className="export-tab-pane">
              <div className="export-pane-desc">
                Shareable web link encoding the exact board position and orientation. Opening this link reconstructs this 3D match.
              </div>
              <div className="export-url-input-wrap">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="export-url-input"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <div className="export-info-card">
                <strong>Instant Web Reload:</strong> The destination page decodes the <code>?fen=...</code> parameter on startup and animates the sculpted pieces into position.
              </div>
              <div className="export-actions-row">
                <button
                  type="button"
                  className="export-action-btn primary"
                  onClick={() => copyToClipboard(shareUrl, 'Shareable Web URL')}
                >
                  Copy Shareable Web Link
                </button>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="export-action-btn secondary"
                >
                  Test Link ↗
                </a>
              </div>
            </div>
          )}

          {/* TAB 5: MATCH JSON */}
          {activeTab === 'json' && (
            <div className="export-tab-pane">
              <div className="export-pane-desc">
                Comprehensive machine-readable JSON structure detailing move plies, timestamps, captured stones, and board matrix.
              </div>
              <pre className="export-code-block scrollable">{jsonString}</pre>
              <div className="export-actions-row">
                <button
                  type="button"
                  className="export-action-btn primary"
                  onClick={() => downloadFile(`wizard-chess-match-${Date.now()}.json`, jsonString, 'application/json')}
                >
                  Download JSON
                </button>
                <button
                  type="button"
                  className="export-action-btn secondary"
                  onClick={() => copyToClipboard(jsonString, 'Match JSON')}
                >
                  Copy JSON
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: STANDALONE WEB BUNDLE */}
          {activeTab === 'bundle' && (
            <div className="export-tab-pane">
              <div className="export-pane-desc">
                Standalone HTML5 / Web Export architecture. The production build produces an ultra-optimized static web package.
              </div>
              <div className="export-bundle-grid">
                <div className="bundle-feature-card">
                  <div className="feature-title">Relative Base Path</div>
                  <div className="feature-desc">Configured with <code>base: './'</code> so assets load seamlessly anywhere (subpaths, local files, itch.io, GitHub Pages).</div>
                </div>
                <div className="bundle-feature-card">
                  <div className="feature-title">Compressed 3D Assets</div>
                  <div className="feature-desc">All 7 sculpted statues &amp; cathedral geometry are stored as gzip-compressed binary models in <code>/public/assets/glb</code>.</div>
                </div>
                <div className="bundle-feature-card">
                  <div className="feature-title">Single Command Build</div>
                  <div className="feature-desc">Run <code>npm run export:web</code> or <code>npm run build</code> to generate the standalone web distribution in <code>dist/</code>.</div>
                </div>
                <div className="bundle-feature-card">
                  <div className="feature-title">Static Hosting Ready</div>
                  <div className="feature-desc">Deploy the <code>dist/</code> folder directly to Vercel, Netlify, Cloudflare Pages, Firebase Hosting, or itch.io.</div>
                </div>
              </div>
              <div className="export-actions-row">
                <button
                  type="button"
                  className="export-action-btn primary"
                  onClick={() => downloadFile(`wizard-chess-manifest-${Date.now()}.json`, jsonString, 'application/json')}
                >
                  Download Match Manifest (.json)
                </button>
                <button
                  type="button"
                  className="export-action-btn secondary"
                  onClick={handleDownloadScreenshot}
                >
                  Download Cover Art (.png)
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: OPEN SOURCE LICENSES */}
          {activeTab === 'licenses' && (
            <div className="export-tab-pane">
              <div className="export-pane-desc">
                Wizard Chess 3D is free, open-source software under the <strong>MIT License</strong>. Below are the third-party licenses and asset attributions.
              </div>
              <div className="export-bundle-grid">
                <div className="bundle-feature-card">
                  <div className="feature-title">Application Core</div>
                  <div className="feature-desc"><strong>MIT License</strong> &bull; &copy; 2026 Wizard Chess 3D. Free for commercial &amp; private use.</div>
                </div>
                <div className="bundle-feature-card">
                  <div className="feature-title">Three.js Engine</div>
                  <div className="feature-desc"><strong>MIT License</strong> &bull; &copy; 2010–2024 Three.js Authors (Ricardo Cabello / mrdoob).</div>
                </div>
                <div className="bundle-feature-card">
                  <div className="feature-title">React &amp; Vite Toolchain</div>
                  <div className="feature-desc"><strong>MIT License</strong> &bull; &copy; Meta Platforms, Inc. &amp; Evan You / Vite Contributors.</div>
                </div>
                <div className="bundle-feature-card">
                  <div className="feature-title">3D Sanctum &amp; Pieces</div>
                  <div className="feature-desc"><strong>CC-BY 4.0</strong> &bull; Procedural and Blender glTF 2.0 stone statue models. Permissive game assets.</div>
                </div>
              </div>
              <pre className="export-code-block scrollable">
{`MIT License

Copyright (c) 2026 Wizard Chess 3D Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </pre>
              <div className="export-actions-row">
                <button
                  type="button"
                  className="export-action-btn primary"
                  onClick={() => downloadFile('LICENSE', `MIT License\n\nCopyright (c) 2026 Wizard Chess 3D Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.`, 'text/plain;charset=utf-8')}
                >
                  Download LICENSE
                </button>
                <button
                  type="button"
                  className="export-action-btn secondary"
                  onClick={() => copyToClipboard(`MIT License\n\nCopyright (c) 2026 Wizard Chess 3D Contributors`, 'MIT License text')}
                >
                  Copy License
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
