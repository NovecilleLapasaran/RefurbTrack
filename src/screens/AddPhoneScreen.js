import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useAppContext } from './src/context/AppContext';

const AddPhoneScreen = () => {
  const [name, setName] = useState('');
  const [jobType, setJobType] = useState('');
  const [expenses, setExpenses] = useState([]);

  const handleAddPhone = () => {
    // Add the phone to the phone records
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Job Type"
        value={jobType}
        onChangeText={setJobType}
      />
      <Text>Expenses:</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item}</Text>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Expense"
        value={expenses.join(', ')}
        onChangeText={setExpenses}
      />
      <Button title="Add" onPress={handleAddPhone} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.text,
    borderRadius: theme.roundness.small,
    padding: theme.spacing.small,
    fontSize: theme.typography.body1.fontSize,
    marginBottom: theme.spacing.medium,
  },
});

export default AddPhoneScreen;
