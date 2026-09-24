import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import { AppContext } from './src/context/AppContext';
import { theme } from './src/theme/theme';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    // Simulate local authentication
    if (email === 'admin@example.com' && password === confirmPassword) {
      AppContext.login({ email, password });
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{theme.typography.h1}</Text>
        <Text style={styles.tagline}>{theme.typography.body2}</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>{theme.typography.body1}</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
  },
  title: {
    color: theme.text,
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
  },
  tagline: {
    color: theme.text,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
  },
  form: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.text,
    borderRadius: theme.roundness.small,
    padding: theme.spacing.small,
    fontSize: theme.typography.body1.fontSize,
    marginBottom: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: theme.roundness.medium,
    padding: theme.spacing.medium,
    fontSize: theme.typography.body1.fontSize,
    color: theme.background,
    marginTop: theme.spacing.large,
  },
  buttonText: {
    color: theme.background,
    fontSize: theme.typography.body1.fontSize,
  },
  error: {
    color: theme.error,
    fontSize: theme.typography.body1.fontSize,
    marginTop: theme.spacing.small,
  },
});

export default SignupScreen;
