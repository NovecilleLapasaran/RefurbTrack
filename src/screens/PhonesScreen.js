import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { formatPeso, referenceOf, useAppContext } from '../context/AppContext';
import { theme } from '../theme/theme';

const investmentOf = (phone) =>
  Number(phone.purchasePrice || 0) +
  Number(phone.partsCost || 0) +
  Number(phone.laborCost || 0) +
  Number(phone.otherExpenses || 0);

const PhonesScreen = () => {
  const { phoneRecords, deletePhone } = useAppContext();
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  // BACKEND: after each mutation, refresh phoneRecords from
  // GET /api/units so every screen reflects server state.
  const handleEditPhone = (phone) => {
    navigation.navigate('AddPhone', { phone });
  };

  const handleDeletePhone = (phone) => {
    // BACKEND: await fetch(`https://YOUR_API/units/${phone.id}`, { method: 'DELETE' })
    deletePhone(phone);
    setSelectedId(null);
  };

  const renderItem = ({ item }) => {
    const expanded = selectedId === item.id;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setSelectedId(expanded ? null : item.id)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardMeta}>
                {referenceOf(item)} · {item.jobType || 'Repair job'}
              </Text>
              <Text style={styles.cardTitle}>{item.name || 'Untitled unit'}</Text>
              {item.issue ? (
                <Text style={styles.cardIssue}>{item.issue}</Text>
              ) : null}
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{item.status || 'Acquired'}</Text>
            </View>
          </View>

          <View style={styles.cardFigures}>
            <View style={styles.figure}>
              <Text style={styles.figureLabel}>Invested</Text>
              <Text style={styles.figureValue}>{formatPeso(investmentOf(item))}</Text>
            </View>
            <View style={styles.figure}>
              <Text style={styles.figureLabel}>Revenue</Text>
              <Text style={styles.figureValue}>
                {formatPeso(item.revenue || item.amountCharged || 0)}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={22}
              color={theme.textMuted}
            />
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference</Text>
              <Text style={styles.detailValue}>{referenceOf(item)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{item.name || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Job type</Text>
              <Text style={styles.detailValue}>{item.jobType || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Issue</Text>
              <Text style={styles.detailValue}>{item.issue || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Source</Text>
              <Text style={styles.detailValue}>{item.source || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>{item.status || 'Acquired'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Parts + labor</Text>
              <Text style={styles.detailValue}>
                {formatPeso(
                  Number(item.partsCost || 0) + Number(item.laborCost || 0)
                )}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={() => handleEditPhone(item)}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={16}
                  color={theme.primary}
                />
                <Text style={styles.secondaryButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dangerButton}
                activeOpacity={0.85}
                onPress={() => handleDeletePhone(item)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={16}
                  color={theme.error}
                />
                <Text style={styles.dangerButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Units</Text>
          <Text style={styles.subtitle}>
            {phoneRecords.length} total · {phoneRecords.filter((p) => !['Sold', 'Released', 'Written off'].includes(p.status)).length} on the bench
          </Text>
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

      <FlatList
        data={phoneRecords}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={28}
              color={theme.textMuted}
            />
            <Text style={styles.emptyText}>
              No units yet. Tap “New” to log the first phone on your bench.
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
    marginTop: 6,
    color: theme.text,
    fontSize: theme.typography.body1.fontSize + 3,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cardMeta: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: '600',
  },
  cardIssue: {
    marginTop: 4,
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
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
  cardFigures: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.large,
    marginTop: 14,
  },
  figure: {
    flex: 1,
  },
  figureLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: 2,
  },
  figureValue: {
    color: theme.text,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: '700',
  },
  details: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.body2.fontSize,
  },
  detailValue: {
    color: theme.text,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    marginTop: theme.spacing.small,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.primarySoft,
    borderRadius: theme.roundness.medium,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: theme.primary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
  },
  dangerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.medium,
    paddingVertical: 12,
  },
  dangerButtonText: {
    color: theme.error,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
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

export default PhonesScreen;
