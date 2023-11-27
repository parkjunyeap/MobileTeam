// home 화면이 채팅화면을 대신함

// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   FlatList,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";

// // 더미 데이터
// const dummyMessages = [
//   { id: "1", text: "안녕하세요!", sentByMe: true },
//   { id: "2", text: "안녕하세요, 어떻게 지내세요?", sentByMe: false },
//   // ...더 많은 메시지
// ];

// const ChattingDetail = () => {
//   const [messages, setMessages] = useState(dummyMessages);
//   const [inputText, setInputText] = useState("");

//   const sendMessage = () => {
//     if (inputText.trim()) {
//       // 메시지를 서버에 전송하는 로직을 여기에 추가
//       // 예시로 더미 데이터에 메시지를 추가
//       const newMessage = {
//         id: String(messages.length + 1),
//         text: inputText,
//         sentByMe: true,
//       };
//       setMessages([...messages, newMessage]);
//       setInputText("");
//     }
//   };

//   const renderMessageItem = ({ item }) => (
//     <View
//       style={[
//         styles.messageItem,
//         item.sentByMe ? styles.myMessage : styles.theirMessage,
//       ]}
//     >
//       <Text style={styles.messageText}>{item.text}</Text>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//       keyboardVerticalOffset={80}
//     >
//       <FlatList
//         data={messages}
//         renderItem={renderMessageItem}
//         keyExtractor={(item) => item.id}
//         inverted // 새 메시지가 아래에 추가되도록 함
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={inputText}
//           onChangeText={setInputText}
//           placeholder="메시지 입력..."
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Text style={styles.sendButtonText}>전송</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   messageItem: {
//     margin: 10,
//     padding: 10,
//     borderRadius: 10,
//     maxWidth: "80%",
//   },
//   myMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#0078fe",
//   },
//   theirMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#e5e5ea",
//   },
//   messageText: {
//     color: "white",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     borderColor: "gray",
//     borderWidth: 1,
//     borderRadius: 20,
//     padding: 10,
//     marginRight: 10,
//     backgroundColor: "white",
//   },
//   sendButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#0078fe",
//     borderRadius: 20,
//   },
//   sendButtonText: {
//     color: "white",
//   },
// });

// export default ChattingDetail;
