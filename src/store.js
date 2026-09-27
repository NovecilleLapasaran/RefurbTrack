import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, runTransaction, getDocFromServer } from 'firebase/firestore';
import { auth, db, cloudConfigured } from './firebase';
import { closed } from './domain.mjs';

const Store = createContext(null);
const PRACTICE_KEY = 'refurbtrack.practice.v1';
export const useStore = () => useContext(Store);
export const newId = () => randomUUID();
export function friendlyError(error) {
  const messages = {
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/email-already-in-use': 'An account already uses this email. Sign in instead.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Use at least 8 characters for your password.',
    'auth/network-request-failed': 'Cannot reach the sign-in service. Check your internet connection.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
    'auth/operation-not-allowed': 'Sign-in is unavailable. Please contact your shop owner.',
    'permission-denied': 'You do not have access to these records. Ask your shop owner to check your account.',
    'unavailable': 'Cannot reach the database. Check your connection and retry.',
  };
  return (messages[error?.code] || error?.message || 'Something went wrong. Please try again.').replaceAll('YYYY-MM-DD', 'MM-DD-YYYY');
}

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [practice, setPractice] = useState(false);
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('My shop');
  const [setupError, setSetupError] = useState('');
  const [records, setRecords] = useState([]);
  const recordsRef = useRef([]);
  const mutating = useRef(false);
  const [authLoading, setAuthLoading] = useState(cloudConfigured);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [notice, setNotice] = useState('');
  const [fromCache, setFromCache] = useState(false);
  const replace = value => { recordsRef.current = value; setRecords(value); };

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async value => {
      replace([]); setSetupError(''); setAuthLoading(true);
      if (!value) { setUser(null); setShopId(''); setShopName('My shop'); setAuthLoading(false); return; }
      try {
        const profile = await getDocFromServer(doc(db, 'profiles', value.uid));
        if (auth.currentUser?.uid !== value.uid) return;
        const assignment = profile.exists() ? profile.data() : null;
        setShopId(assignment?.shopId || value.uid);
        setShopName(assignment?.shopName || 'My shop');
      } catch (e) {
        if (auth.currentUser?.uid !== value.uid) return;
        setShopId(''); setSetupError('Could not open your shop. Check your connection, then sign out and sign in again.');
      }
      setUser(value); setAuthLoading(false);
    });
  }, []);
  useEffect(() => {
    let alive = true;
    replace([]); setError(''); setNotice(''); setFromCache(false);
    if (practice) {
      setLoading(true);
      AsyncStorage.getItem(PRACTICE_KEY).then(raw => {
        if (alive) replace(raw ? JSON.parse(raw) : []);
      }).catch(e => { if (alive) setError(friendlyError(e)); }).finally(() => { if (alive) setLoading(false); });
      return () => { alive = false; };
    }
    if (!user || !shopId) { setLoading(false); return; }
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'shops', shopId, 'records'), { includeMetadataChanges: true }, snapshot => {
      replace(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
      setFromCache(snapshot.metadata.fromCache); setError(''); setLoading(false);
    }, e => { replace([]); setError(friendlyError(e)); setLoading(false); });
    return unsubscribe;
  }, [user?.uid, shopId, practice, reload]);

  async function save(id, patch, action, expectedVersion) {
    if (mutating.current) throw new Error('A change is still being saved. Please wait.');
    if (loading || error || setupError) throw new Error('Your records are not ready. Reconnect and try again.');
    mutating.current = true;
    const recordId = id || newId();
    const now = new Date().toISOString();
    function next(current) {
      if (id && !current) throw new Error('This record no longer exists. Return to the job list.');
      if (current && current.version !== expectedVersion) throw new Error('Another update was saved first. Reopen this screen to use the latest record.');
      const base = current || { id: recordId, status: patch.jobType === 'repair' ? 'Received' : 'Acquired', expenses: [], sale: null, diagnosis: '', feasibility: '', estimate: 0, history: [], createdAt: now, createdBy: user?.uid || 'practice' };
      return { ...base, ...patch, updatedAt: now, version: (base.version || 0) + 1,
        history: [...base.history, { at: now, action, by: user?.email || 'Practice user' }].slice(-100) };
    }
    try {
      if (practice) {
        const updated = next(recordsRef.current.find(r => r.id === recordId));
        const all = [...recordsRef.current.filter(r => r.id !== recordId), updated];
        await AsyncStorage.setItem(PRACTICE_KEY, JSON.stringify(all)); replace(all);
      } else {
        if (!user || !shopId) throw new Error('Sign in before saving.');
        const ref = doc(db, 'shops', shopId, 'records', recordId);
        await runTransaction(db, async transaction => {
          const snapshot = await transaction.get(ref);
          transaction.set(ref, next(snapshot.exists() ? snapshot.data() : null));
        });
      }
      setNotice(action);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      return recordId;
    } finally { mutating.current = false; }
  }
  async function remove(record) {
    if (mutating.current) throw new Error('A change is still being saved.');
    mutating.current = true;
    try {
      if (practice) {
        const all = recordsRef.current.filter(r => r.id !== record.id);
        await AsyncStorage.setItem(PRACTICE_KEY, JSON.stringify(all)); replace(all);
      } else {
        const ref = doc(db, 'shops', shopId, 'records', record.id);
        await runTransaction(db, async transaction => {
          const current = await transaction.get(ref);
          if (!current.exists()) throw new Error('This record has already been deleted.');
          if (current.data().version !== record.version) throw new Error('The record changed. Reload it before deleting.');
          transaction.delete(ref);
        });
      }
      setNotice('Record deleted');
    } finally { mutating.current = false; }
  }
  async function switchWorkspace(value) {
    const id = value.trim();
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) throw new Error('Enter a valid workspace ID.');
    if (id !== user.uid) {
      const member = await getDocFromServer(doc(db, 'shops', id, 'members', user.uid));
      if (!member.exists() || member.data().active !== true) throw new Error('You have not been added to this workspace.');
    }
    setShopId(id);
  }
  async function logout() {
    if (practice) { setPractice(false); replace([]); }
    else await signOut(auth);
  }
  return <Store.Provider value={{ user, practice, shopId, shopName, records, loading, authLoading, error: setupError || error, notice, fromCache,
    enterPractice: () => setPractice(true), retry: () => setReload(n => n + 1), dismissNotice: () => setNotice(''),
    save, remove, logout, switchWorkspace, activeCount: records.filter(r => !closed(r)).length }}>{children}</Store.Provider>;
}
