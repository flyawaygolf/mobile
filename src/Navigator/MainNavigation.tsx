import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useState } from "react";

import { BottomNavigation } from "./";
import CreateStack from "./CreateStack";
import EventStack from "./EventStack";
import GolfsStack from "./GolfsStack";
import MessageStack from "./MessageStack";
import PostStack from "./PostsStack";
import PremiumStack from "./PremiumStack";
import ProfileStack from "./ProfileStack";
import ScorecardStack from "./ScorecardStack";
import SettingsStack from "./SettingsStack";
import FavoritesScreen from "../Screens/FavoritesScreen";
import { NotificationScreen } from "../Screens/Notifications";

const Stack = createStackNavigator();

export default function MainNavigation(): JSX.Element {
  
  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "ProfileStack", screen: ProfileStack },
    { name: "PremiumStack", screen: PremiumStack },
    { name: "MessagesStack", screen: MessageStack },
    { name: "SettingsStack", screen: SettingsStack },
    { name: "GolfsStack", screen: GolfsStack },
    { name: "PostsStack", screen: PostStack },
    { name: "CreateStack", screen: CreateStack },
    { name: "EventStack", screen: EventStack },
    { name: "FavoritesScreen", screen: FavoritesScreen },
    { name: "NotificationsScreen", screen: NotificationScreen },
    { name: "ScorecardStack", screen: ScorecardStack }
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
