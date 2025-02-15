import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import BlockedScreen from "../Screens/Settings/BlockedScreen";
import SessionScreen from "../Screens/Settings/SessionScreen";
import SecurityScreen from "../Screens/Settings/SecurityScreen";
import HomeSettingsScreen from "../Screens/Settings/HomeSettingsScreen";
import AppScreen from "../Screens/Settings/AppScreen";
import PremiumScreen from "../Screens/Settings/PremiumScreen";
import SubscriptionValidationScreen from "../Screens/Settings/SubscriptionValidationScreen";

export type SettingsStackScreens =
    "BlockedScreen" |
    "SessionScreen" |
    "SecurityScreen" |
    "AppScreen" |
    "LanguageThemeScreen" |
    "PremiumScreen" |
    "SubscriptionValidationScreen"

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
    /*{ name: "AffiliationScreen", screen: AffiliationScreen },*/
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
