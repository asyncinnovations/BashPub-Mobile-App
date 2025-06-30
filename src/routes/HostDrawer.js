import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import InvitedGuestScreen from '../screens/hosts_dashboard/invited_guests_screen/InvitedGuestScreen';
import HostSettingsScreen from '../screens/hosts_dashboard/host_setting_screen/HostSettingsScreen';
import HostPoliciesScreen from '../screens/hosts_dashboard/host_policy_screen/HostPoliciesScreen';
import CreateEventScreen from '../screens/hosts_dashboard/create_event_screen/CreateEventScreen';
import TicketSalesScreen from '../screens/hosts_dashboard/ticket_sales_screen/TicketSalesScreen';
import HostSupportScreen from '../screens/hosts_dashboard/host_support_screen/HostSupportScreen';
import AccountInfoScreen from '../screens/hosts_dashboard/accountInfo_screen/AccountInfoScreen';
import TicketEventScreen from '../screens/hosts_dashboard/ticket_verify_screen/TicketEventScreen';
import EventListScreen from '../screens/hosts_dashboard/create_event_screen/EventListScreen';
import DashboardScreen from '../screens/hosts_dashboard/dashboard_screen/DashboardScreen';
import EarningsScreen from '../screens/hosts_dashboard/earning_screen/EarningsScreen';
import PayoutScreen from '../screens/hosts_dashboard/wallet_screen/PayoutScreen';
import ReviewScreen from '../screens/hosts_dashboard/review_screen/ReviewScreen';
import {themes} from '../constants/themes';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {CommonActions} from '@react-navigation/native';
import JoinRequestScreen from '../screens/hosts_dashboard/join_request_screen/JoinRequestScreen';

const Drawer = createDrawerNavigator();

const HostDrawer = () => {
  const {user, logout} = useAuth();

  ////////////////////////////////
  // HANDLE USER LOGOUT
  ////////////////////////////////
  const handle_logout = async () => {
    logout(); // clear user data from async storage
    ToastAndroid.show('Logout Successful', ToastAndroid.SHORT);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  ////////////////////////////////
  // CUSTOM DRAWER CONENT HERE
  ////////////////////////////////
  const CustomDrawerContent = props => {
    const user = {
      name: 'hasna',
      email: 'hasan@gmail.com',
      role: 'hosts',
    };
    return (
      <DrawerContentScrollView
        {...props}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{backgroundColor: themes.colors.PRIMARY}}>
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Text style={styles.avatar_txt}>H</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name="star-outline"
              size={14}
              color={themes.colors.TEXT_LIGHT}
            />
            <Text style={styles.roleText}> {user.role}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => props.navigation.navigate('Profile')}>
            <Text style={styles.profileBtnText}>View Profile</Text>
          </TouchableOpacity>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  };
  const DrawerProfile = ({user, navigation}) => {
    return (
      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatar_txt}>H</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Ionicons
            name="star-outline"
            size={14}
            color={themes.colors.TEXT_LIGHT}
          />
          <Text style={styles.roleText}> {user?.role}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileBtnText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={props => {
        return (
          <DrawerContentScrollView
            {...props}
            style={{backgroundColor: themes.colors.PRIMARY}}>
            <DrawerItemList {...props} />
            <TouchableOpacity onPress={handle_logout} style={styles.logout_btn}>
              <MaterialIcons
                name="logout"
                size={20}
                color={themes.colors.TEXT_LIGHT}
              />
              <Text style={styles.logout_btn_txt}>Logout</Text>
            </TouchableOpacity>
          </DrawerContentScrollView>
        );
      }}
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
        drawerStatusBarAnimation: 'fade',
        drawerActiveTintColor: themes.colors.BACKGROUND,
        drawerInactiveTintColor: themes.colors.TEXT_LIGHT,
        drawerLabelStyle: {fontSize: 15},
        gestureEnabled: true,
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Create Event"
        component={CreateEventScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="My Events"
        component={EventListScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Invited Guests"
        component={InvitedGuestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Verify Tickets"
        component={TicketEventScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="people-circle" size={size} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Join Requests"
        component={JoinRequestScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="people-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Ticket Sales"
        component={TicketSalesScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Earnings & Reports"
        component={EarningsScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Get Payout"
        component={PayoutScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Guest Reviews"
        component={ReviewScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={HostSettingsScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={AccountInfoScreen}
        options={{
          drawerItemStyle: {display: 'none'},
          drawerIcon: ({color, size}) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact Support"
        component={HostSupportScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="help-buoy-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Terms & Policies"
        component={HostPoliciesScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default HostDrawer;

const styles = StyleSheet.create({
  profileBox: {
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: themes.colors.BACKGROUND,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themes.colors.BACKGROUND,
  },
  avatar_txt: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
  },
  name: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: themes.colors.TEXT_LIGHT,
    textTransform: 'capitalize',
  },
  email: {
    textAlign: 'center',
    fontSize: 14,
    color: themes.colors.TEXT_LIGHT,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themes.colors.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '400',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  profileBtn: {
    marginTop: 10,
    backgroundColor: themes.colors.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileBtnText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '600',
  },
  logout_btn: {
    padding: 10,
    backgroundColor: themes.colors.ERROR,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    // borderWidth: 1,
    // borderColor: themes.colors.BACKGROUND,
    elevation: 3,
  },
  logout_btn_txt: {
    color: themes.colors.TEXT_LIGHT,
    fontSize: 14,
    fontWeight: '600',
  },
});
