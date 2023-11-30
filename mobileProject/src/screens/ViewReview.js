// import React, { useState, useEffect, useContext } from "react";
// import { View, FlatList, StyleSheet, Text, Image } from "react-native";
// import { UserType } from "../UserContext";

// import axios from "axios";

// // 사용자 리뷰 보여지는 곳

// // 리뷰 받아와야함 먼저 여기 부분다시볼것

// const data = [
//   {
//     id: "8",
//     senderName: "오해성",
//     receiverName: "박준엽",
//     rating: 5,
//     reviewDate: "2023-09-15 03:15 PM",
//     comment: "정말 도움이 되었습니다...",
//   },
//   // ... more items
// ];

// // data 이런식으로 받아옴

// // 여기서 item 을

// const ReviewItem = ({ item }) => {
//   // item 은
//   const { senderName, receiverName, rating, reviewDate, comment } = item;
//   return (
//     <View style={styles.itemContainer}>
//       {/* <Image source={avatar} style={styles.avatar} /> */}
//       <View style={styles.textContainer}>
//         <Text style={styles.name}> 보낸 사람 : {senderName} </Text>
//         <Text style={styles.name}> 받는 사람 : {receiverName}</Text>

//         <Text style={styles.rating}>{"★".repeat(rating)}</Text>
//         <Text style={styles.text}>{comment}</Text>

//         <Text style={styles.date}>{reviewDate}</Text>
//       </View>
//     </View>
//   );
// };

// const ViewReview = () => {
//   const { userId, setUserId } = useContext(UserType);
//   // 로그인한 유저 아이디를 받아옴
//   console.log("리뷰 화면들어오면 유저아이디 보여주기 ", userId);

//   // 여기 안에서 변수 선언 ??
//   useEffect(() => {
//     fetchReviewRequest();
//   }, []);

//   const fetchReviewRequest = async () => {
//     try {
//       const response = await axios.get(
//         `http://10.20.65.66:8000/reviews/receiver/${userId}` // 유저 아이디를 주면.. 리뷰DB에서  이 유저 아이디가 receiptId 인 리뷰데이터만 받아와서
//       );
//       if (response.status === 200) {
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   //{ navigation }
//   return (
//     <FlatList
//       // data : data는 만들고자 하는 리스트의 soucre를 담는 props.
//       data={data} // 데이터를 다 넣고
//       // renderItem : 1개의 item을 redner 시키는 props. item이라고 이름짓는것은 약속된 컨벤션이다.
//       renderItem={ReviewItem} //renderItem 함수 호출
//       // keyExtractor: 지정된 인덱스에서 지정된 항목에 대한 고유 키를 추출하는 데 사용된다.
//       // 키는 캐싱에 사용되며 항목 재정렬을 추적하는 반응 키로 사용됨.
//       keyExtractor={(item) => item.id}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   itemContainer: {
//     flexDirection: "row",
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   textContainer: {
//     marginLeft: 10,
//     justifyContent: "space-around",
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   date: {
//     fontSize: 12,
//     color: "#666",
//   },
//   rating: {
//     fontSize: 14,
//     color: "#FFD700",
//   },
//   text: {
//     fontSize: 14,
//   },
// });

// export default ViewReview;

import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { UserType } from "../UserContext";
import axios from "axios";

const ReviewItem = ({ item }) => {
  const { senderName, receiverName, rating, reviewDate, comment } = item;

  // 평점을 나타내는 별표 문자열 생성
  const ratingStars = Array(rating).fill("★").join("");

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>보낸 사람: {senderName}</Text>
        <Text style={styles.name}>받는 사람: {receiverName}</Text>
        <Text style={styles.rating}>{ratingStars}</Text>
        <Text style={styles.text}>{comment}</Text>
        <Text style={styles.date}>{reviewDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 스타일을 여기에 정의합니다.
  itemContainer: {
    // 예시 스타일
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  textContainer: {
    // 예시 스타일
  },
  name: {
    // 예시 스타일
    fontWeight: "bold",
  },
  rating: {
    // 예시 스타일
    color: "orange",
  },
  text: {
    // 예시 스타일
  },
  date: {
    // 예시 스타일
  },
  // 여기에 필요한 나머지 스타일을 추가하세요.
});

const ViewReview = () => {
  const { userId } = useContext(UserType);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태

  useEffect(() => {
    // 컴포넌트가 마운트되면 리뷰 데이터를 요청합니다.
    const fetchReviewRequest = async () => {
      try {
        const response = await axios.get(
          `http://10.20.65.66:8000/reviews/receiver/${userId}`
        );
        if (response.status === 200) {
          setReviews(response.data); // 서버로부터 받은 데이터를 상태에 저장합니다.
        }
      } catch (err) {
        console.error("리뷰 데이터를 가져오는 데 실패했습니다.", err);
      }
    };

    fetchReviewRequest();
  }, [userId]); // userId가 바뀔 때마다 리뷰를 다시 요청합니다.

  return (
    <FlatList
      data={reviews} // 서버로부터 받은 리뷰 데이터를 사용합니다.
      renderItem={({ item }) => <ReviewItem item={item} />}
      keyExtractor={(item) => item._id.toString()} // MongoDB의 _id를 사용합니다.
    />
  );
};

export default ViewReview;
