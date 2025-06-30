import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const CustomButton = ({
  title,
  StartIcon,
  EndIcon,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      {StartIcon}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      {EndIcon}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
