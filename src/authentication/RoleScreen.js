import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../constants/themes';

const RoleScreen = ({navigation}) => {
  /////////////////////////////////////////
  // MOVE TO SIGNUP SCREEN TO WITH ROLE
  /////////////////////////////////////////
  const SelectedRole = role => {
    navigation.navigate('social_signup', {role});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Who Are You</Text>
      <Text style={styles.subHeading}>How do you want to use BashPub?</Text>

      {/* JOIN AS GUEST BUTTON */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => SelectedRole('guest')}>
        <Ionicons
          name="person-outline"
          size={40}
          color={themes.colors.PRIMARY}
        />
        <View>
          <Text style={styles.cardTitle}>Join as Guest</Text>
          <Text style={styles.cardText}>Discover events & RSVP easily.</Text>
        </View>
      </TouchableOpacity>

      {/* JOIN AS HOSTS BUTTON */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => SelectedRole('hosts')}>
        <FontAwesome
          name="microphone"
          size={40}
          color={themes.colors.SECONDARY}
        />
        <View>
          <Text style={styles.cardTitle}>Become a Host</Text>
          <Text style={styles.cardText}>
            Create events & earn from your parties.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    marginBottom: 8,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',
    color: themes.colors.TEXT_DARK,
  },
  subHeading: {
    color: themes.colors.TEXT_DARK,
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
  card: {
    backgroundColor: themes.colors.BACKGROUND,
    borderColor: themes.colors.BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  cardTitle: {
    fontWeight: themes.font.weight.medium,
    color: '#222',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  cardText: {
    color: 'gray',
    fontSize: 14,
    marginTop: 4,
    textTransform: 'capitalize',
    marginRight: 30,
  },
});
