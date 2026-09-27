// Adapted from React Native Reusables (MIT); see THIRD_PARTY_NOTICES.md.
import React, { createContext, useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { motion, radius, useStyles, useTheme } from '../../src/theme';
const TextStyleContext = createContext(null);
export function ButtonText({ children }) { const s = useStyles(makeStyles); return <Text style={[s.text, useContext(TextStyleContext)]}>{children}</Text>; }
export function Button({ title, children, onPress, secondary, danger, variant, icon: Icon, disabled, busy, style, accessibilityState, ...props }) {
  const { C } = useTheme();
  const s = useStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const kind = variant || (secondary ? 'secondary' : 'default');
  const color = danger ? C.danger : kind === 'default' ? C.onAccent : C.teal;
  const blocked = disabled || busy;
  return <TextStyleContext.Provider value={{ color }}><Pressable role="button" accessibilityLabel={title}
    accessibilityState={{ ...accessibilityState, disabled: !!blocked, busy: !!busy }} disabled={blocked} onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onPressIn={() => { scale.value = withSpring(0.98, { ...motion, reduceMotion: ReduceMotion.System }); }}
    onPressOut={() => { scale.value = withSpring(1, { ...motion, reduceMotion: ReduceMotion.System }); }}
    style={[s.wrapper, blocked && s.disabled, focused && s.focus, style]} {...props}>
    <Animated.View style={[s.base, s[kind], danger && s.danger, animated]}>
      {busy ? <ActivityIndicator size="small" color={color} /> : Icon ? <Icon size={20} strokeWidth={1.8} color={color} /> : null}
      {title ? <ButtonText>{title}</ButtonText> : children}
    </Animated.View>
  </Pressable></TextStyleContext.Provider>;
}
const makeStyles = ({ C, type }) => StyleSheet.create({
  wrapper: { borderRadius: radius.button },
  base: { minHeight: 56, paddingHorizontal: 20, paddingVertical: 15, borderRadius: radius.button, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  default: { backgroundColor: C.teal }, secondary: { backgroundColor: C.soft },
  ghost: { backgroundColor: 'transparent', minHeight: 48, paddingHorizontal: 8 },
  danger: { backgroundColor: C.dangerSoft }, disabled: { opacity: 0.5 },
  focus: { outlineWidth: 3, outlineColor: C.navy, outlineStyle: 'solid', outlineOffset: 2 },
  text: { ...type.body, fontFamily: 'Comfortaa_700Bold', fontSize: 15, textAlign: 'center', flexShrink: 1 },
});
