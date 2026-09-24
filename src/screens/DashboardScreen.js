import React from 'react';
import { View, Text } from 'react-native';
import { useAppContext } from './src/context/AppContext';

const DashboardScreen = () => {
  const { phoneRecords } = useAppContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.phoneCount}>{phoneRecords.length} Phones</Text>
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
  phoneCount: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
  },
});

export default DashboardScreen;
