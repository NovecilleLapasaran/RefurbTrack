import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Card, Surface, Text } from 'react-native-paper';

import {
  formatPeso,
  investmentOf,
  realizedOf,
  referenceOf,
  useAppContext,
} from '../context/AppContext';
import { theme } from '../theme/theme';

const HistoryScreen = () => {
  // BACKEND: swap for
  //   GET https://YOUR_API/units?status=Sold,Released,Not Worth Repairing
  // and let the server compute realized profit per job if it owns pricing.
  const { closedJobs, stats } = useAppContext();

  const renderItem = ({ item }) => {
    const profit = realizedOf(item);
    const writtenOff = item.status === 'Not Worth Repairing';

    return (
      <Card mode="outlined" style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {item.name || 'Untitled unit'}
              </Text>
              <Text variant="bodySmall" style={styles.muted}>
                {referenceOf(item)} ·{' '}
                {item.date || item.closedAt || item.jobType || 'Closed job'}
              </Text>
            </View>
            <Badge
              style={[styles.statusBadge, writtenOff && styles.badgeMuted]}
              textColor={writtenOff ? theme.textMuted : theme.primary}
            >
              {item.status}
            </Badge>
          </View>

          <View style={styles.cardFooter}>
            <Text variant="bodySmall" style={styles.muted}>
              Realized
            </Text>
            <Text
              variant="titleMedium"
              style={[
                styles.profitValue,
                profit < 0 ? styles.profitNegative : null,
              ]}
            >
              {profit >= 0 ? '+' : ''}
              {formatPeso(profit)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.screenTitle}>
          History
        </Text>
        <Text variant="bodyMedium" style={styles.muted}>
          {closedJobs.length} closed jobs
        </Text>
      </View>

      <Surface style={styles.summaryCard} elevation={0}>
        <Text variant="bodyMedium" style={styles.heroLabel}>
          Realized profit
        </Text>
        <Text style={styles.heroValue}>
          {stats.realizedProfit >= 0 ? '+' : ''}
          {formatPeso(stats.realizedProfit)}
        </Text>
        <Text variant="bodySmall" style={styles.heroCaption}>
          {stats.soldOrReleased} sold or released
          {stats.writtenOff > 0 ? ` · ${stats.writtenOff} written off` : ''}
        </Text>
      </Surface>

      <FlatList
        data={closedJobs}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card mode="contained" style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="bodyMedium" style={styles.muted}>
                Nothing here yet. Jobs appear once a unit is sold, released, or
                marked not worth repairing.
              </Text>
            </Card.Content>
          </Card>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
  },
  screenTitle: {
    color: theme.text,
    fontWeight: '700',
  },
  muted: {
    color: theme.textMuted,
  },
  summaryCard: {
    marginHorizontal: theme.spacing.medium,
    backgroundColor: theme.primaryDark,
    borderRadius: theme.roundness.large,
    padding: 20,
    marginBottom: theme.spacing.medium,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.78)',
    marginBottom: 6,
  },
  heroValue: {
    color: theme.textOnPrimary,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
  },
  heroCaption: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
  },
  listContent: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.small,
  },
  card: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: theme.text,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: theme.primarySoft,
  },
  badgeMuted: {
    backgroundColor: '#EFECE1',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  profitValue: {
    color: theme.primary,
    fontWeight: '700',
  },
  profitNegative: {
    color: theme.error,
  },
  emptyCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    marginTop: theme.spacing.small,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 28,
  },
});

export default HistoryScreen;
