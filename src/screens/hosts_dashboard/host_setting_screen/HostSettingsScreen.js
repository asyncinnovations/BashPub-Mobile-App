import {
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../../constants/themes';

const HostSettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Host Settings</Text>

      {/* Toggles */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={() => setNotifications(!notifications)}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Email Updates</Text>
        <Switch
          value={emailUpdates}
          onValueChange={() => setEmailUpdates(!emailUpdates)}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Auto-confirm RSVP</Text>
        <Switch
          value={autoConfirm}
          onValueChange={() => setAutoConfirm(!autoConfirm)}
        />
      </View>

      {/* Status */}
      <View style={styles.verificationBox}>
        <Ionicons name="shield-checkmark-outline" size={22} color="#4CAF50" />
        <Text style={styles.verifiedText}>Account Verified</Text>
      </View>
    </ScrollView>
  );
};

export default HostSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  verificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
  },
  verifiedText: {
    fontSize: 15,
    color: '#388E3C',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: themes.colors.ERROR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 40,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
