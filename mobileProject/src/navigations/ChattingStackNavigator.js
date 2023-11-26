import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen";

const Stack = createStackNavigator();

function ChattingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="Friends" component={FriendsScreen} />

      <Stack.Screen name="Chats" component={ChatScreen} />

      <Stack.Screen name="Messages" component={ChatMessagesScreen} />
    </Stack.Navigator>
  );
}

export default ChattingStackNavigator;
