import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Smartphone, History, UserRound } from 'lucide-react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useStyles, useTheme } from './theme';
const icons = { Workshop: House, Records: Smartphone, History, Account: UserRound };
function Item({ route, focused, onPress }) {
  const { C } = useTheme();
  const s = useStyles(makeStyles);
  const progress = useSharedValue(focused ? 1 : 0);
  useEffect(() => { progress.value = withSpring(focused ? 1 : 0, { damping: 22, stiffness: 260, reduceMotion: ReduceMotion.System }); }, [focused]);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: 0.85 + progress.value * 0.15 }], opacity: 0.5 + progress.value * 0.5 }));
  const Icon = icons[route.name];
  return <Pressable accessibilityRole="tab" accessibilityLabel={route.name} accessibilityState={{ selected: focused }} onPress={onPress} style={s.item}>
    <Animated.View style={[s.icon, focused && s.selected, animated]}><Icon size={23} strokeWidth={focused ? 2.2 : 1.8} color={focused ? C.teal : C.muted} /></Animated.View>
    <Text style={[s.label, focused && { color: C.teal, fontWeight: '700' }]}>{route.name}</Text>
  </Pressable>;
}
export function WorkshopBar({ state, descriptors, navigation }) {
  const s = useStyles(makeStyles);
  const insets = useSafeAreaInsets();
  return <View style={[s.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}><View style={s.dock}>
    {state.routes.map((route, index) => <Item key={route.key} route={route} focused={state.index === index} onPress={() => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (state.index !== index && !event.defaultPrevented) navigation.navigate(route.name);
    }} />)}
  </View></View>;
}
const makeStyles = ({ C }) => StyleSheet.create({ wrap: { backgroundColor: C.paper, paddingHorizontal: 16, paddingTop: 8 }, dock: { backgroundColor: C.soft, borderRadius: 36, paddingHorizontal: 6, paddingVertical: 8, flexDirection: 'row', width: '100%', maxWidth: 680, alignSelf: 'center' }, item: { flex: 1, minHeight: 58, alignItems: 'center', justifyContent: 'center', gap: 3 }, icon: { width: 54, height: 32, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, selected: { backgroundColor: C.tonal }, label: { fontSize: 12, lineHeight: 18, color: C.muted } });
