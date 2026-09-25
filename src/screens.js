import React, { useState } from 'react';
import { Alert, Platform, Share, Text, View } from 'react-native';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, cloudConfigured } from './firebase';
import { friendlyError, newId, useStore } from './store';
import { amountText, changeStatus, closed, completed, expensePatch, filterRecords, intake, JOBS, money, parseMoney, readyStatus, salePatch, STATUSES, summary, today, totals, validDate } from './domain.mjs';
import { Button, C, Choice, ErrorText, Field, Line, Loading, Page, Section, styles } from './ui';

async function confirmAction(title, message) {
  if (Platform.OS === 'web') return window.confirm(`${title}\n\n${message}`);
  return new Promise(resolve => Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
    { text: 'Confirm', style: 'destructive', onPress: () => resolve(true) }], { cancelable: true, onDismiss: () => resolve(false) }));
}
function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = async fn => { if (busy) return; setBusy(true); setError(''); try { await fn(); } catch (e) { setError(friendlyError(e)); } finally { setBusy(false); } };
  return { busy, error, run };
}
function useForm(initial) {
  const [form, setForm] = useState(initial);
  const field = key => ({ value: form[key], onChangeText: value => setForm(current => ({ ...current, [key]: value })) });
  return { form, setForm, field };
}
function BackCancel({ navigation }) {
  return <Button title="Cancel" secondary onPress={async () => { if (await confirmAction('Discard changes?', 'Changes on this form have not been saved.')) navigation.goBack(); }} />;
}
export function LoginScreen() {
  const store = useStore();
  const [register, setRegister] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { form, field } = useForm({ email: '', password: '' });
  const action = useAction();
  return <Page title="RefurbTrack" subtitle="Every phone. Every cost. One record.">
    <View style={[styles.panel, { backgroundColor: C.navy }]}><Text style={[styles.heading, { color: C.white }]}>Know what each repair earns</Text><Text style={[styles.body, { color: '#E2ECEF' }]}>Record intake, parts, labor, and the final payment for your shop’s phones.</Text></View>
    {cloudConfigured ? <Section title={register ? 'Create a staff account' : 'Staff sign in'}>
      <Field label="Email" {...field('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Field label="Password" {...field('password')} autoCapitalize="none" secureTextEntry autoComplete={register ? 'new-password' : 'current-password'} hint={register ? 'Use at least 8 characters.' : undefined} />
      <ErrorText message={action.error} />
      <Button title={register ? 'Create account' : 'Sign in'} busy={action.busy} onPress={() => action.run(async () => {
        if (register && form.password.length < 8) throw new Error('Use at least 8 characters for your password.');
        await (register ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, form.email.trim(), form.password);
      })} />
      <Button secondary title={register ? 'I already have an account' : 'Create a staff account'} onPress={() => setRegister(!register)} />
      {!register && <Button secondary title="Reset password" disabled={action.busy} onPress={() => action.run(async () => { if (!form.email.trim()) throw new Error('Enter your email first.'); await sendPasswordResetEmail(auth, form.email.trim()); setResetSent(true); })} />}
      {resetSent && <Text accessibilityLiveRegion="polite" style={styles.body}>If this email has an account, a reset link will arrive shortly.</Text>}
      {register && <Text style={styles.small}>A new account starts with a private workspace. A project administrator can add you to the shop’s shared workspace.</Text>}
    </Section> : <Section title="Practice before connecting your shop"><Text style={styles.body}>Cloud sign-in is not configured in this build. Practice records stay on this device and are separate from shop data.</Text></Section>}
    <Button secondary title="Open practice workspace" onPress={store.enterPractice} />
    <Text style={styles.small}>For the owner and technicians of AJ Cellphone Repair Shop and Accessories.</Text>
  </Page>;
}
function RecordRow({ record, navigation }) {
  const t = totals(record);
  return <View style={styles.panel}><Text style={[styles.small, { color: C.teal, fontWeight: '600' }]}>{JOBS[record.jobType]} · {record.status}</Text><Text style={styles.heading}>{record.brand} {record.model}</Text><Line label={closed(record) ? 'Recorded profit / loss' : 'Total investment'} value={money(t.profit ?? t.investment)} strong /><Text style={styles.small}>Intake {record.acquiredAt} · {record.source}</Text><Button secondary title={`Open ${record.brand} ${record.model}`} onPress={() => navigation.navigate('Detail', { id: record.id })} /></View>;
}
export function HomeScreen({ navigation }) {
  const store = useStore();
  const [tab, setTab] = useState('Overview');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  let dateError = '';
  try { if (from) validDate(from, 'From date', true); if (to) validDate(to, 'To date', true); if (from && to && from > to) throw new Error('From date must be on or before To date.'); } catch(e) { dateError = e.message; }
  const all = filterRecords(store.records, { query, status, jobType, from: dateError ? '' : from, to: dateError ? '' : to, history: tab === 'History' });
  const sums = summary(store.records);
  return <Page title="RefurbTrack" subtitle={tab === 'Overview' ? 'Your workshop at a glance' : tab === 'History' ? 'Completed and written-off jobs' : 'Find a phone and continue its record'}>
    <View style={styles.row}>{['Overview', 'Records', 'History'].map(name => <Button key={name} title={name} secondary={tab !== name} accessibilityState={{ selected: tab === name }} onPress={() => setTab(name)} />)}<Button secondary title="Account" onPress={() => navigation.navigate('Account')} /></View>
    {store.loading ? <Loading /> : store.error ? <><ErrorText message={store.error} /><Button title="Reload records" onPress={store.retry} /></> : <>
      <Button title="Add phone record" onPress={() => navigation.navigate('Intake')} />
      {tab === 'Overview' ? <>
        <View style={[styles.panel, { backgroundColor: C.navy }]}><Text style={[styles.body, { color: '#E2ECEF' }]}>Recorded profit / loss</Text><Text style={[styles.metric, { color: C.white }]}>{money(sums.profit)}</Text><Text style={[styles.small, { color: '#E2ECEF' }]}>From {sums.completed} paid jobs and {sums.writtenOff} write-offs. Open jobs are excluded.</Text></View>
        <View style={styles.panel}><Line label="Open jobs" value={String(sums.active)} /><Line label="Investment in open jobs" value={money(sums.invested)} /><Line label="Recorded revenue" value={money(sums.revenue)} /><Line label="All records" value={String(sums.count)} /></View>
        <Section title="Recently updated">{store.records.length ? filterRecords(store.records).slice(0, 4).map(r => <RecordRow key={r.id} record={r} navigation={navigation} />) : <Text style={styles.body}>No phone records yet. Add a phone to start tracking its costs.</Text>}</Section>
      </> : <>
        <Field label="Search records" value={query} onChangeText={setQuery} placeholder="Brand, model, status, source, or record ID" />
        <Button secondary title={filtersOpen ? 'Hide filters' : 'Filter by job, status, or date'} onPress={() => setFiltersOpen(!filtersOpen)} />
        {filtersOpen && <View style={styles.panel}>
          <Choice label="Job type" value={jobType} options={[{ value: 'All', label: 'All jobs' }, ...Object.entries(JOBS).map(([value, label]) => ({ value, label }))]} onChange={v => { setJobType(v); setStatus('All'); }} />
          <Choice label="Status" value={status} options={['All', ...new Set(jobType === 'All' ? [...STATUSES.resale, ...STATUSES.repair] : STATUSES[jobType])]} onChange={setStatus} />
          <Field label="From intake date" value={from} onChangeText={setFrom} placeholder="YYYY-MM-DD" /><Field label="To intake date" value={to} onChangeText={setTo} placeholder="YYYY-MM-DD" />
          <ErrorText message={dateError} /><Button secondary title="Clear filters" onPress={() => { setQuery(''); setStatus('All'); setJobType('All'); setFrom(''); setTo(''); }} />
        </View>}
        <Text accessibilityLiveRegion="polite" style={styles.small}>{all.length} matching {all.length === 1 ? 'record' : 'records'}</Text>
        {!all.length && <Text style={styles.body}>No records match this view. Adjust your filters or add a phone.</Text>}
        {all.map(r => <RecordRow key={r.id} record={r} navigation={navigation} />)}
      </>}
    </>}
  </Page>;
}
export function IntakeScreen({ navigation, route }) {
  const store = useStore();
  const previous = store.records.find(r => r.id === route.params?.id);
  const [version] = useState(previous?.version);
  const { form, setForm, field } = useForm(previous ? { ...previous, purchase: amountText(previous.purchase) } : { jobType: 'resale', brand: '', model: '', condition: '', source: '', purchase: '', acquiredAt: today(), notes: '' });
  const action = useAction();
  return <Page title={previous ? 'Edit intake' : 'Add a phone'} subtitle="Keep one record from intake to final payment.">
    {previous ? <Text style={styles.label}>{JOBS[form.jobType]}</Text> : <Choice label="Job type" value={form.jobType} options={Object.entries(JOBS).map(([value, label]) => ({ value, label }))} onChange={jobType => setForm(f => ({ ...f, jobType }))} />}
    <Field label="Brand" {...field('brand')} maxLength={60} placeholder="e.g. Samsung" /><Field label="Model" {...field('model')} maxLength={80} placeholder="e.g. Galaxy A15" />
    <Field label="Physical condition" {...field('condition')} multiline maxLength={500} placeholder="Visible damage and intake observations" />
    <Field label={form.jobType === 'repair' ? 'Customer reference' : 'Acquisition source'} {...field('source')} placeholder={form.jobType === 'repair' ? 'Name or shop reference' : 'Walk-in seller, supplier, or other source'} />
    {form.jobType === 'resale' ? <Field label="Purchase price (PHP)" {...field('purchase')} money hint="Enter 0 for a zero-cost acquisition. It remains a Buy & Resell job." /> : <Text style={styles.body}>Customer repairs have a purchase price of PHP 0. Record parts and paid labor as expenses later.</Text>}
    <Field label="Intake date" {...field('acquiredAt')} placeholder="YYYY-MM-DD" maxLength={10} /><Field label="Intake notes (optional)" {...field('notes')} multiline />
    <ErrorText message={action.error} /><Button title="Save phone record" busy={action.busy} onPress={() => action.run(async () => {
      if (route.params?.id && !previous) throw new Error('This record no longer exists.');
      const id = await store.save(previous?.id, intake(form, previous), previous ? 'Intake updated' : 'Phone record created', version); navigation.replace('Detail', { id });
    })} /><BackCancel navigation={navigation} />
  </Page>;
}
export function DetailScreen({ navigation, route }) {
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const action = useAction();
  if (!record) return <Page title="Phone record">{store.loading ? <Loading /> : <><Text style={styles.body}>This record is unavailable. It may have been deleted or access may have changed.</Text><Button title="Return to records" onPress={() => navigation.popToTop()} /></>}</Page>;
  const t = totals(record);
  const financialClosed = closed(record);
  return <Page title={`${record.brand} ${record.model}`} subtitle={`${JOBS[record.jobType]} · ${record.status}`}>
    <View style={[styles.panel, { backgroundColor: C.navy }]}><Text style={[styles.body, { color: '#E2ECEF' }]}>{financialClosed ? 'Recorded profit / loss' : 'Total investment'}</Text><Text style={[styles.metric, { color: C.white }]}>{money(t.profit ?? t.investment)}</Text><Text style={[styles.small, { color: '#E2ECEF' }]}>{financialClosed ? 'Revenue less purchase, parts, and paid labor' : 'Profit is calculated when payment or a write-off is recorded.'}</Text></View>
    <Section title="Cost breakdown"><View style={styles.panel}><Line label="Purchase" value={money(record.purchase)} /><Line label="Parts" value={money(t.parts)} /><Line label="Paid labor" value={money(t.labor)} /><Line label="Total investment" value={money(t.investment)} strong />{completed(record) && <Line label={record.jobType === 'repair' ? 'Amount charged' : 'Selling price'} value={money(t.revenue)} strong />}</View></Section>
    <ErrorText message={action.error} />
    {!financialClosed && <View style={styles.row}><Button title="Add expense" onPress={() => navigation.navigate('Expense', { id: record.id })} /><Button secondary title="Edit intake" onPress={() => navigation.navigate('Intake', { id: record.id })} /></View>}
    <Section title="Diagnosis and progress"><Text style={styles.body}>{record.diagnosis || 'No diagnosis recorded yet.'}</Text>{record.feasibility ? <Text style={styles.body}>Feasibility: {record.feasibility}</Text> : null}<Line label="Estimated repair cost" value={money(record.estimate)} /><Text style={styles.small}>The estimate is a planning figure. Only recorded expenses count toward investment.</Text>
      {!financialClosed && <Button secondary title="Update diagnosis or status" onPress={() => navigation.navigate('Progress', { id: record.id })} />}
      {[readyStatus(record), ...(record.jobType === 'resale' ? ['Unsold'] : [])].includes(record.status) && <Button title={record.jobType === 'repair' ? 'Record payment and release' : 'Record sale'} onPress={() => navigation.navigate('Sale', { id: record.id })} />}
    </Section>
    <Section title="Expenses">{!record.expenses.length && <Text style={styles.body}>No expenses recorded. Add parts or paid labor as work progresses.</Text>}
      {record.expenses.map(x => <View key={x.id} style={styles.panel}><Text style={styles.label}>{x.kind} · {x.name}</Text><Text style={styles.body}>{money(x.amount)}</Text>
        {!financialClosed && <View style={styles.row}><Button secondary title={`Edit ${x.name}`} onPress={() => navigation.navigate('Expense', { id: record.id, expenseId: x.id })} /><Button secondary danger title={`Remove ${x.name}`} disabled={action.busy} onPress={() => action.run(async () => {
          if (await confirmAction('Remove expense?', `${x.name}: ${money(x.amount)} will be removed from this job’s costs.`)) await store.save(record.id, { expenses: record.expenses.filter(e => e.id !== x.id) }, `Expense removed: ${x.name}`, record.version);
        })} /></View>}
      </View>)}
    </Section>
    <Section title="Intake details"><Text style={styles.body}>{record.condition}</Text><Line label="Intake date" value={record.acquiredAt} /><Text style={styles.body}>Source / reference: {record.source}</Text>{record.notes ? <Text style={styles.body}>{record.notes}</Text> : null}<Text selectable style={styles.small}>Record ID: {record.id}</Text></Section>
    {record.sale && <Section title="Payment details"><Line label="Payment date" value={record.sale.date} /><Text style={styles.body}>Buyer / customer: {record.sale.buyer || 'Not recorded'}</Text><Text style={styles.body}>Warranty: {record.sale.warranty || 'Not recorded'}</Text></Section>}
    <Section title="Activity history"><Text style={styles.small}>Most recent 100 changes are retained.</Text>{[...record.history].reverse().map((event, index) => <View key={`${event.at}-${index}`} style={styles.divider}><Text style={styles.label}>{event.action}</Text><Text style={styles.small}>{new Date(event.at).toLocaleString()} · {event.by}</Text></View>)}</Section>
    {financialClosed && <Button secondary title="Reopen job" disabled={action.busy} onPress={() => action.run(async () => {
      if (await confirmAction('Reopen this job?', 'The recorded payment will be removed and the job will return to an open status. Its expenses remain.')) await store.save(record.id, { status: record.status === 'Not Worth Repairing' ? 'Repairing' : readyStatus(record), sale: null }, 'Job reopened; payment cleared', record.version);
    })} />}
    <Button secondary danger title="Delete phone record" disabled={action.busy} onPress={() => action.run(async () => { if (await confirmAction('Delete phone record?', 'The phone, expenses, payment, and activity history will be permanently deleted.')) { await store.remove(record); navigation.popToTop(); } })} />
  </Page>;
}
export function ExpenseScreen({ route, navigation }) {
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const existing = record?.expenses.find(e => e.id === route.params.expenseId);
  const [version] = useState(record?.version);
  const [expenseId] = useState(existing?.id || newId());
  const { form, setForm, field } = useForm({ kind: existing?.kind || 'Parts', name: existing?.name || '', amount: existing ? amountText(existing.amount) : '' });
  const action = useAction();
  return <Page title={existing ? 'Edit expense' : 'Add expense'} subtitle="Record the cost actually paid, not a quoted selling price.">
    <Choice label="Expense type" value={form.kind} options={['Parts', 'Labor']} onChange={kind => setForm(f => ({ ...f, kind }))} />
    <Field label="Expense description" {...field('name')} placeholder={form.kind === 'Parts' ? 'e.g. Replacement display' : 'e.g. Outsourced board repair'} /><Field label="Expense amount (PHP)" {...field('amount')} money />
    <Text style={styles.small}>Owner-performed labor may be recorded as PHP 0. Profit then includes the owner’s compensation for time; it is not accounting net income after overhead.</Text>
    <ErrorText message={action.error} /><Button title="Save expense" busy={action.busy} onPress={() => action.run(async () => { if (!record) throw new Error('This record no longer exists.'); await store.save(record.id, expensePatch(record, form, expenseId), `${existing ? 'Expense updated' : 'Expense added'}: ${form.name.trim()}`, version); navigation.goBack(); })} /><BackCancel navigation={navigation} />
  </Page>;
}
export function ProgressScreen({ route, navigation }) {
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const [version] = useState(record?.version);
  const { form, setForm, field } = useForm({ diagnosis: record?.diagnosis || '', feasibility: record?.feasibility || '', estimate: amountText(record?.estimate || 0), status: record?.status || 'Acquired' });
  const action = useAction();
  return <Page title="Diagnosis and status"><Field label="Diagnosed problems" {...field('diagnosis')} multiline /><Field label="Repair feasibility notes" {...field('feasibility')} multiline /><Field label="Estimated repair cost (PHP)" {...field('estimate')} money />
    <Choice label="Current status" value={form.status} options={(STATUSES[record?.jobType] || []).filter(s => !['Sold', 'Released'].includes(s))} onChange={status => setForm(f => ({ ...f, status }))} />
    <Text style={styles.small}>A write-off records the full accumulated investment as a loss. Complete a sale or customer release from the phone details screen.</Text>
    <ErrorText message={action.error} /><Button title="Save diagnosis and status" busy={action.busy} onPress={() => action.run(async () => {
      if (!record) throw new Error('This record no longer exists.');
      const patch = { diagnosis: form.diagnosis.trim(), feasibility: form.feasibility.trim(), estimate: parseMoney(form.estimate, 'Estimate') };
      Object.assign(patch, changeStatus({ ...record, diagnosis: patch.diagnosis }, form.status));
      if (form.status === 'Not Worth Repairing' && !await confirmAction('Write off this job?', `${money(totals(record).investment)} will be recorded as a loss.`)) return;
      await store.save(record.id, patch, `Diagnosis updated; status: ${form.status}`, version); navigation.goBack();
    })} /><BackCancel navigation={navigation} />
  </Page>;
}
export function SaleScreen({ route, navigation }) {
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const [version] = useState(record?.version);
  const { form, field } = useForm({ amount: '', date: today(), buyer: '', warranty: '' });
  const action = useAction();
  let preview = null;
  try { if (form.amount && record) preview = parseMoney(form.amount) - totals(record).investment; } catch {}
  return <Page title={record?.jobType === 'repair' ? 'Record payment' : 'Record sale'} subtitle="Save the final amount received and close this job.">
    <Field label={record?.jobType === 'repair' ? 'Amount charged (PHP)' : 'Selling price (PHP)'} {...field('amount')} money />
    {preview !== null && <View style={styles.panel}><Text style={styles.label}>Profit / loss after saving</Text><Text style={styles.metric}>{money(preview)}</Text></View>}
    <Field label="Payment date" {...field('date')} placeholder="YYYY-MM-DD" maxLength={10} /><Field label="Buyer or customer (optional)" {...field('buyer')} /><Field label="Warranty offered (optional)" {...field('warranty')} multiline maxLength={300} />
    <ErrorText message={action.error} /><Button title={record?.jobType === 'repair' ? 'Save payment and release phone' : 'Save sale'} busy={action.busy} onPress={() => action.run(async () => { if (!record) throw new Error('This record no longer exists.'); const patch = salePatch(record, form); await store.save(record.id, patch, `${patch.status}: ${money(patch.sale.amount)}`, version); navigation.goBack(); })} /><BackCancel navigation={navigation} />
  </Page>;
}
export function AccountScreen() {
  const store = useStore();
  const [workspace, setWorkspace] = useState('');
  const action = useAction();
  return <Page title={store.practice ? 'Practice workspace' : 'Staff account'}>
    <Text style={styles.body}>{store.practice ? 'Practice records remain on this device after you leave. Use fictional data here. They are not uploaded to Firebase.' : store.user?.email}</Text>
    {!store.practice && <><Text selectable style={styles.small}>Your user ID: {store.user?.uid}</Text><Text selectable style={styles.small}>Current workspace ID: {store.shopId}</Text>
      <Section title="Shared shop workspace"><Text style={styles.body}>Ask the project administrator to add your user ID as an active member of the shop workspace before switching.</Text><Field label="Shop workspace ID" value={workspace} onChangeText={setWorkspace} autoCapitalize="none" /><Button secondary title="Open shop workspace" disabled={action.busy} onPress={() => action.run(() => store.switchWorkspace(workspace))} /><Button secondary title="Open my private workspace" disabled={action.busy} onPress={() => action.run(() => store.switchWorkspace(store.user.uid))} /></Section></>}
    <Section title="Keep a copy"><Text style={styles.body}>Export the currently loaded records as a JSON backup. Treat backups as private because they can include customer references and financial amounts.</Text>
      <Button secondary title="Export records" disabled={store.loading || Boolean(store.error) || action.busy} onPress={() => action.run(async () => {
        const payload = JSON.stringify({ app: 'RefurbTrack', version: 1, exportedAt: new Date().toISOString(), practice: store.practice, records: store.records }, null, 2);
        if (Platform.OS === 'web') { const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = `refurbtrack-${today()}.json`; link.click(); URL.revokeObjectURL(url); }
        else await Share.share({ message: payload, title: 'RefurbTrack records backup' });
      })} />
    </Section>
    <Section title="About this release"><Text style={styles.body}>RefurbTrack 1.0.0 · CCE 106/L</Text><Text style={styles.small}>Alejo, Blagantio, Galvez, and Lapasaran</Text><Text style={styles.small}>Profit is revenue minus purchase, parts, and paid labor. Rent, tax, and other shop overhead are not included. Cloud changes require an internet connection.</Text></Section>
    <ErrorText message={action.error} /><Button title={store.practice ? 'Leave practice workspace' : 'Sign out'} disabled={action.busy} onPress={() => action.run(store.logout)} />
  </Page>;
}
