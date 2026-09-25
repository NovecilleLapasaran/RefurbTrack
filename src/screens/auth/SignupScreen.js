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

const SignupScreen = ({ navigation }) => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------
  // BACKEND: account creation
  // 1. Validate the passwords client-side (below).
  // 2. POST { email, password } to your registration endpoint.
  // 3. Store the session token, then log the new user in via `login()`.
  // ---------------------------------------------------------------------
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // const response = await fetch('https://YOUR_API/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) {
    //   setError('Could not create the account');
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
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.tagline}>
              Start tracking capital, repairs, and profit in one place.
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

            <Text style={styles.fieldLabel}>Confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={handleSignup}
            >
              <Text style={styles.buttonText}>Create account</Text>
            </TouchableOpacity>
          </View>

          {navigation ? (
            <TouchableOpacity
              style={styles.footer}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.footerLink}>Sign in</Text>
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

export default SignupScreen;
