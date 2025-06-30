import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EventCard from '../../components/event_card/EventCard';
import {DateFormate} from '../../utility/DateFormater';
import {useAuth} from '../../context/AuthContext';
import React, {useCallback, useEffect, useState} from 'react';
import {themes} from '../../constants/themes';
import {events} from '../../utility/events';
const {width} = Dimensions.get('window');
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
const FavoritScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const favoriteItems = events;
  const [FavoritEvent, setFavoritEvent] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  //////////////////////////////
  // FETCH ALL UPCOMING EVENTS
  //////////////////////////////

  useFocusEffect(
    useCallback(() => {
      fetch_all_events();
    }, []),
  );
  const fetch_all_events = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/favorites/${user?.user_id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status == 200) {
        console.log(response.data);
        setFavoritEvent(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////
  // ADD EVENT TO FAVORITS
  //////////////////////////////
  const add_favorit = async event_id => {
    try {
      const data = {
        user_id: user?.user_id,
        event_id: event_id,
      };
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/favorites/add`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 201) {
        fetch_all_events();
        ToastAndroid.show('Event Favorit Added', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////
  // REMOVE EVENT TO FAVORITS
  //////////////////////////////
  const remove_favorit = async event_id => {
    try {
      const response = await axios.delete(
        `${process.env.API_ROOT_URI}/api/favorites/remove/${user?.user_id}/${event_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        fetch_all_events();
        ToastAndroid.show('Event Favorit Removed', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////have///////////////
  // PULL TO REFREASH CONTROLL
  /////////////////////////////////
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetch_all_events();
    }, 2000);
  };
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="heart-o" size={50} color={themes.colors.GRAY} />
      <Text style={styles.emptyText}>No favorites yet</Text>
      <Text style={styles.subText}>
        Tap the heart icon to add your favorite events
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={false}
        data={FavoritEvent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardWrapper}>
            <EventCard
              onView={() =>
                navigation.navigate('Event Details', {event_id: item.uuid})
              }
              AddFavorit={() => add_favorit(item.uuid)}
              RemoveFavorit={() => remove_favorit(item.uuid)}
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
        // contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState()}
        contentContainerStyle={favoriteItems.length === 0 && {flex: 1}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FavoritScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themes.colors.TEXT_DARK,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: themes.colors.TEXT_DARK,
    marginTop: 16,
  },
  subText: {
    fontSize: 14,
    color: themes.colors.GRAY,
    marginTop: 8,
    textAlign: 'center',
  },
});
