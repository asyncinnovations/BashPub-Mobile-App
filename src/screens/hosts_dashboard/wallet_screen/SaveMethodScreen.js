import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {themes} from '../../../constants/themes';
import {useAuth} from '../../../context/AuthContext';
import axios from 'axios';
import DataNotFound from '../../../components/data_notfound/DataNotFound';
const SaveMethodScreen = () => {
  const {user, token} = useAuth();
  const [SavedMethod, setSavedMethod] = useState([]);

  const [MethodType, setMethodType] = useState('');
  const [Currency, setCurrency] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState('');
  const [BankName, setBankName] = useState('');
  const [BankAddress, setBankAddress] = useState('');
  const [AccountNumber, setAccountNumber] = useState('');
  const [SwiftCode, setSwiftCode] = useState('');
  const [PaypalEmail, setPaypalEmail] = useState('');
  const [StripeEmail, setStripeEmail] = useState('');

  const [error, setError] = useState({});
  const [fetchLoader, setFetchLoader] = useState(false);
  const [CreateLoader, setCreateLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // VALIDATION
  const validate = () => {
    let err = {};
    if (!MethodType) err.MethodType = 'Method type is required';
    if (!Currency) err.Currency = 'Currency is required';

    if (MethodType === 'bank') {
      if (!AccountHolderName)
        err.AccountHolderName = 'Account holder name is required';
      if (!BankName) err.BankName = 'Bank name is required';
      if (!BankAddress) err.BankAddress = 'Bank address is required';
      if (!AccountNumber) err.AccountNumber = 'Account number is required';
      if (!SwiftCode) err.SwiftCode = 'SWIFT code is required';
    } else if (MethodType === 'paypal') {
      if (!PaypalEmail) err.PaypalEmail = 'PayPal email is required';
    } else if (MethodType === 'stripe') {
      if (!StripeEmail) err.StripeEmail = 'Stripe email is required';
    }

    setError(err);
    return Object.keys(err).length === 0;
  };
  const clearForm = () => {
    setMethodType('');
    setCurrency('');
    setAccountHolderName('');
    setBankName('');
    setBankAddress('');
    setAccountNumber('');
    setSwiftCode('');
    setPaypalEmail('');
    setStripeEmail('');
    setError({});
  };
  ///////////////////////////////
  // CREATE NEW METHODS
  ///////////////////////////////
  const save_method = async () => {
    if (!validate()) return;

    const data = {
      host_id: user?.user_id,
      method_type: MethodType,
      is_default: true,
      currency: Currency,
      account_holder_name: AccountHolderName,
      bank_name: BankName,
      bank_address: BankAddress,
      account_number: AccountNumber,
      swift_code: SwiftCode,
      paypal_email: PaypalEmail,
      stripe_email: StripeEmail,
      status: 'active',
    };
    try {
      setCreateLoader(true);
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/saved_method/create`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 201) {
        console.log(response.data);
        ToastAndroid.show('Method Saved Success', ToastAndroid.SHORT);
        setCreateLoader(false);
        fetch_method();
        clearForm();
      }
    } catch (error) {
      setCreateLoader(false);
      console.log(error);
    }
  };
  ///////////////////////////////////
  // FETCH SAVED PAYMENT METHOD
  ///////////////////////////////////
  const fetch_method = async () => {
    try {
      setFetchLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/saved_method/host/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        console.log(response.data);
        setSavedMethod(response.data.results);
        setFetchLoader(false);
      }
    } catch (error) {
      setFetchLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_method();
    console.log(user?.user_id);
  }, []);
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
  ////////////////////////
  // FETCH DATA LOADER
  ///////////////////////
  if (fetchLoader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
      </View>
    );
  }
  ////////////////////////
  // RENDER LIST ITEMS
  ///////////////////////
  const renderItem = ({item}) => {
    const Row = ({label, value}) => (
      <View style={styles.row}>
        <Text style={styles.method_label}>{label}</Text>
        <Text style={styles.method_value}>{value || '-'}</Text>
      </View>
    );

    return (
      <View style={styles.method_card}>
        <Row label="Method Type:" value={item.method_type} />
        <Row label="Currency:" value={item.currency} />

        {item.method_type === 'bank' && (
          <>
            <Row
              label="Account Holder Name:"
              value={item.account_holder_name}
            />
            <Row label="Bank Name:" value={item.bank_name} />
            <Row label="Bank Address:" value={item.bank_address} />
            <Row label="Account Number:" value={item.account_number} />
            <Row label="SWIFT Code:" value={item.swift_code} />
          </>
        )}

        {item.method_type === 'paypal' && (
          <Row label="PayPal Email:" value={item.paypal_email} />
        )}

        {item.method_type === 'stripe' && (
          <>
            <Row label="Stripe Email:" value={item.stripe_email} />
            <Row label="Stripe Account ID:" value={item.stripe_account_id} />
          </>
        )}

        <Row label="Default:" value={item.is_default ? 'Yes' : 'No'} />
        <Row
          label="Date"
          value={new Date(item.created_at).toLocaleDateString()}
        />
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Method Type</Text>
      {/* FORM WRAPPER */}
      <View style={styles.form}>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.MethodType
                ? themes.colors.ERROR
                : themes.colors.BACKGROUND,
            },
          ]}>
          <Picker
            selectedValue={MethodType}
            onValueChange={itemValue => setMethodType(itemValue)}>
            <Picker.Item label="Select Method" value="" />
            <Picker.Item label="Bank" value="bank" />
            <Picker.Item label="PayPal" value="paypal" />
            <Picker.Item label="Stripe" value="stripe" />
          </Picker>
        </View>

        <Text style={styles.label}>Currency</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error.Currency
                ? themes.colors.ERROR
                : themes.colors.BACKGROUND,
            },
          ]}
          value={Currency}
          onChangeText={setCurrency}
          placeholder="e.g. USD"
        />

        {MethodType === 'bank' && (
          <>
            <Text style={styles.label}>Account Holder Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error.AccountHolderName
                    ? themes.colors.ERROR
                    : themes.colors.BACKGROUND,
                },
              ]}
              value={AccountHolderName}
              onChangeText={setAccountHolderName}
            />

            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error.BankName
                    ? themes.colors.ERROR
                    : themes.colors.BACKGROUND,
                },
              ]}
              value={BankName}
              onChangeText={setBankName}
            />

            <Text style={styles.label}>Bank Address</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error.BankAddress
                    ? themes.colors.ERROR
                    : themes.colors.BACKGROUND,
                },
              ]}
              value={BankAddress}
              onChangeText={setBankAddress}
            />

            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error.AccountNumber
                    ? themes.colors.ERROR
                    : themes.colors.BACKGROUND,
                },
              ]}
              value={AccountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />

            <Text style={styles.label}>SWIFT Code</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error.SwiftCode
                    ? themes.colors.ERROR
                    : themes.colors.BACKGROUND,
                },
              ]}
              value={SwiftCode}
              onChangeText={setSwiftCode}
            />
          </>
        )}

        {MethodType === 'paypal' && (
          <>
            <Text style={styles.label}>PayPal Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error.PaypalEmail
                    ? themes.colors.ERROR
                    : themes.colors.BACKGROUND,
                },
              ]}
              value={PaypalEmail}
              onChangeText={setPaypalEmail}
              keyboardType="email-address"
              placeholder="Enter Your Email"
            />
          </>
        )}

        {MethodType === 'stripe' && (
          <>
            <Text style={styles.label}>Stripe Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error.StripeEmail
                    ? themes.colors.ERROR
                    : themes.colors.BACKGROUND,
                },
              ]}
              value={StripeEmail}
              onChangeText={setStripeEmail}
              keyboardType="email-address"
              placeholder="Enter Stripe Email"
            />
          </>
        )}

        <TouchableOpacity
          disabled={CreateLoader}
          style={styles.button}
          onPress={save_method}>
          <Text style={styles.buttonText}>
            {CreateLoader ? 'Loading..' : 'Save Method'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* SAVED METHOD LIST TABLE */}
      <View style={styles.saved_method_table}>
        <Text style={styles.table_title}>Saved methods</Text>
        <FlatList
          horizontal={false}
          scrollEnabled={false}
          data={SavedMethod}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<DataNotFound />}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </ScrollView>
  );
};

export default SaveMethodScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: '400',
    fontSize: 14,
    paddingBottom: 5,
  },
  input: {
    borderRadius: 6,
    marginTop: 5,
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  error: {
    color: 'red',
    fontSize: 13,
  },
  button: {
    marginTop: 20,
    backgroundColor: themes.colors.PRIMARY,
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  picker: {
    borderRadius: 6,
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
  },
  // saved_method_table
  saved_method_table: {
    paddingVertical: 20,
  },
  method_card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  method_label: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  method_value: {
    color: '#555',
    textAlign: 'right',
    flex: 1,
  },
});
