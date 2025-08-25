import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useState } from "react";

import AffiliationScreen from "../Screens/Settings/AffiliationScreen";
import AppScreen from "../Screens/Settings/AppScreen";
import BlockedScreen from "../Screens/Settings/BlockedScreen";
import HomeSettingsScreen from "../Screens/Settings/HomeSettingsScreen";
import PremiumScreen from "../Screens/Settings/PremiumScreen";
import SecurityScreen from "../Screens/Settings/SecurityScreen";
import SessionScreen from "../Screens/Settings/SessionScreen";
import SubscriptionValidationScreen from "../Screens/Settings/SubscriptionValidationScreen";

export type SettingsStackScreens =
    "BlockedScreen" |
    "SessionScreen" |
    "SecurityScreen" |
    "AppScreen" |
    "LanguageThemeScreen" |
    "PremiumScreen" |
    "SubscriptionValidationScreen" |
    "AffiliationScreen"

const Stack = createStackNavigator();

const SettingsStack = () => {

  const [routes] = useState([
    { name: "HomeSettingsScreen", screen: HomeSettingsScreen },
    { name: "BlockedScreen", screen: BlockedScreen },
    { name: "SecurityScreen", screen: SecurityScreen },
    { name: "SessionScreen", screen: SessionScreen },
    { name: "AppScreen", screen: AppScreen },
    { name: "PremiumScreen", screen: PremiumScreen },
    { name: "SubscriptionValidationScreen", screen: SubscriptionValidationScreen },
  { name: "AffiliationScreen", screen: AffiliationScreen }
  ])

  return (
    <Stack.Navigator initialRouteName="HomeSettingsScreen">
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false
        }} />)
      }
    </Stack.Navigator>
  );
};

export default SettingsStack;
