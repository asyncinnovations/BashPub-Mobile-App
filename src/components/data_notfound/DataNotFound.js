import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {themes} from '../../constants/themes';

const DataNotFound = ({text = 'Data Not Found'}) => {
  return (
    <View style={styles.data_notfound}>
      <Text style={styles.data_notfound_txt}>{text}</Text>
    </View>
  );
};

export default DataNotFound;

const styles = StyleSheet.create({
  data_notfound: {
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  data_notfound_txt: {
    textTransform: 'capitalize',
    textAlign: 'center',
    fontSize: 16,
    color: themes.colors.SUCCESS,
    fontWeight: themes.font.weight.large,
  },
});
