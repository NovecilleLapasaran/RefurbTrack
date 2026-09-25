import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppContext } from '../../context/AppContext';
import { theme } from '../../theme/theme';

const LoginScreen = ({ navigation }) => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------
  // BACKEND: sign-in
  // 1. POST the credentials to your auth service.
  // 2. Store the returned session token (e.g. expo-secure-store or
  //    AsyncStorage) so the app can restore the session on launch.
  // 3. Feed the returned user object into `login()` from AppContext.
  // ---------------------------------------------------------------------
  const handleLogin = async () => {
    // const response = await fetch('https://YOUR_API/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) {
    //   setError('Invalid credentials');
    //   return;
    // }
    // const { token, user } = await response.json();
    // await AsyncStorage.setItem('token', token);
    // login(user);
    // setError('');
    setError('Backend not connected yet');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.logo}>
              <MaterialCommunityIcons
                name="cellphone-cog"
                size={30}
                color={theme.textOnPrimary}
              />
            </View>
            <Text style={styles.title}>RefurbTrack</Text>
            <Text style={styles.tagline}>
              Track every unit on your bench, from acquisition to sale.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@shop.com"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
          </View>

          {navigation ? (
            <TouchableOpacity
              style={styles.footer}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.footerText}>
                New here? <Text style={styles.footerLink}>Create an account</Text>
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.large,
  },
  brand: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: theme.roundness.medium,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.medium,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    letterSpacing: theme.typography.h1.letterSpacing,
    color: theme.text,
  },
  tagline: {
    marginTop: 8,
    fontSize: theme.typography.body2.fontSize,
    color: theme.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    padding: theme.spacing.medium,
  },
  fieldLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: theme.spacing.small,
  },
  input: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.medium,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: theme.typography.body1.fontSize,
    color: theme.text,
  },
  error: {
    color: theme.error,
    fontSize: theme.typography.body2.fontSize,
    marginTop: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: theme.roundness.medium,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: theme.spacing.large,
  },
  buttonText: {
    color: theme.textOnPrimary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
  },
  footer: {
    marginTop: theme.spacing.large,
    alignItems: 'center',
  },
  footerText: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
  },
  footerLink: {
    color: theme.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
