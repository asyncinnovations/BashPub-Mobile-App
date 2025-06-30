import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(false);

  const handleToggleNotification = () =>
    setNotificationsEnabled(!notificationsEnabled);
  const handleToggleEmail = () => setEmailUpdatesEnabled(!emailUpdatesEnabled);

  const settingsOptions = [
    {
      icon: 'notifications-outline',
      label: 'Notification Preferences',
    },
    {
      icon: 'mail-outline',
      label: 'Email Subscription Settings',
    },
    {
      icon: 'moon-outline',
      label: 'Dark Mode',
    },
    {
      icon: 'language-outline',
      label: 'Language Preferences',
    },
    {
      icon: 'trash-outline',
      label: 'Delete My Account',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Switch Preferences */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotification}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Email Updates</Text>
        <Switch value={emailUpdatesEnabled} onValueChange={handleToggleEmail} />
      </View>

      {/* Static Options */}
      <View style={styles.section}>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Ionicons
              name={item.icon}
              size={20}
              color="#444"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={22} color="#bbb" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  logoutBtn: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 40,
    marginBottom: 30,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
