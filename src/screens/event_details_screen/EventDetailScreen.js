import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import {useFocusEffect} from '@react-navigation/native';
import {DateFormate} from '../../utility/DateFormater';
import FastImage from 'react-native-fast-image';
import {themes} from '../../constants/themes';
import axios from 'axios';

const EventDetailScreen = ({navigation, route}) => {
  const {user, token} = useAuth();
  const event_id = route.params.event_id;
  const [SingleEvent, setSingleEvent] = useState({});
  const [loader, setLoader] = useState(false);
  const [isJoined, setIsJoined] = useState(true);
  //////////////////////////////
  // FETCH EVENT BY EVENT ID
  //////////////////////////////

  const fetch_all_events = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/single/${event_id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        setLoader(false);
        console.log(response.data.result);
        setSingleEvent(response.data.result);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch_all_events();
    }, [event_id]),
  );
  //////////////////////////////
  // SEND REQUEST TO JOIN
  //////////////////////////////
  const send_request = async () => {
    try {
      const data = {
        guest_id: user?.user_id,
        event_id: event_id,
        message: 'I would like to join this event.',
        status: 'pending',
      };

      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/join_request/create`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 201) {
        fetch_joined_request();
        ToastAndroid.show('Request Send successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////
  // FETCH JOINED REQUEST
  ///////////////////////////
  const fetch_joined_request = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/join_request/user/${user?.user_id}/${event_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setIsJoined(response.data.response.length > 0);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_joined_request();
    console.log(event_id);
  }, []);
  //////////////////////////////
  // BUY TICKET
  //////////////////////////////

  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {SingleEvent !== undefined || Object.keys(SingleEvent).length > 0 ? (
        <View style={styles.details}>
          {SingleEvent.cover_image && (
            <FastImage
              source={{
                uri: `${process.env.API_ROOT_URI}/public/event_img/${SingleEvent?.cover_image}`,
                cache: FastImage.cacheControl.cacheOnly,
                priority: FastImage.priority.high,
              }}
              style={styles.image}
            />
          )}
          <Text style={styles.title}>{SingleEvent.title}</Text>
          <View style={styles.rows}>
            <Text style={styles.label}>📍 Location:</Text>
            <Text style={styles.value}>{SingleEvent.location}</Text>
          </View>
          <View style={styles.rows}>
            <Text style={styles.label}>🗓 Start:</Text>
            <Text style={styles.value}>
              {DateFormate(SingleEvent.start_datetime)}
            </Text>
          </View>

          <View style={styles.rows}>
            <Text style={styles.label}>🕒 End:</Text>
            <Text style={styles.value}>
              {DateFormate(SingleEvent.end_datetime)}
            </Text>
          </View>

          <View style={styles.rows}>
            <Text style={styles.label}>🎟 Ticket Type:</Text>
            <Text style={styles.value}>{SingleEvent.ticket_type}</Text>
          </View>
          <View style={styles.rows}>
            <Text style={styles.label}>🔞 Age Restriction:</Text>
            <Text style={styles.value}>{SingleEvent.age_restriction}</Text>
          </View>

          <View style={styles.rows}>
            <Text style={styles.label}>👥 Max Guests:</Text>
            <Text style={styles.value}>{SingleEvent.max_guests}</Text>
          </View>

          <View style={styles.rows}>
            <Text style={styles.label}>📌 Event Type:</Text>
            <Text style={styles.value}>{SingleEvent.category_name}</Text>
          </View>

          <View style={styles.rows}>
            <Text style={styles.label}>🔐 Visibility:</Text>
            <Text style={styles.value}>{SingleEvent.visibility}</Text>
          </View>

          <View style={styles.rows}>
            <Text style={styles.label}>📊 Status:</Text>
            <Text style={styles.value}>{SingleEvent.status}</Text>
          </View>
          <View style={{paddingVertical: 10}}>
            <Text style={styles.description_label}>🧾 Description</Text>
            <Text style={styles.description}>{SingleEvent.description}</Text>
          </View>
          {SingleEvent.allow_request_to_join ? (
            <TouchableOpacity
              onPress={send_request}
              disabled={isJoined}
              style={[styles.JoinRequestBtn]}>
              <Text style={styles.btn_txt}>
                {isJoined ? 'Joined' : 'Join Request'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.BuyTicketBtn]}>
              <Text style={styles.btn_txt}>Buy ticket</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <DataNotFound />
      )}
    </ScrollView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  rows: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontWeight: '600',
    width: '50%',
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    textTransform: 'capitalize',
    width: '50%',
  },

  JoinRequestBtn: {
    marginTop: 30,
    padding: 12,
    backgroundColor: themes.colors.SECONDARY,
    borderRadius: 8,
    alignItems: 'center',
  },
  BuyTicketBtn: {
    marginTop: 30,
    padding: 12,
    backgroundColor: themes.colors.PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
  },
  btn_txt: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    width: '100%',
    textAlign: 'center',
    color: themes.colors.TEXT_LIGHT,
  },
  description_label: {
    fontSize: themes.font.size.large,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
});
