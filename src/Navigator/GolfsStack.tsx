import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import GolfsProfileScreen from "../Screens/Golfs/GolfsProfileScreen";

export type GolfStackScreens =
    "GolfsProfileScreen" |
    "GolfsUsers"

const Stack = createStackNavigator();

const GolfsStack = () => {

  return (
    <Stack.Navigator initialRouteName="GolfsProfileScreen">
      <Stack.Screen name="GolfsProfileScreen" component={GolfsProfileScreen as any} options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }} />
    </Stack.Navigator>
  );
};

export default GolfsStack;
