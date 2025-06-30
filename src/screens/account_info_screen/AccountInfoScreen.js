import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../constants/themes';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import ImagePickerComponent from '../../components/image_picker/ImagePickerComponent';

const AccountInfoScreen = () => {
  const {user, token} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [UserInfo, setUserInfo] = useState({});
  const [SelectedImage, setSelectedImage] = useState({});
  const [ProfileImage, setProfileImage] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  //////////////////////
  // VALIDATE FORM
  //////////////////////
  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = 'Name required';
    }
    if (!phone) {
      errors.phone = 'phone required';
    }
    if (!email) {
      errors.email = 'email required';
    }
    if (!ProfileImage) {
      errors.ProfileImage = 'image required';
    }
    setError(errors);
    return Object.keys(errors).length > 0;
  };

  //////////////////////////////
  // FILE UPLOAD CONTROLLER
  //////////////////////////////
  const handleImageSelected = file => {
    setSelectedImage(file);
    setProfileImage(file.uri);
    ToastAndroid.show('Image Selected Successfully!', ToastAndroid.SHORT);
  };
  //////////////////////////////
  // UPDATE PROFILE INFO
  //////////////////////////////

  const update_profile = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const formdate = new FormData();
      formdate.append('email', email);
      formdate.append('full_name', name);
      formdate.append('phone', phone);
      if (SelectedImage && Object.keys(SelectedImage).length > 0) {
        formdate.append('image', {
          uri: SelectedImage.uri,
          type: SelectedImage.type,
          name: SelectedImage.fileName,
        });
      } else {
        formdate.append('profile_image', ProfileImage);
      }
      const response = await axios.put(
        `${process.env.API_ROOT_URI}/api/auth/guest/update/${user?.user_id}`,
        formdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 200) {
        ToastAndroid.show('Profile Updated', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //////////////////////
  // FETCH USERS INFO
  //////////////////////
  const fetch_user = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/auth/single/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        const data = response.data.result;
        setUserInfo(data);
        setName(data.full_name);
        setEmail(data.email);
        setPhone(data.phone);
        setProfileImage(data.profile_image);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_user();
  }, []);
  const getImageUri = () => {
    if (!ProfileImage) return null;

    // If it's already a full URL
    if (ProfileImage.startsWith('http') || ProfileImage.startsWith('https')) {
      return ProfileImage;
    }

    // If image is from server
    if (['custom', 'facebook', 'apple', 'google'].includes(user?.provider)) {
      return `${process.env.API_ROOT_URI}/public/user_img/${ProfileImage}`;
    }

    // Fallback
    return ProfileImage;
  };

  return (
    <ScrollView style={styles.container}>
      {/* EVENT BANNER */}
      {/* <Text>{getImageUri()}</Text> */}

      <ImagePickerComponent
        onImageSelected={handleImageSelected}
        style={{
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: error.ProfileImage
            ? themes.colors.ERROR
            : themes.colors.BACKGROUND,
          marginBottom: 5,
        }}
        textStyle={{fontSize: 18}}>
        {SelectedImage?.uri || getImageUri() ? (
          <Image
            source={{
              uri: SelectedImage?.uri || getImageUri(),
            }}
            style={styles.avatar}
          />
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

      {/* <View style={styles.avatarContainer}>
        <Image source={{uri: user.image}} style={styles.avatar} />
        <TouchableOpacity style={styles.editAvatarBtn}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, {backgroundColor: '#F0F0F0'}]}
          value={email}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="e.g. +1 234 567 8901"
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          if (!validate()) update_profile();
        }}
        disabled={loading}>
        <Text style={styles.saveText}>
          {loading ? 'Updating...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: themes.colors.TEXT_DARK,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: themes.colors.PRIMARY,
    padding: 8,
    borderRadius: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
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
  saveBtn: {
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
