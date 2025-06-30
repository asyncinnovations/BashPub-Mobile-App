import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../../context/AuthContext';
import {Picker} from '@react-native-picker/picker';
import {themes} from '../../../constants/themes';

const ApproveScreen = ({route, navigation}) => {
  const {user, token} = useAuth();
  const {request_id, event_id, guest_id} = route.params;
  const [TicketPrice, setTicketPrice] = useState(0);
  const [TicketType, setTicketType] = useState('');
  const [loader, setLoader] = useState(false);

  const [error, setError] = useState({});
  const validate = () => {
    let errors = {};
    if (!TicketPrice) {
      errors.TicketPrice = 'Ticket Price is required';
    }
    if (!TicketType) {
      errors.TicketType = 'Ticket Type is required';
    }
    setError(errors);
    return Object.keys(errors).length > 0;
  };
  //////////////////////////
  // UPDATE REQUEST STATUS//
  //////////////////////////
  const update_status = async () => {
    if (validate()) return;
    try {
      setLoader(true);
      const response = await axios.put(
        `${process.env.API_ROOT_URI}/api/join_request/${request_id}`,
        {status: 'approved'},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        setLoader(false);
        await sell_ticket(event_id, guest_id);
        ToastAndroid.show('Request approved', ToastAndroid.SHORT);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  ///////////////////////////
  // SELL TICKET TO GUEST
  ///////////////////////////
  const sell_ticket = async (event_id, guest_id) => {
    const data = {
      event_id: event_id,
      guest_id: guest_id,
      ticket_type: TicketType,
      price: TicketPrice,
      quantity: 1,
    };
    try {
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/ticket/sell`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 201) {
        await record_transaction('', data.price, 'stripe', data.guest_id);
        navigation.goBack();
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
    user_id,
  ) => {
    try {
      const data = {
        user_id: user_id,
        user_role: 'guest',
        type: 'purchase',
        reference_id: reference_id | 'ref_20250508_xyz',
        event_id: event_id,
        method: method,
        amount: amount,
        currency: 'USD',
        status: 'pending',
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
  return (
    <View style={styles.container}>
      {/* INPUT FORM START */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ticket Price</Text>
        <TextInput
          onChangeText={text => setTicketPrice(text)}
          value={TicketPrice}
          style={[
            styles.input,
            {
              borderColor: error.TicketPrice
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          placeholder="Enter Ticket Price"
          keyboardType="number-pad"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ticket Type</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: error.TicketType
              ? themes.colors.ERROR
              : themes.colors.TEXT_LIGHT,
          }}>
          <Picker
            style={styles.picker}
            selectedValue={TicketType}
            onValueChange={(value, index) => setTicketType(value)}>
            <Picker.Item label="VIP" value="vip" />
            <Picker.Item label="GENERAL" value="general" />
            <Picker.Item label="FREE" value="free" />
            <Picker.Item label="PAID" value="paid" />
          </Picker>
        </View>
      </View>
      <TouchableOpacity
        disabled={loader}
        style={styles.button}
        onPress={update_status}>
        <Text style={styles.button_txt}>
          {loader ? 'Loading..' : 'confirm Approve'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={loader}
        style={[styles.button, {backgroundColor: themes.colors.ERROR}]}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={styles.button_txt}>cancel Approve</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ApproveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  input: {
    borderWidth: 1,
    borderColor: themes.colors.SECONDARY,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    paddingVertical: 15,
    backgroundColor: themes.colors.BACKGROUND,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: themes.colors.PRIMARY,
    borderRadius: 30,
    marginVertical: 5,
  },
  button_txt: {
    textTransform: 'capitalize',
    color: themes.colors.TEXT_LIGHT,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
  },
});
