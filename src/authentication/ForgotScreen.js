import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../constants/themes';
const {width} = Dimensions.get('window');

const ForgotScreen = ({navigation, route}) => {
  const {role} = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.brand_wrapper}>
        <FastImage
          source={require('../assets/512.png')}
          style={styles.brand_img}
        />
      </View>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email and we’ll send you a link to reset your password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.resetButton}>
        <Text style={styles.resetText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login', {role})}>
        <Ionicons name="arrow-back" size={16} color={themes.colors.PRIMARY} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  brand_wrapper: {
    width: 'auto',
    height: 110,
    paddingVertical: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand_img: {
    width: 110,
    height: '100%',
    objectFit: 'contain',
    borderRadius: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  backText: {
    color: '#007BFF',
    fontSize: 14,
  },
});
