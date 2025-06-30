import {
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import EventCard from '../../components/event_card/EventCard';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import { DateFormate } from '../../utility/DateFormater';
const {width, height} = Dimensions.get('window');
const CategoryScreen = ({route}) => {
  const {user, token} = useAuth();
  const {category_id} = route.params;
  const [loader, setLoader] = useState(false);
  const [AllEvents, setAllEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  //////////////////////////////
  // FETCH EVENT BY EVENT ID
  //////////////////////////////
  useEffect(() => {
    fetch_all_events();
  }, [category_id]);

  const fetch_all_events = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/category/${category_id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        console.log(response.data)
        setLoader(false);
        setAllEvents(response.data.data);
      }
    } catch (error) {
      setLoader(false);
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
  return (
    <View style={styles.container}>
      {/* <Text>{category_id}</Text> */}
      <FlatList
        horizontal={false}
        data={AllEvents}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardWrapper}>
            <EventCard
              onView={() => {}}
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
        ListEmptyComponent={<DataNotFound />}
        // contentContainerStyle={AllEvents.length === 0 && {flex: 1}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({});
