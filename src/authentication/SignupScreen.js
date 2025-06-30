import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../components/custom_button/CustomButton';
import FastImage from 'react-native-fast-image';
import {themes} from '../constants/themes';
import axios from 'axios';

const SignupScreen = ({navigation, route}) => {
  const {role} = route.params;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  ////////////////////////////
  // HANDLE SIGNUP ELELMENTS
  ///////////////////////////
  const handleSignup = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const data = {
      full_name: fullName,
      email: email,
      phone: phone,
      password_hash: '',
      social_login_provider: 'custom',
      social_id: '',
      role: role,
      profile_image: '',
      status: 'active',
    };
    try {
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/auth/register`,
        data,
      );
      if (response.status === 201) {
        ToastAndroid.show(
          'Account Create Successfully  🎉🎉',
          ToastAndroid.SHORT,
        );
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 409) {
        navigation.navigate('Login');
        ToastAndroid.show(
          'Account Already Exist ~ Please Login!',
          ToastAndroid.SHORT,
        );
      }
    }
  };

  ////////////////////////////
  // RENDER XML ELEMENT
  ///////////////////////////
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brand_wrapper}>
        <FastImage
          source={require('../assets/512.png')}
          style={styles.brand_img}
        />
      </View>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        title="Sign Up"
        onPress={handleSignup}
        style={styles.button}
        textStyle={styles.buttonText}
      />
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login', {role})}>
          <Text style={styles.loginLink}> Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
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
    height: 110,
    objectFit: 'contain',
    borderRadius: '100%',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: themes.colors.PRIMARY,
  },
  buttonText: {
    color: themes.colors.BACKGROUND,
    fontSize: 18,
    fontWeight: themes.font.weight.regular,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: themes.colors.TEXT_DARK,
    fontSize: 14,
  },
  loginLink: {
    color: themes.colors.SECONDARY,
    fontWeight: '600',
    fontSize: 14,
  },
  picker: {
    padding: 1,
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
  },
});
