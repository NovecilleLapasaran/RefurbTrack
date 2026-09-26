import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  Chip,
  IconButton,
  Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import {
  CLOSED_STATUSES,
  formatPeso,
  investmentOf,
  referenceOf,
  UNIT_STATUSES,
  useAppContext,
} from '../context/AppContext';
import { theme } from '../theme/theme';

const StatusPicker = ({ title, options, current, onSelect }) => (
  <View>
    <Text variant="labelMedium" style={styles.statusLabel}>
      {title}
    </Text>
    <View style={styles.statusChipRow}>
      {options.map((status) => {
        const active = status === current;
        return (
          <Chip
            key={status}
            mode={active ? 'flat' : 'outlined'}
            selected={active}
            style={[styles.statusChip, active && styles.statusChipActive]}
            selectedColor={theme.primary}
            onPress={() => onSelect(status)}
          >
            {status}
          </Chip>
        );
      })}
    </View>
  </View>
);

const PhonesScreen = () => {
  const { phoneRecords, deletePhone, editPhone } = useAppContext();
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  // BACKEND: after each mutation, refresh phoneRecords from
  // GET /api/units so every screen reflects server state.
  // Status lives here on the Units screen (moved out of the add form):
  // changing it writes straight back to the record.
  // BACKEND: await fetch(`https://YOUR_API/units/${phone.id}`, { method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
  const handleStatusChange = (phone, status) => {
    if (status === phone.status) return;
    editPhone({ ...phone, status });
  };

  const handleEditPhone = (phone) => {
    navigation.navigate('AddPhone', { phone });
  };

  const handleDeletePhone = (phone) => {
    // BACKEND: await fetch(`https://YOUR_API/units/${phone.id}`, { method: 'DELETE' })
    deletePhone(phone);
    setSelectedId(null);
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text variant="bodyMedium" style={styles.muted}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const expanded = selectedId === item.id;
    const currentStatus = item.status || 'Acquired';

    return (
      <Card
        mode="outlined"
        style={styles.card}
        onPress={() => setSelectedId(expanded ? null : item.id)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text variant="bodyMedium" style={styles.muted}>
                  {referenceOf(item)} · {item.jobType || 'Repair job'}
                </Text>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  {item.name || 'Untitled unit'}
                </Text>
                {item.issue ? (
                  <Text variant="bodyMedium" style={styles.muted}>
                    {item.issue}
                  </Text>
                ) : null}
              </View>
              <View style={styles.statusBadge}>
                <Text variant="labelSmall" style={styles.statusBadgeText}>
                  {currentStatus}
                </Text>
              </View>
            </View>

            <View style={styles.cardFigures}>
              <View style={styles.figure}>
                <Text variant="bodySmall" style={styles.muted}>
                  Invested
                </Text>
                <Text variant="titleMedium" style={styles.figureValue}>
                  {formatPeso(investmentOf(item))}
                </Text>
              </View>
              <View style={styles.figure}>
                <Text variant="bodySmall" style={styles.muted}>
                  Revenue
                </Text>
                <Text variant="titleMedium" style={styles.figureValue}>
                  {formatPeso(item.revenue || item.amountCharged || 0)}
                </Text>
              </View>
              <IconButton
                icon={expanded ? 'chevron-up' : 'chevron-down'}
                size={22}
                style={styles.chevron}
              />
            </View>

          {expanded && (
            <View style={styles.details}>
              <StatusPicker
                title="Status"
                options={UNIT_STATUSES}
                current={currentStatus}
                onSelect={(status) => handleStatusChange(item, status)}
              />
              <StatusPicker
                title="Close unit"
                options={CLOSED_STATUSES}
                current={item.status}
                onSelect={(status) => handleStatusChange(item, status)}
              />

              <View style={styles.detailBlock}>
                <DetailRow label="Reference" value={referenceOf(item)} />
                <DetailRow label="Name" value={item.name || '—'} />
                {item.brand || item.model ? (
                  <DetailRow
                    label="Brand / model"
                    value={[item.brand, item.model].filter(Boolean).join(' ')}
                  />
                ) : null}
                <DetailRow label="Job type" value={item.jobType || '—'} />
                {item.condition ? (
                  <DetailRow label="Condition" value={item.condition} />
                ) : null}
                <DetailRow label="Issue" value={item.issue || '—'} />
                <DetailRow label="Source" value={item.source || '—'} />
                {item.date ? (
                  <DetailRow label="Date acquired" value={item.date} />
                ) : null}
                {item.diagnosis ? (
                  <DetailRow label="Diagnosis" value={item.diagnosis} />
                ) : null}
                {item.feasibility ? (
                  <DetailRow label="Feasibility" value={item.feasibility} />
                ) : null}
                {item.estimatedRepairCost ? (
                  <DetailRow
                    label="Est. repair cost"
                    value={formatPeso(item.estimatedRepairCost)}
                  />
                ) : null}
                {item.intakeNotes ? (
                  <DetailRow label="Intake notes" value={item.intakeNotes} />
                ) : null}

                {Array.isArray(item.expenseItems) && item.expenseItems.length ? (
                  <View style={styles.expenseBlock}>
                    <Text variant="labelMedium" style={styles.muted}>
                      Expense entries
                    </Text>
                    {item.expenseItems.map((entry, index) => (
                      <View
                        key={`${item.id}-expense-${index}`}
                        style={styles.detailRow}
                      >
                        <Text variant="bodyMedium" style={styles.detailValue}>
                          {entry.name}
                        </Text>
                        <Text variant="bodyMedium" style={styles.detailValue}>
                          {formatPeso(entry.cost)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                <DetailRow
                  label="Parts + labor"
                  value={formatPeso(
                    Number(item.partsCost || 0) + Number(item.laborCost || 0)
                  )}
                />
              </View>

              <View style={styles.actions}>
                <Button
                  mode="contained"
                  icon="pencil"
                  compact
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  onPress={() => handleEditPhone(item)}
                >
                  Edit
                </Button>
                <Button
                  mode="outlined"
                  icon="trash-can-outline"
                  compact
                  textColor={theme.error}
                  style={styles.dangerButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  onPress={() => handleDeletePhone(item)}
                >
                  Delete
                </Button>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="headlineSmall" style={styles.screenTitle}>
            Units
          </Text>
          <Text variant="bodyMedium" style={styles.muted}>
            {phoneRecords.length} total ·{' '}
            {
              phoneRecords.filter(
                (p) => !CLOSED_STATUSES.includes(p.status)
              ).length
            }{' '}
            on the bench
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

      <FlatList
        data={phoneRecords}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card mode="contained" style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="bodyMedium" style={styles.muted}>
                No units yet. Tap “New” to log the first phone on your bench.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    paddingRight: theme.spacing.small,
  },
  cardTitle: {
    color: theme.text,
    fontWeight: '700',
    marginVertical: 4,
    letterSpacing: -0.3,
  },
  statusBadge: {
    backgroundColor: theme.primarySoft,
    borderRadius: theme.roundness.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    color: theme.primary,
    fontWeight: '700',
  },
  cardFigures: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.large,
    marginTop: 14,
  },
  figure: {
    flex: 1,
  },
  figureValue: {
    color: theme.text,
    fontWeight: '700',
    marginTop: 2,
  },
  chevron: {
    margin: 0,
    alignSelf: 'flex-end',
  },
  details: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 12,
  },
  statusLabel: {
    color: theme.textMuted,
    fontWeight: '600',
    marginBottom: 6,
  },
  statusChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.pill,
  },
  statusChipActive: {
    backgroundColor: theme.primarySoft,
    borderColor: theme.primary,
  },
  detailBlock: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
  },
  detailValue: {
    color: theme.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  expenseBlock: {
    gap: 6,
    paddingVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    marginTop: 4,
  },
  dangerButton: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
  },
  emptyCard: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.large,
    marginTop: theme.spacing.medium,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 28,
  },
});

export default PhonesScreen;
