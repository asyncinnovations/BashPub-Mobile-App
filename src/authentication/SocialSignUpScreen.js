import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken, Profile} from 'react-native-fbsdk-next';
import FacebookButton from '../components/custom_button/FacebookButton';
import GoogleButton from '../components/custom_button/GoogleButton';
import AppleButton from '../components/custom_button/AppleButton';
import GmailButton from '../components/custom_button/GmailButton';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useAuth} from '../context/AuthContext';
import {themes} from '../constants/themes';
import axios from 'axios';
const SocialSignUpScreen = ({route}) => {
  const {login} = useAuth();
  const {role} = route.params;
  const navigation = useNavigation();
  const [LoginLoader, setLoginLoader] = useState(false);
  const [socialLoaders, setSocialLoaders] = useState({
    facebook: false,
    google: false,
    apple: false,
  });

  /////////////////////////
  // GOOGLE CONFIGURE
  ////////////////////////
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    // console.log(process.env.GOOGLE_OAUTH_CLIENT_ID);
  }, []);

  //////////////////////////////
  // HANDLE GOOGLE LOGINS
  /////////////////////////////
  const GoogleSignup = async () => {
    try {
      setSocialLoaders({facebook: true, google: true, apple: true});
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();

      // Try to sign in
      const signInResult = await GoogleSignin.signIn();
      const {email, photo, familyName, id} = signInResult?.data?.user;

      // ToastAndroid.show('Google Account Is Exists!', ToastAndroid.SHORT);
      // You can now send signInResult.idToken to your server
      console.log(familyName, email);
      await create_account(familyName, email, '', 'google', photo, id);
    } catch (error) {
      console.log('Google SignIn Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastAndroid.show('Login Canceled', ToastAndroid.SHORT);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show(
          'Google Play Services Not Available',
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    } finally {
      setSocialLoaders({facebook: false, google: false, apple: false});
    }
  };
  ///////////////////////////////
  // HANDLE FACEBOOK LOGINS
  ///////////////////////////////
  const FacebookSignup = async () => {
    try {
      // Set all social buttons to loading/disabled
      setSocialLoaders({facebook: true, google: true, apple: true});

      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        console.log('User cancelled login');
        return;
      }

      // Get access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        console.log('No access token found');
        return;
      }

      const {accessToken} = data;

      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
      );
      const profile = await response.json();

      if (profile) {
        const {name, email, id, picture} = profile;
        const image = picture.data.url;
        console.log(process.env.API_ROOT_URI);
        // Call your create_account function
        await create_account(name, email, '', 'facebook', image, id);
      }
    } catch (error) {
      console.log('Facebook Login Error:', error);
    } finally {
      // Reset all social loaders
      setSocialLoaders({facebook: false, google: false, apple: false});
    }
  };
  ////////////////////////////
  // HANDLE APPLE LOGINS
  ////////////////////////////
  const AppleSignup = async () => {
    try {
      // Disable all social buttons
      setSocialLoaders({facebook: true, google: true, apple: true});

      // Configure Apple sign-in
      appleAuthAndroid.configure({
        clientId: 'com.your.client.id',
        redirectUri: 'https://your-backend.com/callback',
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
      });

      // Check if Apple Sign-In is supported
      if (!appleAuthAndroid.isSupported) {
        Alert.alert('Error', 'Apple Sign-In is not supported on this device.');
        return;
      }

      // Start sign-in
      const response = await appleAuthAndroid.signIn();
      if (response) {
        const {id_token, user, email, fullName} = response;
        console.log('Apple Sign-In Success:', response);

        // OPTIONAL: Call create_account if needed
        await create_account(
          fullName?.givenName,
          email,
          '',
          'apple',
          '',
          id_token,
        );

        Alert.alert(
          'Logged in with Apple!',
          `Welcome, ${fullName?.givenName || 'User'}`,
        );
      }
    } catch (error) {
      console.error('Apple Sign-In Error', error);
      Alert.alert('Apple Sign-In Failed', error.message || 'Unknown error');
    } finally {
      // Re-enable all buttons
      setSocialLoaders({facebook: false, google: false, apple: false});
    }
  };

  ////////////////////////////
  // HANDLE EMAIL LOGINS
  ////////////////////////////
  const handleEmailSignup = () => {
    navigation.navigate('SignUp', {role});
  };

  ///////////////////////////////////
  // CREATE NEW USER ACCOUNT
  ///////////////////////////////////
  const create_account = async (
    name,
    email,
    phone,
    provider,
    photo,
    social_id,
  ) => {
    try {
      const data = {
        full_name: name,
        email: email,
        phone: phone,
        password_hash: '',
        social_login_provider: provider,
        social_id: social_id,
        role: role,
        profile_image: photo,
        status: 'active',
      };
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/auth/register`,
        data,
      );
      if (response.status === 201) {
        ToastAndroid.show(
          'Account Create Successfully  🎉🎉',
          ToastAndroid.SHORT,
        );
        await login_account(data.email);
      }
    } catch (error) {
      setLoginLoader(false);
      console.log(error);
      if (error?.response?.status == 409) {
        await login_account(email);
        // navigation.navigate('Login');
        ToastAndroid.show(
          'Account Already Exist ~ Please Login!',
          ToastAndroid.SHORT,
        );
      }
    }
  };

  ////////////////////////////
  // LOGIN TO USER ACCOUNT
  ///////////////////////////
  const login_account = async email => {
    try {
      setLoginLoader(true);
      const data = {
        email,
        role,
      };
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/auth/login`,
        data,
      );
      if (response.status === 200) {
        setLoginLoader(false);
        // const credential = response.data.token;
        // const user = response.data.user;
        console.log(response.data);
        login(response.data);
        // const credential = response.data.payload;
        ToastAndroid.show('Login successfull 🎉🎉', ToastAndroid.SHORT);
        navigation.navigate('Home');
      }
    } catch (error) {
      setLoginLoader(false);
      console.log(error);
    }
  };
  const isAnyLoading = Object.values(socialLoaders).some(val => val);

  ////////////////////////////
  // RENDER XML ELEMENT
  ///////////////////////////
  return (
    <ScrollView style={styles.container}>
      <View style={styles.brand_wrapper}>
        <FastImage
          source={require('../assets/512.png')}
          style={styles.brand_img}
        />
      </View>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Create your BashPub host or guest account
      </Text>
      {isAnyLoading && <ActivityIndicator />}
      <FacebookButton
        disabled={isAnyLoading}
        title={socialLoaders.facebook ? 'Loading...' : 'Sign in with Facebook'}
        onPress={FacebookSignup}
      />

      <GoogleButton
        disabled={isAnyLoading}
        title={socialLoaders.google ? 'Loading...' : 'Sign in with Google'}
        onPress={GoogleSignup}
      />

      <AppleButton
        disabled={isAnyLoading}
        title={socialLoaders.apple ? 'Loading...' : 'Sign in with Apple'}
        onPress={AppleSignup}
      />

      {/* Email fallback */}
      <GmailButton disabled={isAnyLoading} onPress={handleEmailSignup} />

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

export default SocialSignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
    paddingHorizontal: 20,
    paddingTop: 60,
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'capitalize',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#777',
    fontSize: 14,
  },
  loginLink: {
    color: '#2196F3',
    fontWeight: '400',
    textTransform: 'capitalize',
    fontSize: 14,
  },
  role_selection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  role_selection_btn: {
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  role_selection_btn_txt: {
    color: themes.colors.TEXT_DARK,
    fontSize: 14,
    textTransform: 'capitalize',
  },
});
