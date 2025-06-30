import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LineChart} from 'react-native-chart-kit';
import {themes} from '../../../constants/themes';
import {useAuth} from '../../../context/AuthContext';
import axios from 'axios';
const screenWidth = Dimensions.get('window').width - 32;

const DashboardScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [AllEvents, setAllEvents] = useState([]);
  const [AllSales, setAllSales] = useState([]);

  const [loader, setLoader] = useState(false);
  const [TicketSold, setTicketSold] = useState(0);
  const [TotalEarn, setTotalEarn] = useState(0);
  const [UpcomingEvent, setUpcomingEvent] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const chartData = {
    labels: AllSales.map(item => item?.date || ''),
    datasets: [
      {
        data: AllSales.map(item => {
          const revenue = parseFloat(item?.revenue);
          return isNaN(revenue) || !isFinite(revenue) ? 0 : revenue;
        }),
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };
  ////////////////////////
  // FETCH ALL EVENTS
  ///////////////////////
  useEffect(() => {
    fetch_events();
    console.log(user.user_id);
  }, []);

  const fetch_events = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/host/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        const upcoming = await response.data.result.filter(
          i => i.status == 'upcoming',
        );
        setUpcomingEvent(upcoming.length);
        setAllEvents(response.data.result);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log('Error fetching events:', error);
    }
  };

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
        const salesData = response.data.result;
        setAllSales(salesData);
        // console.log(salesData);

        let totalTickets = 0;
        let totalRevenue = 0;

        salesData.forEach(event => {
          // Sum tickets
          const tickets = event.tickets;
          for (const type in tickets) {
            totalTickets += parseInt(tickets[type], 10);
          }

          // Sum revenue
          totalRevenue += parseFloat(event.revenue || 0);
        });

        setTicketSold(totalTickets);
        setTotalEarn(totalRevenue);
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
  ///////////////////////
  // CHARTS STATS DATA
  ///////////////////////
  const stats = [
    {
      label: 'Total Events',
      value: loader ? 'Loading...' : AllEvents?.length,
      icon: 'calendar-outline',
      bg: '#E3F2FD',
      color: '#2196F3',
    },
    {
      label: 'Tickets Sold',
      value: TicketSold,
      icon: 'pricetags-outline',
      bg: '#F1F8E9',
      color: '#689F38',
    },
    {
      label: 'Total Earnings',
      value: `$${TotalEarn}`,
      icon: 'wallet-outline',
      bg: '#FFF3E0',
      color: '#FB8C00',
    },
    {
      label: 'Upcoming Events',
      value: UpcomingEvent,
      icon: 'alarm-outline',
      bg: '#FCE4EC',
      color: '#C2185B',
    },
  ];
  //////////////////have///////////////
  // PULL TO REFREASH CONTROLL
  /////////////////////////////////
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetch_events();
      fetch_ticket_sales();
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.welcome}>Welcome back, {user?.name}! 👋</Text>
      <Text style={styles.sub}>overview</Text>

      {/* FEATURE CARDS */}
      <View style={styles.grid}>
        {stats.map((item, index) => (
          <View key={index} style={[styles.card, {backgroundColor: item.bg}]}>
            <Ionicons name={item.icon} size={28} color={item.color} />
            <Text style={[styles.value, {color: item.color}]}>
              {item.value}
            </Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* CARTS REPORTS*/}
      <Text style={styles.chartTitle}>Earning reports</Text>
      {loader ? (
        <Text style={styles.chartTitle}>Loading....</Text>
      ) : AllSales.length > 0 ? (
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={{textAlign: 'center', marginVertical: 20}}>
          No earnings data to display yet.
        </Text>
      )}

      {/* Quick Actions */}
      <Text style={styles.quickTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Create Event')}>
          <Ionicons name="add-circle-outline" size={22} color="#2196F3" />
          <Text style={styles.actionText}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Invited Guests')}>
          <Ionicons name="people-outline" size={22} color="#4CAF50" />
          <Text style={styles.actionText}>Invited Guests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Ticket Sales')}>
          <Ionicons name="mail-outline" size={22} color="#FB8C00" />
          <Text style={styles.actionText}>Ticket Sales</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
  },
  sub: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '47%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
    textTransform: 'capitalize',
  },
  chart: {
    borderRadius: 12,
    marginBottom: 20,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
  },
});
