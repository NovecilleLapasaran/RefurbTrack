import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Chip, Text } from 'react-native-paper';

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
        <Text variant="headlineSmall" style={styles.screenTitle}>
          Profile
        </Text>

        <Card mode="outlined" style={styles.identityCard}>
          <Card.Content style={styles.identityRow}>
            <Avatar.Text size={62} label={initialsOf(name)} />
            <View style={styles.identityText}>
              <Text variant="titleLarge" style={styles.name}>
                {name}
              </Text>
              <Text variant="bodyMedium" style={styles.muted}>
                {email}
              </Text>
              <Chip
                mode="flat"
                style={styles.jobChip}
                selectedColor={theme.primary}
                onPress={() => {}}
              >
                {jobType}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.statRow}>
          <Card mode="outlined" style={styles.statCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.muted}>
                Units logged
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {phoneRecords.length}
              </Text>
            </Card.Content>
          </Card>
          <Card mode="outlined" style={styles.statCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.muted}>
                On the bench
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {stats.onBench}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card mode="outlined" style={styles.listCard}>
          <Card.Content>
            <View style={styles.listRow}>
              <Text variant="bodyMedium" style={styles.muted}>
                Tied-up capital
              </Text>
              <Text variant="titleSmall" style={styles.listValue}>
                {formatPeso(stats.tiedUpCapital)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.listRow}>
              <Text variant="bodyMedium" style={styles.muted}>
                Realized profit
              </Text>
              <Text variant="titleSmall" style={styles.listValue}>
                {stats.realizedProfit >= 0 ? '+' : ''}
                {formatPeso(stats.realizedProfit)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          icon="logout"
          textColor={theme.error}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          onPress={logout}
        >
          Log out
        </Button>
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
  screenTitle: {
    color: theme.text,
    fontWeight: '700',
    marginBottom: theme.spacing.large,
  },
  muted: {
    color: theme.textMuted,
  },
  identityCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    marginBottom: theme.spacing.medium,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityText: {
    flex: 1,
    marginLeft: theme.spacing.medium,
  },
  name: {
    color: theme.text,
    fontWeight: '700',
  },
  jobChip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primarySoft,
    marginTop: 8,
  },
  statRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
  },
  statValue: {
    color: theme.text,
    fontWeight: '700',
    marginTop: 6,
  },
  listCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    marginBottom: theme.spacing.large,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listValue: {
    color: theme.text,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 14,
  },
  logoutButton: {
    borderColor: theme.border,
    borderRadius: theme.roundness.medium,
  },
  buttonContent: {
    height: 48,
  },
});

export default ProfileScreen;
