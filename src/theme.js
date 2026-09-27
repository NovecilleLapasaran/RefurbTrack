import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightColors = {
  navy: '#12334B', teal: '#096B60', brand: '#279D8F', ink: '#183348',
  muted: '#4E6270', paper: '#F3F8F5', white: '#FFFFFF', line: '#7F9690',
  divider: '#D7E5DF', soft: '#DFEDE7', tonal: '#CAE8DD', navySoft: '#DFE9EF', danger: '#A32323', dangerSoft: '#FBEAE7',
  warning: '#805414', warningSoft: '#F8EEDB', onNavy: '#D9E8EC',
  surface: '#FFFFFF', onAccent: '#FFFFFF', ledger: '#12334B', ledgerLine: '#426073', activityMedium: '#A5D4C4',
};
export const darkColors = {
  ...lightColors,
  navy: '#DCECF6', teal: '#78D8BC', ink: '#E5F0EB', muted: '#A9BDB6',
  paper: '#101A1E', surface: '#19272D', line: '#6F9185', divider: '#354B45',
  soft: '#223630', tonal: '#294D41', navySoft: '#243B49',
  danger: '#FFB4AA', dangerSoft: '#4B2929', warning: '#F4CB84', warningSoft: '#473921',
  onAccent: '#102E26', ledger: '#153849', ledgerLine: '#567683', activityMedium: '#3B715D',
};
export const space = { xs: 4, sm: 8, md: 12, lg: 16, page: 20, section: 24, xl: 32 };
export const radius = { input: 16, button: 28, surface: 28, sheet: 32 };
export function createTheme(C) {
  const type = {
    title: { fontFamily: 'Comfortaa_700Bold', fontSize: 28, lineHeight: 38, color: C.navy, letterSpacing: -0.5 },
    heading: { fontFamily: 'Comfortaa_600SemiBold', fontSize: 19, lineHeight: 28, color: C.navy },
    body: { fontSize: 16, lineHeight: 24, color: C.ink },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: C.ink },
    small: { fontSize: 13, lineHeight: 19, color: C.muted },
    metric: { fontSize: 34, lineHeight: 42, fontWeight: '700', fontVariant: ['tabular-nums'], color: C.navy, letterSpacing: -0.6 },
  };
  const styles = StyleSheet.create({
    ...type,
    screen: { flex: 1, backgroundColor: C.paper },
    content: { flexGrow: 1, width: '100%', maxWidth: 680, alignSelf: 'center', padding: space.page, paddingBottom: space.xl, gap: space.section },
    row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm },
    section: { gap: space.md },
    panel: { backgroundColor: C.surface, padding: space.page, borderRadius: radius.surface, gap: space.lg },
    divider: { borderTopWidth: 1, borderTopColor: C.divider, paddingTop: space.lg, gap: space.sm },
    error: { ...type.body, color: C.danger },
    field: { gap: space.sm },
    header: { gap: space.sm },
    notice: { backgroundColor: C.soft, padding: space.md, borderRadius: radius.input, flexDirection: 'row', gap: space.sm, alignItems: 'center' },
    flex: { flex: 1 },
    subtle: { ...type.small, color: C.teal },
    choiceRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, paddingHorizontal: space.lg, borderBottomWidth: 1, borderColor: C.divider },
    selected: { backgroundColor: C.soft },
    selector: { minHeight: 52, borderRadius: radius.input, padding: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', gap: space.sm },
    iconButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.input },
    disclosure: { borderTopWidth: 1, borderColor: C.divider, paddingTop: space.sm, gap: space.md },
    disclosureHeader: { flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: space.md },
    empty: { paddingVertical: space.section, gap: space.sm },
    loading: { flexGrow: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', paddingVertical: space.xl, gap: space.lg },
    loadingText: { ...type.heading, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  });
  return { C, type, styles };
}

const themes = { light: createTheme(lightColors), dark: createTheme(darkColors) };
const Theme = createContext(null);
const THEME_KEY = 'refurbtrack.theme.v1';
export const useTheme = () => useContext(Theme);
export function useStyles(factory) {
  const { C, type, styles } = useTheme();
  return useMemo(() => factory({ C, type, styles }), [factory, C, type, styles]);
}
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(null);
  const [themeError, setThemeError] = useState('');
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_KEY).then(value => {
      if (active) setMode(value === 'dark' ? 'dark' : 'light');
    }).catch(() => {
      if (active) { setMode('light'); setThemeError('Could not load your appearance preference. Try changing it again.'); }
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (mode && Platform.OS !== 'web') Appearance.setColorScheme(mode);
  }, [mode]);
  const setDarkMode = async enabled => {
    const next = enabled ? 'dark' : 'light';
    try { await AsyncStorage.setItem(THEME_KEY, next); }
    catch { throw new Error('Could not save your appearance preference. Please try again.'); }
    setThemeError('');
    setMode(next);
  };
  if (!mode) return <View style={{ flex: 1, backgroundColor: lightColors.paper }} />;
  return <Theme.Provider value={{ ...themes[mode], dark: mode === 'dark', setDarkMode, themeError }}>{children}</Theme.Provider>;
}
export const motion = { damping: 24, stiffness: 320 };
