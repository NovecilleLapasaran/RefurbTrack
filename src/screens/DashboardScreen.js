import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {
  formatPeso,
  referenceOf,
  shortReference,
  UNIT_STATUSES,
  useAppContext,
} from '../context/AppContext';
import { theme } from '../theme/theme';

const investmentOf = (phone) =>
  Number(phone.purchasePrice || 0) +
  Number(phone.partsCost || 0) +
  Number(phone.laborCost || 0) +
  Number(phone.otherExpenses || 0);

const realizedOf = (phone) => {
  const status = String(phone.status || '').toLowerCase();
  if (status === 'written off') return -investmentOf(phone);
  return Number(phone.revenue || phone.amountCharged || 0) - investmentOf(phone);
};

const StatCard = ({ label, value, caption }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {caption ? <Text style={styles.statCaption}>{caption}</Text> : null}
  </View>
);

const ClosedJobsChart = ({ jobs }) => {
  if (!jobs.length) {
    return (
      <Text style={styles.chartEmpty}>
        Closed jobs will chart here once units are sold, released, or written
        off.
      </Text>
    );
  }

  const profits = jobs.map(realizedOf);
  const maxAbs = Math.max(...profits.map((value) => Math.abs(value)), 1);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chartRow}
    >
      {jobs.map((job, index) => {
        const profit = profits[index];
        const barHeight = Math.max(
          24,
          Math.round((Math.abs(profit) / maxAbs) * 130)
        );

        return (
          <View key={referenceOf(job)} style={styles.chartColumn}>
            <View style={styles.chartTrack}>
              <View
                style={[
                  styles.chartBar,
                  { height: barHeight },
                  profit < 0 ? styles.chartBarNegative : null,
                ]}
              />
            </View>
            <Text style={styles.chartLabel}>{shortReference(job)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const DashboardScreen = () => {
  const { user, stats, openTickets, closedJobs } = useAppContext();
  const navigation = useNavigation();

  // BACKEND: replace with data from the profile endpoint
  //   GET /api/me -> { name, shopName, jobType, city }
  const subtitle = user?.name
    ? [user.name, user.shopName || user.jobType].filter(Boolean).join(' · ')
    : 'No shop profile yet';

  const closedLine = [
    `${stats.soldOrReleased} sold or released`,
    stats.writtenOff > 0 ? `${stats.writtenOff} written off` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  // BACKEND: `stats` is derived locally in AppContext. If your API reports
  // aggregates, swap it for `GET /api/dashboard` here instead.
  const activeStatuses = UNIT_STATUSES.filter(
    (status) => stats.statusCounts[status] > 0
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Bench</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.newButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddPhone')}
          >
            <MaterialCommunityIcons name="plus" size={18} color={theme.textOnPrimary} />
            <Text style={styles.newButtonText}>New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Realized profit</Text>
          <Text style={styles.heroValue}>
            {stats.realizedProfit >= 0 ? '+' : ''}
            {formatPeso(stats.realizedProfit)}
          </Text>
          <Text style={styles.heroCaption}>{closedLine || 'No units closed yet'}</Text>
        </View>

        <View style={styles.statRow}>
          <StatCard label="Tied-up capital" value={formatPeso(stats.tiedUpCapital)} />
          <StatCard
            label="On the bench"
            value={String(stats.onBench)}
            caption={`${stats.unsold} unsold`}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Status mix</Text>
          <TouchableOpacity
            style={styles.sectionLink}
            onPress={() => navigation.navigate('Units')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLinkText}>All units</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {activeStatuses.length > 0 ? (
          <View style={styles.chipWrap}>
            {activeStatuses.map((status) => (
              <View key={status} style={styles.chip}>
                <Text style={styles.chipLabel}>{status}</Text>
                <Text style={styles.chipCount}>{stats.statusCounts[status]}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No units on the bench yet. Tap “New” to add your first unit.
            </Text>
          </View>
        )}

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Recent closed jobs</Text>
          <Text style={styles.cardSubtitle}>
            Profit and loss on the last sales
          </Text>
          <ClosedJobsChart jobs={closedJobs.slice(-6)} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active tickets</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Units')}
          >
            <Text style={styles.openCount}>{stats.onBench} open</Text>
          </TouchableOpacity>
        </View>

        {openTickets.length > 0 ? (
          <View style={styles.ticketList}>
            {openTickets.map((phone) => (
              <TouchableOpacity
                key={referenceOf(phone)}
                style={styles.ticketCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Units')}
              >
                <View style={styles.ticketTop}>
                  <Text style={styles.ticketRef}>
                    {referenceOf(phone)} · {phone.jobType || 'Repair job'}
                  </Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>
                      {phone.status || 'Acquired'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketName}>
                  {phone.name || 'Untitled unit'}
                </Text>
                <Text style={styles.ticketIssue}>
                  {phone.issue || 'No issue noted'}
                </Text>

                <View style={styles.ticketBottom}>
                  <View style={styles.ticketField}>
                    <Text style={styles.ticketFieldLabel}>Investment</Text>
                    <Text style={styles.ticketFieldValue}>
                      {formatPeso(investmentOf(phone))}
                    </Text>
                  </View>
                  <View style={[styles.ticketField, styles.ticketFieldRight]}>
                    <Text style={styles.ticketFieldLabel}>Source</Text>
                    <Text style={styles.ticketFieldValue}>
                      {phone.source || '—'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No open tickets. Add a unit to start tracking it here.
            </Text>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.large,
  },
  headerText: {
    flex: 1,
    paddingRight: theme.spacing.medium,
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
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    borderRadius: theme.roundness.medium,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  newButtonText: {
    color: theme.textOnPrimary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
    marginLeft: 6,
  },
  heroCard: {
    backgroundColor: theme.primaryDark,
    borderRadius: theme.roundness.large,
    padding: 22,
    marginBottom: theme.spacing.medium,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: theme.typography.body1.fontSize,
    marginBottom: 6,
  },
  heroValue: {
    color: theme.textOnPrimary,
    fontSize: theme.typography.display.fontSize,
    fontWeight: theme.typography.display.fontWeight,
    letterSpacing: theme.typography.display.letterSpacing,
  },
  heroCaption: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.72)',
    fontSize: theme.typography.body2.fontSize,
  },
  statRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.large,
    borderWidth: 1,
    borderColor: theme.border,
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
  statCaption: {
    marginTop: 6,
    color: theme.textMuted,
    fontSize: theme.typography.caption.fontSize,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    letterSpacing: theme.typography.h2.letterSpacing,
  },
  cardSubtitle: {
    marginTop: 4,
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    marginBottom: theme.spacing.medium,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionLinkText: {
    color: theme.primary,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: '600',
  },
  openCount: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: '600',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chipLabel: {
    color: theme.text,
    fontSize: theme.typography.caption.fontSize + 1,
  },
  chipCount: {
    color: theme.text,
    fontSize: theme.typography.caption.fontSize + 1,
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.large,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 20,
    marginBottom: theme.spacing.large,
  },
  chartRow: {
    alignItems: 'flex-end',
    gap: theme.spacing.large,
    paddingVertical: theme.spacing.small,
    paddingRight: theme.spacing.small,
  },
  chartColumn: {
    alignItems: 'center',
    width: 72,
  },
  chartTrack: {
    height: 140,
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 64,
    borderRadius: 10,
    backgroundColor: theme.primary,
  },
  chartBarNegative: {
    backgroundColor: theme.error,
  },
  chartLabel: {
    marginTop: 10,
    color: theme.textMuted,
    fontSize: theme.typography.caption.fontSize,
  },
  chartEmpty: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 20,
    paddingVertical: theme.spacing.medium,
  },
  ticketList: {
    gap: theme.spacing.medium,
  },
  ticketCard: {
    backgroundColor: theme.surfaceAlt,
    borderRadius: theme.roundness.large,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 18,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
  },
  ticketRef: {
    flex: 1,
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: '600',
  },
  statusPill: {
    backgroundColor: '#EFECE1',
    borderRadius: theme.roundness.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  statusPillText: {
    color: theme.text,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '700',
  },
  ticketName: {
    marginTop: 12,
    color: theme.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  ticketIssue: {
    marginTop: 6,
    color: theme.textMuted,
    fontSize: theme.typography.body1.fontSize,
  },
  ticketBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  ticketField: {
    flex: 1,
  },
  ticketFieldRight: {
    alignItems: 'flex-end',
  },
  ticketFieldLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: 4,
  },
  ticketFieldValue: {
    color: theme.text,
    fontSize: theme.typography.body1.fontSize + 2,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.large,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 20,
    marginBottom: theme.spacing.medium,
  },
  emptyText: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 20,
  },
});

export default DashboardScreen;
