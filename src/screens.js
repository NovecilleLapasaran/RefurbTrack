import React, { useRef, useState } from 'react';
import { Platform, Share, Text, View } from 'react-native';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { confirmAction } from '../components/ui/dialog';
import { DateField } from './date-field';
import { PhoneDetail } from './detail';
import { auth, cloudConfigured } from './firebase';
import { friendlyError, newId, useStore } from './store';
import { amountText, changeStatus, closed, completed, expensePatch, filterRecords, intake, JOBS, money, parseMoney, readyStatus, salePatch, STATUSES, summary, today, totals, validDate } from './domain.mjs';
import { Button, Choice, Disclosure, ErrorText, Field, Line, Loading, Page, Section } from './ui';
import { useTheme } from './theme';

function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = async fn => { if (busy) return; setBusy(true); setError(''); try { await fn(); } catch (e) { setError(friendlyError(e)); } finally { setBusy(false); } };
  return { busy, error, run };
}
function useForm(initial, protect = true) {
  const [form, setForm] = useState(initial);
  const baseline = useRef(JSON.stringify(initial));
  const saved = useRef(false);
  const navigation = useNavigation();
  const dirty = protect && JSON.stringify(form) !== baseline.current;
  usePreventRemove(dirty, async ({ data }) => {
    if (saved.current || await confirmAction('Discard changes?', 'Your edits have not been saved.', 'Discard changes')) navigation.dispatch(data.action);
  });
  const field = key => ({ value: form[key], onChangeText: value => setForm(current => ({ ...current, [key]: value })) });
  const finish = fn => { saved.current = true; fn(); };
  return { form, setForm, field, finish };
}
function BackCancel({ navigation }) {
  return <Button title="Cancel" variant="ghost" onPress={() => navigation.goBack()} />;
}
export function LoginScreen({ route }) {
  const { styles } = useTheme();
  const store = useStore();
  const [register, setRegister] = useState(!!route.params?.register);
  const [resetSent, setResetSent] = useState(false);
  const { form, field } = useForm({ email: '', password: '' }, false);
  const action = useAction();
  return <Page title={register ? "Let’s get started" : "Welcome back"} subtitle={register ? "Create your account to start tracking phones." : "Sign in to pick up where you left off."}>
    {cloudConfigured ? <Section title={register ? 'Create an account' : 'Sign in'}>
      <Field label="Email" {...field('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Field label="Password" {...field('password')} autoCapitalize="none" secureTextEntry autoComplete={register ? 'new-password' : 'current-password'} hint={register ? 'Use at least 8 characters.' : undefined} />
      <ErrorText message={action.error} />
      <Button title={register ? 'Create account' : 'Sign in'} busy={action.busy} onPress={() => action.run(async () => {
        if (register && form.password.length < 8) throw new Error('Use at least 8 characters for your password.');
        await (register ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, form.email.trim(), form.password);
      })} />
      <Button variant="ghost" title={register ? 'I already have an account' : 'Create an account'} onPress={() => setRegister(!register)} />
      {!register && <Button variant="ghost" title="Reset password" disabled={action.busy} onPress={() => action.run(async () => { if (!form.email.trim()) throw new Error('Enter your email first.'); await sendPasswordResetEmail(auth, form.email.trim()); setResetSent(true); })} />}
      {resetSent && <Text accessibilityLiveRegion="polite" style={styles.body}>If this email has an account, a reset link will arrive shortly.</Text>}
      {register && <Text style={styles.small}>Joining an existing shop? Ask the owner to arrange access with your email.</Text>}
    </Section> : <Section title="Sign-in is unavailable"><Text style={styles.body}>Please ask the shop owner for the latest app.</Text></Section>}
    <Text style={styles.small}>For the owner and technicians of AJ Cellphone Repair Shop and Accessories.</Text>
  </Page>;
}
export function IntakeScreen({ navigation, route }) {
  const { styles } = useTheme();
  const store = useStore();
  const previous = store.records.find(r => r.id === route.params?.id);
  const [version] = useState(previous?.version);
  const { form, setForm, field, finish } = useForm(previous ? { ...previous, purchase: amountText(previous.purchase) } : { jobType: 'resale', brand: '', model: '', condition: '', source: '', purchase: '', acquiredAt: today(), notes: '' });
  const action = useAction();
  return <Page title={previous ? 'Edit intake' : 'Add a phone'} subtitle="Keep one record from intake to final payment.">
    {previous ? <Text style={styles.label}>{JOBS[form.jobType]}</Text> : <Choice label="Job type" value={form.jobType} options={Object.entries(JOBS).map(([value, label]) => ({ value, label }))} onChange={jobType => setForm(f => ({ ...f, jobType }))} />}
    <Section title="The phone"><Field label="Brand" {...field('brand')} maxLength={60} placeholder="e.g. Samsung" /><Field label="Model" {...field('model')} maxLength={80} placeholder="e.g. Galaxy A15" />
    <Field label="Physical condition" {...field('condition')} multiline maxLength={500} placeholder="Visible damage and intake observations" />
    </Section><Section title="Intake details"><Field label={form.jobType === 'repair' ? 'Customer reference' : 'Acquisition source'} {...field('source')} placeholder={form.jobType === 'repair' ? 'Name or shop reference' : 'Walk-in seller, supplier, or other source'} />
    {form.jobType === 'resale' ? <Field label="Purchase price (PHP)" {...field('purchase')} money hint="Enter 0 if the phone was acquired at no cost." /> : <Text style={styles.body}>No purchase cost for customer repairs. Add parts and paid labor after intake.</Text>}
    <DateField label="Intake date" {...field('acquiredAt')} placeholder="YYYY-MM-DD" maxLength={10} /><Field label="Intake notes (optional)" {...field('notes')} multiline /></Section>
    <ErrorText message={action.error} /><Button title="Save phone record" busy={action.busy} onPress={() => action.run(async () => {
      if (route.params?.id && !previous) throw new Error('This record no longer exists.');
      const id = await store.save(previous?.id, intake(form, previous), previous ? 'Intake updated' : 'Phone record created', version); finish(() => navigation.replace('Detail', { id }));
    })} /><BackCancel navigation={navigation} />
  </Page>;
}
export const DetailScreen = PhoneDetail;
export function ExpenseScreen({ route, navigation }) {
  const { styles } = useTheme();
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const existing = record?.expenses.find(e => e.id === route.params.expenseId);
  const [version] = useState(record?.version);
  const [expenseId] = useState(existing?.id || newId());
  const { form, setForm, field, finish } = useForm({ kind: existing?.kind || 'Parts', name: existing?.name || '', amount: existing ? amountText(existing.amount) : '' });
  const action = useAction();
  return <Page title={existing ? 'Edit expense' : 'Add expense'} subtitle="What did this repair cost?">
    <Choice label="Expense type" value={form.kind} options={['Parts', 'Labor']} onChange={kind => setForm(f => ({ ...f, kind }))} />
    <Field label="Expense description" {...field('name')} placeholder={form.kind === 'Parts' ? 'e.g. Replacement display' : 'e.g. Outsourced board repair'} /><Field label="Expense amount (PHP)" {...field('amount')} money />
    <Text style={styles.small}>Enter what was paid. Use 0 for work you did yourself.</Text>
    <ErrorText message={action.error} /><Button title="Save expense" busy={action.busy} onPress={() => action.run(async () => { if (!record) throw new Error('This record no longer exists.'); await store.save(record.id, expensePatch(record, form, expenseId), `${existing ? 'Expense updated' : 'Expense added'}: ${form.name.trim()}`, version); finish(() => navigation.goBack()); })} /><BackCancel navigation={navigation} />
  </Page>;
}
export function ProgressScreen({ route, navigation }) {
  const { styles } = useTheme();
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const [version] = useState(record?.version);
  const { form, setForm, field, finish } = useForm({ diagnosis: record?.diagnosis || '', feasibility: record?.feasibility || '', estimate: amountText(record?.estimate || 0), status: record?.status || 'Acquired' });
  const action = useAction();
  return <Page title="Diagnosis and status"><Field label="Diagnosed problems" {...field('diagnosis')} multiline /><Field label="Repair feasibility notes" {...field('feasibility')} multiline /><Field label="Estimated repair cost (PHP)" {...field('estimate')} money />
    <Choice label="Current status" value={form.status} options={(STATUSES[record?.jobType] || []).filter(s => !['Sold', 'Released'].includes(s))} onChange={status => setForm(f => ({ ...f, status }))} />
    <Text style={styles.small}>Choose “Not Worth Repairing” only when you’re closing the job at a loss.</Text>
    <ErrorText message={action.error} /><Button title="Save diagnosis and status" busy={action.busy} onPress={() => action.run(async () => {
      if (!record) throw new Error('This record no longer exists.');
      const patch = { diagnosis: form.diagnosis.trim(), feasibility: form.feasibility.trim(), estimate: parseMoney(form.estimate, 'Estimate') };
      Object.assign(patch, changeStatus({ ...record, diagnosis: patch.diagnosis }, form.status));
      if (form.status === 'Not Worth Repairing' && !await confirmAction('Write off this job?', `${money(totals(record).investment)} will be recorded as a loss.`)) return;
      await store.save(record.id, patch, `Diagnosis updated; status: ${form.status}`, version); finish(() => navigation.goBack());
    })} /><BackCancel navigation={navigation} />
  </Page>;
}
export function SaleScreen({ route, navigation }) {
  const { styles } = useTheme();
  const store = useStore();
  const record = store.records.find(r => r.id === route.params.id);
  const [version] = useState(record?.version);
  const { form, field, finish } = useForm({ amount: '', date: today(), buyer: '', warranty: '' });
  const action = useAction();
  let preview = null;
  try { if (form.amount && record) preview = parseMoney(form.amount) - totals(record).investment; } catch {}
  return <Page title={record?.jobType === 'repair' ? 'Record payment' : 'Record sale'} subtitle="Save the final amount received and close this job.">
    <Field label={record?.jobType === 'repair' ? 'Amount charged (PHP)' : 'Selling price (PHP)'} {...field('amount')} money />
    {preview !== null && <View style={styles.panel}><Text style={styles.label}>Profit / loss after saving</Text><Text style={styles.metric}>{money(preview)}</Text></View>}
    <DateField label="Payment date" {...field('date')} placeholder="YYYY-MM-DD" maxLength={10} /><Field label="Buyer or customer (optional)" {...field('buyer')} /><Field label="Warranty offered (optional)" {...field('warranty')} multiline maxLength={300} />
    <ErrorText message={action.error} /><Button title={record?.jobType === 'repair' ? 'Save payment and release phone' : 'Save sale'} busy={action.busy} onPress={() => action.run(async () => { if (!record) throw new Error('This record no longer exists.'); const patch = salePatch(record, form); await store.save(record.id, patch, `${patch.status}: ${money(patch.sale.amount)}`, version); finish(() => navigation.goBack()); })} /><BackCancel navigation={navigation} />
  </Page>;
}
export { ShopAccount as AccountScreen } from './account';
