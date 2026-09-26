import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Chip,
  IconButton,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

import { formatPeso, investmentOf, useAppContext } from '../context/AppContext';
import { theme } from '../theme/theme';

const JOB_TYPES = ['Buy & Resell', 'Customer Repair'];

const ChipRow = ({ options, value, onChange }) => (
  <View style={styles.chipRow}>
    {options.map((option) => {
      const active = option === value;
      return (
        <Chip
          key={option}
          mode={active ? 'flat' : 'outlined'}
          selected={active}
          style={[styles.chip, active && styles.chipActive]}
          selectedColor={theme.primary}
          onPress={() => onChange(option)}
        >
          {option}
        </Chip>
      );
    })}
  </View>
);

const AddPhoneScreen = ({ route, navigation }) => {
  const editing = route?.params?.phone;
  const { addPhone, editPhone } = useAppContext();

  // ---- Intake (feature C) -------------------------------------------
  const [brand, setBrand] = useState(editing?.brand || '');
  const [model, setModel] = useState(editing?.model || editing?.name || '');
  const [condition, setCondition] = useState(editing?.condition || '');
  const [issue, setIssue] = useState(editing?.issue || '');
  const [source, setSource] = useState(editing?.source || '');
  const [date, setDate] = useState(editing?.date || '');
  const [intakeNotes, setIntakeNotes] = useState(editing?.intakeNotes || '');

  // ---- Job type (feature A) -----------------------------------------
  const [jobType, setJobType] = useState(editing?.jobType || JOB_TYPES[0]);

  // ---- Money (features C + E) ---------------------------------------
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

  // Expense entries per unit (feature E): one name + cost row each.
  const [expenseItems, setExpenseItems] = useState(
    Array.isArray(editing?.expenseItems) && editing.expenseItems.length
      ? editing.expenseItems.map((item) => ({
          name: String(item.name || ''),
          cost: String(item.cost ?? ''),
        }))
      : []
  );

  // ---- Evaluation & diagnosis (feature D) ---------------------------
  const [diagnosis, setDiagnosis] = useState(editing?.diagnosis || '');
  const [feasibility, setFeasibility] = useState(editing?.feasibility || '');
  const [estimatedRepairCost, setEstimatedRepairCost] = useState(
    editing?.estimatedRepairCost ? String(editing.estimatedRepairCost) : ''
  );

  const [error, setError] = useState('');

  const updateExpense = (index, field, value) => {
    setExpenseItems((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addExpense = () => {
    setExpenseItems((items) => [...items, { name: '', cost: '' }]);
  };

  const removeExpense = (index) => {
    setExpenseItems((items) => items.filter((_, i) => i !== index));
  };

  const cleanedExpenseItems = expenseItems
    .filter((item) => item.name.trim() || Number(item.cost))
    .map((item) => ({
      name: item.name.trim() || 'Part',
      cost: Number(item.cost) || 0,
    }));

  // Running investment total, updated while typing (feature E).
  const runningInvestment = investmentOf({
    purchasePrice: Number(purchasePrice) || 0,
    partsCost: Number(partsCost) || 0,
    laborCost: Number(laborCost) || 0,
    otherExpenses: Number(otherExpenses) || 0,
    expenseItems: cleanedExpenseItems,
  });

  // ---------------------------------------------------------------------
  // BACKEND: saving a unit
  // New unit  -> POST https://YOUR_API/units
  // Edit unit -> PUT  https://YOUR_API/units/:id
  // Then refresh the list (AppContext holds the records) with the response.
  // ---------------------------------------------------------------------
  const handleSave = () => {
    if (!brand.trim() && !model.trim()) {
      setError('Add a brand and model first.');
      return;
    }

    const record = {
      id: editing?.id,
      reference: editing?.reference,
      brand: brand.trim(),
      model: model.trim(),
      name: [brand.trim(), model.trim()].filter(Boolean).join(' '),
      condition: condition.trim(),
      issue: issue.trim(),
      source: source.trim(),
      date:
        date.trim() || editing?.date || new Date().toISOString().slice(0, 10),
      intakeNotes: intakeNotes.trim(),
      jobType,
      status: editing?.status,
      purchasePrice: Number(purchasePrice) || 0,
      partsCost: Number(partsCost) || 0,
      laborCost: Number(laborCost) || 0,
      otherExpenses: Number(otherExpenses) || 0,
      expenseItems: cleanedExpenseItems,
      diagnosis: diagnosis.trim(),
      feasibility: feasibility.trim(),
      estimatedRepairCost: Number(estimatedRepairCost) || 0,
      revenue: Number(revenue) || 0,
    };

    if (editing) editPhone(record);
    else addPhone(record);

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.screenTitle}>
          {editing ? 'Edit unit' : 'New unit'}
        </Text>
        <IconButton
          icon="close"
          mode="outlined"
          size={20}
          onPress={() => navigation.goBack()}
        />
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
          <Text variant="titleMedium" style={styles.sectionLabel}>
            Intake
          </Text>

          <View style={styles.fieldRow}>
            <View style={styles.fieldCell}>
              <TextInput
                mode="outlined"
                label="Brand"
                placeholder="e.g. Vivo"
                value={brand}
                onChangeText={setBrand}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldCell}>
              <TextInput
                mode="outlined"
                label="Model"
                placeholder="e.g. Y87"
                value={model}
                onChangeText={setModel}
                style={styles.input}
              />
            </View>
          </View>

          <TextInput
            mode="outlined"
            label="Physical condition"
            placeholder="e.g. Cracked frame, dent on left side"
            value={condition}
            onChangeText={setCondition}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Issue"
            placeholder="e.g. Cracked screen"
            value={issue}
            onChangeText={setIssue}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Acquisition source"
            placeholder="e.g. Walk-in seller"
            value={source}
            onChangeText={setSource}
            style={styles.input}
          />

          <View style={styles.fieldRow}>
            <View style={styles.fieldCell}>
              <TextInput
                mode="outlined"
                label="Date acquired"
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldCell}>
              <Text variant="bodySmall" style={styles.muted}>
                Job type
              </Text>
              <ChipRow
                options={JOB_TYPES}
                value={jobType}
                onChange={setJobType}
              />
            </View>
          </View>

          <TextInput
            mode="outlined"
            label="Intake notes"
            placeholder="Anything noted at hand-over"
            multiline
            numberOfLines={3}
            value={intakeNotes}
            onChangeText={setIntakeNotes}
            style={styles.textArea}
          />

          <Text variant="titleMedium" style={styles.sectionLabel}>
            Money
          </Text>

          <View style={styles.fieldRow}>
            <View style={styles.fieldCell}>
              <TextInput
                mode="outlined"
                label="Purchase ₱"
                placeholder="0"
                keyboardType="numeric"
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldCell}>
              <TextInput
                mode="outlined"
                label="Revenue ₱"
                placeholder="0"
                keyboardType="numeric"
                value={revenue}
                onChangeText={setRevenue}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldCell}>
              <TextInput
                mode="outlined"
                label="Parts ₱"
                placeholder="0"
                keyboardType="numeric"
                value={partsCost}
                onChangeText={setPartsCost}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldCell}>
              <TextInput
                mode="outlined"
                label="Labor ₱"
                placeholder="0"
                keyboardType="numeric"
                value={laborCost}
                onChangeText={setLaborCost}
                style={styles.input}
              />
            </View>
          </View>

          <TextInput
            mode="outlined"
            label="Other expenses ₱"
            placeholder="0"
            keyboardType="numeric"
            value={otherExpenses}
            onChangeText={setOtherExpenses}
            style={styles.input}
          />

          <Text variant="titleMedium" style={styles.sectionLabel}>
            Expenses
          </Text>

          {expenseItems.map((item, index) => (
            <View key={`expense-${index}`} style={styles.expenseRow}>
              <View style={styles.expenseName}>
                <TextInput
                  mode="outlined"
                  label="Part name"
                  value={item.name}
                  onChangeText={(value) => updateExpense(index, 'name', value)}
                  style={styles.input}
                />
              </View>
              <View style={styles.expenseCost}>
                <TextInput
                  mode="outlined"
                  label="₱ cost"
                  placeholder="0"
                  keyboardType="numeric"
                  value={item.cost}
                  onChangeText={(value) => updateExpense(index, 'cost', value)}
                  style={styles.input}
                />
              </View>
              <IconButton
                icon="close"
                size={18}
                style={styles.expenseRemove}
                onPress={() => removeExpense(index)}
              />
            </View>
          ))}

          <Button
            mode="outlined"
            icon="plus"
            textColor={theme.primary}
            style={styles.addExpenseButton}
            contentStyle={styles.buttonContent}
            onPress={addExpense}
          >
            Add expense
          </Button>

          <Surface style={styles.runningTotal} elevation={0}>
            <Text variant="bodyMedium" style={styles.runningTotalLabel}>
              Running investment
            </Text>
            <Text variant="titleMedium" style={styles.runningTotalValue}>
              {formatPeso(runningInvestment)}
            </Text>
          </Surface>

          <Text variant="titleMedium" style={styles.sectionLabel}>
            Evaluation &amp; diagnosis
          </Text>

          <TextInput
            mode="outlined"
            label="Diagnosed problems"
            placeholder="e.g. Dead LCD connector, corroded charging line"
            multiline
            numberOfLines={3}
            value={diagnosis}
            onChangeText={setDiagnosis}
            style={styles.textArea}
          />

          <TextInput
            mode="outlined"
            label="Repair feasibility notes"
            placeholder="e.g. Parts available, worth repairing"
            multiline
            numberOfLines={3}
            value={feasibility}
            onChangeText={setFeasibility}
            style={styles.textArea}
          />

          <TextInput
            mode="outlined"
            label="Estimated repair cost ₱"
            placeholder="0"
            keyboardType="numeric"
            value={estimatedRepairCost}
            onChangeText={setEstimatedRepairCost}
            style={styles.input}
          />

          {error ? (
            <Text variant="bodyMedium" style={styles.error}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            icon="check"
            contentStyle={styles.saveButtonContent}
            labelStyle={styles.buttonLabel}
            style={styles.saveButton}
            onPress={handleSave}
          >
            {editing ? 'Save changes' : 'Add to bench'}
          </Button>
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
  screenTitle: {
    color: theme.text,
    fontWeight: '700',
  },
  muted: {
    color: theme.textMuted,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.xl,
  },
  sectionLabel: {
    color: theme.text,
    fontWeight: '700',
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.small,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.medium,
    marginBottom: theme.spacing.small,
  },
  textArea: {
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.medium,
    marginBottom: theme.spacing.small,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  fieldCell: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
  },
  chip: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: theme.roundness.pill,
  },
  chipActive: {
    backgroundColor: theme.primarySoft,
    borderColor: theme.primary,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  expenseName: {
    flex: 1,
  },
  expenseCost: {
    width: 104,
  },
  expenseRemove: {
    margin: 0,
  },
  addExpenseButton: {
    borderColor: theme.primary,
    borderRadius: theme.roundness.medium,
    marginTop: theme.spacing.small,
  },
  buttonContent: {
    height: 44,
  },
  runningTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.primarySoft,
    borderRadius: theme.roundness.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: theme.spacing.small,
  },
  runningTotalLabel: {
    color: theme.primary,
    fontWeight: '600',
  },
  runningTotalValue: {
    color: theme.primary,
    fontWeight: '700',
  },
  error: {
    color: theme.error,
    marginTop: theme.spacing.medium,
  },
  saveButton: {
    backgroundColor: theme.primary,
    borderRadius: theme.roundness.medium,
    marginTop: theme.spacing.large,
  },
  saveButtonContent: {
    height: 50,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: theme.typography.label.fontSize,
  },
});

export default AddPhoneScreen;
