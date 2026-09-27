import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ellipsis, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useStore } from './store';
import { closed, completed, JOBS, money, readyStatus, totals } from './domain.mjs';
import { Button, Disclosure, ErrorText, IconButton, Line, Loading, Page, Section, Sheet } from './ui';
import { confirmAction } from '../components/ui/dialog';
import { activityTime, activityPerson, displayDate } from './activity.mjs';
import { RepairJourney } from './journey';
import { radius, useStyles, useTheme } from './theme';
import { Status } from './workshop';
export function PhoneDetail({ navigation, route }) {
  const { styles } = useTheme();
  const s = useStyles(makeStyles);
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const [more, setMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = async fn => { if (busy) return; setBusy(true); setError(''); try { await fn(); } catch(e) { setError(e); } finally { setBusy(false); } };
  if (!record) return <Page title="Phone record">{store.loading ? <Loading /> : <><Text style={styles.body}>This record is unavailable. It may have been deleted or access may have changed.</Text><Button title="Return to records" onPress={() => navigation.popToTop()} /></>}</Page>;
  const t = totals(record);
  const done = closed(record);
  const ready = [readyStatus(record), ...(record.jobType === 'resale' ? ['Unsold'] : [])].includes(record.status);
  const openForm = screen => navigation.navigate(screen, { id: record.id });
  return <Page title={`${record.brand} ${record.model}`} subtitle={JOBS[record.jobType]} accessory={<IconButton icon={Ellipsis} label="Record actions" onPress={() => setMore(true)} />}>
    <Status value={record.status} /><RepairJourney status={record.status} />
    <View style={s.ledger}><Text style={s.ledgerLabel}>{done ? 'Recorded profit / loss' : 'Total invested'}</Text><Text style={s.total}>{money(t.profit ?? t.investment)}</Text><Text style={s.ledgerHint}>{done ? 'After purchase, parts and paid labor' : 'Actual costs so far · estimate excluded'}</Text></View>
    <ErrorText message={error} />
    {!done && <View style={styles.section}><Button title={ready ? record.jobType === 'repair' ? 'Record payment & release' : 'Record sale' : 'Update diagnosis & status'} onPress={() => openForm(ready ? 'Sale' : 'Progress')} />
      <Button title="Add expense" secondary icon={Plus} onPress={() => openForm('Expense')} /></View>}
    <Section title="Cost breakdown"><View style={styles.panel}>
      <Line label="Purchase" value={money(record.purchase)} /><Line label="Parts" value={money(t.parts)} /><Line label="Paid labor" value={money(t.labor)} />
      <View style={styles.divider}><Line label="Total investment" value={money(t.investment)} strong />{completed(record) && <Line label={record.jobType === 'repair' ? 'Amount charged' : 'Selling price'} value={money(t.revenue)} strong />}</View>
    </View></Section>
    <Section title="Diagnosis" action={ready && !done ? <Button title="Update" variant="ghost" onPress={() => openForm('Progress')} /> : null}>
      <Text style={styles.body}>{record.diagnosis || 'No diagnosis yet. Record the problem before moving this job forward.'}</Text>
      {record.feasibility ? <Text style={styles.small}>{record.feasibility}</Text> : null}
      <Line label="Repair estimate" value={money(record.estimate)} />
    </Section>
    <Section title={`Expenses (${record.expenses.length})`}>
      {!record.expenses.length && <Text style={styles.small}>No costs added yet. Record parts and paid labor as work progresses.</Text>}
      {record.expenses.map(x => <View key={x.id} style={s.expense}>
        <View style={s.flex}><Text style={styles.label}>{x.name}</Text><Text style={styles.small}>{x.kind} · {money(x.amount)}</Text></View>
        {!done && <><IconButton icon={Pencil} label={`Edit ${x.name}`} disabled={busy} onPress={() => navigation.navigate('Expense', { id: record.id, expenseId: x.id })} />
          <IconButton icon={Trash2} label={`Remove ${x.name}`} danger disabled={busy} onPress={() => run(async () => {
            if (await confirmAction('Remove expense?', `${x.name}: ${money(x.amount)} will be removed from this job’s costs.`, 'Remove expense')) await store.save(record.id, { expenses: record.expenses.filter(e => e.id !== x.id) }, `Expense removed: ${x.name}`, record.version);
          })} /></>}
      </View>)}
    </Section>
    <Disclosure title="Intake details"><Text style={styles.body}>{record.condition}</Text><Line label="Intake date" value={displayDate(record.acquiredAt)} /><Text style={styles.body}>Received from: {record.source}</Text>{record.notes ? <Text style={styles.body}>{record.notes}</Text> : null}</Disclosure>
    {record.sale && <Disclosure title="Payment details"><Line label="Payment date" value={displayDate(record.sale.date)} /><Text style={styles.body}>Buyer / customer: {record.sale.buyer || 'Not recorded'}</Text><Text style={styles.body}>Warranty: {record.sale.warranty || 'Not recorded'}</Text></Disclosure>}
    <Disclosure title="Activity history">{[...record.history].reverse().map((event, i) => <View key={`${event.at}-${i}`} style={styles.divider}><Text style={styles.label}>{event.action}</Text><Text style={styles.small}>{activityTime(event.at)} · {activityPerson(event, store.user)}</Text></View>)}</Disclosure>
    <Sheet open={more} onClose={() => setMore(false)} title="Record actions">
      <Text style={styles.heading}>{record.brand} {record.model}</Text><Status value={record.status} />
      {!done && <Button secondary title="Edit intake" onPress={() => { setMore(false); openForm('Intake'); }} />}
      {done && <Button secondary title="Reopen job" disabled={busy} onPress={() => { setMore(false); run(async () => {
        if (await confirmAction('Reopen this job?', 'The payment will be removed. The job reopens with its existing expenses.', 'Reopen job')) await store.save(record.id, { status: record.status === 'Not Worth Repairing' ? 'Repairing' : readyStatus(record), sale: null }, 'Job reopened; payment cleared', record.version);
      }); }} />}
      <Button danger title="Delete phone record" disabled={busy} onPress={() => { setMore(false); run(async () => {
        if (await confirmAction('Delete phone record?', 'The phone, expenses, payment and activity history will be permanently deleted.', 'Delete record')) { await store.remove(record); navigation.popToTop(); }
      }); }} />
    </Sheet>
  </Page>;
}
const makeStyles = ({ C, styles }) => StyleSheet.create({ ledger: { backgroundColor: C.ledger, borderRadius: radius.surface, padding: 22, gap: 8 }, ledgerLabel: { ...styles.label, color: C.onNavy }, total: { ...styles.metric, color: C.white }, ledgerHint: { ...styles.small, color: C.onNavy }, expense: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10, borderBottomWidth: 1, borderColor: C.divider }, flex: { flex: 1, gap: 4 } });
