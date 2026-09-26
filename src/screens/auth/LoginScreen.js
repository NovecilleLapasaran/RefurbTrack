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

const LoginScreen = ({ navigation }) => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------
  // BACKEND: sign-in
  // 1. POST the credentials to your auth service (Firebase Authentication:
  //    signInWithEmailAndPassword).
  // 2. Store the returned session token (e.g. expo-secure-store or
  //    AsyncStorage) so the app can restore the session on launch.
  // 3. Feed the returned user object into `login()` from AppContext.
  // ---------------------------------------------------------------------
  const handleLogin = async () => {
    // const userCredential = await signInWithEmailAndPassword(
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
              RefurbTrack
            </Text>
            <Text variant="bodyMedium" style={styles.tagline}>
              Track every unit on your bench, from acquisition to sale.
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

            <HelperText type="error" visible={Boolean(error)}>
              {error}
            </HelperText>

            <Button
              mode="contained"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.button}
              onPress={handleLogin}
            >
              Sign in
            </Button>
          </View>

          {navigation ? (
            <Button
              mode="text"
              compact
              textColor={theme.primary}
              style={styles.footer}
              onPress={() => navigation.navigate('Signup')}
            >
              New here? Create an account
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

export default LoginScreen;
