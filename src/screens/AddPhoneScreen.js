import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { UNIT_STATUSES, useAppContext } from '../context/AppContext';
import { theme } from '../theme/theme';

const JOB_TYPES = ['Buy & Resell', 'Customer Repair'];

const ChipRow = ({ options, value, onChange }) => (
  <View style={styles.chipRow}>
    {options.map((option) => {
      const active = option === value;
      return (
        <TouchableOpacity
          key={option}
          activeOpacity={0.8}
          style={[styles.chip, active && styles.chipActive]}
          onPress={() => onChange(option)}
        >
          <Text style={[styles.chipText, active && styles.chipTextActive]}>
            {option}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const AddPhoneScreen = ({ route, navigation }) => {
  const editing = route?.params?.phone;
  const { addPhone, editPhone } = useAppContext();

  const [name, setName] = useState(editing?.name || '');
  const [issue, setIssue] = useState(editing?.issue || '');
  const [source, setSource] = useState(editing?.source || '');
  const [jobType, setJobType] = useState(editing?.jobType || JOB_TYPES[0]);
  const [status, setStatus] = useState(editing?.status || 'Acquired');
  const [purchasePrice, setPurchasePrice] = useState(
    editing?.purchasePrice ? String(editing.purchasePrice) : ''
  );
  const [partsCost, setPartsCost] = useState(
    editing?.partsCost ? String(editing.partsCost) : ''
  );
  const [laborCost, setLaborCost] = useState(
    editing?.laborCost ? String(editing.laborCost) : ''
  );
  const [otherExpenses, setOtherExpenses] = useState(
    editing?.otherExpenses ? String(editing.otherExpenses) : ''
  );
  const [revenue, setRevenue] = useState(
    editing?.revenue ? String(editing.revenue) : ''
  );
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------
  // BACKEND: saving a unit
  // New unit  -> POST https://YOUR_API/units
  // Edit unit -> PUT  https://YOUR_API/units/:id
  // Then refresh the list (AppContext holds the records) with the response.
  // ---------------------------------------------------------------------
  const handleSave = () => {
    if (!name.trim()) {
      setError('Give this unit a name first.');
      return;
    }

    const record = {
      id: editing?.id,
      reference: editing?.reference,
      name: name.trim(),
      issue: issue.trim(),
      source: source.trim(),
      jobType,
      status,
      purchasePrice: Number(purchasePrice) || 0,
      partsCost: Number(partsCost) || 0,
      laborCost: Number(laborCost) || 0,
      otherExpenses: Number(otherExpenses) || 0,
      revenue: Number(revenue) || 0,
      date: editing?.date || new Date().toISOString().slice(0, 10),
    };

    if (editing) editPhone(record);
    else addPhone(record);

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{editing ? 'Edit unit' : 'New unit'}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="close" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. iPhone 13 · cracked display"
            placeholderTextColor={theme.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.fieldLabel}>Issue</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cracked screen"
            placeholderTextColor={theme.textMuted}
            value={issue}
            onChangeText={setIssue}
          />

          <Text style={styles.fieldLabel}>Source</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Walk-in seller"
            placeholderTextColor={theme.textMuted}
            value={source}
            onChangeText={setSource}
          />

          <Text style={styles.fieldLabel}>Job type</Text>
          <ChipRow options={JOB_TYPES} value={jobType} onChange={setJobType} />

          <Text style={styles.fieldLabel}>Status</Text>
          <ChipRow options={UNIT_STATUSES} value={status} onChange={setStatus} />

          <View style={styles.moneyRow}>
            <View style={styles.moneyField}>
              <Text style={styles.fieldLabel}>Purchase ₱</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={purchasePrice}
                onChangeText={setPurchasePrice}
              />
            </View>
            <View style={styles.moneyField}>
              <Text style={styles.fieldLabel}>Revenue ₱</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={revenue}
                onChangeText={setRevenue}
              />
            </View>
          </View>

          <View style={styles.moneyRow}>
            <View style={styles.moneyField}>
              <Text style={styles.fieldLabel}>Parts ₱</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={partsCost}
                onChangeText={setPartsCost}
              />
            </View>
            <View style={styles.moneyField}>
              <Text style={styles.fieldLabel}>Labor ₱</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={laborCost}
                onChangeText={setLaborCost}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Other expenses ₱</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={theme.textMuted}
            keyboardType="numeric"
            value={otherExpenses}
            onChangeText={setOtherExpenses}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.85}
            onPress={handleSave}
          >
            <MaterialCommunityIcons
              name="check"
              size={18}
              color={theme.textOnPrimary}
            />
            <Text style={styles.saveButtonText}>
              {editing ? 'Save changes' : 'Add to bench'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    paddingBottom: theme.spacing.small,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    letterSpacing: theme.typography.h1.letterSpacing,
    color: theme.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: theme.roundness.pill,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.xl,
  },
  fieldLabel: {
    color: theme.textMuted,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: theme.spacing.medium,
  },
  input: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: theme.typography.body1.fontSize,
    color: theme.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
  },
  chip: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.roundness.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  chipText: {
    color: theme.text,
    fontSize: theme.typography.caption.fontSize + 1,
  },
  chipTextActive: {
    color: theme.textOnPrimary,
    fontWeight: '700',
  },
  moneyRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  moneyField: {
    flex: 1,
  },
  error: {
    color: theme.error,
    fontSize: theme.typography.body2.fontSize,
    marginTop: theme.spacing.medium,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.primary,
    borderRadius: theme.roundness.medium,
    paddingVertical: 15,
    marginTop: theme.spacing.large,
  },
  saveButtonText: {
    color: theme.textOnPrimary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: '700',
  },
});

export default AddPhoneScreen;
