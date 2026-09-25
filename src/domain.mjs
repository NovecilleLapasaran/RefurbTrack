export const JOBS = { resale: 'Buy & Resell', repair: 'Customer Repair' };
export const STATUSES = {
  resale: ['Acquired', 'Evaluated', 'Waiting for Parts', 'Repairing', 'Ready for Sale', 'Unsold', 'Sold', 'Not Worth Repairing'],
  repair: ['Received', 'Repairing', 'Waiting for Parts', 'Ready for Pickup', 'Released', 'Not Worth Repairing'],
};
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const money = cents => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(cents / 100);
export const amountText = cents => (cents / 100).toFixed(2);
export const closed = r => ['Sold', 'Released', 'Not Worth Repairing'].includes(r.status);
export const completed = r => ['Sold', 'Released'].includes(r.status);
export const readyStatus = r => r.jobType === 'repair' ? 'Ready for Pickup' : 'Ready for Sale';

export function parseMoney(value, name = 'Amount') {
  const s = String(value).trim();
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(s)) throw new Error(`${name}: enter a non-negative amount with up to two decimal places.`);
  const [whole, fraction = ''] = s.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (cents > 1000000000) throw new Error(`${name} must not exceed PHP 10,000,000.`);
  return cents;
}

export function validDate(value, name = 'Date', allowFuture = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number(value.slice(0,4)) < 2000) throw new Error(`${name}: use YYYY-MM-DD, from year 2000 onward.`);
  const d = new Date(value + 'T12:00:00Z');
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) throw new Error(`${name} is not a valid calendar date.`);
  if (!allowFuture && value > today()) throw new Error(`${name} cannot be in the future.`);
  return value;
}

export function required(value, label, max = 120) {
  const s = String(value ?? '').trim();
  if (!s) throw new Error(`${label} is required.`);
  if (s.length > max) throw new Error(`${label} must be ${max} characters or fewer.`);
  return s;
}

export function totals(record) {
  const parts = record.expenses.filter(x => x.kind === 'Parts').reduce((sum, x) => sum + x.amount, 0);
  const labor = record.expenses.filter(x => x.kind === 'Labor').reduce((sum, x) => sum + x.amount, 0);
  const investment = record.purchase + parts + labor;
  const revenue = completed(record) ? record.sale.amount : 0;
  return { parts, labor, investment, revenue, profit: closed(record) ? revenue - investment : null };
}

export function summary(records) {
  return records.reduce((a, r) => {
    const t = totals(r);
    a.count++;
    if (!closed(r)) { a.active++; a.invested += t.investment; }
    if (completed(r)) a.completed++;
    if (r.status === 'Not Worth Repairing') a.writtenOff++;
    a.revenue += t.revenue;
    a.profit += t.profit ?? 0;
    return a;
  }, { count: 0, active: 0, invested: 0, completed: 0, writtenOff: 0, revenue: 0, profit: 0 });
}

export function intake(form, previous) {
  if (previous && closed(previous)) throw new Error('Reopen the job before changing costs or intake details.');
  if (!JOBS[form.jobType]) throw new Error('Choose a job type.');
  if (previous && form.jobType !== previous.jobType) throw new Error('Job type cannot change after intake.');
  const acquiredAt = validDate(form.acquiredAt, 'Intake date');
  return {
    jobType: form.jobType,
    brand: required(form.brand, 'Brand', 60), model: required(form.model, 'Model', 80),
    condition: required(form.condition, 'Condition', 500),
    source: required(form.source, form.jobType === 'repair' ? 'Customer reference' : 'Acquisition source', 120),
    purchase: form.jobType === 'repair' ? 0 : parseMoney(form.purchase, 'Purchase price'),
    acquiredAt, notes: String(form.notes ?? '').trim().slice(0, 1000),
  };
}

export function changeStatus(record, status) {
  if (closed(record)) throw new Error('Reopen the job before changing its status.');
  if (!STATUSES[record.jobType].includes(status)) throw new Error('This status does not belong to the job type.');
  if (['Sold', 'Released'].includes(status)) throw new Error('Use Record sale or Record payment to complete this job.');
  if (status === 'Not Worth Repairing' && !record.diagnosis?.trim()) throw new Error('Record a diagnosis before writing off the job.');
  return { status, sale: null };
}

export function salePatch(record, form) {
  if (![readyStatus(record), ...(record.jobType === 'resale' ? ['Unsold'] : [])].includes(record.status)) throw new Error('Mark the job ready before recording payment.');
  const date = validDate(form.date, 'Payment date');
  if (date < record.acquiredAt) throw new Error('Payment date cannot be before intake.');
  return {
    status: record.jobType === 'repair' ? 'Released' : 'Sold',
    sale: { amount: parseMoney(form.amount, record.jobType === 'repair' ? 'Amount charged' : 'Selling price'), date,
      buyer: String(form.buyer ?? '').trim().slice(0, 120), warranty: String(form.warranty ?? '').trim().slice(0, 300) },
  };
}

export function expensePatch(record, form, id) {
  if (closed(record)) throw new Error('Reopen the job before changing expenses.');
  if (!['Parts', 'Labor'].includes(form.kind)) throw new Error('Choose Parts or Labor.');
  if (record.expenses.length >= 200 && !record.expenses.some(x => x.id === id)) throw new Error('This job has reached the 200-entry limit.');
  const item = { id, kind: form.kind, name: required(form.name, 'Expense description'), amount: parseMoney(form.amount, 'Expense amount') };
  return { expenses: [...record.expenses.filter(x => x.id !== id), item] };
}

export function filterRecords(records, { query = '', status = 'All', jobType = 'All', from = '', to = '', history = false } = {}) {
  const words = query.toLowerCase().trim().split(/\s+/);
  return records.filter(r => (!history || closed(r)) && (status === 'All' || r.status === status) &&
    (jobType === 'All' || r.jobType === jobType) && (!from || r.acquiredAt >= from) && (!to || r.acquiredAt <= to) &&
    words.every(w => `${r.brand} ${r.model} ${r.status} ${r.source} ${r.id}`.toLowerCase().includes(w)))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
