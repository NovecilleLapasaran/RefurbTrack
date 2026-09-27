import test from 'node:test';
import assert from 'node:assert/strict';
import { activityByDay, activityPerson, activityTime, dateInputToISO, displayDate, localDay, monthCells } from '../src/activity.mjs';
import { validDate } from '../src/domain.mjs';

test('US display/input dates round-trip without changing stored ISO dates', () => {
  assert.equal(displayDate('2026-09-26'), '09-26-2026');
  assert.equal(dateInputToISO('09-26-2026'), '2026-09-26');
  assert.equal(dateInputToISO('09-2'), '09-2');
  assert.throws(() => validDate(dateInputToISO('02-30-2026')));
  assert.equal(displayDate(''), '');
});
test('calendar month cells align weekdays and include leap day', () => {
  const cells = monthCells(2024, 1);
  assert.equal(cells.length % 7, 0);
  assert.equal(cells.filter(Boolean).length, 29);
  assert.equal(cells[4], '2024-02-01');
  assert.ok(cells.includes('2024-02-29'));
  assert.equal(monthCells(2026, 11).filter(Boolean).length, 31);
});
test('activity groups real retained events by local day and sorts newest first', () => {
  const early = new Date(2026, 8, 26, 0, 5).toISOString();
  const late = new Date(2026, 8, 26, 23, 59).toISOString();
  const records = [{id:'one',brand:'Phone',model:'A',history:[{at:early,action:'Created'},{at:'invalid',action:'bad'}]}, {id:'two',brand:'Phone',model:'B',history:[{at:late,action:'Paid'}]}];
  const days = activityByDay(records);
  assert.equal(days.size, 1);
  assert.equal(days.get('2026-09-26').length, 2);
  assert.equal(days.get('2026-09-26')[0].recordId, 'two');
  assert.equal(activityByDay([]).size, 0);
});
test('activity labels hide email/UID and distinguish today and yesterday', () => {
  const now = new Date(2026, 8, 26, 14);
  assert.match(activityTime(new Date(2026, 8, 26, 13, 37), now), /^Today · /);
  assert.match(activityTime(new Date(2026, 8, 25, 13, 37), now), /^Yesterday · /);
  assert.equal(activityPerson({by:'a@example.com'}, {email:'a@example.com'}), 'You');
  assert.equal(activityPerson({by:'unknown-uid'}, {uid:'own'}), 'Shop staff');
});
