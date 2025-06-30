import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {useState} from 'react';
import {useEffect} from 'react';
import {themes} from '../../constants/themes';
import {useFocusEffect} from '@react-navigation/native';

const NotificationScreen = () => {
  const {user, token} = useAuth();
  const [AllNotification, setAllNotification] = useState([]);
  const [loader, setLoader] = useState(false);

  const GetIcon = type => {
    switch (type) {
      case 'reminder':
        return 'notifications-outline';
      case 'ticket':
        return 'ticket-outline';
      case 'invite':
        return 'mail-outline';
      case 'refund':
        return 'cash-outline';
      default:
        return 'alert-circle-outline';
    }
  };
  //////////////////////////////
  // UPDATE NOTIFICATION TO READ
  //////////////////////////////
  const mark_as_read = async id => {
    try {
      const response = await axios.put(
        `${process.env.API_ROOT_URI}/api/notification/read/${id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        ToastAndroid.show('Market as Read', ToastAndroid.SHORT);
        fetch_notification();
      }
    } catch (error) {
      console.log(error);
    }
  };
  //////////////////////////////
  // FETCH ALL USER NOTIFICATION
  //////////////////////////////
  const fetch_notification = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/notification/user/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setLoader(false);
        setAllNotification(response.data.data);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetch_notification();
    }, []),
  );
  const renderItem = ({item}) => (
    <View
      style={[
        styles.card,
        {backgroundColor: item.status == 'read' ? '#F4F4F4' : '#E3F2FD'},
      ]}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => mark_as_read(item.uuid)}>
        <Ionicons
          name={GetIcon(item.type)}
          size={24}
          color={item.status == 'read' ? '#888' : '#1976D2'}
          style={styles.icon}
        />
        <View style={styles.textBox}>
          <Text style={styles.message}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  //////////////////////////////
  // FETCH NOTIFICATIONS LOADER
  //////////////////////////////
  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={AllNotification}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={<DataNotFound text="Notification Not Found!" />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textBox: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#777',
  },
});
