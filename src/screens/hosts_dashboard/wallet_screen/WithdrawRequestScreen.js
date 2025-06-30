import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import {useAuth} from '../../../context/AuthContext';
import {Picker} from '@react-native-picker/picker';

const WithdrawRequestScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [SavedMethod, setSavedMethod] = useState([]);
  const [WithdrawAmount, setWithdrawAmount] = useState(0);
  const [form, setForm] = useState({
    amount: '',
    currency: '',
    account_holder_name: '',
    bank_name: '',
    paypal_email: '',
    stripe_email: '',
  });
  const [loader, setLoader] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState({});
  const handleChange = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
  };
  ///////////////////////////////////
  // VALIDATE WITHDRAW FORMS FIELDS
  ///////////////////////////////////
  const validateForm = () => {
    let errors = {};

    if (!selectedMethod) {
      errors.selectedMethod = 'Please select a withdrawal method';
    }

    if (
      !WithdrawAmount ||
      isNaN(WithdrawAmount) ||
      Number(WithdrawAmount) <= 0
    ) {
      errors.WithdrawAmount = 'Please enter a valid amount';
    }

    // if (!form.currency) {
    //   errors.currency = 'Currency is required';
    // }

    // if (selectedMethod === 'paypal') {
    //   if (!form.paypal_email) {
    //     errors.paypal_email = 'PayPal email is required';
    //   }
    // }

    // if (selectedMethod === 'stripe') {
    //   if (!form.stripe_email) {
    //     errors.stripe_email = 'Stripe email is required';
    //   }
    //   if (!form.account_holder_name) {
    //     errors.account_holder_name = 'Account holder name is required';
    //   }
    //   if (!form.bank_name) {
    //     errors.bank_name = 'Bank name is required';
    //   }
    // }

    setError(errors);
    return Object.keys(errors).length === 0;
  };
  ///////////////////////////////////
  // FETCH SAVED PAYMENT METHOD
  //////////////////////////////////
  const fetch_method = async () => {
    try {
      setFetchLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/saved_method/host/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        setFetchLoader(false);
        console.log(response.data);
        setSavedMethod(response.data.results);
      }
    } catch (error) {
      setFetchLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_method();
  }, []);
  ////////////////////////////////////
  // HANDLE SUBMIT WITHDRAW REQUEST
  ///////////////////////////////////
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const data = {
      host_id: user?.user_id,
      method_id: selectedMethod,
      amount: WithdrawAmount,
      status: 'pending',
    };
    try {
      setLoader(true);
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/payout/request`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 201) {
        setSelectedMethod('');
        setWithdrawAmount(0);
        setLoader(false);
        await subtract_fund(data.amount);
        Alert.alert('Success', 'Your withdrawal request has been submitted!');
        ToastAndroid.show(
          'Your withdrawal request has been submitted!',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //////////////////////////////
  // SUBSCTRACT HOST BALANCE
  //////////////////////////////
  const subtract_fund = async amount => {
    try {
      const data = {
        balance: parseInt(amount),
        wallet_for: 'host',
        user_id: user?.user_id,
      };
      const response = await axios.put(
        `${process.env.API_ROOT_URI}/api/wallet/subtract`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        console.log(response.data)
        navigation.goBack();
        ToastAndroid.show('Fund Subtract Successful', ToastAndroid.SHORT);
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
      fetch_method();
    }, 2000);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.methodContainer}>
        {fetchLoader ? (
          <Text style={styles.methodText}>Loading...</Text>
        ) : SavedMethod.length > 0 ? (
          <View
            style={[
              styles.picker,
              {
                borderColor: error.selectedMethod
                  ? themes.colors.ERROR
                  : themes.colors.TEXT_LIGHT,
              },
            ]}>
            <Picker
              selectedValue={selectedMethod}
              onValueChange={itemValue => setSelectedMethod(itemValue)}>
              <Picker.Item value={''} label="Select Method" />
              {SavedMethod.map((items, index) => (
                <Picker.Item label={items.method_type} value={items.uuid} />
              ))}
            </Picker>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.add_method_btn}
            onPress={() => navigation.navigate('Save Method')}>
            <Text style={styles.add_method_btn_txt}>add method</Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity
          key={index}
          style={[
            styles.methodCard,
            selectedMethod === items.method_type && styles.selected,
            error.selectedMethod && {borderColor: themes.colors.ERROR},
          ]}
          onPress={() => setSelectedMethod(items.uuid)}>
          <Text style={styles.methodText}>{items.method_type}</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Enter Amount</Text>
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          style={[
            styles.input,
            {
              borderColor: error.WithdrawAmount
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          value={WithdrawAmount}
          onChangeText={val => setWithdrawAmount(val)}
        />
        {/* {selectedMethod === 'paypal' && (
          <TextInput
            placeholder="PayPal Email"
            style={[
              styles.input,
              {
                borderColor: error.paypal_email
                  ? themes.colors.ERROR
                  : themes.colors.TEXT_LIGHT,
              },
            ]}
            value={form.paypal_email}
            onChangeText={val => handleChange('paypal_email', val)}
          />
        )}

        {selectedMethod === 'stripe' && (
          <>
            <TextInput
              placeholder="Stripe Email"
              style={[
                styles.input,
                {
                  borderColor: error.stripe_email
                    ? themes.colors.ERROR
                    : themes.colors.TEXT_LIGHT,
                },
              ]}
              value={form.stripe_email}
              onChangeText={val => handleChange('stripe_email', val)}
            />
            <TextInput
              placeholder="Account Holder Name"
              style={[
                styles.input,
                {
                  borderColor: error.account_holder_name
                    ? themes.colors.ERROR
                    : themes.colors.TEXT_LIGHT,
                },
              ]}
              value={form.account_holder_name}
              onChangeText={val => handleChange('account_holder_name', val)}
            />
            <TextInput
              placeholder="Bank Name"
              style={[
                styles.input,
                {
                  borderColor: error.bank_name
                    ? themes.colors.ERROR
                    : themes.colors.TEXT_LIGHT,
                },
              ]}
              value={form.bank_name}
              onChangeText={val => handleChange('bank_name', val)}
            />
          </>
        )} */}

        <TouchableOpacity
          disabled={loader}
          style={styles.send_btn}
          onPress={handleSubmit}>
          <Text style={styles.send_btn_txt}>
            {loader ? 'Sending...' : 'Send Request'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default WithdrawRequestScreen;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  methodCard: {
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    padding: 16,
    width: '100%', // allows 2 cards with space in between
    margin: '1%', // gap between cards
  },

  selected: {
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderColor: themes.colors.SECONDARY,
  },
  methodText: {
    fontSize: 16,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  form: {
    marginTop: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: '400',
    fontSize: 14,
    paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderColor: themes.colors.TEXT_LIGHT,
  },
  send_btn: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: themes.colors.PRIMARY,
    borderRadius: 10,
  },
  send_btn_txt: {
    textTransform: 'capitalize',
    textAlign: 'center',
    fontSize: 14,
    color: themes.colors.TEXT_LIGHT,
  },
  add_method_btn: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: themes.colors.PRIMARY,
    borderRadius: 10,
    width: '100%',
  },
  add_method_btn_txt: {
    textTransform: 'capitalize',
    textAlign: 'center',
    fontSize: 14,
    color: themes.colors.TEXT_LIGHT,
  },
  picker: {
    borderRadius: 6,
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
  },
});
