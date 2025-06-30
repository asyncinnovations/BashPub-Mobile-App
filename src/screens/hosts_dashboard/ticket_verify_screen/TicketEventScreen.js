import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useAuth} from '../../../context/AuthContext';
import {DateFormate} from '../../../utility/DateFormater';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const TicketEventScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [AllEvents, setAllEvents] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);
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
        console.log(response.data.result);
        setAllEvents(response.data.result);
      }
    } catch (error) {
      setLoader(false);
      console.logg(error);
    }
  };

  /////////////////////////////////
  // RENDER TICKET EVENT CARD ITEM
  /////////////////////////////////
  const renderItem = ({event, index}) => {
    return (
      <View style={styles.card} key={index}>
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
          <MaterialIcons name="confirmation-number" size={14} /> Tickets Sold:{' '}
          {30}
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
    );
  };
  /////////////////////////////////
  // PULL TO REFREASH CONTROLL
  /////////////////////////////////
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetch_events();
    setIsRefreshing(false);
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
              Sold: {event.total_sold}
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.btn_style}
                onPress={() =>
                  navigation.navigate('Verify Guest', {
                    event_id: event.invite_event_id,
                  })
                }>
                <Text style={styles.btnText}>verify guest</Text>
                <MaterialIcons
                  size={20}
                  color={themes.colors.TEXT_LIGHT}
                  name="arrow-right-alt"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No invitations found.</Text>
        }
        contentContainerStyle={
          AllEvents.length === 0 && {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
      />
    </View>
  );
};

export default TicketEventScreen;

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

  btnText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '400',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  btn_style: {
    backgroundColor: themes.colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
