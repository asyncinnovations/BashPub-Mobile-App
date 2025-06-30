import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';

const CheckOutScreen = ({route, navigation}) => {
  const {user, token} = useAuth();
  const {
    invite_id,
    ticket_price,
    quantity,
    secrets,
    total_price,
    invite_type,
    event_id,
    host_id,
  } = route.params;

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [loading, setLoading] = useState(false);
  /////////////////////////
  // INITIALIZE PAYMENT UI
  /////////////////////////
  const initializePaymentSheet = async () => {
    setLoading(true);
    const {error} = await initPaymentSheet({
      paymentIntentClientSecret: secrets,
      merchantDisplayName: 'BashPub',
    });

    if (!error) {
      openPaymentSheet(); // ✅ Proceed to show payment UI
    } else {
      alert(`Payment sheet init failed: ${error.message}`);
    }

    setLoading(false);
  };
  /////////////////////////
  // DISPLAY PAYMENT UI
  /////////////////////////
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      await respond_invitation(invite_id, 'accept');
      await sell_ticket();
      //  /api/tickets/sell
      // /api/invites/respond
      navigation.replace('Payment Success');
    }
  };
  /////////////////////////
  // ACCEPT INVITATIONS
  /////////////////////////
  const respond_invitation = async (invite_id, status) => {
    try {
      const data = {
        status,
      };
      const response = await axios.put(
        `${process.env.API_ROOT_URI}/api/invitation/respond/${invite_id}`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        await fetch_invites();
        if (status == 'accept') {
          ToastAndroid.show('Invitation Accepted', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Invitation Cancelled', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////
  // SELL TICKET TO GUEST
  ///////////////////////////
  const sell_ticket = async () => {
    try {
      const data = {
        event_id: event_id,
        guest_id: user?.user_id,
        ticket_type: invite_type,
        price: ticket_price,
        quantity: quantity,
      };
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/ticket/sell`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 201) {
        await record_transaction('', data.price, 'stripe');
        await record_wallet();
        ToastAndroid.show('Ticket Purchase successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////
  // RECORD TRANSACTIONSS
  ///////////////////////////
  const record_transaction = async (
    reference_id,
    amount,
    method = 'stripe',
  ) => {
    try {
      const data = {
        user_id: user?.user_id,
        user_role: user?.role,
        type: 'payout',
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
        ToastAndroid.show('Transactin Recorded', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////
  // RECORD HOST EARNING TO WALLET
  //////////////////////////////////
  // const record_wallet = async () => {
  //   try {
  //     const commissionRate = 0.1; // 10%
  //     const commission = ticket_price * commissionRate;
  //     const hostEarning = ticket_price - commission;
  //     const data = {
  //       wallet_for: 'host',
  //       user_id: host_id,
  //       balance: parseInt(hostEarning),
  //     };
  //     const response = await axios.post(
  //       `${process.env.API_ROOT_URI}/api/wallet/new`,
  //       data,
  //       {headers: {Authorization: `Bearer ${token}`}},
  //     );
  //     if (response.status === 200) {
  //       console.log(response.data);
  //       ToastAndroid.show('Wallet recoreded');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const record_wallet = async () => {
    try {
      const commissionRate = 0.1; // 10%
      const commission = ticket_price * commissionRate;
      const hostEarning = ticket_price - commission;

      // Host wallet entry
      const hostData = {
        wallet_for: 'host',
        user_id: host_id,
        balance: parseInt(hostEarning),
      };

      // Admin wallet entry
      const adminData = {
        wallet_for: 'admin',
        balance: parseInt(commission),
      };

      const headers = {Authorization: `Bearer ${token}`};

      // Send both requests (host + admin)
      const [hostResponse, adminResponse] = await Promise.all([
        axios.post(`${process.env.API_ROOT_URI}/api/wallet/new`, hostData, {
          headers,
        }),
        axios.post(
          `${process.env.API_ROOT_URI}/api/wallet/admin/add`,
          adminData,
          {
            headers,
          },
        ),
      ]);

      if (hostResponse.status === 200 && adminResponse.status === 200) {
        console.log('Host:', hostResponse.data);
        console.log('Admin:', adminResponse.data);
        ToastAndroid.show('Wallets recorded', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Wallet error:', error?.response?.data || error.message);
    }
  };

  /////////////////////////
  // RENDER XML ELEMENTS
  /////////////////////////
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.amount}>Total: ${total_price}</Text>
      <TouchableOpacity
        style={styles.payBtn}
        disabled={!secrets}
        onPress={initializePaymentSheet}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  title: {fontSize: 22, fontWeight: '700', marginBottom: 20},
  amount: {fontSize: 18, marginBottom: 30},
  payBtn: {
    backgroundColor: '#4B7BE5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});
