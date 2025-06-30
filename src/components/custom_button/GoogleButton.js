import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {themes} from '../../constants/themes';
const GoogleButton = ({
  title = 'Sign in with Google',
  disabled = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.touchable}
      onPress={onPress}>
      <LinearGradient
        colors={['#4285F4', '#EA4335', '#FBBC04', '#34A853']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.button}>
        <View style={styles.innerContent}>
          <FontAwesome
            name="google"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.text}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  touchable: {marginVertical: 1},
  button: {
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },

  text: {
    fontSize: 14,
    fontWeight: '600',
    color: themes.colors.TEXT_LIGHT,
    textTransform: 'capitalize',
  },
  icon: {
    marginRight: 12,
    width: 20,
    height: 20,
  },
});
