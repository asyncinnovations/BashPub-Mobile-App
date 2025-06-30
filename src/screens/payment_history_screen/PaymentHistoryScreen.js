import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useAuth} from '../../context/AuthContext';
import {themes} from '../../constants/themes';
import axios from 'axios';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import {DateFormate} from '../../utility/DateFormater';
const PaymentHistoryScreen = () => {
  const {user, token} = useAuth();
  const [PaymentHistory, setPaymentHistory] = useState([]);
  const [loader, setLoader] = useState(false);
  /////////////////////////////////
  // FETCH EVENT HISTRY FOR GUEST
  ////////////////////////////////
  const fetch_event_history = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/transaction/user/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setPaymentHistory(response.data.result);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error.response);
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
    <ScrollView style={styles.container}>
      {PaymentHistory.length > 0 ? (
        PaymentHistory.map(payment => (
          <View key={payment.id} style={styles.card}>
            <View style={styles.row}>
              <FontAwesome5 name="calendar-alt" size={14} color="#888" />
              <Text style={styles.date}>
                {' '}
                {DateFormate(payment.created_at)}
              </Text>
            </View>
            <Text style={styles.event}>{payment.title}</Text>
            <Text style={styles.ticket}>Method: {payment.method}</Text>
            <Text style={styles.amount}>Amount: ${payment.amount}</Text>
            <Text style={[styles.status, styles[`status${payment.status}`]]}>
              {payment.status}
            </Text>
          </View>
        ))
      ) : (
        <DataNotFound text="No Transaction History" />
      )}
    </ScrollView>
  );
};

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  event: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  ticket: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  amount: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statussuccess: {
    backgroundColor: '#C8E6C9',
    color: '#2E7D32',
  },
  statusrefunded: {
    backgroundColor: '#FFF9C4',
    color: '#F57F17',
  },
  statusfailed: {
    backgroundColor: '#FFCDD2',
    color: '#C62828',
  },
});
