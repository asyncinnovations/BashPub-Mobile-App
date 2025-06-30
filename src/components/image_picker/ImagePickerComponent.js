import React, {useState} from 'react';
import {TouchableOpacity, Text, ToastAndroid, StyleSheet} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {themes} from '../../constants/themes';

const ImagePickerComponent = ({
  onImageSelected,
  maxSizeMB = 5,
  buttonText = 'Select Image',
  style,
  textStyle,
  children,
}) => {
  const [loader, setLoader] = useState(false);
  const openImagePicker = async () => {
    try {
      let options = {
        mediaType: 'photo',
        includeBase64: false,
      };
      setLoader(true);
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          ToastAndroid.show('Image Not Selected', ToastAndroid.LONG);
          setLoader(false);
        } else if (response.assets && response.assets.length > 0) {
          const file = response.assets[0];
          const fileSize = file.fileSize;
          const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
          setLoader(false);
          if (fileSize > maxSize) {
            setLoader(false);
            ToastAndroid.show(
              `File Size Should Be ${maxSizeMB}MB or Lower.`,
              ToastAndroid.LONG,
            );
          } else {
            setLoader(false);
            onImageSelected(file); // Pass selected file to parent component
          }
        } else {
          setLoader(false);
          ToastAndroid.show('Please select an image.', ToastAndroid.SHORT);
        }
      });
    } catch (error) {
      setLoader(false);
      console.error('ImagePicker Error:', error);
    }
  };

  return loader ? (
    <Text style={styles.loader_txt}>Uploading...</Text>
  ) : (
    <TouchableOpacity onPress={openImagePicker} style={[styles.button, style]}>
      {children ? (
        children
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
  button: {
    backgroundColor: themes.colors.BACKGROUND,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: themes.colors.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader_txt: {
    textTransform: 'capitalize',
    color: themes.colors.TEXT_DARK,
    fontSize: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
