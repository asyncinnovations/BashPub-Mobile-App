import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../constants/themes';

const SuccessScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="checkmark-circle"
        size={100}
        color={themes.colors.SUCCESS}
      />
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>Your tickets have been confirmed.</Text>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => navigation.navigate('Payment History')}>
        <Text style={styles.btnText}>Go to My Tickets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.btnTextSecondary}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: themes.colors.SUCCESS,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 40,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    marginTop: 20,
  },
  btnTextSecondary: {
    fontSize: 15,
    color: themes.colors.PRIMARY,
    fontWeight: '600',
  },
});
