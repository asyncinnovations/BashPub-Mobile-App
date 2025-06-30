import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EventCard from '../../components/event_card/EventCard';
import {useAuth} from '../../context/AuthContext';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import axios from 'axios';
import {DateFormate} from '../../utility/DateFormater';
import { themes } from '../../constants/themes';
const {width} = Dimensions.get('window');
const EventHistoryScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [EventHistory, setEventHistory] = useState([]);
  const [loader, setLoader] = useState(false);

  const eventHistory = [
    {
      id: 1,
      title: 'Summer Vibe Party',
      date: 'March 24, 2025',
      time: '8:00 PM',
      location: 'Downtown Club, NYC',
      ticketType: 'VIP',
      status: 'Attended',
      image:
        'https://media.istockphoto.com/id/1478375497/photo/friends-dancing-at-the-festival.jpg?s=612x612&w=0&k=20&c=rVwFBKe__UuQld6kJUWjV48kyw-40OHlnuyQZd4_lgQ=',
    },
    {
      id: 2,
      title: 'Wedding Bash',
      date: 'Feb 10, 2025',
      time: '5:00 PM',
      location: 'Riverside Banquet Hall',
      ticketType: 'General',
      status: 'Missed',
      image:
        'https://www.brides.com/thmb/J7fmR1rugaIO7V1iTcautPVSwXE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(767x410:769x412)/guests-at-reception-toasting-logal-cole-photography-twitter-0923-1b64ca7e758a4d9f93c89a7b5f708e0d.jpg',
    },
    {
      id: 3,
      title: 'Chef’s Dinner Night',
      date: 'Jan 30, 2025',
      time: '7:00 PM',
      location: 'The Gourmet Loft',
      ticketType: 'Free',
      status: 'Cancelled',
      image:
        'https://storage.googleapis.com/wzukusers/user-29222826/images/5a9ddee5d301cAftiWAa/landscape-1444323280-stocksy-txp9eee683922d000-large-403198-581552b45f9b581c0b2f4576.jpeg',
    },
  ];
  /////////////////////////////////
  // FETCH EVENT HISTRY FOR GUEST
  ////////////////////////////////
  const fetch_event_history = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/guest/event-history/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setEventHistory(response.data.result);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_event_history();
  }, []);
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
        horizontal={false}
        data={EventHistory}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListEmptyComponent={<DataNotFound text="No Event History" />}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardWrapper}>
            <EventCard
              onView={() =>
                navigation.navigate('Event Details', {event_id: item.uuid})
              }
              AddFavorit={() => {}}
              RemoveFavorit={() => {}}
              ticket_type={item.ticket_type}
              width={width * 0.48}
              title={item.title}
              banner={`${process.env.API_ROOT_URI}/public/event_img/${item.cover_image}`}
              date={DateFormate(item.start_datetime)}
              isFavorit={item.isFavorite}
              price={item.price}
              rating={item.rating}
              horizantal={false}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* {eventHistory.map(event => (
        <View key={event.id} style={styles.card}>
          <Image source={{uri: event.image}} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.dateTime}>
              <FontAwesome5 name="calendar-alt" size={14} /> {event.date} at{' '}
              {event.time}
            </Text>
            <Text style={styles.location}>
              <MaterialIcons name="location-pin" size={16} color="#777" />{' '}
              {event.location}
            </Text>
            <Text style={styles.ticket}>Ticket: {event.ticketType}</Text>
            <Text style={[styles.status, styles[`status${event.status}`]]}>
              {event.status}
            </Text>
          </View>
        </View>
      ))} */}
    </View>
  );
};

export default EventHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    height: 150,
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  ticket: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  statusAttended: {
    backgroundColor: '#C8E6C9',
    color: '#2E7D32',
  },
  statusMissed: {
    backgroundColor: '#FFE0B2',
    color: '#EF6C00',
  },
  statusCancelled: {
    backgroundColor: '#FFCDD2',
    color: '#C62828',
  },
});
