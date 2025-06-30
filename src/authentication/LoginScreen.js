import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {themes} from '../constants/themes';
import axios from 'axios';
import CustomButton from '../components/custom_button/CustomButton';
import {useAuth} from '../context/AuthContext';
const {width} = Dimensions.get('window');

const LoginScreen = ({navigation, route}) => {
  const {login} = useAuth();
  const {role} = route.params;
  const [LoginLoader, setLoginLoader] = useState(false);
  const [Email, setEmail] = useState();
  ///////////////////////////////////
  // LOGIN TO USER ACCOUNT
  ///////////////////////////////////
  const login_account = async () => {
    if (!Email) {
      ToastAndroid.show('Please Enter Your Email!', ToastAndroid.SHORT);
      return;
    }
    try {
      setLoginLoader(true);
      const data = {email: Email, role};
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/auth/login`,
        data,
      );
      if (response.status === 200) {
        setLoginLoader(false);
        const credential = response.data.token;
        const user = response.data.user;
        login(response.data);
        console.log(user, credential);
        ToastAndroid.show('Login successfull 🎉🎉', ToastAndroid.SHORT);
        navigation.navigate('Home');
      }
    } catch (error) {
      setLoginLoader(false);
      console.log(error);
      if (error?.status == 404) {
        ToastAndroid.show(
          'Account Not Found! Please Sign-up',
          ToastAndroid.SHORT,
        );
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.brand_wrapper}>
        <FastImage
          source={require('../assets/512.png')}
          style={styles.brand_img}
        />
      </View>
      <Text style={styles.title}>Welcome Back 👋 {role}</Text>

      <TextInput
        style={styles.input}
        onChangeText={text => setEmail(text)}
        value={Email}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Forgot Password', {role})}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <CustomButton
        disabled={LoginLoader}
        onPress={login_account}
        title={LoginLoader ? 'Loading...' : 'Login Now'}
        textStyle={styles.loginText}
        style={styles.loginButton}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => navigation.navigate('SignUp', {role})}>
        <Text style={styles.googleText}>Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
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
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: themes.colors.BACKGROUND,
    height: 50,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#007BFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  googleButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: themes.colors.BACKGROUND,
  },
  googleText: {
    color: '#444',
    fontSize: 16,
  },
});
