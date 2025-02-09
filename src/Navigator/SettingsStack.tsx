import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import BlockedScreen from "../Screens/Settings/BlockedScreen";
import SessionScreen from "../Screens/Settings/SessionScreen";
import SecurityScreen from "../Screens/Settings/SecurityScreen";
import HomeSettingsScreen from "../Screens/Settings/HomeSettingsScreen";
import AppScreen from "../Screens/Settings/AppScreen";

export type SettingsStackScreens =
    "BlockedScreen" |
    "SessionScreen" |
    "SecurityScreen" |
    "AppScreen" |
    "LanguageThemeScreen";
    // "SubscriptionScreen";

const Stack = createStackNavigator();

const SettingsStack = () => {

  const [routes] = useState([
    { name: "HomeSettingsScreen", screen: HomeSettingsScreen },
    { name: "BlockedScreen", screen: BlockedScreen },
    { name: "SecurityScreen", screen: SecurityScreen },
    { name: "SessionScreen", screen: SessionScreen },
    { name: "AppScreen", screen: AppScreen },
    /*{ name: "AffiliationScreen", screen: AffiliationScreen },
    { name: "SubscriptionScreen", screen: SubscriptionScreen },
    { name: "CustomSubscriptionScreen", screen: CustomSubscriptionScreen },
    { name: "SubscriptionValidationScreen", screen: SubscriptionValidationScreen },
    { name: "SubscriptionDashboardScreen", screen: SubscriptionDashboardScreen },
    { name: "LanguageSpokenScreen", screen: LanguageSpokenScreen }*/
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
