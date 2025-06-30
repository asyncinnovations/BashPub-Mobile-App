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
import {themes} from '../../constants/themes';

const SupportScreen = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendSupportMessage = () => {
    // Simulate a send action (you can integrate API here)
    if (subject && message) {
      alert('Your message has been sent to support!');
      setSubject('');
      setMessage('');
    } else {
      alert('Please fill out both fields.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitle}>
        We're here to help! Fill out the form below and our team will get back
        to you shortly.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="e.g. Problem with ticket purchase"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your issue or question..."
          multiline
          numberOfLines={6}
        />
      </View>

      <TouchableOpacity
        style={styles.sendBtn}
        onPress={handleSendSupportMessage}>
        <Ionicons name="send" size={18} color="#fff" />
        <Text style={styles.sendText}>Send Message</Text>
      </TouchableOpacity>

      {/* Optional Static Info */}
      <View style={styles.staticInfo}>
        <Text style={styles.infoLabel}>📧 Email us at:</Text>
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

export default SupportScreen;

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
    color: themes.colors.TEXT_DARK,
  },
  subtitle: {
    fontSize: 14,
    color: themes.colors.TEXT_DARK,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: themes.colors.TEXT_DARK,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: themes.colors.TEXT_LIGHT,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#eee',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendBtn: {
    flexDirection: 'row',
    backgroundColor: themes.colors.PRIMARY,
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
  staticInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: themes.colors.TEXT_DARK,
    marginBottom: 4,
  },
  infoLink: {
    fontSize: 14,
    color: themes.colors.PRIMARY,
    marginTop: 2,
    textDecorationLine: 'underline',
  },
});
