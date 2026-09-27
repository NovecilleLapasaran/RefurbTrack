import React, { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Check, ChevronDown, ChevronRight, Copy, Eye, EyeOff, Hourglass, Share2, X } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, ReduceMotion, useReducedMotion } from 'react-native-reanimated';
import { useStore } from './store';
import { useTheme } from './theme';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sheet } from '../components/ui/sheet';
import { diagnosticReport, friendlyError } from './error-report.mjs';
import appConfig from '../app.json';
export { Button, Sheet };
export function IconButton({ icon: Icon, label, onPress, danger, disabled }) {
  const { C, styles } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={({ pressed, focused }) => [styles.iconButton, pressed && styles.selected, focused && { outlineWidth: 2, outlineColor: C.teal }, disabled && { opacity: 0.4 }]}>
    <Icon size={22} strokeWidth={1.8} color={danger ? C.danger : C.navy} />
  </Pressable>;
}
export function Field({ label, hint, money, secureTextEntry, ...props }) {
  const { styles } = useTheme();
  const [visible, setVisible] = useState(false);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text>
    <View style={secureTextEntry ? { position: 'relative' } : undefined}>
      <Input accessibilityLabel={label} keyboardType={money ? 'decimal-pad' : undefined} secureTextEntry={secureTextEntry && !visible}
        style={secureTextEntry ? { paddingRight: 56 } : undefined} {...props} />
      {secureTextEntry && <View style={{ position: 'absolute', right: 4, top: 4 }}><IconButton icon={visible ? EyeOff : Eye} label={visible ? 'Hide password' : 'Show password'} onPress={() => setVisible(!visible)} /></View>}
    </View>{hint ? <Text style={styles.small}>{hint}</Text> : null}
  </View>;
}
export function Choice({ label, value, options, onChange }) {
  const { C, styles } = useTheme();
  const [open, setOpen] = useState(false);
  const items = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  const choose = next => { if (next !== value && Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {}); onChange(next); setOpen(false); };
  const rows = items.map(item => <Pressable key={item.value} accessibilityRole="radio" accessibilityLabel={item.label}
    accessibilityState={{ checked: value === item.value }} aria-checked={value === item.value} onPress={() => choose(item.value)}
    style={({ pressed }) => [styles.choiceRow, (value === item.value || pressed) && styles.selected]}>
    <Text style={[styles.body, styles.flex, value === item.value && { fontWeight: '600' }]}>{item.label}</Text>
    {value === item.value && <Check size={20} color={C.teal} />}
  </Pressable>);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text>
    {items.length <= 3 ? <View accessibilityRole="radiogroup">{rows}</View> : <>
      <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${items.find(i => i.value === value)?.label || value}`} onPress={() => setOpen(true)} style={styles.selector}>
        <Text style={[styles.body, styles.flex]}>{items.find(i => i.value === value)?.label || value}</Text><ChevronDown size={20} color={C.muted} />
      </Pressable><Sheet title={label} open={open} onClose={() => setOpen(false)}>{rows}</Sheet>
    </>}
  </View>;
}
export function Page({ children, title, subtitle, top = false, accessory, footer }) {
  const { C, styles } = useTheme();
  const { practice, notice, dismissNotice, fromCache } = useStore();
  const headerHeight = useHeaderHeight();
  return <SafeAreaView style={styles.screen} edges={top ? ['top', 'left', 'right'] : ['bottom', 'left', 'right']}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={headerHeight}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content}>
        {title && <View style={styles.header}><View style={styles.row}><Text accessibilityRole="header" style={[styles.title, styles.flex]}>{title}</Text>{accessory}</View>{subtitle && <Text style={styles.small}>{subtitle}</Text>}</View>}
        {practice && <Text style={styles.subtle}>Practice · Saved on this device</Text>}
        {fromCache && !practice && <Text accessibilityLiveRegion="polite" style={styles.small}>Connecting to your shop… Check your internet before saving changes.</Text>}
        {notice ? <View style={styles.notice}><Text accessibilityLiveRegion="polite" style={[styles.small, styles.flex, { color: C.teal }]}>{notice}</Text><IconButton icon={X} label="Dismiss notification" onPress={dismissNotice} /></View> : null}
        {children}
      </ScrollView>{footer}
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
export function ErrorText({ message }) {
  const { styles } = useTheme();
  if (!message) return null;
  return typeof message === 'string'
    ? <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.error}>{message}</Text>
    : <ErrorDetails error={message} />;
}
function ErrorDetails({ error }) {
  const { C, styles } = useTheme();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const report = useMemo(() => diagnosticReport(error, {
    App: `${appConfig.expo.version} (Android build ${appConfig.expo.android.versionCode})`,
    Platform: Platform.OS,
    OS: Platform.OS === 'web' ? 'Browser' : Platform.constants?.Release || Platform.Version,
    'Android API': Platform.OS === 'android' ? Platform.Version : 'Not applicable',
    Manufacturer: Platform.constants?.Manufacturer,
    Model: Platform.constants?.Model,
  }), [error]);
  const send = async copy => {
    if (busy) return;
    setBusy(true); setFeedback(null);
    try {
      if (copy) {
        if (!await Clipboard.setStringAsync(report)) throw new Error('Clipboard unavailable');
        setFeedback({ error, text: 'Details copied. Paste them into a message to your developer.' });
      } else await Share.share({ title: 'RefurbTrack error report', message: report });
    } catch {
      setFeedback({ error, text: copy ? 'Could not copy. Select the details below to copy them manually.' : 'Could not open sharing. Copy the details and send them in a message instead.' });
    } finally { setBusy(false); }
  };
  return <View style={[styles.panel, { backgroundColor: C.dangerSoft }]}>
    <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.error}>{friendlyError(error)}</Text>
    <Disclosure title="Technical details">
      <Text style={styles.small}>Includes app, phone, system and error details. Review before sending to your developer.</Text>
      <View style={styles.row}><Button secondary title="Copy details" icon={Copy} disabled={busy} onPress={() => send(true)} /><Button secondary title="Share" icon={Share2} disabled={busy} onPress={() => send(false)} /></View>
      {feedback?.error === error && <Text accessibilityLiveRegion="polite" style={styles.small}>{feedback.text}</Text>}
      <Text selectable style={styles.small}>{report}</Text>
    </Disclosure>
  </View>;
}
export function Loading({ message = 'Loading your phone records…' }) {
  const { C, styles } = useTheme();
  const reducedMotion = useReducedMotion();
  return <Animated.View entering={FadeIn.duration(240).reduceMotion(ReduceMotion.System)} style={styles.loading} accessibilityState={{ busy: true }}>
    {reducedMotion ? <Hourglass size={28} strokeWidth={1.8} color={C.teal} /> : <ActivityIndicator size="large" color={C.teal} />}
    {message && <Text accessibilityLiveRegion="polite" style={styles.loadingText}>{message}</Text>}
  </Animated.View>;
}
export function Section({ title, children, action }) { const { styles } = useTheme(); return <View style={styles.section}><View style={styles.row}><Text accessibilityRole="header" style={[styles.heading, styles.flex]}>{title}</Text>{action}</View>{children}</View>; }
export function Disclosure({ title, children }) {
  const { C, styles } = useTheme();
  const [open, setOpen] = useState(false);
  const Icon = open ? ChevronDown : ChevronRight;
  return <View style={styles.disclosure}><Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={styles.disclosureHeader}>
    <Text style={[styles.heading, styles.flex]}>{title}</Text><Icon size={20} color={C.muted} />
  </Pressable>{open && <Animated.View entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)} style={styles.section}>{children}</Animated.View>}</View>;
}
export function EmptyState({ title, detail, children }) { const { styles } = useTheme(); return <View style={styles.empty}><Text style={styles.heading}>{title}</Text><Text style={styles.body}>{detail}</Text>{children}</View>; }
export function Line({ label, value, strong }) { const { C, styles } = useTheme(); return <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}><Text style={[styles.body, { color: C.muted }]}>{label}</Text><Text style={[styles.body, { fontVariant: ['tabular-nums'] }, strong && { fontWeight: '700' }]}>{value}</Text></View>; }
