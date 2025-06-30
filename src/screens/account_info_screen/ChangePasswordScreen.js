import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../context/AuthContext';
import {themes} from '../../constants/themes';
import axios from 'axios';

const ChangePasswordScreen = () => {
  const {user, token} = useAuth();
  const [Loader, setLoader] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState({});
  const [secure, setSecure] = useState({
    current: true,
    new: true,
    confirm: true,
  });

  ////////////////////////////////
  // PASSWORD VALIDATIONS
  ////////////////////////////////
  const validate = () => {
    let errors = {};
    if (!newPassword) {
      errors.newPassword = 'new password is required';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'confirm Password is required';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'new passwrod and confirm password not match';
    }
    setError(errors);
    return Object.keys(errors).length > 0;
  };

  /////////////////////////////////
  // CHANGE PASSWORD VIA USER ID
  ////////////////////////////////
  const change_password = async () => {
    if (validate()) return;
    const data = {
      user_id: user?.user_id,
      new_password: newPassword,
    };
    try {
      setLoader(true);
      const response = await axios.post(
        `${process.env.API_ROOT_URI}/api/auth/change_password`,
        data,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        setLoader(false);
        console.log(response.data);
        setNewPassword('');
        setConfirmPassword('');
        ToastAndroid.show('Password Changed Successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Current Password */}
      {/* <View style={styles.inputGroup}>
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={secure.current}
            placeholder="Enter current password"
          />
          <TouchableOpacity
            onPress={() =>
              setSecure(prev => ({...prev, current: !prev.current}))
            }>
            <Ionicons
              name={secure.current ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View> */}

      {/* New Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: error.newPassword
                  ? themes.colors.ERROR
                  : themes.colors.BACKGROUND,
              },
            ]}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secure.new}
            placeholder="Enter new password"
          />
          <TouchableOpacity
            onPress={() => setSecure(prev => ({...prev, new: !prev.new}))}>
            <Ionicons
              name={secure.new ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {error.newPassword && (
          <Text style={{color: 'red'}}>{error.newPassword}</Text>
        )}
      </View>

      {/* Confirm Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: error.confirmPassword
                  ? themes.colors.ERROR
                  : themes.colors.BACKGROUND,
              },
            ]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secure.confirm}
            placeholder="Re-enter new password"
          />
          <TouchableOpacity
            onPress={() =>
              setSecure(prev => ({...prev, confirm: !prev.confirm}))
            }>
            <Ionicons
              name={secure.confirm ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {error.confirmPassword && (
          <Text style={{color: 'red'}}>{error.confirmPassword}</Text>
        )}
      </View>

      <TouchableOpacity
        disabled={Loader}
        onPress={change_password}
        style={styles.saveBtn}>
        <Text style={styles.saveText}>
          {Loader ? 'Loading...' : 'Update Password'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChangePasswordScreen;

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
    marginBottom: 24,
    color: themes.colors.TEXT_DARK,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: themes.colors.TEXT_DARK,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: themes.colors.BACKGROUND,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: themes.colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  saveText: {
    color: themes.colors.TEXT_LIGHT,
    fontWeight: '700',
    fontSize: 16,
  },
});
