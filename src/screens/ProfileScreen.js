import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { formatPeso, useAppContext } from '../context/AppContext';
import { theme } from '../theme/theme';

const initialsOf = (name) =>
  String(name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const ProfileScreen = () => {
  const { user, logout, stats, phoneRecords } = useAppContext();

  // BACKEND: replace with GET https://YOUR_API/me
  //   -> { name, email, jobType }
  const name = user?.name || '—';
  const email = user?.email || '—';
  const jobType = user?.jobType || '—';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(name)}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            <View style={styles.jobPill}>
              <Text style={styles.jobPillText}>{jobType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Units logged</Text>
            <Text style={styles.statValue}>{phoneRecords.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>On the bench</Text>
            <Text style={styles.statValue}>{stats.onBench}</Text>
          </View>
        </View>

        <View style={styles.listCard}>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>Tied-up capital</Text>
            <Text style={styles.listValue}>
              {formatPeso(stats.tiedUpCapital)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>Realized profit</Text>
            <Text style={styles.listValue}>
              {stats.realizedProfit >= 0 ? '+' : ''}
              {formatPeso(stats.realizedProfit)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={logout}>
          <MaterialCommunityIcons name="logout" size={18} color={theme.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    letterSpacing: theme.typography.h1.letterSpacing,
    color: theme.text,
    marginBottom: theme.spacing.large,
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    padding: 18,
    marginBottom: theme.spacing.medium,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: theme.roundness.pill,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.medium,
  },
  avatarText: {
    color: theme.textOnPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  identityText: {
    flex: 1,
  },
  name: {
    color: theme.text,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
  },
  email: {
    marginTop: 2,
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
  },
  jobPill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primarySoft,
    borderRadius: theme.roundness.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
  },
  jobPillText: {
    color: theme.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    padding: 18,
  },
  statLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    marginBottom: 8,
  },
  statValue: {
    color: theme.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  listCard: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    padding: 18,
    marginBottom: theme.spacing.large,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
  },
  listValue: {
    color: theme.text,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.medium,
    paddingVertical: 14,
  },
  logoutText: {
    color: theme.error,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
  },
});

export default ProfileScreen;
