import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash_screen/SplashScreen';
import {NavigationContainer} from '@react-navigation/native';
import AdminDrawer from './AdminDrawer';
import HostRoutes from './HostRoutes';
import GuestRoutes from './GuestRoutes';
import AuthStack from './AuthStack';
import {useAuth} from '../context/AuthContext';
import HostDrawer from './HostDrawer';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const {user} = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState({guest: false, hosts: true, admin: false});
  const [SplashOpen, setSplashOpen] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSplashOpen(false);
    }, 3000);
    console.log(user);
    return () => clearTimeout(timeout);
  }, []);

  if (SplashOpen) return <SplashScreen />;

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'guest' ? (
        <GuestRoutes SplashOpen={SplashOpen} />
      ) : user.role === 'hosts' ? (
        <HostRoutes SplashOpen={SplashOpen} />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Admin"
            options={{headerShown: false}}
            component={AdminDrawer}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Routes;

const styles = StyleSheet.create({});
