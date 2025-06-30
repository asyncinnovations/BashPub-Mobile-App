import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  ToastAndroid,
  RefreshControl,
  ActivityIndicator,
  Button,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import CategoryCard from '../../components/category_card/CategoryCard';
import UpcomingCard from '../../components/event_card/UpcomingCard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EventCard from '../../components/event_card/EventCard';
import {useFocusEffect} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import {DateFormate} from '../../utility/DateFormater';
import Icons from 'react-native-vector-icons/Ionicons';
import {useStripe} from '@stripe/stripe-react-native';
import {useAuth} from '../../context/AuthContext';
import {themes} from '../../constants/themes';
const {width} = Dimensions.get('window');
import axios from 'axios';
const DiscoverEventScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [AllEventType, setAllEventType] = useState([]);
  const [AllEvents, setAllEvents] = useState([]);
  const [UpcomingEvent, setUpcomingEvent] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  /////////////////////////
  // FETCH ALL EVENT TYPES
  /////////////////////////
  const fetch_event_types = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event_type/all`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        setLoader(false);
        console.log(response.data);
        setAllEventType(response.data.result);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetch_event_types();
      fetch_all_events();
    }, []),
  );
  //////////////////////////////
  // FETCH ALL UPCOMING EVENTS
  //////////////////////////////
  const fetch_all_events = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/favorits/${user?.user_id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.status === 200) {
        console.log(response.data);
        const upcoming = response.data.result.filter(
          items => items.status === 'upcoming',
        );
        const allevents = response.data.result.filter(
          items => items.status !== 'upcoming',
        );
        setUpcomingEvent(upcoming);
        setAllEvents(allevents);
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
  /////////////////////////////////
  // PULL TO REFREASH CONTROLL
  /////////////////////////////////
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetch_event_types();
      fetch_all_events();
    }, 2000);
  };
  const SectionTitle = ({title, subtitle}) => {
    return (
      <View style={styles.heading_box}>
        <Text style={styles.heading_title}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={styles.heading_sub}>{subtitle}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
      </View>
    );
  }
  /////////////////////////
  // INITALIZE APPLE PAY
  /////////////////////////
  const handleApplePay = async () => {
    const {presentApplePay, confirmApplePayPayment} = useStripe();

    // 1. Present Apple Pay sheet
    const {error: presentError} = await presentApplePay({
      cartItems: [
        {
          label: 'Item 1',
          amount: '9.99',
        },
      ],
      country: 'US',
      currency: 'USD',
    });

    if (presentError) {
      console.error('Apple Pay Sheet Error:', presentError);
      return;
    }

    // 2. Get client secret from your backend (REQUIRED)
    const clientSecret = await fetchClientSecretFromBackend(); // <--- YOU MUST IMPLEMENT THIS

    // 3. Confirm payment
    const {error: confirmError} = await confirmApplePayPayment(clientSecret);

    if (confirmError) {
      console.error('Apple Pay Payment Confirmation Error:', confirmError);
    } else {
      console.log('✅ Apple Pay Payment Successful!');
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* <Button title="apple pay" onPress={handleApplePay} />  */}

      {/* EVENT SEARCHING */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        style={styles.search_box}>
        <Icons name="search" size={16} color={themes.colors.PRIMARY} />
        <TextInput
          readOnly
          style={styles.search_input}
          placeholder="Search Event"
          keyboardType="ascii-capable"
        />
        <TouchableOpacity disabled>
          <FontAwesome name="search" size={25} color={themes.colors.PRIMARY} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* <ScrollView horizontal>
        <TouchableOpacity style={styles.filter_btn}>
          <Text style={styles.filter_btn_txt}>public</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filter_btn}>
          <Text style={styles.filter_btn_txt}>vip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filter_btn}>
          <Text style={styles.filter_btn_txt}>free</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filter_btn}>
          <Text style={styles.filter_btn_txt}>regular</Text>
        </TouchableOpacity>
      </ScrollView> */}

      {/* EVENT CATEGORY */}
      <View style={styles.event_category}>
        <SectionTitle title="categories" subtitle="see all" />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {AllEventType.length > 0 ? (
            AllEventType.map((items, index) => (
              <CategoryCard
                onPress={() =>
                  navigation.navigate('Category Event', {
                    category_id: items.uuid,
                  })
                }
                horizontal={true}
                image={`${process.env.API_ROOT_URI}/public/event_type_img/${items.icon}`}
                title={items.name}
                key={index}
              />
            ))
          ) : (
            <DataNotFound />
          )}
        </ScrollView>
      </View>

      {/* UPCOMMING EVENTS */}
      <View style={styles.upcoming_events}>
        <SectionTitle title="Upcoming Events" subtitle="" />
        {UpcomingEvent.length > 0 ? (
          <Carousel
            loop
            width={width}
            height={200}
            autoPlay={true}
            data={UpcomingEvent}
            scrollAnimationDuration={3000}
            renderItem={({item, index}) => (
              <UpcomingCard
                onView={() => {}}
                AddFavorit={() => add_favorit(item.uuid)}
                RemoveFavorit={() => remove_favorit(item.uuid)}
                favorit={item.isFavorite}
                event_banner={`${process.env.API_ROOT_URI}/public/event_img/${item.cover_image}`}
                event_date={DateFormate(item.start_datetime)}
                event_time={item.end_datetime}
                event_category={item.category_name}
                event_host={{name: 'Corbay', img: ''}}
                event_title={item.title}
                key={index}
              />
            )}
          />
        ) : (
          <DataNotFound />
        )}
      </View>

      {/* EVENTS FOR YOU */}
      <View style={styles.event_foryou}>
        <SectionTitle title="events for you" subtitle="" />
        <FlatList
          horizontal={false}
          scrollEnabled={false}
          data={AllEvents}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          ListEmptyComponent={<DataNotFound />}
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
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScrollView>
  );
};

export default DiscoverEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    marginBottom: '25%',
  },
  heading_box: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  heading_title: {
    fontSize: 18,
    fontWeight: '600',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
  },
  heading_sub: {
    fontSize: 14,
    fontWeight: '400',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.TEXT_DARK,
  },
  search_box: {
    // elevation: 2,
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    backgroundColor: themes.colors.BACKGROUND,
    borderColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    padding: 10,
  },
  search_input: {
    padding: 5,
    width: '85%',
  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: width * 0.9,
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#eee',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  // filter_btn
  filter_btn: {
    padding: 5,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 30,
  },
  filter_btn_txt: {
    color: themes.colors.TEXT_DARK,
    fontSize: 14,
    fontWeight: '400',
    textTransform: 'capitalize',
    width: '100%',
  },
});
