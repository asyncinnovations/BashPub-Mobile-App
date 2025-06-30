import {
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {themes} from '../../constants/themes';
const {width} = Dimensions.get('window');
const CategoryCard = ({
  image,
  title,
  index,
  horizontal = false,
  card_width = 0.47,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.category_card,
        {
          flexDirection: horizontal ? 'row' : 'column',
          display: horizontal ? 'flex' : 'contents',
          width: width * card_width,
        },
      ]}
      key={index}>
      {/* <FastImage
        style={styles.category_card_img}
        source={{
          uri: image,
          cache: 'cacheOnly',
          priority: 'high',
        }}
      /> */}
      <Image
        source={{uri: image, cache: 'default'}}
        style={styles.category_card_img}
      />
      <Text style={styles.category_card_title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  // category_card
  category_card: {
    height: 55,
    marginRight: 5,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: themes.colors.BACKGROUND,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  category_card_img: {
    width: 55,
    height: 55,
    objectFit: 'cover',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  category_card_title: {
    color: themes.colors.TEXT_DARK,
    fontSize: themes.font.size.regular,
    fontWeight: themes.font.weight.regular,
    textTransform: 'capitalize',
    width: '100%',
  },
});
