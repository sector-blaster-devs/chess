import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

test('Web Export integration in src/App.tsx and src/WebExportModal.tsx', () => {
  const appTsx = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8');
  assert.ok(appTsx.includes('id="btn-web-export"'), 'Missing #btn-web-export in App.tsx');
  assert.ok(appTsx.includes('WebExportModal'), 'App.tsx must render WebExportModal');

  const modalPath = path.join(ROOT, 'src/WebExportModal.tsx');
  assert.ok(fs.existsSync(modalPath), 'Missing src/WebExportModal.tsx');
  const modalTsx = fs.readFileSync(modalPath, 'utf-8');
  assert.ok(modalTsx.includes('export function WebExportModal'), 'Missing WebExportModal export');
  assert.ok(modalTsx.includes('snapshot'), 'Missing snapshot tab');
  assert.ok(modalTsx.includes('pgn'), 'Missing PGN export tab');
  assert.ok(modalTsx.includes('fen'), 'Missing FEN export tab');
  assert.ok(modalTsx.includes('share'), 'Missing shareable link tab');
});

test('Web Export build configuration in vite.config.ts and package.json', () => {
  const viteConfig = fs.readFileSync(path.join(ROOT, 'vite.config.ts'), 'utf-8');
  assert.ok(viteConfig.includes("base: './'"), "vite.config.ts must have base: './' for portable static web export");

  const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  assert.ok(pkgJson.scripts['export:web'], 'package.json must define export:web script');
});

test('License files and package license metadata exist', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'LICENSE')), 'Missing root LICENSE file');
  assert.ok(fs.existsSync(path.join(ROOT, 'LICENSES.md')), 'Missing LICENSES.md file');

  const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  assert.equal(pkgJson.license, 'MIT', 'package.json license must be MIT');
});

test('wizardChessEngine exports required web export helpers on window.wizardChess', () => {
  const engineJs = fs.readFileSync(path.join(ROOT, 'src/wizardChessEngine.js'), 'utf-8');
  assert.ok(engineJs.includes('exportBoardFEN'), 'engine must expose exportBoardFEN');
  assert.ok(engineJs.includes('exportBoardPGN'), 'engine must expose exportBoardPGN');
  assert.ok(engineJs.includes('captureCanvasScreenshot'), 'engine must expose captureCanvasScreenshot');
  assert.ok(engineJs.includes('getGameStateJSON'), 'engine must expose getGameStateJSON');
  assert.ok(engineJs.includes('getShareableWebURL'), 'engine must expose getShareableWebURL');
});
