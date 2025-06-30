import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DiscoverEventScreen from '../screens/discover_event_screen/DiscoverEventScreen';
import InvitationScreen from '../screens/invitation_screen/InvitationScreen';
import MyTicketScreen from '../screens/my_ticket_screen/MyTicketScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/profile_screen/ProfileScreen';
import SearchScreen from '../screens/search_screen/SearchScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {themes} from '../constants/themes';
const Tab = createBottomTabNavigator();

//////////////////////////
// TAB MENUE ARRAY OBJECT
//////////////////////////
const TabMenu = [
  {
    name: 'Home',
    screen: DiscoverEventScreen,
    label: 'For You',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  {
    name: 'Search',
    screen: SearchScreen,
    label: 'Search',
    activeIcon: 'search',
    inactiveIcon: 'search-outline',
  },
  {
    name: 'My Invites',
    screen: InvitationScreen,
    label: 'My Invites',
    activeIcon: 'person-add',
    inactiveIcon: 'person-add-outline',
  },
  {
    name: 'MyTicket',
    screen: MyTicketScreen,
    label: 'My Ticket',
    activeIcon: 'ticket',
    inactiveIcon: 'ticket-outline',
  },
  {
    name: 'Profile',
    screen: ProfileScreen,
    label: 'Profile',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
];
//////////////////////////
// HEADER LEFT CONTENT
//////////////////////////
const HEADER_LEFT = ({navigation}) => {
  return (
    <View style={styles.header_left}>
      <FastImage
        style={styles.header_left_logo}
        source={require('../assets/512.png')}
      />
      {/* <Text style={styles.header_left_txt}>Bash-Pub</Text> */}
    </View>
  );
};
//////////////////////////
// HEADER RIGHT CONTENT
//////////////////////////
const HEADER_RIGHT = ({navigation}) => {
  return (
    <View style={styles.header_right}>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
        <Text style={styles.header_right_icon}>
          <Icon name="heart" size={30} color={themes.colors.ERROR} />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        <Text style={styles.header_right_icon}>
          <Icon name="notifications" size={30} color={themes.colors.PRIMARY} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};
//////////////////////////
// GUEST BOTTOM TABS
//////////////////////////
const GuestTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        title: 'BashPub',
        headerShown: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: themes.colors.BACKGROUND,
        tabBarInactiveTintColor: themes.colors.TEXT_LIGHT,
        tabBarStyle: styles.tab_bar_style,
        tabBarLabelStyle: styles.tab_bar_label,
      }}>
      {TabMenu.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.screen}
          options={navigation => ({
            headerLeft: () => HEADER_LEFT(navigation),
            headerRight: () => HEADER_RIGHT(navigation),
            tabBarLabel: item.label,
            tabBarIcon: ({focused, color}) => (
              <Icon
                name={focused ? item.activeIcon : item.inactiveIcon}
                size={18}
                color={color}
              />
            ),
          })}
        />
      ))}
    </Tab.Navigator>
  );
};

export default GuestTabs;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab_bar_style: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: themes.colors.PRIMARY,
    borderRadius: 10,
    height: 70,
    shadowColor: themes.colors.SECONDARY,
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    borderTopWidth: 0,
    marginHorizontal: 5,
  },
  tab_bar_label: {
    fontSize: 12,
    fontWeight: '500',
  },
  header_left: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  header_left_logo: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 30,
    elevation: 3,
    borderWidth: 1,
    borderColor: themes.colors.TEXT_LIGHT,
  },
  header_left_txt: {
    textTransform: 'capitalize',
    color: themes.colors.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  // header_right
  header_right: {
    padding: 5,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  header_right_icon: {},
});
