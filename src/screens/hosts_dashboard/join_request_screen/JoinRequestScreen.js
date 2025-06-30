import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../../context/AuthContext';
import {Picker} from '@react-native-picker/picker';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
const JoinRequestScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [AllEvents, setAllEvents] = useState([]);
  const [JoinRequest, setJoinRequest] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //////////////////////////
  // UPDATE REQUEST STATUS//
  //////////////////////////
  const update_status = async (status, request_id, event_id) => {
    try {
      const response = await axios.put(
        `${process.env.API_ROOT_URI}/api/join_request/${request_id}`,
        {status},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        await fetch_join_request(event_id);
        await fetch_events();
        ToastAndroid.show('Request ' + status + '', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };
  ////////////////////////
  // FETCH ALL EVENTS
  ///////////////////////
  const fetch_events = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/host/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        console.log(response.data);
        setAllEvents(response.data.result);
      }
    } catch (error) {
      console.logg(error);
    }
  };
  ////////////////////////
  // FETCH ALL EVENTS
  ///////////////////////
  const fetch_join_request = async event_id => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/join_request/${event_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        console.log(response.data)
        setJoinRequest(response.data.response);
      }
    } catch (error) {
      console.logg(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch_events();
    }, []),
  );
  /////////////////////////////////
  // RENDER INVITED USER CARD
  ////////////////////////////////
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.guest_info_txt}>{item.username}</Text>
          <Text style={styles.guest_info_txt}>{item.email}</Text>
        </View>
        <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.detail}>
        <Text style={styles.invite_type}>Event: {item.event_title}</Text>
        <Text style={styles.invite_type}>message: {item.message}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          disabled={item.status == 'approved'}
          style={styles.resendBtn}
          //   onPress={() => update_status('approved', item.uuid, item.event_id)}
          onPress={() => {
            navigation.navigate('Approve Request', {
              request_id: item.uuid,
              event_id: item.event_id,
              guest_id: item.guest_id,
            });
          }}>
          <Ionicons name="send-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={item.status == 'rejected'}
          onPress={() => update_status('rejected', item.uuid, item.event_id)}
          style={styles.cancelBtn}>
          <Ionicons name="close-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  /////////////////////////////////
  // PULL REFRESH TO FETCH DATA
  ////////////////////////////////
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetch_events();
    setIsRefreshing(false);
  };
  //////////////////////////////
  // RENDER ELEMENTS
  //////////////////////////////

  return (
    <View style={styles.container}>
      <View style={styles.event_filter}>
        <Picker
          selectedValue={selectedEvent}
          onValueChange={itemValue => fetch_join_request(itemValue)}
          style={styles.picker}>
          <Picker.Item label="All Events" value="" />
          {AllEvents.map((event, index) => (
            <Picker.Item key={index} label={event.title} value={event.uuid} />
          ))}
        </Picker>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={JoinRequest}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Request found.</Text>
        }
      />
    </View>
  );
};

export default JoinRequestScreen;

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
    alignItems: 'center',
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
    gap: 3,
  },
  actionText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '400',
    fontSize: 14,
    textTransform: 'capitalize',
    width: 'auto',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
