import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../authentication/LoginScreen';
import SocialSignUpScreen from '../authentication/SocialSignUpScreen';
import SignupScreen from '../authentication/SignupScreen';
import ForgotScreen from '../authentication/ForgotScreen';
import RoleScreen from '../authentication/RoleScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Who Are You?"
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true, // swipe back
      }}>
      <Stack.Screen
        options={{headerShown: true}}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Who Are You?"
        component={RoleScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="social_signup"
        component={SocialSignUpScreen}
      />
      <Stack.Screen
        options={{headerShown: true}}
        name="SignUp"
        component={SignupScreen}
      />
      <Stack.Screen
        options={{headerShown: true}}
        name="Forgot Password"
        component={ForgotScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
