import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import DataNotFound from '../../../components/data_notfound/DataNotFound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DateFormate} from '../../../utility/DateFormater';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../../context/AuthContext';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
const EventListScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [AllEvents, setAllEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);

  ////////////////////////
  // DELETE SINGLE EVENTS
  ///////////////////////
  const delete_event = async id => {
    Alert.alert('Permission', 'are you sure you want to delte this event?', [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const response = await axios.delete(
              `${process.env.API_ROOT_URI}/api/event/delete/${id}`,
              {headers: {Authorization: `Bearer ${token}`}},
            );
            if (response.status == 200) {
              fetch_events();
              ToastAndroid.show('Event Delete Success', ToastAndroid.SHORT);
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  ////////////////////////
  // FETCH ALL EVENTS
  ///////////////////////
  useEffect(() => {
    fetch_events();
  }, []);
  const fetch_events = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/host/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        setLoader(false);
        console.log(response.data);
        setAllEvents(response.data.result);
      }
    } catch (error) {
      setLoader(false);
      console.logg(error);
    }
  };

  //////////////////have///////////////
  // PULL TO REFREASH CONTROLL
  /////////////////////////////////
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetch_events();
    }, 2000);
  };
  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={AllEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={({item: event}) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={[styles.status, styles[`status_${event.status}`]]}>
                <Text style={styles.statusText}>{event.status}</Text>
              </View>
            </View>

            <Text style={styles.detail}>
              <Ionicons name="calendar-outline" size={14} />{' '}
              {DateFormate(event.start_datetime)}
            </Text>
            <Text style={styles.detail}>
              <Ionicons name="calendar-outline" size={14} />{' '}
              {DateFormate(event.end_datetime)}
            </Text>
            <Text style={styles.detail}>
              <Ionicons name="location-outline" size={14} /> {event.location}
            </Text>
            <Text style={styles.detail}>
              <MaterialIcons name="confirmation-number" size={14} /> Tickets
              Sold: {30}
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn_style, styles.inviteBtn]}
                onPress={() =>
                  navigation.navigate('Invite Guests', {
                    event_id: event.uuid,
                    invite_type: event.ticket_type,
                    host_id: event.host_id,
                    price: event.price,
                  })
                }>
                <Text style={styles.btnText}>Invite</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn_style, styles.viewBtn]}>
                <Text style={styles.btnText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn_style, styles.editBtn]}
                onPress={() =>
                  navigation.navigate('Update Event', {event_id: event.uuid})
                }>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn_style, styles.deleteBtn]}
                onPress={() => delete_event(event.uuid)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<DataNotFound />}
        contentContainerStyle={
          AllEvents.length === 0 && {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default EventListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  status_upcoming: {
    backgroundColor: '#E3F2FD',
  },
  status_completed: {
    backgroundColor: '#C8E6C9',
  },
  status_cancelled: {
    backgroundColor: '#FFCDD2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'capitalize',
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  viewBtn: {
    backgroundColor: themes.colors.PRIMARY,
  },
  editBtn: {
    backgroundColor: themes.colors.SUCCESS,
  },

  deleteBtn: {
    backgroundColor: themes.colors.ERROR,
  },
  inviteBtn: {
    backgroundColor: themes.colors.SECONDARY,
  },
  btnText: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  btn_style: {
    backgroundColor: themes.colors.SECONDARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
