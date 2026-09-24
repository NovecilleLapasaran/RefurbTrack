import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import PhonesScreen from './screens/PhonesScreen';
import AddPhoneScreen from './screens/AddPhoneScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Phones"
        component={PhonesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="phone" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Phone"
        component={AddPhoneScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
