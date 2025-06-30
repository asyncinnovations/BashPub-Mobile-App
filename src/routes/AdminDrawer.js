import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text} from 'react-native';

const Drawer = createDrawerNavigator();

const AdminDrawer = () => {
  const AdminDashboard = () => {
    return (
      <View>
        <Text>AdminDashboard</Text>
      </View>
    );
  };
  const AdminSettings = () => {
    return (
      <View>
        <Text>AdminSettings</Text>
      </View>
    );
  };
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: true}}
      initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={AdminDashboard} />
      <Drawer.Screen name="Settings" component={AdminSettings} />
    </Drawer.Navigator>
  );
};

export default AdminDrawer;
