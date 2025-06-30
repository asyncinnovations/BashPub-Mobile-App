import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-chart-kit';
import {themes} from '../../../constants/themes';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
const screenWidth = Dimensions.get('window').width;
import {useAuth} from '../../../context/AuthContext';
import {useEffect} from 'react';
import {useState} from 'react';
import DataNotFound from '../../../components/data_notfound/DataNotFound';
const ReviewScreen = () => {
  const {user, token} = useAuth();
  const [AllReviews, setAllReviews] = useState([]);
  const [loader, setLoader] = useState(false);

  const renderStars = count => {
    return Array.from({length: 5}, (_, i) => (
      <FontAwesome
        key={i}
        name={i < count ? 'star' : 'star-o'}
        size={14}
        color="#FFD700"
      />
    ));
  };

  //////////////////////////////
  // FETCH ALL REVIES
  //////////////////////////////
  const fetch_reviews = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.API_ROOT_URI}/api/reviews/user/${user?.user_id}`,
        {headers: {Authorization: `Bearer ${token}`}},
      );
      if (response.status == 200) {
        setLoader(false);
        // console.log(response.data);
        setAllReviews(response.data);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetch_reviews();
  }, []);
  const ratingData = {
    labels: AllReviews.map(item => item.rating),
    datasets: [
      {
        data: AllReviews.map(item => item.rating),
      },
    ],
  };

  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={themes.colors.PRIMARY} size="large" />
      </View>
    );
  }
  const renderItem = ({item}) => (
    <View style={styles.reviewCard}>
      <Text style={styles.guest}>{item.guest}</Text>
      <View style={styles.starRow}>{renderStars(item.rating)}</View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Engagement</Text>
      <Text style={styles.subtitle}>
        Reviews – See reviews received from guests
      </Text>

      <BarChart
        data={ratingData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
          labelColor: () => '#333',
        }}
        style={styles.chart}
        fromZero
        showValuesOnTopOfBars
      />

      <FlatList
        data={AllReviews}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<DataNotFound />}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.BACKGROUND,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 24,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  guest: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  starRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  comment: {
    fontSize: 14,
    color: '#444',
  },
});
