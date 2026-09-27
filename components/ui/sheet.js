import React, { useCallback, useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './button';
import { radius, useStyles, useTheme } from '../../src/theme';
export function Sheet({ open, onClose, title, children }) {
  const { type } = useTheme();
  const s = useStyles(makeStyles);
  const ref = useRef(null);
  const presented = useRef(false);
  const dismissing = useRef(false);
  const latestOpen = useRef(open);
  latestOpen.current = open;
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (dismissing.current) return;
    if (open) { presented.current = true; ref.current?.present(); }
    else if (presented.current) { dismissing.current = true; ref.current?.dismiss(); }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; });
    return () => sub.remove();
  }, [open, onClose]);
  const backdrop = useCallback(props => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />, []);
  const handleDismiss = () => {
    const reopen = dismissing.current && latestOpen.current;
    dismissing.current = false;
    presented.current = false;
    if (reopen) { presented.current = true; ref.current?.present(); }
    else onClose();
  };
  return <BottomSheetModal ref={ref} snapPoints={['78%']} enableDynamicSizing={false} enablePanDownToClose
    onDismiss={handleDismiss} backdropComponent={backdrop} keyboardBehavior="interactive" keyboardBlurBehavior="restore"
    android_keyboardInputMode="adjustResize" backgroundStyle={s.surface} handleIndicatorStyle={s.handle}>
    <BottomSheetScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <View style={s.header}><Text accessibilityRole="header" style={[type.heading, s.title]}>{title}</Text><Button title="Close" variant="ghost" onPress={onClose} /></View>
      {children}
    </BottomSheetScrollView>
  </BottomSheetModal>;
}
const makeStyles = ({ C }) => StyleSheet.create({ surface: { backgroundColor: C.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet }, handle: { backgroundColor: C.line, width: 36 }, content: { paddingHorizontal: 20, gap: 20, width: '100%', maxWidth: 680, alignSelf: 'center' }, header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, title: { flex: 1 } });
