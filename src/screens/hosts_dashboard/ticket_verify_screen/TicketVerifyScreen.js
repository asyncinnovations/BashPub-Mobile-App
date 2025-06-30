import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import {useAuth} from '../../../context/AuthContext';

const TicketVerifyScreen = ({route}) => {
  const {user, token} = useAuth();
  const {event_id} = route.params;
  const [AllInviteHistory, setAllInviteHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /////////////////////////
  // FETCH SELLED TICKETS
  /////////////////////////
  const fetch_selled_tickets = async () => {
    console.log(user.user_id, event_id);
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/invitation/verify-guests/${user?.user_id}/${event_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        setAllInviteHistory(response.data.result);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_selled_tickets();
  }, []);

  const renderGuestItem = ({item, index}) => (
    <View style={styles.card} key={index}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.detail}>
        <Ionicons name="mail-outline" size={14} /> {item.email}
      </Text>
      <Text style={styles.detail}>
        <MaterialIcons name="confirmation-number" size={14} /> Ticket:{' '}
        {item.ticket}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="checkmark-done-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: themes.colors.SUCCESS}]}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  /////////////////////////////////
  // PULL REFRESH TO FETCH DATA
  ////////////////////////////////
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetch_invited_users();
    setIsRefreshing(false);
  };
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={AllInviteHistory}
      keyExtractor={item => item.invite_event_id}
      renderItem={renderGuestItem}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No invitations found.</Text>
      }
    />
  );
};

export default TicketVerifyScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
  },
});
