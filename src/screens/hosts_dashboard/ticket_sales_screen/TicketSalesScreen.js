import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import DataNotFound from '../../../components/data_notfound/DataNotFound';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../../constants/themes';
import {useAuth} from '../../../context/AuthContext';
import {useEffect} from 'react';
import axios from 'axios';

const TicketSalesScreen = () => {
  const {user, token} = useAuth();
  const [AllSales, setAllSales] = useState([]);
  const [loader, setLoader] = useState(false);

  ///////////////////////
  // FETCH TICKET SALES
  ///////////////////////
  const fetch_ticket_sales = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/ticket/sales/${user?.user_id}`,
      );
      if (response.status === 200) {
        setLoader(false);
        console.log(response.data.result);
        setAllSales(response.data.result);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_ticket_sales();
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
      {AllSales.length > 0 ? (
        AllSales.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.eventName}>{item.event}</Text>
            <Text style={styles.date}>
              <Ionicons name="calendar-outline" size={14} /> {item.date}
            </Text>

            <View style={styles.tickets}>
              <Text style={styles.ticketType}>
                🎟️ VIP:{' '}
                <Text style={styles.ticketCount}>{item.tickets.vip}</Text>
              </Text>
              <Text style={styles.ticketType}>
                🎫 General:{' '}
                <Text style={styles.ticketCount}>{item.tickets.general}</Text>
              </Text>
              <Text style={styles.ticketType}>
                🆓 Free:{' '}
                <Text style={styles.ticketCount}>{item.tickets.free}</Text>
              </Text>
            </View>

            <Text style={styles.revenue}>
              {/* <MaterialIcons name="attach-money" size={18} color="#388E3C" /> */}
              Revenue: ${item.revenue.toLocaleString()}
            </Text>
          </View>
        ))
      ) : (
        <DataNotFound />
      )}
    </ScrollView>
  );
};

export default TicketSalesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
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
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  tickets: {
    marginBottom: 12,
  },
  ticketType: {
    fontSize: 14,
    color: '#444',
    marginVertical: 2,
  },
  ticketCount: {
    fontWeight: '700',
  },
  revenue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#388E3C',
    marginTop: 6,
  },
});
