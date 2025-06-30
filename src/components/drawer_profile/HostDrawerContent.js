import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../constants/themes';
// import {useAuth} from '../../context/AuthContext';

const HostDrawerContent = props => {
  // const {user} = useAuth();
  const user = {
    name: 'hasna',
    email: 'hasan@gmail.com',
    role: 'hosts',
  };
  return (
    <DrawerContentScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{backgroundColor: themes.colors.PRIMARY}} // use `style`, not `contentContainerStyle`
    >
      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatar_txt}>H</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Ionicons
            name="star-outline"
            size={14}
            color={themes.colors.TEXT_LIGHT}
          />
          <Text style={styles.roleText}> {user.role}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => props.navigation.navigate('Profile')}>
          <Text style={styles.profileBtnText}>View Profile</Text>
        </TouchableOpacity>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default HostDrawerContent;

const styles = StyleSheet.create({
  profileBox: {
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: themes.colors.BACKGROUND,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themes.colors.BACKGROUND,
  },
  avatar_txt: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
  },
  name: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: themes.colors.TEXT_LIGHT,
    textTransform: 'capitalize',
  },
  email: {
    textAlign: 'center',
    fontSize: 14,
    color: themes.colors.TEXT_LIGHT,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themes.colors.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '400',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  profileBtn: {
    marginTop: 10,
    backgroundColor: themes.colors.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileBtnText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '600',
  },
});
