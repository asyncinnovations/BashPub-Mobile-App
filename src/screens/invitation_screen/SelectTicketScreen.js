import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {themes} from '../../constants/themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
const SelectTicketScreen = ({route, navigation}) => {
  const {token} = useAuth();
  const {invite_id, ticket_price, invite_type, event_id, host_id} =
    route.params;
  const [quantity, setQuantity] = useState(1);
  const [loader, setLoader] = useState(false);
  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };
  const totalPrice = quantity * ticket_price;
  //////////////////////////
  // CREATE PAYMENT INTENT
  //////////////////////////
  const create_payment_intent = async () => {
    try {
      setLoader(true);
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/stripe_payment/checkout`,
        {
          amount: totalPrice * 100,
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );
      console.log(response.data);
      if (response.status == 201) {
        setLoader(false);

        console.log(response.data.clientSecret);

        ToastAndroid.show('Moving to Check Out', ToastAndroid.SHORT);

        navigation.navigate('Check Out', {
          invite_id,
          ticket_price,
          quantity,
          secrets: response.data.clientSecret,
          total_price: totalPrice,
          invite_type,
          event_id,
          host_id,
        });
      }
    } catch (err) {
      setLoader(false);
      console.log(err.response);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Ticket Price:</Text>
        <Text style={styles.value}>${ticket_price}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Quantity:</Text>
        <View style={styles.counter}>
          <TouchableOpacity onPress={decrement} style={styles.circleBtn}>
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={increment} style={styles.circleBtn}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.total}>${totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        onPress={create_payment_intent}
        disabled={loader}
        style={styles.proceedBtn}>
        <Text style={styles.proceedText}>
          {loader ? 'Processing' : 'Proceed to Payment'}
        </Text>
        <Ionicons name="arrow-forward-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default SelectTicketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    color: themes.colors.TEXT_DARK,
    fontWeight: themes.font.weight.bold,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themes.colors.PRIMARY,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themes.colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 18,
    marginHorizontal: 15,
    fontWeight: '600',
  },
  proceedBtn: {
    flexDirection: 'row',
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
  },
  proceedText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
