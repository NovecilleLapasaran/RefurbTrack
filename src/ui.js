import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from './store';
export const C = { navy: '#12334B', teal: '#096B60', ink: '#183348', muted: '#4E6270', paper: '#F4F6F5', white: '#FFFFFF', line: '#83938F', soft: '#DDEDE8', danger: '#A32323' };
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.paper },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, paddingBottom: 36, gap: 20 },
  title: { fontSize: 30, lineHeight: 38, fontWeight: '700', color: C.navy },
  heading: { fontSize: 21, lineHeight: 28, fontWeight: '700', color: C.navy },
  body: { fontSize: 16, lineHeight: 24, color: C.ink },
  small: { fontSize: 14, lineHeight: 21, color: C.muted },
  label: { fontSize: 15, lineHeight: 22, color: C.ink, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  section: { gap: 12 },
  panel: { backgroundColor: C.white, padding: 18, borderRadius: 12, gap: 14 },
  divider: { borderTopWidth: 1, borderTopColor: '#CED7D3', paddingTop: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: C.line, borderRadius: 7, minHeight: 50, paddingHorizontal: 13, paddingVertical: 12, fontSize: 16, color: C.ink, backgroundColor: C.white },
  button: { minHeight: 48, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 7, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.teal, backgroundColor: C.teal },
  buttonText: { color: C.white, fontSize: 16, lineHeight: 22, fontWeight: '600', textAlign: 'center' },
  error: { color: C.danger, fontSize: 16, lineHeight: 24 },
  metric: { fontSize: 31, lineHeight: 40, fontWeight: '700', fontVariant: ['tabular-nums'], color: C.navy },
});
export function Button({ title, onPress, secondary = false, danger = false, disabled = false, busy = false, style, ...props }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: disabled || busy }}
    disabled={disabled || busy} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.button, secondary && { backgroundColor: C.white, borderColor: danger ? C.danger : C.teal },
      danger && !secondary && { backgroundColor: C.danger, borderColor: C.danger },
      (disabled || busy) && { opacity: 0.55 }, pressed && { opacity: 0.75 },
      focused && { outlineWidth: 3, outlineStyle: 'solid', outlineColor: C.navy, outlineOffset: 3 }, style]} {...props}>
    <Text style={[styles.buttonText, secondary && { color: danger ? C.danger : C.teal }]}>{busy ? 'Saving…' : title}</Text>
  </Pressable>;
}
export function Field({ label, value, onChangeText, hint, multiline, money, ...props }) {
  const [focused, setFocused] = useState(false);
  return <View style={{ gap: 6 }}><Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} multiline={multiline}
      keyboardType={money ? 'decimal-pad' : 'default'} maxLength={multiline ? 1000 : 120}
      placeholderTextColor={C.muted} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={[styles.input, multiline && { minHeight: 100, textAlignVertical: 'top' }, focused && { borderColor: C.navy, borderWidth: 2 }]} {...props} />
    {hint ? <Text style={styles.small}>{hint}</Text> : null}</View>;
}
export function Choice({ label, value, options, onChange }) {
  return <View style={{ gap: 8 }}><Text style={styles.label}>{label}</Text><View style={styles.row}>{options.map(option => {
    const item = typeof option === 'string' ? { value: option, label: option } : option;
    return <Button key={item.value} title={item.label} secondary={value !== item.value} onPress={() => onChange(item.value)} accessibilityState={{ selected: value === item.value }} />;
  })}</View></View>;
}
export function Page({ children, title, subtitle }) {
  const { practice, notice, dismissNotice, fromCache } = useStore();
  return <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      {practice && <Text style={[styles.small, { color: C.teal, fontWeight: '600' }]}>Practice workspace · Saved only on this device</Text>}
      {fromCache && !practice && <Text accessibilityLiveRegion="polite" style={styles.small}>Waiting for a server connection. Displayed records may be cached; changes require internet.</Text>}
      {title && <View style={{ gap: 5 }}><Text accessibilityRole="header" style={styles.title}>{title}</Text>{subtitle && <Text style={styles.body}>{subtitle}</Text>}</View>}
      {notice ? <View style={styles.row}><Text accessibilityLiveRegion="polite" style={[styles.small, { flex: 1, color: C.teal }]}>{notice}</Text><Button secondary title="Dismiss" onPress={dismissNotice} /></View> : null}
      {children}
    </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
export function ErrorText({ message }) { return message ? <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.error}>{message}</Text> : null; }
export function Loading({ message = 'Loading records…' }) { return <View style={styles.section}><ActivityIndicator color={C.teal} /><Text accessibilityLiveRegion="polite" style={styles.body}>{message}</Text></View>; }
export function Section({ title, children }) { return <View style={styles.section}><Text accessibilityRole="header" style={styles.heading}>{title}</Text>{children}</View>; }
export function Line({ label, value, strong }) { return <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}><Text style={styles.body}>{label}</Text><Text style={[styles.body, { fontVariant: ['tabular-nums'] }, strong && { fontWeight: '700' }]}>{value}</Text></View>; }
