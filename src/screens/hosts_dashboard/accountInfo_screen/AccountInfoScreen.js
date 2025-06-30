import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons  from 'react-native-vector-icons/Ionicons';

const AccountInfoScreen = () => {
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex@bashpub.com');
  const [phone, setPhone] = useState('+1 555 123 4567');
  const [businessName, setBusinessName] = useState('');
  const [stripeConnected] = useState(true);

  return (
    <ScrollView style={styles.container}>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300?img=10' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarBtn}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email (readonly)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#F0F0F0' }]}
          value={email}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="e.g. +1 555 123 4567"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Optional"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Stripe Connection</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: stripeConnected ? '#C8E6C9' : '#FFCDD2' },
          ]}
        >
          <Ionicons
            name={stripeConnected ? 'checkmark-circle' : 'alert-circle'}
            size={16}
            color={stripeConnected ? '#2E7D32' : '#C62828'}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.badgeText}>
            {stripeConnected ? 'Connected' : 'Not Connected'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  saveBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
