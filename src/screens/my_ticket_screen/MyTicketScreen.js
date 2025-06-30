import TicketCard from '../../components/ticket_card/TicketCard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  processColor,
  ActivityIndicator,
  ToastAndroid,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {my_tickets} from '../../utility/my_tickets';
import {themes} from '../../constants/themes';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {DateFormate} from '../../utility/DateFormater';
import {useStripe} from '@stripe/stripe-react-native';

const MyTicketScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [MyTickets, setMyTickets] = useState([]);
  const [loader, setLoader] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const [screenReady, setScreenReady] = useState(false);
  const [AllTransaction, setAllTransaction] = useState([]);
  const [LoadingState, setLoadingState] = useState({
    ticket_fetch: false,
    intent_create: false,
    txn_create: false,
    fetch_evn_txn: false,
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Tickets 🎟️',
    });
  }, [navigation]);
  ////////////////////////////
  // FETCH MY TICKETS
  ////////////////////////////
  const fetch_ticket = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/ticket/myticket/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setLoader(false);
        setMyTickets(response.data.result);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_ticket();
  }, [user?.user_id]);
  //////////////////////////
  // CREATE PAYMENT INTENT
  //////////////////////////
  // When screen is focused and mounted
  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setScreenReady(true);
      });
      return () => {
        setScreenReady(false);
        task.cancel();
      };
    }, []),
  );
  const create_payment_intent = async (
    quantity,
    ticket_price,
    ticket_type,
    event_id,
  ) => {
    try {
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/stripe_payment/checkout`,
        {
          amount: parseInt(ticket_price) * 100,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );

      if (response.status === 201) {
        // const clientSecret = response.data.clientSecret;
        console.log(response.data);
        const clientSecret = response.data.clientSecret;
        InteractionManager.runAfterInteractions(() => {
          initializePaymentSheet(
            clientSecret,
            quantity,
            ticket_price,
            ticket_type,
            event_id,
          );
        });
      }
    } catch (err) {
      console.log(err.response);
    }
  };
  /////////////////////////
  // INITIALIZE PAYMENT UI
  /////////////////////////
  const initializePaymentSheet = async (
    secrets,
    quantity,
    ticket_price,
    ticket_type,
    event_id,
  ) => {
    const {error} = await initPaymentSheet({
      paymentIntentClientSecret: secrets,
      merchantDisplayName: 'BashPub',
    });
    console.log(error);
    if (!error) {
      openPaymentSheet(quantity, ticket_price, ticket_type, event_id); // ✅ Proceed to show payment UI
    } else {
      console.log(`Payment sheet init failed: ${error.message}`);
    }
  };
  /////////////////////////
  // DISPLAY PAYMENT UI
  /////////////////////////
  const openPaymentSheet = async (
    quantity,
    ticket_price,
    ticket_type,
    event_id,
  ) => {
    const {error} = await presentPaymentSheet();
    if (error) {
      console.log(`Error: ${error.message}`);
    } else {
      ToastAndroid.show('Payment Successfull', ToastAndroid.SHORT);
      await record_transaction('', ticket_price, 'stripe', event_id);
      // navigation.replace('Payment Success');
    }
  };
  ///////////////////////////
  // RECORD TRANSACTIONSS
  ///////////////////////////
  const record_transaction = async (
    reference_id,
    amount,
    method = 'stripe',
    event_id,
  ) => {
    try {
      const data = {
        user_id: user?.user_id,
        user_role: user?.role,
        type: 'payment',
        reference_id: reference_id | 'ref_20250508_xyz',
        event_id: event_id,
        method: method,
        amount: amount,
        currency: 'USD',
        status: 'success',
        note: 'Ticket Purchasing',
      };

      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/transaction/create`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 201) {
        fetch_ticket();
        ToastAndroid.show('Transactin Recorded', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////
  // RECORD TRANSACTIONSS
  ///////////////////////////
  const fetch_all_events_transaction = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/transaction/user/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        setAllTransaction(response.data.result);
        console.log(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_all_events_transaction();
  }, []);
  ////////////////////////////
  // FETCH LOADER
  ////////////////////////////
  // const isPaid = (event_id, status) => {
  //   return AllTransaction.some(
  //     i =>
  //       i.event_id == event_id &&
  //       i.user_id == user?.user_id &&
  //       i.status == 'success',
  //   );
  // };

  ////////////////////////////
  // FETCH LOADER
  ////////////////////////////
  // if (loader) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
  //     </View>
  //   );
  // }
  ////////////////////////////
  // RENDER EMPTY STATE
  ////////////////////////////
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="ticket-alt" size={50} color={themes.colors.GRAY} />
      <Text style={styles.emptyText}>No Tickets Yet</Text>
      <Text style={styles.subText}>
        Your upcoming event tickets will appear here.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MyTickets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          const isPaid = AllTransaction.some(
            i =>
              i.event_id === item.event_id &&
              i.user_id === user?.user_id &&
              i.status === 'success',
          );

          const showButton = item.status === 'approved';

          return (
            <TicketCard
              event_title={item.title}
              quantity={item.quantity}
              end_datetime={DateFormate(item.end_datetime)}
              start_datetime={DateFormate(item.start_datetime)}
              ticket_date={DateFormate(item.ticket_date)}
              status={item.status}
              ticket_type={item.ticket_type}
              venue={item.location}
              ticket_price={parseInt(item.price)}
              button_element={
                showButton ? (
                  <TouchableOpacity
                    disabled={isPaid}
                    onPress={() => {
                      if (!screenReady) {
                        ToastAndroid.show(
                          'Please wait for screen to load',
                          ToastAndroid.SHORT,
                        );
                        return;
                      }
                      create_payment_intent(
                        item.quantity,
                        item.price,
                        item.ticket_type,
                        item.event_id,
                      );
                    }}
                    style={{
                      backgroundColor: isPaid ? 'gray' : '#007bff',
                      padding: 10,
                      borderRadius: 5,
                      marginTop: 10,
                    }}>
                    <Text style={{color: '#fff', textAlign: 'center'}}>
                      {isPaid ? 'Paid' : 'Pay Now'}
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          );
        }}
        ListEmptyComponent={renderEmptyState()}
        contentContainerStyle={MyTickets.length === 0 && {flex: 1}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyTicketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 10,
    marginBottom: '25%',
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
  ticketCard: {
    backgroundColor: themes.colors.CARD,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#fff',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'dashed',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: themes.colors.TEXT_DARK,
  },
  ticketDate: {
    fontSize: 14,
    color: themes.colors.PRIMARY,
    marginTop: 4,
  },
  ticketLocation: {
    fontSize: 13,
    color: themes.colors.GRAY,
    marginTop: 2,
  },
});
