import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { activityByDay, activityPerson, activityTime, displayDate, localDay, monthCells } from './activity.mjs';
import { Button, IconButton, Sheet } from './ui';
import { useStyles, useTheme } from './theme';
import { useStore } from './store';
export function ActivityCalendar({ records, navigation }) {
  const { C, styles } = useTheme();
  const s = useStyles(makeStyles);
  const { user } = useStore();
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12));
  const [selected, setSelected] = useState(null);
  const [availableWidth, setAvailableWidth] = useState(336);
  const byDay = useMemo(() => activityByDay(records), [records]);
  const cells = monthCells(month.getFullYear(), month.getMonth());
  const today = localDay(new Date());
  const currentMonth = month.getFullYear() === new Date().getFullYear() && month.getMonth() === new Date().getMonth();
  const move = offset => setMonth(d => new Date(d.getFullYear(), d.getMonth() + offset, 1, 12));
  const events = byDay.get(selected) || [];
  const cellWidth = Math.max(48, availableWidth / 7);
  return <View style={s.section}>
    <View style={styles.header}>
      <View style={styles.row}><Text accessibilityRole="header" style={[styles.heading, styles.flex]}>Shop activity</Text>{!currentMonth && <Button title="Today" variant="ghost" onPress={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12))} />}</View>
      <Text style={styles.small}>Tap a date to see recorded changes.</Text>
    </View>
    <View style={s.calendar}>
      <View style={s.monthBar}><IconButton icon={ChevronLeft} label="Previous month" onPress={() => move(-1)} /><Text accessibilityLiveRegion="polite" style={styles.label}>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text><IconButton icon={ChevronRight} label="Next month" disabled={currentMonth} onPress={() => move(1)} /></View>
      <View onLayout={e => setAvailableWidth(e.nativeEvent.layout.width)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={availableWidth < 336}>
          <View style={{ width: cellWidth * 7 }}>
            <View style={s.week}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((name, i) => <Text key={i} style={[s.weekday, { width: cellWidth }]}>{name}</Text>)}</View>
            <View style={s.grid}>{cells.map((date, i) => {
              if (!date) return <View key={`blank-${i}`} style={{ width: cellWidth, height: 52 }} />;
              const count = byDay.get(date)?.length || 0;
              const dark = count >= 5;
              return <Pressable key={date} accessibilityRole="button" accessibilityLabel={`${displayDate(date)}, ${count} ${count === 1 ? 'update' : 'updates'}${date === today ? ', today' : ''}`}
                accessibilityState={{ selected: selected === date, disabled: date > today }} disabled={date > today} onPress={() => setSelected(date)} style={{ width: cellWidth, minHeight: 52, padding: 3 }}>
                <View style={[s.day, { backgroundColor: dark ? C.teal : count >= 2 ? C.activityMedium : count ? C.tonal : C.paper }, date === today && s.today, date > today && s.future]}>
                  <Text style={[s.dayText, dark && { color: C.onAccent }]}>{Number(date.slice(-2))}</Text>
                  {count > 0 && <View style={[s.dot, dark && { backgroundColor: C.onAccent }]} />}
                </View>
              </Pressable>;
            })}</View>
          </View>
        </ScrollView>
      </View>
      <View style={s.legend}><Text style={styles.small}>Fewer updates</Text>{[C.paper, C.tonal, C.activityMedium, C.teal].map(color => <View key={color} style={[s.swatch, { backgroundColor: color }]} />)}<Text style={styles.small}>More</Text></View>
    </View>
    <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected ? displayDate(selected) : 'Activity'}>
      <Text style={styles.heading}>{events.length ? `${events.length} ${events.length === 1 ? 'update' : 'updates'}` : 'No activity recorded'}</Text>
      {!events.length && <Text style={styles.body}>No phone records were updated on this date.</Text>}
      {events.map(event => <Pressable key={event.key} accessibilityRole="button" accessibilityLabel={`Open ${event.phone}: ${event.action}`} style={s.event} onPress={() => { setSelected(null); navigation.navigate('Detail', { id: event.recordId }); }}>
        <Text style={styles.label}>{event.phone}</Text><Text style={styles.body}>{event.action}</Text><Text style={styles.small}>{activityTime(event.at)} · {activityPerson(event, user)}</Text>
      </Pressable>)}
    </Sheet>
  </View>;
}
const makeStyles = ({ C, styles }) => StyleSheet.create({ section: { gap: 12 }, calendar: { backgroundColor: C.soft, marginHorizontal: -8, borderRadius: 28, padding: 8, gap: 12 }, monthBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, week: { flexDirection: 'row' }, weekday: { ...styles.small, textAlign: 'center', paddingVertical: 8 }, grid: { flexDirection: 'row', flexWrap: 'wrap' }, day: { flex: 1, minHeight: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent', gap: 2 }, dayText: { ...styles.label }, today: { borderColor: C.navy }, future: { opacity: 0.4 }, dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.teal }, legend: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 5, paddingHorizontal: 8 }, swatch: { width: 14, height: 14, borderRadius: 4 }, event: { padding: 16, backgroundColor: C.soft, borderRadius: 16, gap: 6 } });
