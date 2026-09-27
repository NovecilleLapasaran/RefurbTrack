import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { reportFilename, reportHtml } from '../src/report-document.mjs';

const date = new Date(2026, 8, 27, 12);
test('report names are readable, filesystem-safe, and short enough for Unicode shop names', () => {
  assert.equal(reportFilename('AJ Cellphone Repair', date), 'RefurbTrack - AJ Cellphone Repair - Shop Report - 27 Sept 2026.pdf');
  assert.equal(reportFilename('  AJ:/ <Repair>  . ', date), 'RefurbTrack - AJ Repair - Shop Report - 27 Sept 2026.pdf');
  assert.match(reportFilename('...', date), /My shop/);
  assert.ok(Buffer.byteLength(reportFilename('😀'.repeat(100), date)) < 255);
});

test('report escapes user text, keeps financial totals, and embeds supplied artwork and font', () => {
  const common = { brand: '<script>alert(1)</script>', model: 'A & B', jobType: 'repair', acquiredAt: '2026-09-01', purchase: 0, expenses: [{ kind: 'Parts', amount: 80000 }] };
  const html = reportHtml([
    { ...common, status: 'Received' },
    { ...common, status: 'Released', sale: { amount: 150000 } },
    { ...common, status: 'Not Worth Repairing' },
  ], 'AJ & "Friends"', { date, logo: 'data:image/png;base64,logo', font: 'data:font/ttf;base64,font' });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('AJ &amp; &quot;Friends&quot;'));
  assert.ok(html.includes('₱800.00'));
  assert.ok(html.includes('₱1,500.00'));
  assert.ok(html.includes('-₱100.00'));
  assert.ok(html.includes('Still open'));
  assert.ok(html.includes('data:image/png;base64,logo'));
  assert.ok(html.includes('data:font/ttf;base64,font'));
  assert.ok(reportHtml([], '', { date, logo: '', font: '' }).includes('No phone records'));
});

test('native export waits for the readable filename before sharing, including repeat saves', async () => {
  const require = createRequire(import.meta.url);
  const { code } = require('@babel/core').transformSync(readFileSync(new URL('../src/report.js', import.meta.url), 'utf8'), {
    configFile: false, babelrc: false, plugins: ['@babel/plugin-transform-modules-commonjs'],
  });
  const files = new Set();
  let serial = 0, shared = [], printed = [], sharing = true, moveFails = false;
  class Directory { constructor(...paths) { this.uri = paths.join('/'); } create() {} }
  class File {
    constructor(...paths) { this.uri = paths.map(p => p.uri || p).join('/'); this.name = this.uri.split('/').at(-1); }
    async base64() { return 'embedded'; }
    async move(target) { await new Promise(resolve => setImmediate(resolve)); if (moveFails) throw new Error('disk full'); files.add(target.uri); }
  }
  let previewHtml = '', didPrint = false, decoded = false;
  const preview = {
    document: { write: html => { previewHtml = html; }, close() {}, fonts: { ready: Promise.resolve() }, images: [{ decode: async () => { decoded = true; } }] },
    focus() {}, print() { assert.ok(decoded); didPrint = true; }, close() {},
  };
  const window = { location: { href: 'http://localhost/' }, open: () => preview };
  const modules = {
    'react-native': { Platform: { OS: 'android' } },
    'expo-asset': { Asset: { fromModule: () => ({ uri: '/asset', localUri: 'file:///asset', downloadAsync: async () => {} }) } },
    'expo-file-system': { File, Directory, Paths: { cache: 'file:///cache' } },
    'expo-print': { printToFileAsync: async () => ({ uri: `file:///cache/${++serial}.pdf` }), printAsync: async options => printed.push(options.uri) },
    'expo-sharing': { isAvailableAsync: async () => sharing, shareAsync: async uri => { assert.ok(files.has(uri)); shared.push(uri); } },
    './report-document.mjs': { reportFilename, reportHtml },
  };
  const exports = {};
  runInNewContext(code, { exports, URL, window, require: name => modules[name] || name });
  await exports.shareReport([], 'AJ / Repair');
  await exports.shareReport([], 'AJ / Repair');
  assert.notEqual(shared[0], shared[1]);
  assert.match(shared[0], /RefurbTrack - AJ Repair - Shop Report - .*\.pdf$/);
  sharing = false;
  await exports.shareReport([], 'AJ');
  assert.equal(printed.length, 1);
  moveFails = true;
  await assert.rejects(exports.shareReport([], 'AJ'), /disk full/);
  assert.equal(printed.length, 1);
  modules['react-native'].Platform.OS = 'web';
  await exports.shareReport([], 'Web shop');
  assert.ok(didPrint);
  assert.ok(previewHtml.includes('<h1>Shop report</h1>'));
  assert.ok(previewHtml.includes('http://localhost/asset'));
  window.open = () => null;
  await assert.rejects(exports.shareReport([], 'Web shop'), /Allow pop-ups/);
});
