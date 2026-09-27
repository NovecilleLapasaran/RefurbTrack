import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { code } = require('@babel/core').transformSync(readFileSync(new URL('../src/theme.js', import.meta.url), 'utf8'), {
  configFile: false, babelrc: false,
  plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-transform-modules-commonjs'],
});
function loadTheme(storage) {
  const state = [], effects = [], applied = [];
  let cursor = 0;
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    createContext: () => ({ Provider: 'Theme' }),
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], value => { state[index] = value; }];
    },
    useEffect(fn, deps) {
      const index = cursor++;
      if (!state[index] || deps.some((value, i) => value !== state[index][i])) effects.push(fn);
      state[index] = deps;
    },
  };
  const modules = {
    react,
    'react-native': { StyleSheet: { create: value => value }, View: 'View', Platform: { OS: 'android' }, Appearance: { setColorScheme: mode => applied.push(mode) } },
    '@react-native-async-storage/async-storage': storage,
  };
  const exports = {};
  runInNewContext(code, { exports, require: name => modules[name] });
  return {
    ...exports, applied,
    render() { cursor = 0; const tree = exports.ThemeProvider({ children: 'app' }); effects.splice(0).forEach(fn => fn()); return tree.props.value; },
  };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('appearance survives restart, updates native chrome, and preserves mode on save failure', async () => {
  const values = new Map();
  let fail = false;
  const storage = {
    getItem: async key => values.get(key),
    setItem: async (key, value) => { if (fail) throw new Error('disk full'); values.set(key, value); },
  };
  const first = loadTheme(storage);
  first.render(); await settle();
  assert.equal(first.render().dark, false);
  await first.render().setDarkMode(true);
  assert.equal(first.render().dark, true);
  assert.equal(first.applied.at(-1), 'dark');
  const restarted = loadTheme(storage);
  restarted.render(); await settle();
  assert.equal(restarted.render().dark, true);
  fail = true;
  await assert.rejects(restarted.render().setDarkMode(false), /Could not save/);
  assert.equal(restarted.render().dark, true);
  fail = false;
  await restarted.render().setDarkMode(false);
  assert.equal(restarted.render().dark, false);
  assert.equal(restarted.applied.at(-1), 'light');
  const unavailable = loadTheme({ getItem: async () => { throw new Error('unavailable'); } });
  unavailable.render(); await settle();
  assert.equal(unavailable.render().dark, false);
  assert.match(unavailable.render().themeError, /Could not load/);
});

test('both themes keep text readable on app surfaces, buttons, and activity cells', () => {
  const { lightColors, darkColors, createTheme } = loadTheme({});
  const luminance = hex => hex.slice(1).match(/../g).map(part => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  for (const C of [lightColors, darkColors]) {
    const pairs = ['paper', 'surface', 'soft', 'tonal', 'navySoft'].flatMap(bg => ['ink', 'muted', 'teal'].map(fg => [fg, bg]));
    pairs.push(['onAccent', 'teal'], ['ink', 'activityMedium'], ['danger', 'dangerSoft'], ['warning', 'paper'], ['white', 'ledger'], ['onNavy', 'ledger']);
    for (const [fg, bg] of pairs) {
      const a = luminance(C[fg]), b = luminance(C[bg]);
      assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5, `${fg} on ${bg}: ${C[fg]} / ${C[bg]}`);
    }
    assert.equal(createTheme(C).styles.panel.backgroundColor, C.surface);
    assert.equal(createTheme(C).type.body.color, C.ink);
  }
});
