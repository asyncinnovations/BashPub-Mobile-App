import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {themes} from '../../constants/themes';

const TicketCard = ({
  event_title,
  start_datetime,
  end_datetime,
  venue,
  ticket_type,
  quantity,
  status,
  ticket_date,
  ticket_price,
  button_element,
}) => {
  return (
    <View style={styles.ticketContainer}>
      {/* Top Half - Event Title */}
      <View style={styles.header}>
        <Text style={styles.eventTitle}>{event_title}</Text>
      </View>

      {/* Middle - Event Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{ticket_date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Event Start:</Text>
          <Text style={styles.value}>{start_datetime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Venue:</Text>
          <Text style={styles.value}>{venue}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Ticket Type:</Text>
          <Text style={styles.value}>{ticket_type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Qty:</Text>
          <Text style={styles.value}>{quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.status,
              status === 'Used'
                ? styles.used
                : status === 'Cancelled'
                ? styles.cancelled
                : styles.active,
            ]}>
            {status}
          </Text>
        </View>
        <View style={styles.detailRow}>
          {ticket_price > 0 && button_element}
          {/* { && (
            <TouchableOpacity
              disabled={btn_disabled}
              onPress={PayBtn}
              style={styles.proceedBtn}>
              <Text style={styles.proceedText}>
                ${ticket_price} {btn_title}
              </Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>

      {/* Bottom - QR Code */}
      {/* <View style={styles.qrContainer}>
        <Image
          source={ticket.qrCodeUrl}
          style={styles.qrImage}
          resizeMode="contain"
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  ticketContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 10,
    overflow: 'hidden',
    elevation: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  header: {
    backgroundColor: '#3E64FF',
    padding: 16,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsSection: {
    padding: 16,
    backgroundColor: '#fdfdfd',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#444',
  },
  status: {
    color: '#222',
    textTransform: 'capitalize',
    width: 70,
  },
  value: {
    color: '#222',
    textTransform: 'capitalize',
  },
  active: {
    color: '#2ecc71',
  },
  used: {
    color: '#e67e22',
  },
  cancelled: {
    color: '#e74c3c',
  },
  qrContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  qrImage: {
    width: 120,
    height: 120,
  },
  proceedBtn: {
    backgroundColor: themes.colors.PRIMARY,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  proceedText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});

export default TicketCard;
