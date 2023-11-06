import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";

import ListScreen from "../screens/ListScreen";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { ContentRoutes } from "./routes";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import TabBarAddButton from "../component/TabBarAddButton";

import MyInfo from "../screens/HomeScreen";
// 바텀탭바
const Tab = createBottomTabNavigator();
const getTabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const AddButtonScreen = () => null;

const ContentTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }} // 위에 헤더 없애기    안없애면 , 못씀
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: "home" }),
          tabBarLabel: "홈",
        }}
      />
      <Tab.Screen
        name={ContentRoutes.LIST}
        component={ListScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: "post" }),
        }} // 게시판
      />
      <Tab.Screen
        name={"AddButton"}
        component={AddButtonScreen}
        options={{ tabBarButton: () => <TabBarAddButton /> }}
      />
      {/* 더하기 */}
      <Tab.Screen
        name={ContentRoutes.MAP}
        component={MapScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: "map" }),
        }}
      />
      <Tab.Screen
        name={ContentRoutes.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: "account" }),
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
