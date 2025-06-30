import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../../constants/themes';

const HostSupportScreen = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject || !message) {
      alert('Please fill out both fields.');
      return;
    }

    alert('Support message sent ');
    setSubject('');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Need Help?</Text>
      <Text style={styles.sub}>
        Contact our support team and we’ll respond as soon as possible.
      </Text>

      {/* Subject Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Event refund issue"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      {/* Message Field */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your issue or question..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
        />
      </View>

      {/* Send Button */}
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Ionicons name="send" size={18} color="#fff" />
        <Text style={styles.sendText}>Send Message</Text>
      </TouchableOpacity>

      {/* Support Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>📧 Email us:</Text>
        <Text
          style={styles.infoLink}
          onPress={() => Linking.openURL('mailto:support@bashpub.com')}>
          support@bashpub.com
        </Text>
        <Text
          style={styles.infoLink}
          onPress={() => Linking.openURL('https://bashpub.com/faq')}>
          Visit our FAQ
        </Text>
      </View>
    </ScrollView>
  );
};

export default HostSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  sub: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: themes.colors.BACKGROUND,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendBtn: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  sendText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '700',
    fontSize: 16,
  },
  infoBox: {
    marginTop: 30,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
  },
  infoLink: {
    fontSize: 14,
    color: '#1E88E5',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
});
