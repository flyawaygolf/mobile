import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { BottomNavigation } from "./";
import MessageStack from "./MessageStack";
import SettingsStack from "./SettingsStack";
import ProfileStack from "./ProfileStack";
import GolfsStack from "./GolfsStack";

const Stack = createStackNavigator();

export default function MainNavigation(): JSX.Element {

  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "ProfileStack", screen: ProfileStack },
    { name: "MessagesStack", screen: MessageStack },
    { name: "SettingsStack", screen: SettingsStack },
    { name: "GolfsStack", screen: GolfsStack },
  ])

  return (
    <Stack.Navigator initialRouteName="BottomNavigation" screenOptions={{ headerShown: false }}>
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }} />)
      }
    </Stack.Navigator>
  );
}
