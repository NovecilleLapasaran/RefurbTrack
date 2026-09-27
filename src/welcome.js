import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, Check, Smartphone, Wrench } from 'lucide-react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { Button, Page } from './ui';
import { useStyles, useTheme } from './theme';
export function WelcomeScreen({ navigation }) {
  const { C } = useTheme();
  const s = useStyles(makeStyles);
  return <Page top>
    <View style={s.brand}><Image source={require('../assets/refurbtrack-logo.png')} style={s.logo} resizeMode="contain" accessibilityLabel="RefurbTrack logo" /><Text style={s.brandName}>RefurbTrack</Text></View>
    <Animated.View entering={FadeInDown.duration(320).reduceMotion(ReduceMotion.System)} style={s.intro}>
      <Text accessibilityRole="header" style={s.title}>From broken phones{ '\n' }to better profits.</Text>
      <Text style={s.description}>Record repairs, track costs and check your profit.</Text>
    </Animated.View>
    <View style={s.illustration} accessibilityLabel="Track a phone through intake, repair, and completion">
      <View style={s.phone}><View style={s.speaker} /><Wrench color={C.teal} size={48} strokeWidth={1.6} /><View style={s.phoneLine} /><View style={s.phoneLineShort} /><View style={s.phoneCheck}><Check size={22} color={C.onAccent} /></View></View>
      <View style={s.steps}><Step icon={Smartphone} title="Take it in" text="Phone & condition" /><Step icon={Wrench} title="Track the work" text="Parts & repair costs" /><Step icon={Check} title="See the result" text="Payment & profit" /></View>
    </View>
    <View style={s.actions}><Button title="Sign in" icon={ArrowRight} onPress={() => navigation.navigate('Login')} /><Button title="Create an account" secondary onPress={() => navigation.navigate('Login', { register: true })} /></View>
    <Text style={s.footer}>Made for AJ Cellphone Repair Shop{ '\n' }and Accessories</Text>
  </Page>;
}
function Step({ icon: Icon, title, text }) { const { C, styles } = useTheme(); const s = useStyles(makeStyles); return <View style={s.step}><Icon color={C.teal} size={20} strokeWidth={1.8} /><View style={s.stepText}><Text style={styles.label}>{title}</Text><Text style={styles.small}>{text}</Text></View></View>; }
const makeStyles = ({ C, styles }) => StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 }, logo: { width: 58, height: 58 }, brandName: { ...styles.heading, fontSize: 22 },
  intro: { gap: 16, paddingTop: 12 }, title: { ...styles.title, fontSize: 36, lineHeight: 47 }, description: { ...styles.body, color: C.muted, lineHeight: 26 },
  illustration: { backgroundColor: C.tonal, borderRadius: 32, borderTopRightRadius: 64, padding: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'center' },
  phone: { width: 100, height: 168, borderRadius: 24, borderWidth: 4, borderColor: C.navy, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center', gap: 10, transform: [{rotate:'-6deg'}] },
  speaker: { position: 'absolute', top: 9, width: 25, height: 4, backgroundColor: C.navy, borderRadius: 4 }, phoneLine: { width: 48, height: 5, backgroundColor: C.tonal, borderRadius: 4 }, phoneLineShort: { width: 32, height: 5, backgroundColor: C.tonal, borderRadius: 4 },
  phoneCheck: { position: 'absolute', right: -14, bottom: 16, width: 38, height: 38, borderRadius: 14, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  steps: { flex: 1, minWidth: 135, gap: 22 }, step: { flexDirection: 'row', gap: 10, alignItems: 'center' }, stepText: { flex: 1, gap: 3 }, actions: { gap: 12 }, footer: { ...styles.small, textAlign: 'center', paddingBottom: 8 },
});
