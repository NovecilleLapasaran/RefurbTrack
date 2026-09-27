export function friendlyError(error) {
  if (typeof error === 'string') return error;
  const messages = {
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/email-already-in-use': 'An account already uses this email. Sign in instead.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Use at least 8 characters for your password.',
    'auth/network-request-failed': 'Cannot reach the sign-in service. Check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
    'auth/operation-not-allowed': 'Sign-in is unavailable. Please contact your shop owner.',
    'permission-denied': 'You do not have access to these records. Ask your shop owner to check your account.',
    'unavailable': 'Cannot reach the database. Check your connection and retry.',
  };
  if (messages[error?.code]) return messages[error.code];
  const message = error?.message || '';
  if (error?.code || /exception|filesystem|call to function|rejected|not a function|undefined|null|ENOENT|ENOSPC|EACCES|Firebase|network request failed/i.test(message) || ['TypeError', 'ReferenceError', 'SyntaxError'].includes(error?.name)) {
    return 'Something went wrong. Please try again. If it keeps happening, share the technical details with your developer.';
  }
  return (message || 'Something went wrong. Please try again.').replaceAll('YYYY-MM-DD', 'MM-DD-YYYY');
}

export function redactDiagnostics(value) {
  return String(value ?? '')
    .replace(/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi, '[email removed]')
    .replace(/(?:https?:\/\/|file:\/\/|content:\/\/)[^\s)]+/gi, '[URL removed]')
    .replace(/\b(Bearer\s+)\S+/gi, '$1[removed]')
    .replace(/\b(password|token|api[_-]?key|authorization)["']?\s*[:=]\s*(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi, '$1=[removed]')
    .replace(/\b(?:AIza[\w-]{30,}|eyJ[\w-]+\.[\w-]+\.[\w-]+)\b/g, '[credential removed]')
    .slice(0, 6000);
}

export function diagnosticReport(error, device, date = new Date()) {
  const causes = [];
  let current = error;
  for (let i = 0; current && i < 3; i++, current = current.cause) {
    const heading = `${current.name || 'Error'}${current.code ? ` (${current.code})` : ''}: ${current.message || current}`;
    const stack = String(current.stack || '').split('\n').filter(line => !line.includes(current.message || heading)).join('\n');
    causes.push(redactDiagnostics(`${heading}\n${stack}`));
  }
  return ['RefurbTrack error report', `Time: ${date.toISOString()}`, `Action: ${redactDiagnostics(error.operation || 'App action')}`,
    ...Object.entries(device).map(([key, value]) => `${key}: ${redactDiagnostics(value ?? 'Unavailable')}`), '', ...causes].join('\n');
}
