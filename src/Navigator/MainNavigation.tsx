import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { NavigationProvider } from "../Components/Container";
import { BottomNavigation } from "./";
import { NavigationContextI } from "../Components/Container/Navigation/NavigationContext";
import MessageStack from "./MessageStack";
import SettingsStack from "./SettingsStack";
import ProfileStack from "./ProfileStack";

const Stack = createStackNavigator();

export default function MainNavigation({ navigation }: { navigation: NavigationContextI }) {

  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "ProfileStack", screen: ProfileStack },
    { name: "MessagesStack", screen: MessageStack },
    { name: "SettingsStack", screen: SettingsStack },
  ])

  return (
    <NavigationProvider value={navigation}>
      <Stack.Navigator initialRouteName="BottomNavigation" screenOptions={{ headerShown: false }}>
        {
          routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }} />)
        }
      </Stack.Navigator>
    </NavigationProvider>
  );
}
