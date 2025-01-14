import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { BottomNavigation } from "./";
import MessageStack from "./MessageStack";
import SettingsStack from "./SettingsStack";
import ProfileStack from "./ProfileStack";
import GolfsStack from "./GolfsStack";
import PostStack from "./PostsStack";
import CreateStack from "./CreateStack";
import FavoritesScreen from "../Screens/FavoritesScreen";
import { NotificationScreen } from "../Screens/Notifications";

const Stack = createStackNavigator();

export default function MainNavigation(): JSX.Element {

  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "ProfileStack", screen: ProfileStack },
    { name: "MessagesStack", screen: MessageStack },
    { name: "SettingsStack", screen: SettingsStack },
    { name: "GolfsStack", screen: GolfsStack },
    { name: "PostsStack", screen: PostStack },
    { name: "CreateStack", screen: CreateStack },
    { name: "FavoritesScreen", screen: FavoritesScreen },
    { name: "NotificationsScreen", screen: NotificationScreen }
  ])

  return (
    <Stack.Navigator initialRouteName="BottomNavigation" screenOptions={{ headerShown: false }}>
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false
        }} />)
      }
    </Stack.Navigator>

  );
}
