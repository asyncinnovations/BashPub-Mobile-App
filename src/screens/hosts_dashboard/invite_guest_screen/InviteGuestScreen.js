import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CheckBox} from 'react-native-elements';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import {useAuth} from '../../../context/AuthContext';
import {Picker} from '@react-native-picker/picker';
const InviteGuestScreen = ({route, navigations}) => {
  const {user, token} = useAuth();
  const {event_id, host_id} = route.params;
  const [selectedIds, setSelectedIds] = useState([]);
  const [TicketPrice, setTicketPrice] = useState(0);
  const [InviteType, setInviteType] = useState('');
  const [InviteLoader, setInviteLoader] = useState(false);
  const [AllUsers, setAllUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  /////////////////////////////////
  // TOGGLE USER SELECTION
  ////////////////////////////////
  const toggleSelection = user => {
    setSelectedIds(prev => {
      const exists = prev.find(u => u.email === user.email);
      if (exists) {
        return prev.filter(u => u.email !== user.email);
      } else {
        return [...prev, user];
      }
    });
  };

  /////////////////////////////////
  // RENDER USER CARD ITEMS
  ////////////////////////////////
  const renderItem = ({item}) => (
    <View style={styles.userItem}>
      <CheckBox
        checked={selectedIds.some(u => u.email === item.email)}
        onPress={() => toggleSelection(item)}
        checkedColor={themes.colors.PRIMARY}
        containerStyle={styles.checkboxContainer}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Name : {item.full_name}</Text>
        <Text style={styles.userEmail}>Email : {item.email}</Text>
        <Text style={styles.userEmail}>Location🗺 : {item.location}</Text>
      </View>
    </View>
  );

  /////////////////////////////////
  // SEND INVITATION TO GUESTS
  ////////////////////////////////
  const handleSendInvite = async () => {
    if (!InviteType) {
      ToastAndroid.show('Invite Type is required', ToastAndroid.SHORT);
      return;
    }
    if (!TicketPrice) {
      ToastAndroid.show('Ticket Price is required', ToastAndroid.SHORT);
      return;
    }

    setInviteLoader(true);
    for (const user of selectedIds) {
      const data = {
        host_id: host_id,
        guest_id: user.user_id,
        event_id: event_id,
        invite_type: InviteType,
        price: TicketPrice,
        status: 'pending',
      };
      try {
        const response = await axios.post(
          `${process.env.API_ROOT_URI}/api/invitation/send`,
          data,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        if (response.status === 201) {
          await fetch_all_users();
          setInviteLoader(false);
          ToastAndroid.show('Invite sent successfully', ToastAndroid.SHORT);
          setTicketPrice('');
          setInviteType('');
          setSelectedIds([]);
        }
      } catch (error) {
        setInviteLoader(false);
        console.error('Invite failed for', user, error);
      }
    }
  };
  /////////////////////////////////
  // FETCH ALL PLATFORM USERS
  ////////////////////////////////
  useEffect(() => {
    fetch_all_users();
  }, [event_id]);
  const fetch_all_users = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/auth/invite_user/${event_id}`,
      );
      if (response.status == 200) {
        const finder = response.data.result.filter(i => i.role !== 'hosts');
        console.log(response.data.result)
        setAllUsers(finder);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /////////////////////////////////
  // PULL REFRESH TO FETCH DATA
  ////////////////////////////////
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetch_all_users();
    setIsRefreshing(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* USER INVITE FORM HERE */}
      <View style={styles.form}>
        {selectedIds.length > 0 && (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.footer}>
            <Text
              style={{
                paddingVertical: 10,
                fontSize: 18,
                textTransform: 'capitalize',
                color: themes.colors.TEXT_DARK,
              }}>
              Invite Summary
            </Text>
            {/* TICKET PRICE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ticket Price</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Ticket Price"
                keyboardType="number-pad"
                value={TicketPrice}
                onChangeText={setTicketPrice}
              />
            </View>
            {/* EVENT STATUS */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Invite Type</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={InviteType}
                  onValueChange={(value, index) => setInviteType(value)}>
                  <Picker.Item label="VIP" value="vip" />
                  <Picker.Item label="General" value="general" />
                  <Picker.Item label="Free" value="free" />
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              style={styles.inviteButton}
              disabled={InviteLoader}
              onPress={handleSendInvite}>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.inviteText}>
                {InviteLoader
                  ? 'Sending...'
                  : `Send Invite ${selectedIds.length}`}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
      {/* USR INVITE CARD HERE */}
      <Text style={styles.subHeader}>
        Select one or more users to send an invitation.
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={AllUsers}
        renderItem={renderItem}
        keyExtractor={item => item.uuid}
        contentContainerStyle={{paddingBottom: 100}}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No User Found found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default InviteGuestScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  checkboxContainer: {
    padding: 0,
    margin: 0,
  },

  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 16,
    color: '#666',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themes.colors.BACKGROUND,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 5,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  form: {
    paddingVertical: 10,
  },
  footer: {
    // position: 'absolute',
    // bottom: 20,
    // left: 16,
    // right: 16,
    // height: 'auto',
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
    borderRadius: 10,
  },
  inviteButton: {
    flexDirection: 'row',
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  inviteText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  // input style
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  input: {
    borderWidth: 1,
    borderColor: themes.colors.SECONDARY,
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    backgroundColor: themes.colors.BACKGROUND,
  },
  picker: {
    padding: 1,
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.colors.SECONDARY,
    height: 50,
  },
});
