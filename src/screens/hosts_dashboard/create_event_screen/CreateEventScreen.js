import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../../context/AuthContext';
import {themes} from '../../../constants/themes';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import ImagePickerComponent from '../../../components/image_picker/ImagePickerComponent';
const CreateEventScreen = () => {
  const {user, token} = useAuth();
  const [event_title, setEventTitle] = useState('');
  const [event_startdate, setEventStartDate] = useState('');
  const [event_enddata, setEventEndDate] = useState('');
  const [event_location, setEventLocation] = useState('');
  const [event_type, setEventType] = useState('');
  const [event_description, setEventDescription] = useState('');
  const [event_ticket, setEventTicket] = useState('');
  const [event_maxGuests, setEventMaxGuests] = useState('');
  const [event_status, setEventStatus] = useState('');
  const [event_banner, setEventBanner] = useState('');
  const [event_visibility, setEventVisibility] = useState('');
  const [event_request_join, setEventReqeustJoin] = useState(false);
  const [event_age_restriction, setEventAgeRestriction] = useState('');
  const [event_varification, setEventVarifiction] = useState(false);

  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [SelectedImage, setSelectedImage] = useState({});
  const [AllEventType, setAllEventType] = useState([]);
  const [LoadingState, setLoadingState] = useState({
    event_type: false,
    event_create: false,
  });
  /////////////////////////
  // INPUT VALIDATIONS
  /////////////////////////
  const validate = () => {
    const errors = {};

    if (!event_title) errors.event_title = 'Event title is required';
    if (!event_startdate)
      errors.event_startdate = 'Event start date is required';
    if (!event_enddata) errors.event_enddata = 'Event end date is required';
    if (!event_location) errors.event_location = 'Event location is required';
    if (!event_type) errors.event_type = 'Event type is required';
    if (!event_description)
      errors.event_description = 'Event description is required';
    if (!event_ticket) errors.event_ticket = 'Event ticket type is required';
    if (!event_maxGuests)
      errors.event_maxGuests = 'Event max guest is required';
    if (!event_status) errors.event_status = 'Event status is required';
    if (event_request_join === null || event_request_join === undefined)
      errors.event_request_join = 'Event request join is required';
    if (!event_visibility)
      errors.event_visibility = 'Event visibility is required';
    if (event_varification === null || event_varification === undefined)
      errors.event_varification = 'Event verification is required';
    if (!event_age_restriction)
      errors.event_age_restriction = 'Event age restriction is required';
    if (!event_banner) {
      errors.event_banner = 'Event Banner Image Required';
    }
    setError(errors);
    return Object.keys(errors).length > 0;
  };
  const reset = () => {
    setEventTitle('');
    setEventStartDate('');
    setEventEndDate('');
    setEventLocation('');
    setEventType('');
    setEventDescription('');
    setEventTicket('');
    setEventMaxGuests('');
    setEventStatus('');
    setEventBanner('');
    setEventVisibility('');
    setEventReqeustJoin(false);
    setEventAgeRestriction('');
    setEventVarifiction(false);
    setSelectedImage({});
    setError({});
    setLoader(false);
  };

  //////////////////////////////
  // FILE UPLOAD CONTROLLER
  //////////////////////////////
  const handleImageSelected = file => {
    setSelectedImage(file);
    setEventBanner(file.uri);
    ToastAndroid.show('Image Selected Successfully!', ToastAndroid.SHORT);
  };

  /////////////////////////
  // CREATE NEW EVENT
  /////////////////////////
  const handleCreateEvent = async () => {
    if (validate()) return;
    const formdate = new FormData();
    formdate.append('host_id', user.user_id);
    formdate.append('title', event_title);
    formdate.append('description', event_description);
    formdate.append('event_type', event_type);
    formdate.append('location', event_location);
    formdate.append('start_datetime', event_startdate);
    formdate.append('end_datetime', event_enddata);
    formdate.append('visibility', event_visibility);
    formdate.append('ticket_type', event_ticket);
    formdate.append('allow_request_to_join', event_request_join);
    formdate.append('age_restriction', event_age_restriction);
    formdate.append('guest_verification_required', event_varification);
    formdate.append('max_guests', event_maxGuests);
    formdate.append('status', event_status);
    formdate.append('cover_image', {
      uri: SelectedImage.uri,
      type: SelectedImage.type,
      name: SelectedImage.fileName,
    });
    try {
      setLoadingState({event_create: true, event_type: false});
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/event/create`,
        formdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status == 201) {
        console.log(response.data);
        setLoadingState({event_create: false, event_type: false});
        reset();
        ToastAndroid.show('Event Create Success', ToastAndroid.SHORT);
      }
    } catch (error) {
      setLoadingState({event_create: false, event_type: false});
      console.log(error);
    }
  };
  /////////////////////////
  // FETCH ALL EVENT TYPES
  /////////////////////////
  const fetch_event_types = async () => {
    try {
      setLoadingState({event_create: false, event_type: true});
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event_type/all`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setAllEventType(response.data.result);
        setLoadingState({event_create: false, event_type: false});
      }
    } catch (error) {
      setLoadingState({event_create: false, event_type: false});
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_event_types();
  }, []);
  /////////////////////////
  // CREATE LOADER
  /////////////////////////
  if (LoadingState.event_type) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="small" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* EVENT BANNER */}
      <ImagePickerComponent
        onImageSelected={handleImageSelected}
        style={{
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: error.event_banner
            ? themes.colors.ERROR
            : themes.colors.BACKGROUND,
          marginBottom: 5,
        }}
        textStyle={{fontSize: 18}}>
        {event_banner ? (
          <Image source={{uri: event_banner}} style={styles.appIcon} />
        ) : (
          <View style={styles.upload_btn}>
            <Ionicons
              name="cloud-upload"
              size={50}
              color={themes.colors.SUCCESS}
            />
            <Text style={styles.upload_btn_txt}>Upload App Icon</Text>
          </View>
        )}
      </ImagePickerComponent>

      {/* EVENT TITLE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error.event_title
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          placeholder="e.g. Rooftop Party"
          value={event_title}
          onChangeText={setEventTitle}
        />
      </View>

      {/* EVENT START DATE TIME */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>start & Time</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error.event_startdate
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          placeholder="e.g. May 20, 2025 at 8:00 PM"
          value={event_startdate}
          onChangeText={setEventStartDate}
        />
      </View>

      {/* EVENT END DATE TIME */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>End & Time</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error.event_enddata
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          placeholder="e.g. May 20, 2025 at 8:00 PM"
          value={event_enddata}
          onChangeText={setEventEndDate}
        />
      </View>

      {/* EVENT LOCATION */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error.event_location
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          placeholder="Venue or Address"
          value={event_location}
          onChangeText={setEventLocation}
        />
      </View>

      {/* EVENT TYPE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Type</Text>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.event_type
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}>
          <Picker
            selectedValue={event_type}
            onValueChange={(value, index) => setEventType(value)}>
            <Picker.Item label="Select Event Type" value="" />
            {AllEventType.map((items, index) => (
              <Picker.Item key={index} label={items.name} value={items.uuid} />
            ))}
          </Picker>
        </View>
      </View>

      {/* EVENT DESCRIPTION */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              borderColor: error.event_description
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          placeholder="Write a short event description..."
          value={event_description}
          onChangeText={setEventDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* EVENT MAX GUEST */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Max Guests</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error.event_maxGuests
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}
          placeholder="e.g. 150"
          value={event_maxGuests}
          onChangeText={setEventMaxGuests}
          keyboardType="numeric"
        />
      </View>

      {/* EVENT REQUEST TO JOIN */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Allow Request To Join</Text>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.event_request_join
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}>
          <Picker onValueChange={(value, index) => setEventReqeustJoin(value)}>
            <Picker.Item label="Guest Can Send Request To Join" value={true} />
            <Picker.Item
              label="Guest Can't Send Request To Join"
              value={false}
            />
          </Picker>
        </View>
      </View>

      {/* EVENT AGE RESTRICTED */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Age Restriction</Text>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.event_age_restriction
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}>
          <Picker
            onValueChange={(value, index) => setEventAgeRestriction(value)}>
            <Picker.Item label="Can Join Age - 21+" value="21+" />
            <Picker.Item label="Can Join Age - 18+" value="18+" />
            <Picker.Item label="Can Join Age - 16+" value="16+" />
            <Picker.Item label="Can Join Age - 14+" value="14+" />
            <Picker.Item label="Can Join Any Age" value="none" />
          </Picker>
        </View>
      </View>

      {/* EVENT VARIFICTION */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Guest Varification</Text>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.event_varification
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}>
          <Picker onValueChange={(value, index) => setEventVarifiction(value)}>
            <Picker.Item label="Need Varification" value={true} />
            <Picker.Item label="No Need" value={false} />
          </Picker>
        </View>
      </View>

      {/* EVENT VISIBILITY */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Visibility</Text>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.event_visibility
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}>
          <Picker onValueChange={(value, index) => setEventVisibility(value)}>
            <Picker.Item label="public" value="public" />
            <Picker.Item label="invite-only" value="invite-only" />
            <Picker.Item label="close-friends" value="close-friends" />
          </Picker>
        </View>
      </View>

      {/* EVENT TICKET TYPE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ticket Type</Text>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.event_ticket
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}>
          <Picker onValueChange={(value, index) => setEventTicket(value)}>
            <Picker.Item label="VIP" value="vip" />
            <Picker.Item label="GENERAL" value="general" />
            <Picker.Item label="FREE" value="free" />
          </Picker>
        </View>
      </View>

      {/* EVENT STATUS */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Event Status</Text>
        <View
          style={[
            styles.picker,
            {
              borderColor: error.event_status
                ? themes.colors.ERROR
                : themes.colors.TEXT_LIGHT,
            },
          ]}>
          <Picker onValueChange={(value, index) => setEventStatus(value)}>
            <Picker.Item label="Published" value="published" />
            <Picker.Item label="Upcoming" value="upcoming" />
            <Picker.Item label="Canceled" value="canceled" />
            <Picker.Item label="Completed" value="completed" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        disabled={LoadingState.event_create}
        style={styles.createBtn}
        onPress={handleCreateEvent}>
        <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
        <Text style={styles.createText}>
          {LoadingState.event_create ? 'Loading...' : 'Create Event'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageUpload: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginBottom: 15,
  },
  upload_btn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upload_btn_txt: {
    textTransform: 'capitalize',
    fontWeight: '600',
    color: themes.colors.SUCCESS,
  },
  appIcon: {
    width: '100%',
    objectFit: 'cover',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
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
    borderColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    backgroundColor: themes.colors.BACKGROUND,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createBtn: {
    backgroundColor: themes.colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
    gap: 8,
    marginVertical: 20,
  },
  createText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '700',
    fontSize: 16,
  },
  picker: {
    padding: 1,
    backgroundColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themes.colors.BACKGROUND,
  },
});
