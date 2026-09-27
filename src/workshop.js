import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, Plus, Search, SlidersHorizontal, Smartphone, Wrench } from 'lucide-react-native';
import { useStore } from './store';
import { closed, filterRecords, JOBS, money, STATUSES, summary, totals, validDate } from './domain.mjs';
import { Button, Choice, EmptyState, ErrorText, Field, IconButton, Line, Loading, Page, Section, Sheet } from './ui';
import { ActivityCalendar } from './activity-calendar';
import { DateField } from './date-field';
import { radius, useStyles, useTheme } from './theme';
export function Status({ value }) {
  const { C, styles } = useTheme();
  const tone = value === 'Not Worth Repairing' ? C.danger : ['Waiting for Parts', 'Unsold'].includes(value) ? C.warning : C.teal;
  return <Text style={[styles.small, { color: tone, fontWeight: '600' }]}>{value}</Text>;
}
export function RecordRow({ record, navigation }) {
  const { C, styles } = useTheme();
  const s = useStyles(makeStyles);
  const t = totals(record);
  const Icon = record.jobType === 'repair' ? Wrench : Smartphone;
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${record.brand} ${record.model}, ${record.status}`} onPress={() => navigation.navigate('Detail', { id: record.id })}
    style={({ pressed, focused }) => [s.record, pressed && { backgroundColor: C.soft }, focused && { outlineWidth: 2, outlineColor: C.teal }]}>
    <View style={s.deviceIcon}><Icon size={22} strokeWidth={1.8} color={C.navy} /></View>
    <View style={s.recordBody}><Text style={s.device}>{record.brand} {record.model}</Text><Status value={record.status} />
      <Text style={styles.small}>{closed(record) ? 'Profit / loss' : 'Invested'} <Text style={s.amount}>{money(t.profit ?? t.investment)}</Text></Text>
    </View><ChevronRight size={20} color={C.muted} />
  </Pressable>;
}
export function HomeScreen({ navigation, route }) {
  const { C, styles } = useTheme();
  const s = useStyles(makeStyles);
  const tab = route.name;
  const store = useStore();
  const [query, setQuery] = useState('');
  useEffect(() => { if (route.params?.query !== undefined) setQuery(route.params.query); }, [route.params]);
  const [status, setStatus] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  let dateError = '';
  try { if (from) validDate(from, 'From date', true); if (to) validDate(to, 'To date', true); if (from && to && from > to) throw new Error('From date must be on or before To date.'); } catch (e) { dateError = e.message; }
  const all = filterRecords(store.records, { query, status, jobType, from: dateError ? '' : from, to: dateError ? '' : to, history: tab === 'History' });
  const sums = summary(store.records);
  const ready = store.records.filter(r => ['Ready for Sale', 'Ready for Pickup'].includes(r.status)).length;
  const filterCount = Number(jobType !== 'All') + Number(status !== 'All') + Number(Boolean(from || to));
  const clear = () => { setQuery(''); setStatus('All'); setJobType('All'); setFrom(''); setTo(''); };
  return <Page top title={tab === 'Workshop' ? 'Your workshop' : tab} subtitle={tab === 'Workshop' ? 'Repairs and costs at a glance.' : tab === 'History' ? 'Paid jobs and write-offs' : 'Find a phone or update a repair.'}
    accessory={tab === 'Workshop' ? <Image source={require('../assets/refurbtrack-logo.png')} style={{ width: 52, height: 52 }} resizeMode="contain" /> : tab !== 'History' ? <IconButton icon={Plus} label="Add phone record" onPress={() => navigation.navigate('Intake')} /> : null}>
    {store.loading ? <Loading /> : store.error ? <><ErrorText message={store.error} /><Button title="Reload records" onPress={store.retry} /></> : tab === 'Workshop' ? <>
      <View style={s.ledger}>
        <View style={s.ledgerHeader}><Text style={s.ledgerLabel}>Money in open jobs</Text><Text style={s.ledgerMeta}>{sums.active} open</Text></View>
        <Text style={s.balance}>{money(sums.invested)}</Text>
        <View style={s.ledgerRule} />
        <View style={s.ledgerHeader}><Text style={s.ledgerLabel}>Profit from closed jobs</Text><Text style={s.profit}>{money(sums.profit)}</Text></View>
        <Text style={s.ledgerMeta}>{sums.completed} paid · {sums.writtenOff} written off</Text>
      </View>
      <Button title="Add phone record" icon={Plus} onPress={() => navigation.navigate('Intake')} />
      <View style={s.workline}><Pressable accessibilityRole="button" accessibilityLabel="Show phones ready for payment" style={s.workStat} onPress={() => navigation.navigate('Records', { query: 'Ready' })}><Text style={s.count}>{ready}</Text><Text style={styles.small}>Ready for payment</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Show phones waiting for parts" style={[s.workStat, { backgroundColor: C.navySoft }]} onPress={() => navigation.navigate('Records', { query: 'Waiting for Parts' })}><Text style={s.count}>{store.records.filter(r => r.status === 'Waiting for Parts').length}</Text><Text style={styles.small}>Waiting for parts</Text></Pressable></View>
      <ActivityCalendar records={store.records} navigation={navigation} />
      <Section title="Recent work" action={<Button title="View all" variant="ghost" onPress={() => navigation.navigate('Records')} />}>
        {store.records.length ? <View style={s.list}>{filterRecords(store.records).slice(0, 5).map(r => <RecordRow key={r.id} record={r} navigation={navigation} />)}</View> : <EmptyState title="Your first phone starts here" detail="Add a resale phone or customer repair to track its progress and costs." />}
      </Section>
      <Line label="Recorded revenue · all time" value={money(sums.revenue)} />

    </> : <>
      <View style={s.search}><View style={s.searchField}><Field label="Search records" value={query} onChangeText={setQuery} placeholder="Brand, model, source or status" /></View>
        <IconButton icon={SlidersHorizontal} label={filterCount ? `Filters, ${filterCount} active` : 'Filter records'} onPress={() => setFiltersOpen(true)} /></View>
      <View style={styles.row}><Text accessibilityLiveRegion="polite" style={[styles.small, { flex: 1 }]}>{all.length} {all.length === 1 ? 'record' : 'records'}{filterCount ? ` · ${filterCount} filters` : ''}</Text>{(query || filterCount > 0) && <Button title="Clear" variant="ghost" onPress={clear} />}</View>
      {dateError ? <ErrorText message={dateError} /> : null}
      {!all.length ? <EmptyState title={tab === 'History' && !filterCount && !query ? 'No closed jobs yet' : 'No phones in this view'} detail={tab === 'History' && !filterCount && !query ? 'Completed payments and written-off jobs will appear here.' : 'Try another search or clear the filters. New phones can be added with the + button.'} /> : <View style={s.list}>{all.map(r => <RecordRow key={r.id} record={r} navigation={navigation} />)}</View>}
    </>}
    <Sheet title="Filter records" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
      <Choice label="Job type" value={jobType} options={[{ value: 'All', label: 'All jobs' }, ...Object.entries(JOBS).map(([value, label]) => ({ value, label }))]} onChange={v => { setJobType(v); setStatus('All'); }} />
      <Choice label="Status" value={status} options={['All', ...new Set(jobType === 'All' ? [...STATUSES.resale, ...STATUSES.repair] : STATUSES[jobType])]} onChange={setStatus} />
      <DateField label="From intake date" value={from} onChangeText={setFrom} placeholder="YYYY-MM-DD" maxLength={10} />
      <DateField label="To intake date" value={to} onChangeText={setTo} placeholder="YYYY-MM-DD" maxLength={10} />
      <ErrorText message={dateError} /><Button title="Show records" disabled={!!dateError} onPress={() => setFiltersOpen(false)} /><Button secondary title="Clear filters" onPress={clear} />
    </Sheet>
  </Page>;
}
const makeStyles = ({ C, styles }) => StyleSheet.create({
  ledger: { backgroundColor: C.ledger, borderRadius: radius.surface, padding: 24, gap: 12 },
  ledgerHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  ledgerLabel: { ...styles.label, color: C.onNavy }, ledgerMeta: { ...styles.small, color: C.onNavy },
  balance: { ...styles.metric, color: C.white }, profit: { ...styles.heading, color: C.white, fontVariant: ['tabular-nums'] },
  ledgerRule: { height: 1, backgroundColor: C.ledgerLine, marginVertical: 6 },
  workline: { flexDirection: 'row', gap: 12 }, workStat: { flex: 1, gap: 8, backgroundColor: C.tonal, padding: 20, borderRadius: 24, minHeight: 108 }, count: { ...styles.heading, fontSize: 24, lineHeight: 30 },
  list: { backgroundColor: C.surface, borderRadius: radius.surface, overflow: 'hidden' },
  record: { paddingHorizontal: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 2, borderColor: C.paper },
  deviceIcon: { backgroundColor: C.soft, padding: 12, borderRadius: 20 }, recordBody: { flex: 1, gap: 4 },
  device: { ...styles.body, fontWeight: '600' }, amount: { color: C.ink, fontWeight: '600', fontVariant: ['tabular-nums'] },
  search: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' }, searchField: { flex: 1 },
});
