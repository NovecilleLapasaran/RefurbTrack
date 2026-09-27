import assert from 'node:assert/strict';
import test from 'node:test';
import { diagnosticReport, friendlyError } from '../src/error-report.mjs';

test('errors retain useful instructions while technical failures get readable copy', () => {
  assert.equal(friendlyError(new Error('Brand is required.')), 'Brand is required.');
  assert.match(friendlyError({ code: 'auth/invalid-credential' }), /Email or password/);
  assert.match(friendlyError(new Error('Call to function FileSystemFile.base64 has been rejected')), /Please try again/);
  assert.ok(!friendlyError(new TypeError('Unexpected native failure')).includes('native'));
  assert.equal(friendlyError('Choose a date.'), 'Choose a date.');
});

test('developer reports include phone and original cause, redact credentials and bound cause chains', () => {
  const cause = new Error('java.lang.IllegalArgumentException: URL is not absolute');
  cause.stack = 'at base64 file:///private/data/report.pdf\nhttps://host/path?token=secret\nuser@example.com\npassword="private value" token=secret Bearer hidden';
  const error = Object.assign(new Error('Could not save your shop report.'), { cause, operation: 'Save shop report' });
  const report = diagnosticReport(error, { Model: 'ASUS_I005D', OS: '13', App: '1.1.1' });
  for (const expected of ['ASUS_I005D', 'OS: 13', 'App: 1.1.1', 'Save shop report', 'URL is not absolute']) assert.ok(report.includes(expected));
  for (const secret of ['user@example.com', 'private value', 'token=secret', 'Bearer hidden', 'file:///', 'https://']) assert.ok(!report.includes(secret));
  cause.cause = error;
  assert.ok(diagnosticReport(error, {}).length < 20000);
});
