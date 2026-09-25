import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { formatPeso, referenceOf, useAppContext } from '../context/AppContext';
import { theme } from '../theme/theme';

const investmentOf = (phone) =>
  Number(phone.purchasePrice || 0) +
  Number(phone.partsCost || 0) +
  Number(phone.laborCost || 0) +
  Number(phone.otherExpenses || 0);

const realizedOf = (phone) => {
  const status = String(phone.status || '').toLowerCase();
  if (status === 'written off') return -investmentOf(phone);
  return (
    Number(phone.revenue || phone.amountCharged || 0) - investmentOf(phone)
  );
};

const HistoryScreen = () => {
  // BACKEND: swap for
  //   GET https://YOUR_API/units?status=Sold,Released,Written off
  // and let the server compute realized profit per job if it owns pricing.
  const { closedJobs, stats } = useAppContext();

  const renderItem = ({ item }) => {
    const profit = realizedOf(item);
    const writtenOff = item.status === 'Written off';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.name || 'Untitled unit'}</Text>
            <Text style={styles.cardMeta}>
              {referenceOf(item)} · {item.date || item.closedAt || item.jobType || 'Closed job'}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              writtenOff ? styles.statusPillMuted : null,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                writtenOff ? styles.statusPillTextMuted : null,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerLabel}>Realized</Text>
          <Text
            style={[
              styles.footerValue,
              profit < 0 ? styles.footerValueNegative : null,
            ]}
          >
            {profit >= 0 ? '+' : ''}
            {formatPeso(profit)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>
          {closedJobs.length} closed jobs
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Realized profit</Text>
        <Text style={styles.summaryValue}>
          {stats.realizedProfit >= 0 ? '+' : ''}
          {formatPeso(stats.realizedProfit)}
        </Text>
        <Text style={styles.summaryCaption}>
          {stats.soldOrReleased} sold or released
          {stats.writtenOff > 0 ? ` · ${stats.writtenOff} written off` : ''}
        </Text>
      </View>

      <FlatList
        data={closedJobs}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="history"
              size={28}
              color={theme.textMuted}
            />
            <Text style={styles.emptyText}>
              Nothing here yet. Jobs appear once a unit is sold, released, or
              written off.
            </Text>
          </View>
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
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    letterSpacing: theme.typography.h1.letterSpacing,
    color: theme.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: theme.typography.body2.fontSize,
    color: theme.textMuted,
  },
  summaryCard: {
    marginHorizontal: theme.spacing.medium,
    backgroundColor: theme.primaryDark,
    borderRadius: theme.roundness.large,
    padding: 20,
    marginBottom: theme.spacing.medium,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: theme.typography.body2.fontSize,
    marginBottom: 6,
  },
  summaryValue: {
    color: theme.textOnPrimary,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
  },
  summaryCaption: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
    fontSize: theme.typography.caption.fontSize,
  },
  listContent: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.small,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.large,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    paddingRight: theme.spacing.small,
  },
  cardTitle: {
    color: theme.text,
    fontSize: theme.typography.body1.fontSize + 1,
    fontWeight: '700',
  },
  cardMeta: {
    marginTop: 2,
    color: theme.textMuted,
    fontSize: theme.typography.caption.fontSize,
  },
  statusPill: {
    backgroundColor: theme.primarySoft,
    borderRadius: theme.roundness.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusPillText: {
    color: theme.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '700',
  },
  statusPillMuted: {
    backgroundColor: '#F1EEE4',
  },
  statusPillTextMuted: {
    color: theme.textMuted,
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
  footerLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
  },
  footerValue: {
    color: theme.primary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
  },
  footerValueNegative: {
    color: theme.error,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.large,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 28,
    gap: 10,
  },
  emptyText: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HistoryScreen;
