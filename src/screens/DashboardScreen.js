import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, Chip, Surface, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import {
  formatPeso,
  investmentOf,
  realizedOf,
  referenceOf,
  shortReference,
  UNIT_STATUSES,
  useAppContext,
} from '../context/AppContext';
import { theme } from '../theme/theme';

const StatCard = ({ label, value, caption }) => (
  <Card mode="outlined" style={styles.statCard}>
    <Card.Content>
      <Text variant="bodyMedium" style={styles.muted}>
        {label}
      </Text>
      <Text variant="headlineSmall" style={styles.statValue}>
        {value}
      </Text>
      {caption ? (
        <Text variant="bodySmall" style={styles.muted}>
          {caption}
        </Text>
      ) : null}
    </Card.Content>
  </Card>
);

const ClosedJobsChart = ({ jobs }) => {
  if (!jobs.length) {
    return (
      <Text variant="bodyMedium" style={styles.muted}>
        Closed jobs will chart here once units are sold, released, or marked
        not worth repairing.
      </Text>
    );
  }

  const profits = jobs.map(realizedOf);
  const maxAbs = Math.max(...profits.map((value) => Math.abs(value)), 1);

  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
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
            <Text variant="bodySmall" style={styles.muted}>
              {shortReference(job)}
            </Text>
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
            <Text variant="headlineSmall" style={styles.screenTitle}>
              Bench
            </Text>
            <Text variant="bodyMedium" style={styles.muted}>
              {subtitle}
            </Text>
          </View>
          <Button
            mode="contained"
            icon="plus"
            compact
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate('AddPhone')}
          >
            New
          </Button>
        </View>

        <Surface style={styles.heroCard} elevation={0}>
          <Text variant="bodyMedium" style={styles.heroLabel}>
            Realized profit
          </Text>
          <Text style={styles.heroValue}>
            {stats.realizedProfit >= 0 ? '+' : ''}
            {formatPeso(stats.realizedProfit)}
          </Text>
          <Text variant="bodySmall" style={styles.heroCaption}>
            {closedLine || 'No units closed yet'}
          </Text>
        </Surface>

        <View style={styles.statRow}>
          <StatCard label="Tied-up capital" value={formatPeso(stats.tiedUpCapital)} />
          <StatCard
            label="On the bench"
            value={String(stats.onBench)}
            caption={`${stats.unsold} unsold`}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Status mix
          </Text>
          <Button
            mode="text"
            compact
            icon="arrow-right"
            contentStyle={styles.inlineButtonContent}
            onPress={() => navigation.navigate('Units')}
          >
            All units
          </Button>
        </View>

        {activeStatuses.length > 0 ? (
          <View style={styles.chipWrap}>
            {activeStatuses.map((status) => (
              <Chip
                key={status}
                mode="outlined"
                style={styles.chip}
                onPress={() => navigation.navigate('Units')}
              >
                {`${status} `}
                <Text variant="labelLarge" style={styles.chipCount}>
                  {stats.statusCounts[status]}
                </Text>
              </Chip>
            ))}
          </View>
        ) : (
          <Card mode="contained" style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.muted}>
                No units on the bench yet. Tap “New” to add your first unit.
              </Text>
            </Card.Content>
          </Card>
        )}

        <Card mode="outlined" style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent closed jobs
            </Text>
            <Text variant="bodyMedium" style={styles.muted}>
              Profit and loss on the last sales
            </Text>
            <ClosedJobsChart jobs={closedJobs.slice(-6)} />
          </Card.Content>
        </Card>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Active tickets
          </Text>
          <Button
            mode="text"
            compact
            contentStyle={styles.inlineButtonContent}
            onPress={() => navigation.navigate('Units')}
          >
            {stats.onBench} open
          </Button>
        </View>

        {openTickets.length > 0 ? (
          <View style={styles.ticketList}>
            {openTickets.map((phone) => (
              <Card
                key={referenceOf(phone)}
                mode="outlined"
                style={styles.ticketCard}
                onPress={() => navigation.navigate('Units')}
              >
                <Card.Content>
                  <View style={styles.ticketTop}>
                    <Text
                      variant="bodyMedium"
                      style={[styles.muted, styles.ticketRef]}
                    >
                      {referenceOf(phone)} · {phone.jobType || 'Repair job'}
                    </Text>
                    <Badge style={styles.statusBadge}>
                      {phone.status || 'Acquired'}
                    </Badge>
                  </View>

                  <Text variant="headlineSmall" style={styles.ticketName}>
                    {phone.name || 'Untitled unit'}
                  </Text>
                  <Text variant="bodyMedium" style={styles.muted}>
                    {phone.issue || 'No issue noted'}
                  </Text>

                  <View style={styles.ticketBottom}>
                    <View>
                      <Text variant="bodySmall" style={styles.muted}>
                        Investment
                      </Text>
                      <Text variant="titleMedium" style={styles.ticketValue}>
                        {formatPeso(investmentOf(phone))}
                      </Text>
                    </View>
                    <View style={styles.ticketFieldRight}>
                      <Text variant="bodySmall" style={styles.muted}>
                        Source
                      </Text>
                      <Text variant="titleMedium" style={styles.ticketValue}>
                        {phone.source || '—'}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : (
          <Card mode="contained" style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.muted}>
                No open tickets. Add a unit to start tracking it here.
              </Text>
            </Card.Content>
          </Card>
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
  screenTitle: {
    color: theme.text,
    fontWeight: '700',
  },
  muted: {
    color: theme.textMuted,
  },
  buttonContent: {
    height: 44,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: theme.typography.label.fontSize,
  },
  inlineButtonContent: {
    flexDirection: 'row-reverse',
  },
  heroCard: {
    backgroundColor: theme.primaryDark,
    borderRadius: theme.roundness.large,
    padding: 22,
    marginBottom: theme.spacing.medium,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.78)',
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
  },
  statRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.large,
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
    marginVertical: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.small,
  },
  sectionTitle: {
    color: theme.text,
    fontWeight: '700',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  },
  chip: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.pill,
  },
  chipCount: {
    color: theme.text,
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
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
  ticketList: {
    gap: theme.spacing.medium,
  },
  ticketCard: {
    backgroundColor: theme.surfaceAlt,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
  },
  ticketRef: {
    flex: 1,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#EFECE1',
    color: theme.text,
    fontWeight: '700',
    fontSize: theme.typography.caption.fontSize,
  },
  ticketName: {
    color: theme.text,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: -0.4,
  },
  ticketBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  ticketFieldRight: {
    alignItems: 'flex-end',
  },
  ticketValue: {
    color: theme.text,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    marginBottom: theme.spacing.medium,
  },
});

export default DashboardScreen;
