import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import { NavigationProvider } from "../Components/Container";
import { BottomNavigation } from "./";
import { NavigationContextI } from "../Components/Container/Navigation/NavigationContext";
import { MapScreen, ProfileEditScreen } from "../Screens";
import MessageStack from "./MessageStack";
import SettingsStack from "./SettingsStack";

const Stack = createStackNavigator();

export default function MainNavigation({ navigation }: { navigation: NavigationContextI }) {

  const [routes] = useState([
    { name: "BottomNavigation", screen: BottomNavigation },
    { name: "MapScreen", screen: MapScreen },
    { name: "ProfileEditScreen", screen: ProfileEditScreen },
    { name: "MessagesStack", screen: MessageStack },
    { name: "SettingsStack", screen: SettingsStack },
  ])

  return (
    <NavigationProvider value={navigation}>
      <Stack.Navigator initialRouteName="BottomNavigation" screenOptions={{ headerShown: false }}>
        {
          routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }} />)
        }
      </Stack.Navigator>
    </NavigationProvider>
  );
};
