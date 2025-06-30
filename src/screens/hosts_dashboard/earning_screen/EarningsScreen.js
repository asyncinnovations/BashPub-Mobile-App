import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../../constants/themes';

const EarningsScreen = () => {
  const events = [
    {
      id: '1',
      event: 'Rooftop DJ Party',
      date: 'May 25, 2025',
      gross: 5600,
      fee: 1232, // 22%
      payoutStatus: 'Paid',
    },
    {
      id: '2',
      event: 'Wedding Bash',
      date: 'Apr 10, 2025',
      gross: 8200,
      fee: 1804,
      payoutStatus: 'Pending',
    },
    {
      id: '3',
      event: 'Dinner Night',
      date: 'Mar 18, 2025',
      gross: 2500,
      fee: 550,
      payoutStatus: 'Paid',
    },
  ];

  const totalGross = events.reduce((acc, e) => acc + e.gross, 0);
  const totalFee = events.reduce((acc, e) => acc + e.fee, 0);
  const totalNet = totalGross - totalFee;

  return (
    <ScrollView style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Gross Earnings</Text>
          <Text style={styles.value}>${totalGross.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Platform Fee (22%)</Text>
          <Text style={styles.value}>-${totalFee.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryItem, styles.netItem]}>
          <Text style={styles.label}>Net Earnings</Text>
          <Text style={[styles.value, styles.netValue]}>
            ${totalNet.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Per Event Breakdown */}
      <Text style={styles.sectionTitle}>Event Earnings</Text>
      {events.map(e => (
        <View key={e.id} style={styles.card}>
          <Text style={styles.eventName}>{e.event}</Text>
          <Text style={styles.date}>
            <Ionicons name="calendar-outline" size={14} /> {e.date}
          </Text>

          <Text style={styles.amount}>Gross: ${e.gross.toLocaleString()}</Text>
          <Text style={styles.amount}>
            Fee: -${e.fee.toLocaleString()} (22%)
          </Text>
          <Text style={styles.net}>
            Net: ${(e.gross - e.fee).toLocaleString()}
          </Text>

          <View
            style={[
              styles.statusBadge,
              e.payoutStatus === 'Paid'
                ? styles.statusPaid
                : styles.statusPending,
            ]}>
            <Text style={styles.statusText}>{e.payoutStatus}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default EarningsScreen;

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
    color: '#333',
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#eee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  netItem: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  netValue: {
    color: '#2E7D32',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  date: {
    fontSize: 13,
    color: '#777',
    marginBottom: 8,
  },
  amount: {
    fontSize: 14,
    color: '#444',
  },
  net: {
    fontSize: 16,
    fontWeight: '700',
    color: '#388E3C',
    marginTop: 6,
  },
  statusBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPaid: {
    backgroundColor: '#C8E6C9',
  },
  statusPending: {
    backgroundColor: '#FFE082',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
});
