import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen, ProfileEditScreen } from "../Screens/Profile";

export type ProfileStackScreens =
    "ProfileScreen" |
    "ProfileEditScreen"

const Stack = createStackNavigator();

const ProfileStack = () => {

  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen name="ProfileScreen" component={ProfileScreen as any} options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }} />
      <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
