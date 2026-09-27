// Adapted from React Native Reusables (MIT); see THIRD_PARTY_NOTICES.md.
import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { radius, useStyles, useTheme } from '../../src/theme';
export function Input({ style, onFocus, onBlur, multiline, ...props }) {
  const { C, dark } = useTheme();
  const s = useStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  return <TextInput placeholderTextColor={C.muted} selectionColor={C.teal} keyboardAppearance={dark ? 'dark' : 'light'} multiline={multiline}
    onFocus={e => { setFocused(true); onFocus?.(e); }} onBlur={e => { setFocused(false); onBlur?.(e); }}
    style={[s.input, multiline && s.multiline, focused && s.focused, props.editable === false && s.disabled, style]} {...props} />;
}
const makeStyles = ({ C, type }) => StyleSheet.create({
  input: { ...type.body, minHeight: 56, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: C.soft, borderBottomWidth: 2, borderColor: C.line, borderRadius: radius.input },
  multiline: { minHeight: 100, textAlignVertical: 'top' }, focused: { borderColor: C.teal, outlineWidth: 2, outlineStyle: 'solid', outlineColor: C.teal, outlineOffset: 1 }, disabled: { opacity: 0.5 },
});
