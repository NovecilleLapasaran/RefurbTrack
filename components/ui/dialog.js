// Adapted from React Native Reusables' dialog composition (MIT).
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Dialog from '@rn-primitives/dialog';
import { Button } from './button';
import { radius, useStyles, useTheme } from '../../src/theme';
let present;
export function confirmAction(title, message, confirmLabel = 'Confirm') {
  return new Promise(resolve => { if (present) present({ title, message, confirmLabel, resolve }); else resolve(false); });
}
export function ConfirmationHost() {
  const { type } = useTheme();
  const s = useStyles(makeStyles);
  const [request, setRequest] = useState(null);
  useEffect(() => { present = setRequest; return () => { present = null; }; }, []);
  const finish = answer => { request?.resolve(answer); setRequest(null); };
  return <Dialog.Root open={!!request} onOpenChange={open => { if (!open) finish(false); }}>
    <Dialog.Portal><Dialog.Overlay style={s.overlay}>
      <Dialog.Content style={s.content}>
        <Dialog.Title style={type.heading}>{request?.title}</Dialog.Title>
        <Dialog.Description style={type.body}>{request?.message}</Dialog.Description>
        <View style={s.actions}><Button title="Cancel" variant="ghost" onPress={() => finish(false)} />
          <Button title={request?.confirmLabel || 'Confirm'} danger onPress={() => finish(true)} /></View>
      </Dialog.Content>
    </Dialog.Overlay></Dialog.Portal>
  </Dialog.Root>;
}
const makeStyles = ({ C }) => StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(12,31,43,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { width: '100%', maxWidth: 420, padding: 24, borderRadius: radius.surface, backgroundColor: C.surface, gap: 16 },
  actions: { gap: 8 },
});
