import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useAppContext } from './src/context/AppContext';

const PhonesScreen = () => {
  const { phoneRecords } = useAppContext();
  const [selectedPhone, setSelectedPhone] = useState(null);

  const handleSelectPhone = (phone) => {
    setSelectedPhone(phone);
  };

  const handleEditPhone = () => {
    // Navigate to Edit Phone screen
  };

  const handleDeletePhone = () => {
    // Delete the selected phone
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phones</Text>
      <FlatList
        data={phoneRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectPhone(item)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedPhone && (
        <View style={styles.phoneDetails}>
          <Text>Phone Details</Text>
          <Text>Name: {selectedPhone.name}</Text>
          <Text>Job Type: {selectedPhone.jobType}</Text>
          <Text>Status: {selectedPhone.status}</Text>
          <Text>Expenses: {selectedPhone.expenses.join(', ')}</Text>
          <Button title="Edit" onPress={handleEditPhone} />
          <Button title="Delete" onPress={handleDeletePhone} />
        </View>
      )}
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
  phoneDetails: {
    padding: theme.spacing.medium,
    backgroundColor: theme.surface,
    borderRadius: theme.roundness.small,
  },
});

export default PhonesScreen;
