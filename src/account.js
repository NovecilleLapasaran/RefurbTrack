import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FileDown, LogOut, Moon, Sun } from 'lucide-react-native';
import Animated, { ReduceMotion, ZoomIn } from 'react-native-reanimated';
import { Button, Disclosure, ErrorText, Page } from './ui';
import { useStyles, useTheme } from './theme';
import { useStore } from './store';
import { shareReport } from './report';
import appConfig from '../app.json';
function AppearanceIcon(props) {
  const { dark } = useTheme();
  const Icon = dark ? Moon : Sun;
  return <Animated.View key={dark ? 'dark' : 'light'} entering={ZoomIn.duration(220).reduceMotion(ReduceMotion.System)}><Icon {...props} /></Animated.View>;
}
export function ShopAccount() {
  const { C, styles, dark, setDarkMode, themeError } = useTheme();
  const s = useStyles(makeStyles);
  const store = useStore();
  const [busy, setBusy] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [error, setError] = useState('');
  const run = async fn => { if (busy) return; setBusy(true); setError(''); try { await fn(); } catch(e) { setError(e); } finally { setBusy(false); } };
  return <Page top title="Your shop" subtitle="Your account and useful tools" accessory={
    <Button title={dark ? 'Dark' : 'Light'} icon={AppearanceIcon} secondary disabled={busy}
      accessibilityLabel={dark ? 'Switch to light mode' : 'Switch to dark mode'} accessibilityState={{ selected: dark }}
      onPress={() => run(() => setDarkMode(!dark))} />
  }>
    <View style={s.identity}><Image source={require('../assets/refurbtrack-logo.png')} style={s.logo} resizeMode="contain" />
      <View style={s.flex}><Text style={styles.heading}>{store.shopName || 'My shop'}</Text><Text style={styles.body}>{store.user?.email || 'Practice account'}</Text></View></View>
    <View style={s.report}><FileDown size={28} color={C.teal} strokeWidth={1.8} /><Text style={styles.heading}>Your records, ready to share</Text><Text style={styles.body}>Save a readable report of your phones, costs and earnings.</Text>
      <Button title={savingReport ? 'Preparing report…' : 'Save shop report'} icon={FileDown} busy={savingReport} disabled={busy || store.loading || !!store.error || !store.records.length} onPress={() => run(async () => {
        setSavingReport(true);
        try { await shareReport(store.records, store.shopName || 'My shop'); }
        finally { setSavingReport(false); }
      })} />
      {!store.records.length && <Text style={styles.small}>Your report will be available after adding a phone.</Text>}
    </View>
    <ErrorText message={error || themeError || store.error} />
    <Disclosure title="How your totals work"><Text style={styles.body}>Costs include the phone’s purchase price, parts and paid labor. Profit is the payment received minus those costs.</Text><Text style={styles.body}>Phones still being repaired don’t have a final profit yet. Rent, tax and other shop expenses are not included.</Text></Disclosure>
    <Disclosure title="Working with your team"><Text style={styles.body}>Ask your shop owner to arrange access using your sign-in email. Once added, sign in again to open the shop’s records.</Text><Text style={styles.small}>Your records are saved to your account. An internet connection is needed to save changes.</Text></Disclosure>
    <Button title="Sign out" secondary icon={LogOut} disabled={busy} onPress={() => run(store.logout)} />
    <Text style={s.version}>RefurbTrack · {appConfig.expo.version}</Text>
  </Page>;
}
const makeStyles = ({ C, styles }) => StyleSheet.create({ identity:{flexDirection:'row',gap:16,alignItems:'center',paddingVertical:8},logo:{width:72,height:72},flex:{flex:1,gap:8},report:{backgroundColor:C.tonal,borderRadius:28,padding:24,gap:16},version:{...styles.small,textAlign:'center'} });
