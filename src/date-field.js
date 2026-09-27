import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import { displayDate, dateInputToISO } from './activity.mjs';
import { Field } from './ui';
import { useTheme } from './theme';
export function DateField({ label, value, onChangeText, optional = false }) {
  const { C, styles, dark } = useTheme();
  const [open, setOpen] = useState(false);
  if (Platform.OS === 'web') return <Field label={label} value={displayDate(value)} onChangeText={text => onChangeText(dateInputToISO(text))} placeholder="MM-DD-YYYY" maxLength={10} />;
  const parts=(value || '').split('-').map(Number);
  const date=parts.length===3 && parts[0] ? new Date(parts[0],parts[1]-1,parts[2],12) : new Date();
  const selected=(_, next) => { setOpen(false); if(next) onChangeText(`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-${String(next.getDate()).padStart(2,'0')}`); };
  const show=()=>{ if(Platform.OS==='android') DateTimePickerAndroid.open({value:date,mode:'date',maximumDate:new Date(),onChange:selected}); else setOpen(true); };
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value || 'Choose date'}`} onPress={show} style={styles.selector}><CalendarDays color={C.teal} size={21}/><Text style={[styles.body,styles.flex]}>{value ? displayDate(value) : 'Choose date'}</Text></Pressable>{open && <DateTimePicker value={date} mode="date" display="inline" themeVariant={dark ? 'dark' : 'light'} maximumDate={new Date()} onChange={selected}/>}</View>;
}
