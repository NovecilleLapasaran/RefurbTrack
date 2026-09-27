import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { transformSync } = require('@babel/core');
const { code } = transformSync(readFileSync(new URL('../components/ui/sheet.js', import.meta.url), 'utf8'), {
  configFile: false, babelrc: false,
  plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-transform-modules-commonjs'],
});

test('sheets reopen after gestures, Close, Android back, and parent actions', () => {
  const hooks = [];
  let cursor, effects, back, open = false, presents = 0, dismisses = 0, mounted = false;
  const modal = {
    present() { presents++; mounted = true; },
    dismiss() { assert.ok(mounted, 'must not dismiss an already unmounted modal'); dismisses++; },
  };
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useRef(value) { const i = cursor++; return hooks[i] ??= { current: value }; },
    useCallback: fn => fn,
    useEffect(fn, deps) {
      const i = cursor++;
      const previous = hooks[i];
      if (!previous || deps.some((d, j) => !Object.is(d, previous.deps[j]))) {
        effects.push(() => { previous?.cleanup?.(); hooks[i] = { deps, cleanup: fn() }; });
      }
    },
  };
  const native = {
    BackHandler: { addEventListener: (_, fn) => { back = fn; return { remove() { back = null; } }; } },
    StyleSheet: { create: value => value }, Text: 'Text', View: 'View',
  };
  const modules = {
    react, 'react-native': native,
    '@gorhom/bottom-sheet': { BottomSheetModal: 'Modal', BottomSheetBackdrop: 'Backdrop', BottomSheetScrollView: 'ScrollView' },
    'react-native-safe-area-context': { useSafeAreaInsets: () => ({ bottom: 0 }) },
    './button': { Button: 'Button' }, '../../src/theme': { radius: {}, useTheme: () => ({ type: {} }), useStyles: factory => factory({ C: {} }) },
  };
  const exports = {};
  runInNewContext(code, { exports, require: name => { assert.ok(name in modules, name); return modules[name]; } });
  const onClose = () => { open = false; };
  const render = () => {
    cursor = 0; effects = [];
    const tree = exports.Sheet({ open, onClose, title: 'Actions' });
    tree.props.ref.current = modal;
    effects.forEach(fn => fn());
    return tree;
  };
  const dismissed = tree => { mounted = false; tree.props.onDismiss(); render(); };
  render();
  for (const close of ['backdrop', 'swipe', 'button', 'back', 'parent']) {
    open = true;
    let tree = render();
    assert.ok(mounted);
    const before = dismisses;
    if (close === 'button') tree.props.children[0].props.children[0].props.children[1].props.onPress();
    if (close === 'back') assert.equal(back(), true);
    if (close === 'parent') open = false;
    render();
    assert.equal(dismisses - before, ['button', 'back', 'parent'].includes(close) ? 1 : 0);
    dismissed(tree);
    assert.equal(open, false);
    assert.equal(back, null);
    open = true;
    tree = render();
    assert.ok(mounted, `reopens after ${close}`);
    dismissed(tree);
  }
  assert.equal(presents, 10);
  open = true;
  let tree = render();
  open = false;
  render();
  open = true;
  tree = render();
  assert.equal(presents, 11, 'wait for closing animation before presenting again');
  dismissed(tree);
  assert.equal(open, true, 'late dismissal must not cancel a new open request');
  assert.equal(presents, 12);
  assert.ok(mounted);
});
