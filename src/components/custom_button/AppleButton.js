import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {themes} from '../../constants/themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
const AppleButton = ({
  onPress,
  disabled = false,
  title = 'sign in with Apple',
}) => {
  return (
    <TouchableOpacity disabled={disabled} style={styles.btn} onPress={onPress}>
      <View style={styles.btn_inner}>
        <Ionicons
          name="logo-apple"
          size={20}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.btnText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppleButton;

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#666',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 5,
  },
  btn_inner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  icon: {
    marginRight: 12,
    width: 20,
    height: 20,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: themes.colors.TEXT_LIGHT,
    textTransform: 'capitalize',
  },
});
