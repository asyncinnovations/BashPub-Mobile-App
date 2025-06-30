import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {themes} from '../../constants/themes';

const UpcomingCard = ({
  event_banner,
  event_category,
  event_title,
  event_date,
  event_time,
  event_host,
  favorit,
  onView,
  AddFavorit,
  RemoveFavorit,
}) => {
  return (
    <TouchableOpacity
      onPress={onView}
      activeOpacity={0.5}
      style={styles.event_card}>
      <FastImage
        style={styles.event_card_img}
        source={{
          uri: event_banner,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      {favorit ? (
        <TouchableOpacity style={styles.overlay} onPress={RemoveFavorit}>
          <FontAwesome name="heart" size={25} color={themes.colors.ERROR} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.overlay} onPress={AddFavorit}>
          <FontAwesome5Icon
            name="heart"
            size={25}
            color={themes.colors.TEXT_LIGHT}
          />
        </TouchableOpacity>
      )}
      <View style={styles.event_detail_wrapper}>
        <View>
          <Text style={styles.price}>{event_category}</Text>
          <Text style={styles.title}>{event_title}</Text>
        </View>
        <View style={styles.event_details}>
          <View style={styles.detailItem}>
            <FontAwesome name="calendar" size={14} color="#555" />
            <Text style={styles.detailText}>{event_date}</Text>
          </View>
          {/* <View style={styles.detailItem}>
            <FontAwesome5Icon name="clock" size={14} color="#555" />
            <Text style={styles.detailText}>{event_time}</Text>
          </View> */}
          <View style={styles.avater}>
            <FontAwesome5Icon
              name="user"
              style={{textAlign: 'center'}}
              size={14}
              color="#555"
            />
            <Text style={styles.avater_txt}>Host: {event_host.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  event_card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  event_card_img: {
    width: '100%',
    height: 170,
  },
  event_detail_wrapper: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
  },
  title: {
    fontSize: themes.font.size.regular,
    fontWeight: themes.font.weight.large,
    color: themes.colors.TEXT_DARK,
    marginTop: 6,
  },
  price: {
    fontSize: themes.font.size.regular,
    fontWeight: themes.font.weight.medium,
    color: themes.colors.SUCCESS,
  },
  event_details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avater: {
    backgroundColor: themes.colors.BACKGROUND,
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    gap: 10,
  },
  avater_txt: {
    fontSize: themes.font.size.small,
    color: '#555',
    textAlign: 'center',
    fontWeight: '600',
  },
  detailText: {
    fontSize: themes.font.size.small,
    color: '#555',
    marginLeft: 4,
  },
});

export default UpcomingCard;
