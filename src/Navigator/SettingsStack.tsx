import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import BlockedScreen from "../Screens/Settings/BlockedScreen";
import SessionScreen from "../Screens/Settings/SessionScreen";
import SecurityScreen from "../Screens/Settings/SecurityScreen";

const Stack = createStackNavigator();

const SettingsStack = () => {

  return (
    <Stack.Navigator initialRouteName="BlockScreen">
      <Stack.Screen name="BlockScreen" component={BlockedScreen} options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false
      }} />
      <Stack.Screen name="SessionScreen" component={SessionScreen} options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false
      }} />
      <Stack.Screen name="SecurityScreen" component={SecurityScreen} options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false
      }} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
