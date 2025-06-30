import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../../context/AuthContext';
import {Picker} from '@react-native-picker/picker';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
const InvitedGuestScreen = () => {
  const {user, token} = useAuth();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [AllInvitedUsers, setAllInvitedUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [InviteLoader, setInviteLoader] = useState(false);
  //////////////////////////////
  // RESEND INVITE TO GUESTS
  //////////////////////////////
  const resend_invite = async (
    user_id,
    host_id,
    event_id,
    invite_type,
    price,
  ) => {
    const data = {
      host_id: host_id,
      guest_id: user_id,
      event_id: event_id,
      invite_type: invite_type,
      price: price,
      status: 'resend',
    };
    setInviteLoader(true);
    try {
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/invitation/send`,
        data,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 201) {
        setInviteLoader(false);
        await fetch_invited_users();
        ToastAndroid.show('Invite Resent successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      setInviteLoader(false);
      console.error('Invite failed for', error);
    }
  };
  /////////////////////////////////
  // FETCH ALL INVITED USERS
  ////////////////////////////////
  useFocusEffect(
    useCallback(() => {
      fetch_invited_users();
    }, []),
  );
  const fetch_invited_users = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/auth/invited_user/${user?.user_id}`,
      );
      if (response.status == 200) {
        console.log(response.data);
        setAllInvitedUsers(response.data.result);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  //////////////////////////////
  // FILTER INVITE BY EVENTS
  //////////////////////////////
  const events = [...new Set(AllInvitedUsers.map(inv => inv.event_title))];
  const filteredInvitations = selectedEvent
    ? AllInvitedUsers.filter(inv => inv.event_title === selectedEvent)
    : AllInvitedUsers;
  /////////////////////////////////
  // RENDER INVITED USER CARD
  ////////////////////////////////
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.guest_info_txt}>{item.guest_name}</Text>
          <Text style={styles.guest_info_txt}>{item.guest_email}</Text>
        </View>
        <View
          style={[styles.statusBadge, styles[`status_${item.invite_status}`]]}>
          <Text style={styles.statusText}>{item.invite_status}</Text>
        </View>
      </View>
      <View style={styles.detail}>
        <MaterialIcons name="event" size={18} color={themes.colors.SECONDARY} />
        <Text style={styles.invite_type}>Event: {item.event_title}</Text>
      </View>
      <View style={styles.detail}>
        <MaterialIcons name="chair" size={18} color={themes.colors.SECONDARY} />
        <Text style={styles.invite_type}>Type: {item.invite_type}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          disabled={item.invite_status == 'accept'}
          style={styles.resendBtn}
          onPress={() =>
            resend_invite(
              item.invite_guest_id,
              item.invite_host_id,
              item.event_id,
              item.invite_type,
              item.ticket_price,
            )
          }>
          <Ionicons name="send-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>
            {InviteLoader ? 'Sending...' : 'Resend'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={item.invite_status == 'accept'}
          style={styles.cancelBtn}>
          <Ionicons name="close-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  /////////////////////////////////
  // PULL REFRESH TO FETCH DATA
  ////////////////////////////////
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetch_invited_users();
    setIsRefreshing(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.event_filter}>
        <Picker
          selectedValue={selectedEvent}
          onValueChange={itemValue => setSelectedEvent(itemValue)}
          style={styles.picker}>
          <Picker.Item label="All Events" value="" />
          {events.map(event => (
            <Picker.Item key={event} label={event} value={event} />
          ))}
        </Picker>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={filteredInvitations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No invitations found.</Text>
        }
      />
    </View>
  );
};

export default InvitedGuestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  event_filter: {
    padding: 1,
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },

  card: {
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    margin: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guest_info_txt: {
    textTransform: 'capitalize',
    fontSize: 14,
    color: themes.colors.TEXT_DARK,
  },
  detail: {
    fontSize: 14,
    color: themes.colors.TEXT_DARK,
    marginTop: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  status_pending: {
    backgroundColor: '#FFF9C4',
  },
  status_accepted: {
    backgroundColor: '#C8E6C9',
  },
  status_declined: {
    backgroundColor: '#FFCDD2',
  },
  invite_type: {
    fontSize: 14,
    width: '100%',
    textTransform: 'capitalize',
    color: themes.colors.TEXT_DARK,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: themes.colors.TEXT_DARK,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  resendBtn: {
    backgroundColor: themes.colors.SECONDARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  cancelBtn: {
    backgroundColor: themes.colors.ERROR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  actionText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
