import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {themes} from '../../constants/themes';

const FacebookButton = ({
  onPress,
  disabled = false,
  title = 'Continue with Facebook',
}) => {
  return (
    <TouchableOpacity disabled={disabled} style={styles.btn} onPress={onPress}>
      <View style={styles.btn_inner}>
        <FontAwesome
          name="facebook"
          size={20}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.btnText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FacebookButton;

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 8,
    backgroundColor: '#3b5998',
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
