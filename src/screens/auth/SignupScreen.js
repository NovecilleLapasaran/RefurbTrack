import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  Button,
  HelperText,
  Text,
  TextInput,
} from 'react-native-paper';

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
  // 2. Create the account (Firebase Authentication:
  //    createUserWithEmailAndPassword).
  // 3. Store the session token, then log the new user in via `login()`.
  // ---------------------------------------------------------------------
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // const userCredential = await createUserWithEmailAndPassword(
    //   auth, email, password
    // );
    // await AsyncStorage.setItem('token', userCredential.user.uid);
    // login({ email: userCredential.user.email });
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
            <Avatar.Icon size={64} icon="cellphone-cog" />
            <Text variant="headlineSmall" style={styles.title}>
              Create account
            </Text>
            <Text variant="bodyMedium" style={styles.tagline}>
              Start tracking capital, repairs, and profit in one place.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label="Email"
              placeholder="you@shop.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Confirm password"
              placeholder="••••••••"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            <HelperText type="error" visible={Boolean(error)}>
              {error}
            </HelperText>

            <Button
              mode="contained"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.button}
              onPress={handleSignup}
            >
              Create account
            </Button>
          </View>

          {navigation ? (
            <Button
              mode="text"
              compact
              textColor={theme.primary}
              style={styles.footer}
              onPress={() => navigation.navigate('Login')}
            >
              Already have an account? Sign in
            </Button>
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
  title: {
    color: theme.text,
    fontWeight: '700',
    marginTop: theme.spacing.medium,
  },
  tagline: {
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.roundness.large,
    padding: theme.spacing.medium,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.medium,
    marginBottom: theme.spacing.small,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: theme.roundness.medium,
    marginTop: theme.spacing.small,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: theme.typography.label.fontSize,
  },
  footer: {
    marginTop: theme.spacing.medium,
  },
});

export default SignupScreen;
