import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GuestTabs from './GuestTabs';
import PaymentHistoryScreen from '../screens/payment_history_screen/PaymentHistoryScreen';
import ChangePasswordScreen from '../screens/account_info_screen/ChangePasswordScreen';
import EventHistoryScreen from '../screens/event_history_screen/EventHistoryScreen';
import NotificationScreen from '../screens/notification_screen/NotificationScreen';
import EventDetailScreen from '../screens/event_details_screen/EventDetailScreen';
import Termscondition_screen from '../screens/terms_screen/Termscondition_screen';
import SelectTicketScreen from '../screens/invitation_screen/SelectTicketScreen';
import AccountInfoScreen from '../screens/account_info_screen/AccountInfoScreen';
import InvitationScreen from '../screens/invitation_screen/InvitationScreen';
import CheckOutScreen from '../screens/invitation_screen/CheckOutScreen';
import SuccessScreen from '../screens/invitation_screen/SuccessScreen';
import CategoryScreen from '../screens/category_screen/CategoryScreen';
import SettingsScreen from '../screens/setting_screen/SettingsScreen';
import SupportScreen from '../screens/support_screen/SupportScreen';
import FavoritScreen from '../screens/favorit_screen/FavoritScreen';
const Stack = createNativeStackNavigator();
const GuestRoutes = ({SplashOpen}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BashPub"
        options={{headerShown: SplashOpen ? false : false}}
        component={GuestTabs}
      />
      <Stack.Screen
        name="Event History"
        options={{headerShown: SplashOpen ? false : true}}
        component={EventHistoryScreen}
      />
      <Stack.Screen
        name="Payment History"
        options={{headerShown: SplashOpen ? false : true}}
        component={PaymentHistoryScreen}
      />
      <Stack.Screen
        name="My Invitations"
        options={{headerShown: SplashOpen ? false : true}}
        component={InvitationScreen}
      />
      <Stack.Screen
        name="Account Info"
        options={{headerShown: SplashOpen ? false : true}}
        component={AccountInfoScreen}
      />
      <Stack.Screen
        name="Change Password"
        options={{headerShown: SplashOpen ? false : true}}
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="Contact Support"
        options={{headerShown: SplashOpen ? false : true}}
        component={SupportScreen}
      />
      <Stack.Screen
        name="Terms Condition"
        options={{headerShown: SplashOpen ? false : true}}
        component={Termscondition_screen}
      />
      <Stack.Screen
        name="Settings"
        options={{headerShown: SplashOpen ? false : true}}
        component={SettingsScreen}
      />
      <Stack.Screen
        name="Select Ticket"
        options={{headerShown: SplashOpen ? false : true}}
        component={SelectTicketScreen}
      />
      <Stack.Screen
        name="Payment Success"
        options={{headerShown: SplashOpen ? false : true}}
        component={SuccessScreen}
      />
      <Stack.Screen
        name="Check Out"
        options={{headerShown: SplashOpen ? false : true}}
        component={CheckOutScreen}
      />
      <Stack.Screen
        name="Notification"
        options={{headerShown: SplashOpen ? false : true}}
        component={NotificationScreen}
      />
      <Stack.Screen
        name="Favorites"
        options={{headerShown: SplashOpen ? false : true}}
        component={FavoritScreen}
      />
      <Stack.Screen
        name="Event Details"
        options={{headerShown: SplashOpen ? false : true}}
        component={EventDetailScreen}
      />
      <Stack.Screen
        name="Category Event"
        options={{headerShown: SplashOpen ? false : true}}
        component={CategoryScreen}
      />
    </Stack.Navigator>
  );
};

export default GuestRoutes;

const styles = StyleSheet.create({});
