import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HostDrawer from './HostDrawer';
import UpdateEventScreen from '../screens/hosts_dashboard/create_event_screen/UpdateEventScreen';
import InviteGuestScreen from '../screens/hosts_dashboard/invite_guest_screen/InviteGuestScreen';
import TicketVerifyScreen from '../screens/hosts_dashboard/ticket_verify_screen/TicketVerifyScreen';
import WithdrawRequestScreen from '../screens/hosts_dashboard/wallet_screen/WithdrawRequestScreen';
import SaveMethodScreen from '../screens/hosts_dashboard/wallet_screen/SaveMethodScreen';
import ApproveScreen from '../screens/hosts_dashboard/join_request_screen/ApproveScreen';
const Stack = createNativeStackNavigator();
const HostRoutes = ({SplashOpen}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Hosts"
        options={{headerShown: false}}
        component={HostDrawer}
      />
      <Stack.Screen
        name="Update Event"
        options={{headerShown: true}}
        component={UpdateEventScreen}
      />
      <Stack.Screen
        name="Invite Guests"
        options={{headerShown: true}}
        component={InviteGuestScreen}
      />
      <Stack.Screen
        name="Verify Guest"
        options={{headerShown: true}}
        component={TicketVerifyScreen}
      />
      <Stack.Screen
        name="Approve Request"
        options={{headerShown: true}}
        component={ApproveScreen}
      />
      <Stack.Screen
        name="Withdraw Request"
        options={{headerShown: true}}
        component={WithdrawRequestScreen}
      />
      <Stack.Screen
        name="Save Method"
        options={{headerShown: true}}
        component={SaveMethodScreen}
      />
    </Stack.Navigator>
  );
};

export default HostRoutes;

const styles = StyleSheet.create({});
