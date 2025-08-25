import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from "react";

import { ProfileScreen, ProfileEditScreen } from "../Screens/Profile";
import FollowScreen from "../Screens/Profile/FollowScreen";

export type ProfileStackScreens =
    "ProfileScreen" |
    "ProfileEditScreen" |
    "ProfileFollower"

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
      <Stack.Screen name="ProfileFollower" component={FollowScreen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false
          }} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
