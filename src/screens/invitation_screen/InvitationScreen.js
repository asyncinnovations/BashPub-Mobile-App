import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DateFormate} from '../../utility/DateFormater';
import {useAuth} from '../../context/AuthContext';
import {themes} from '../../constants/themes';
import axios from 'axios';
const InvitationScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [AllInvites, setAllInvites] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /////////////////////////
  // ACCEPT INVITATIONS
  /////////////////////////
  const respond_invitation = async (invite_id, status) => {
    try {
      const data = {
        status,
      };
      const response = await axios.put(
        `${process.env.API_ROOT_URI}/api/invitation/respond/${invite_id}`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        await fetch_invites();
        if (status == 'accept') {
          ToastAndroid.show('Invitation Accepted', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Invitation Cancelled', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  /////////////////////////////////
  // HANDLE ACCEPT INVITATION
  /////////////////////////////////
  const accept_invitation = (
    invite_id,
    event_id,
    invite_type,
    ticket_price,
    host_id,
  ) => {
    if (ticket_price > 0) {
      // Paid invitation (VIP or Regular with price)
      // Redirect to ticket selection screen
      navigation.navigate('Select Ticket', {
        invite_id,
        ticket_price,
        invite_type,
        event_id,
        host_id,
      });
    } else {
      // Free invitation, accept immediately
      respond_invitation(invite_id, 'accept');
    }
  };

  /////////////////////////////////////////
  // FETCH ALL INVITES RECIVED FROM HOSTS
  /////////////////////////////////////////
  const fetch_invites = async () => {
    try {
      setIsRefreshing(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/invitation/guest/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        console.log(response.data);
        setIsRefreshing(false);
        setAllInvites(response.data.result);
      }
    } catch (error) {
      setIsRefreshing(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_invites();
  }, []);

  /////////////////////////////////
  // PULL REFRESH TO FETCH DATA
  ////////////////////////////////
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetch_invites();
    setIsRefreshing(false);
  };
  ///////////////////////////////
  // RENDER INVITES CARD ITEMS
  ///////////////////////////////
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.event}>{item.title}</Text>
        <Text style={[styles.status, styles[`status_${item.status}`]]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.host}>Host: {item.host_name}</Text>

      <View style={styles.list}>
        <Text style={styles.info}>
          <FontAwesome5
            name="calendar-alt"
            size={14}
            color={themes.colors.PRIMARY}
          />
        </Text>
        <Text>
          {DateFormate(item.start_datetime)} at {DateFormate(item.end_datetime)}
        </Text>
      </View>

      <View style={styles.list}>
        <Text style={styles.info}>
          <MaterialIcons name="map" size={18} color={themes.colors.PRIMARY} />
        </Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>

      <View style={styles.list}>
        <Text style={styles.info}>🎫</Text>
        <Text style={styles.info}>{item.invite_type} ticket</Text>
      </View>

      <View style={styles.actionRow}>
        {item.status === 'pending' && (
          <View style={styles.actionRow}>
            21111
            <TouchableOpacity
              style={styles.acceptBtn}
              //  respond_invitation(item.uuid, 'accept')
              onPress={() =>
                accept_invitation(
                  item.uuid,
                  item.event_id,
                  item.invite_type,
                  item.price,
                  item.host_id,
                )
              }>
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => respond_invitation(item.uuid, 'cancelled')}>
              <Text style={styles.actionText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
        <View>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              navigation.navigate('Event Details', {event_id: item.event_id})
            }>
            <Text style={styles.viewText}>View Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={AllInvites}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{paddingBottom: 100}}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={<DataNotFound text="No Invites Found found." />}
      />
    </View>
  );
};

export default InvitationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: themes.colors.TEXT_DARK,
  },
  card: {
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  event: {
    fontSize: 18,
    fontWeight: '700',
    color: themes.colors.TEXT_DARK,
    marginBottom: 4,
  },
  host: {
    fontSize: 14,
    color: themes.colors.TEXT_DARK,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  info: {
    fontSize: 13,
    color: themes.colors.TEXT_DARK,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  status_pending: {
    backgroundColor: '#FFF3CD',
    color: themes.colors.TEXT_DARK,
  },
  status_accept: {
    backgroundColor: themes.colors.SUCCESS,
    color: themes.colors.TEXT_LIGHT,
  },
  status_declined: {
    backgroundColor: '#FFCDD2',
    color: '#C62828',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  acceptBtn: {
    backgroundColor: themes.colors.SUCCESS,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  declineBtn: {
    backgroundColor: themes.colors.ERROR,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  viewBtn: {
    marginTop: 10,
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  viewText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
