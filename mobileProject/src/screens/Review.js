import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

const reviews = [
  { id: 1, name: "홍길동", rating: 5, comment: "시간 약속을 잘 지켜서 좋았어요" },
  { id: 2, name: "김철수", rating: 4, comment: "친절하고 안전운전 해주셔서 감사합니다" },
  // 더 많은 리뷰 데이터...
];

const ReviewList = () => {
  return (
    <ScrollView style={styles.container}>
      {reviews.map((review) => (
        <View key={review.id} style={styles.card}>
          <Text style={styles.name}>{review.name}님의 리뷰</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={20}
            readonly
            startingValue={review.rating}
          />
          <Text style={styles.comment}>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4edda',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontWeight: 'bold',
  },
  comment: {
    marginTop: 10,
  },
});

export default ReviewList;
