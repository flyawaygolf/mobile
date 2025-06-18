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
import EventStack from "./EventStack";
import ScorecardStack from "./ScorecardStack";
import PremiumStack from "./PremiumStack";

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
