import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CategoryCard from '../../components/category_card/CategoryCard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {categories} from '../../utility/event_categories';
import Icons from 'react-native-vector-icons/Ionicons';
import {themes} from '../../constants/themes';
import SectionTitle from '../../components/section_title/SectionTitle';
import {FlatList} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import DataNotFound from '../../components/data_notfound/DataNotFound';
import {useFocusEffect} from '@react-navigation/native';
const SearchScreen = ({navigation}) => {
  const {user, token} = useAuth();
  const [loader, setLoader] = useState(false);
  const [AllEventType, setAllEventType] = useState([]);
  const [AllEvent, setAllEvent] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const popularSearches = [
    'Concerts',
    'Candlelight',
    'Rooftops',
    'Exhibitions',
    'Restaurants',
    'Cinema',
  ];
  /////////////////////////
  // SEARCH EVENTS
  /////////////////////////
  const fetch_events = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event/all`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setAllEvent(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch_events();
    }, []),
  );

  //////////////////////////
  // FETCH ALL EVENT TYPES
  /////////////////////////
  const fetch_event_types = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/event_type/all`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status === 200) {
        console.log(response.data);
        setLoader(false);
        setAllEventType(response.data.result);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch_event_types();
    }, []),
  );

  if (loader) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      {/* EVENT SEARCHING */}
      <View style={styles.search_box}>
        <Icons name="search" size={16} color={themes.colors.PRIMARY} />
        <TextInput
          style={styles.search_input}
          placeholder="Search Event"
          keyboardType="ascii-capable"
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            const filtered = AllEvent.filter(event =>
              event.title.toLowerCase().includes(text.toLowerCase()),
            );
            setSuggestions(filtered);
          }}
        />
      </View>
      {/* <TouchableOpacity>
          <FontAwesome name="search" size={25} color={themes.colors.PRIMARY} />
        </TouchableOpacity> */}
      {searchText.length > 0 && suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSearchText(item.title);
                setSuggestions([]); // Hide suggestions after selecting
                navigation.navigate('Event Details', {event_id: item.uuid});
              }}
              style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* POPULAR CATEGORIES */}
      <ScrollView
        style={styles.scroll}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        <View style={styles.tagsContainer}>
          {popularSearches.map((tag, idx) => (
            <TouchableOpacity key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* all categorys */}
        <View style={styles.category_container}>
          <SectionTitle title="Categories" subtitle="" />
          <FlatList
            data={AllEventType}
            numColumns={2}
            scrollEnabled={false}
            horizontal={false}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<DataNotFound />}
            renderItem={({item, index}) => (
              <CategoryCard
                onPress={() =>
                  navigation.navigate('Category Event', {
                    category_id: item.uuid,
                  })
                }
                horizontal={true}
                image={`${process.env.API_ROOT_URI}/public/event_type_img/${item.icon}`}
                title={item.name}
                key={index}
              />
            )}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            contentContainerStyle={{paddingBottom: 16}}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    marginBottom: '25%',
  },
  search_box: {
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    backgroundColor: themes.colors.BACKGROUND,
    borderColor: themes.colors.BACKGROUND,
    borderRadius: 10,
    padding: 10,
  },
  search_input: {
    padding: 5,
    width: '85%',
  },
  scroll: {
    flex: 1,
  },
  sectionTitle: {
    color: themes.colors.TEXT_DARK,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    borderColor: themes.colors.BACKGROUND,
    backgroundColor: themes.colors.BACKGROUND,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: themes.colors.TEXT_DARK,
  },
  category_container: {
    paddingHorizontal: 5,
  },
  category_card_wrapper: {
    padding: 10,
    backgroundColor: themes.colors.BACKGROUND,
  },

  // search style
  suggestionBox: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    elevation: 4,
    marginHorizontal: 10,
    marginTop: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    fontSize: 16,
  },
});
