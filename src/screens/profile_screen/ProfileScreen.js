import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../context/AuthContext';
import {themes} from '../../constants/themes';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
const ProfileScreen = ({navigation}) => {
  const {user, token, logout} = useAuth();
  const [UserInfo, setUserInfo] = useState({});
  const [EventHistory, setEventHistory] = useState([]);
  const [MyTickets, setMyTickets] = useState([]);
  //////////////////////
  // FETCH USERS INFO
  //////////////////////
  const fetch_user = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/auth/single/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        const data = response.data.result;
        setUserInfo(data);
        // console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch_user();
    }, []),
  );
  ////////////////////////////////
  // PROFIL MENUES ARRAY OBJECTS
  ////////////////////////////////
  const menuItems = [
    {icon: 'calendar-outline', label: 'Event History', route: 'Event History'},
    {icon: 'credit-card', label: 'Payment History', route: 'Payment History'},
    {icon: 'envelope', label: 'My Invitations', route: 'My Invitations'},
    {
      icon: 'person-outline',
      label: 'Account Info',
      route: 'Account Info',
    },
    {
      icon: 'lock-closed-outline',
      label: 'Change Password',
      route: 'Change Password',
    },
    // {
    //   icon: 'shield-checkmark-outline',
    //   label: 'Privacy Settings',
    //   route: '',
    // },
    {
      icon: 'chatbubbles-outline',
      label: 'Contact Support',
      route: 'Contact Support',
    },
    {
      icon: 'document-text-outline',
      label: 'Terms & Conditions',
      route: 'Terms Condition',
    },
    {icon: 'cog', label: 'Settings', route: 'Settings'},
  ];
  ////////////////////////////////
  // RETURN PROFIL IMAGE
  ////////////////////////////////
  const getImageUri = () => {
    if (!UserInfo && !UserInfo.profile_image) return null;

    // If it's already a full URL
    if (
      (!UserInfo && UserInfo.profile_image.startsWith('http')) ||
      (!UserInfo && UserInfo.profile_image.startsWith('https'))
    ) {
      return UserInfo.profile_image;
    }

    // If image is from server
    if (['custom', 'facebook', 'apple', 'google'].includes(user?.provider)) {
      return `${process.env.API_ROOT_URI}/public/user_img/${UserInfo.profile_image}`;
    }

    // Fallback
    return UserInfo.profile_image;
  };
  ////////////////////////////////
  // FETCH USER EVENTS UPCOMING
  ////////////////////////////////
  const fetch_event_history = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/guest/event-history/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data.result);
        const finder = response.data.result.filter(
          i => i.status === 'upcoming',
        );
        setEventHistory(finder);
      }
    } catch (error) {
      console.log(error);
    }
  };
  ////////////////////////////
  // FETCH MY TICKETS
  ////////////////////////////
  const fetch_ticket = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/ticket/myticket/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data.result);
        setMyTickets(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetch_ticket();
      fetch_event_history();
    }, []),
  );
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.profileHeader}>
        <Image source={{uri: getImageUri()}} style={styles.avatar} />
        <Text style={styles.name}>{UserInfo.full_name}</Text>
        <Text style={styles.email}>{UserInfo.email}</Text>
        <Text style={styles.email}>{UserInfo.phone}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎟️ {UserInfo.role}</Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('Account Info')}>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{MyTickets.length}</Text>
          <Text style={styles.statLabel}>Tickets Bought</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{EventHistory.length}</Text>
          <Text style={styles.statLabel}>Upcoming Events</Text>
        </View>
      </View>

      {/* More Menu Section */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.route)}
            style={styles.menuItem}>
            {item.icon == 'credit-card' || item.icon === 'envelope' ? (
              <FontAwesome5
                name={item.icon}
                size={18}
                color="#555"
                style={{marginRight: 12}}
              />
            ) : (
              <Ionicons
                name={item.icon}
                size={18}
                color="#555"
                style={{marginRight: 12}}
              />
            )}

            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: '25%',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 15,
    color: '#777',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
    width: 100,
  },
  badgeText: {
    color: '#1976D2',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  editBtn: {
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  statsContainer: {
    marginTop: 30,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF5722',
  },
  statLabel: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: themes.colors.BACKGROUND,
    backgroundColor: themes.colors.BACKGROUND,
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 40,
    alignItems: 'center',
    marginHorizontal: 40,
    marginBottom: 30,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
