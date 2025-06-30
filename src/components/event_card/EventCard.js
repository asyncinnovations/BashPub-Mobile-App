import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {themes} from '../../constants/themes';
import React, {memo} from 'react';
const EventCard = ({
  banner,
  title,
  date,
  price,
  rating,
  isFavorit,
  horizantal = false,
  width,
  ticket_type,
  AddFavorit,
  RemoveFavorit,
  onView,
}) => {
  return (
    <TouchableOpacity
      onPress={onView}
      activeOpacity={0.9}
      style={[
        styles.event_card,
        {flexDirection: horizantal ? 'row' : 'column', width: width},
      ]}>
      <View style={styles.banner_wrapper}>
        <FastImage
          style={horizantal ? styles.image_horizontal : styles.image}
          source={{uri: banner, priority: 'high'}}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={styles.event_type}>{ticket_type}</Text>
        {/* <TouchableOpacity style={styles.overlay} onPress={OnFavorit}>
          {isFavorit ? (
            <FontAwesome name="heart" size={25} color={themes.colors.ERROR} />
          ) : (
            <FontAwesome5
              name="heart"
              size={25}
              color={themes.colors.TEXT_LIGHT}
            />
          )}
        </TouchableOpacity> */}
        {isFavorit ? (
          <TouchableOpacity style={styles.overlay} onPress={RemoveFavorit}>
            <FontAwesome name="heart" size={25} color={themes.colors.ERROR} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.overlay} onPress={AddFavorit}>
            <FontAwesome5
              name="heart"
              size={25}
              color={themes.colors.TEXT_LIGHT}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.card_content}>
        <View style={styles.header_row}>
          <Text style={styles.title} numberOfLines={2}>
            {title || 'Candlelight: Hans Zimmer’s Best Works'}
          </Text>
        </View>

        <Text style={styles.date}>{date || 'Apr 19, 09:00PM and others'}</Text>

        <View style={styles.footer_row}>
          <Text style={styles.price}>
            from - {price ? `$${price}` : 'Free'}
          </Text>
          {rating && (
            <View style={styles.rating_box}>
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(EventCard);
const styles = StyleSheet.create({
  event_card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    margin: 2,
    shadowColor: '#000',
    // shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // elevation: 4,
    marginBottom: 5,
  },
  event_type: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: themes.colors.BACKGROUND,
    padding: 4,
    borderRadius: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: themes.font.weight.large,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  image: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image_horizontal: {
    position: 'relative',
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  card_content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 6,
  },
  fav_icon: {
    marginLeft: 5,
  },
  date: {
    color: '#888',
    fontSize: 14,
    marginTop: 6,
  },
  from: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  footer_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: '#000',
  },
  rating_box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
});
