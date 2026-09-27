import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import * as reports from '../src/error-report.mjs';

test('error controls copy/share the report and recover when either action fails', async () => {
  const require = createRequire(import.meta.url);
  const { code } = require('@babel/core').transformSync(readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8'), {
    configFile: false, babelrc: false, plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-transform-modules-commonjs'],
  });
  let cursor = 0, copied, shared, copyResult = true, shareFails = false;
  const state = [];
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useMemo: fn => fn(),
    useState(initial) {
      const i = cursor++;
      if (!(i in state)) state[i] = initial;
      return [state[i], value => state[i] = value];
    },
  };
  const modules = {
    react,
    'react-native': { View: 'View', Text: 'Text', Platform: { OS: 'android', Version: 33, constants: { Model: 'ASUS_I005D', Manufacturer: 'ASUS', Release: '13' } },
      Share: { share: async value => { if (shareFails) throw new Error('Unavailable'); shared = value; return { action: 'dismissedAction' }; } } },
    'expo-clipboard': { setStringAsync: async value => { copied = value; return copyResult; } },
    './theme': { useTheme: () => ({ C: {}, styles: {} }) },
    './error-report.mjs': reports,
    '../app.json': { expo: { version: '1.1.1', android: { versionCode: 4 } } },
    '../components/ui/button': { Button: 'Button' },
  };
  const exports = {};
  runInNewContext(code + '\nexports.ErrorDetails = ErrorDetails;', { exports, require: name => modules[name] || {} });
  const error = Object.assign(new Error('Could not save your shop report.'), { cause: new Error('URL is not absolute') });
  const render = () => { cursor = 0; return exports.ErrorDetails({ error }); };
  const flatten = node => !node || typeof node !== 'object' ? [node] : [node, ...node.props.children.flatMap(flatten)];
  const button = title => flatten(render()).find(node => node?.props?.title === title);
  const feedback = () => flatten(render()).filter(node => typeof node === 'string').join(' ');
  await button('Copy details').props.onPress();
  assert.match(copied, /ASUS_I005D/);
  assert.match(copied, /URL is not absolute/);
  assert.match(feedback(), /Details copied/);
  copyResult = false;
  await button('Copy details').props.onPress();
  assert.match(feedback(), /Could not copy/);
  assert.equal(button('Copy details').props.disabled, false);
  await button('Share').props.onPress();
  assert.match(shared.message, /Android API: 33/);
  assert.equal(button('Share').props.disabled, false);
  shareFails = true;
  await button('Share').props.onPress();
  assert.match(feedback(), /Could not open sharing/);
  assert.equal(button('Share').props.disabled, false);
});
