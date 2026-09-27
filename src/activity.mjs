export function localDay(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function displayDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  return match ? `${match[2]}-${match[3]}-${match[1]}` : value || '';
}
export function dateInputToISO(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : value;
}
export function activityByDay(records) {
  const days = new Map();
  for (const record of records) for (const [index, event] of (record.history || []).entries()) {
    const day = localDay(event.at);
    if (!day) continue;
    const entries = days.get(day) || [];
    entries.push({ ...event, recordId: record.id, phone: `${record.brand} ${record.model}`, key: `${record.id}-${index}-${event.at}` });
    days.set(day, entries);
  }
  for (const entries of days.values()) entries.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  return days;
}
export function monthCells(year, month) {
  const first = new Date(year, month, 1, 12).getDay();
  const count = new Date(year, month + 1, 0, 12).getDate();
  const cells = Array.from({ length: first }, () => null);
  for (let n = 1; n <= count; n++) cells.push(localDay(new Date(year, month, n, 12)));
  while (cells.length % 7) cells.push(null);
  return cells;
}
export function activityTime(value, now = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const day = localDay(date) === localDay(now) ? 'Today' : localDay(date) === localDay(yesterday) ? 'Yesterday' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(date.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}) });
  return `${day} · ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}
export function activityPerson(event, user) {
  if (event.by === user?.email || event.by === user?.uid) return 'You';
  if (event.byName && !event.byName.includes('@')) return event.byName;
  return 'Shop staff';
}
