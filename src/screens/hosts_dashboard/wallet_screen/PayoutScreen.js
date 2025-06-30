import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {themes} from '../../../constants/themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useAuth} from '../../../context/AuthContext';
import {DateFormate} from '../../../utility/DateFormater';
import DataNotFound from '../../../components/data_notfound/DataNotFound';
import {useFocusEffect} from '@react-navigation/native';
const PayoutScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [AllTransaction, setAllTransaction] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [Balance, setBalance] = useState(0);

  const totalPendingAmount = AllTransaction.filter(
    i => i.status === 'pending',
  ).reduce((sum, i) => sum + Number(i.amount), 0);
  const totalApprovedAmount = AllTransaction.filter(
    i => i.status === 'approved',
  ).reduce((sum, i) => sum + Number(i.amount), 0);
  const totalEarning = AllTransaction.reduce(
    (sum, i) => sum + Number(i.amount),
    0,
  );

  const payoutSummary = {
    totalEarned: totalEarning,
    pending: totalPendingAmount,
    paid: totalApprovedAmount,
  };

  ////////////////////////////
  // FETCH ALL PAYOUT HISTORY
  ////////////////////////////
  const fetch_balance = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/wallet/user/${user?.user_id}/host`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        setLoader(false);
        console.log(response.data);
        const {balance} = response.data.result[0];
        setBalance(balance);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetch_balance();
    }, []),
  );
  ////////////////////////////
  // FETCH ALL PAYOUT HISTORY
  ////////////////////////////
  const fetch_payout = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/payout/history/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        setLoader(false);
        console.log(response.data);
        setAllTransaction(response.data.results);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_payout();
    console.log(user);
  }, []);
  /////////////////////////////////
  // PULL TO REFREASH CONTROLL
  /////////////////////////////////
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetch_payout();
      fetch_balance();
    }, 2000);
  };
  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
      </View>
    );
  }
  const renderStatusBadge = status => {
    let bgColor = '#ccc';
    if (status === 'approved') bgColor = '#C8E6C9';
    if (status === 'pending') bgColor = '#FFF9C4';

    return (
      <View style={[styles.statusBadge, {backgroundColor: bgColor}]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.balance_card}>
        <Text style={styles.summaryTitle}>Wallet Balance</Text>
        <Text style={styles.balance_card_amount}>
          ${loader ? 'Loading...' : Balance || 0}
        </Text>
      </View>
      {/* Earnings Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Total</Text>
          <Text style={styles.summaryAmount}>
            ${`${loader ? 'Loading...' : payoutSummary.totalEarned} `}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Pending</Text>
          <Text style={styles.summaryAmount}>
            ${`${loader ? 'Loading...' : payoutSummary.pending} `}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Paid</Text>
          <Text style={styles.summaryAmount}>
            ${`${loader ? 'Loading...' : payoutSummary.paid} `}
          </Text>
        </View>
      </View>
      <View style={styles.statusCard}>
        <TouchableOpacity
          disabled={parseInt(Balance) === 10}
          style={styles.witdraw_btn}
          onPress={() => navigation.navigate('Withdraw Request')}>
          <Text style={styles.witdraw_btn_txt}>withdraw</Text>
        </TouchableOpacity>
      </View>
      {/* Payout History */}
      <Text style={styles.historyTitle}>Payout History</Text>
      <FlatList
        data={AllTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<DataNotFound />}
        renderItem={({item}) => (
          <View style={styles.historyCard}>
            <View style={styles.historyRow}>
              <MaterialIcons name="date-range" size={16} color="#444" />
              <Text style={styles.historyText}>
                {DateFormate(item.requested_at)}
              </Text>
            </View>
            <Text style={styles.historyAmount}>${item.amount}</Text>
            {renderStatusBadge(item.status)}
          </View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default PayoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  witdraw_btn: {
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    width: '100%',
  },
  witdraw_btn_txt: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  balance_card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 10,
    elevation: 1,
  },
  balance_card_amount: {
    fontSize: 18,
    color: '#555',
    fontWeight: themes.font.weight.large,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 13,
    color: '#555',
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: themes.colors.SUCCESS,
    marginTop: 6,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 5,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#444',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginTop: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '400',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
  },
});
