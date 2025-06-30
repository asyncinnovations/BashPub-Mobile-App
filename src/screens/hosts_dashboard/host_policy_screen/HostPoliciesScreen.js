import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {themes} from '../../../constants/themes';
const HostPoliciesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.policyCard}>
        <Text style={styles.policyTitle}>Cancellation Policy</Text>
        <Text style={styles.policyText}>
          Hosts must notify guests at least 24 hours before cancellation.
          Failure to do so may result in penalties.
        </Text>
      </View>

      <View style={styles.policyCard}>
        <Text style={styles.policyTitle}>Guest Conduct</Text>
        <Text style={styles.policyText}>
          Hosts can set house rules. Guests must follow them. Report violations
          immediately for BashPub support.
        </Text>
      </View>

      <View style={styles.policyCard}>
        <Text style={styles.policyTitle}>Damage & Liability</Text>
        <Text style={styles.policyText}>
          Hosts are responsible for reporting damages. Security deposits may be
          required for certain events.
        </Text>
      </View>

      <View style={styles.policyCard}>
        <Text style={styles.policyTitle}>Check-in & Check-out</Text>
        <Text style={styles.policyText}>
          Clearly mention check-in/check-out times. Guests should leave the
          venue on time unless agreed otherwise.
        </Text>
      </View>
    </ScrollView>
  );
};

export default HostPoliciesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes?.colors?.BACKGROUND,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themes?.colors?.PRIMARY,
    marginBottom: 20,
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
