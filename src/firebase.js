import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
export const cloudConfigured = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
let auth = null;
let db = null;
if (cloudConfigured) {
  const app = getApps()[0] || initializeApp(config);
  if (Platform.OS === 'web') auth = getAuth(app);
  else {
    try { auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) }); }
    catch (error) {
      if (error.code !== 'auth/already-initialized') throw error;
      auth = getAuth(app);
    }
  }
  db = getFirestore(app);
}
export { auth, db };
