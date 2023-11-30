import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen";
import FriendsFindDetail from "../screens/FriendsFindDetail";

const Stack = createStackNavigator();

function ChattingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="Friends" component={FriendsScreen} />

      <Stack.Screen name="Chats" component={ChatScreen} />

      <Stack.Screen name="Messages" component={ChatMessagesScreen} />
      <Stack.Screen
        name="FriendsFindDetail"
        component={FriendsFindDetail}
        options={{ title: "친구찾기검색" }}
      />
    </Stack.Navigator>
  );
}

export default ChattingStackNavigator;
