import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { themes } from '../../constants/themes';

const SectionTitle = ({title, subtitle, onPress}) => {
  return (
    <View style={styles.heading_box}>
      <Text style={styles.heading_title}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.heading_sub}>{subtitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionTitle;

const styles = StyleSheet.create({
  heading_box: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  heading_title: {
    fontSize: 18,
    fontWeight: '600',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
  },
  heading_sub: {
    fontSize: 14,
    fontWeight: '400',
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.TEXT_DARK,
  },
});
