import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import DisplayRenderScreen from "../Screens/CreatePost/DisplayRenderScreen";
import PostCreatorScreenStack from "../Screens/CreatePost/PostCreatorScreenStack";
import CameraScreen from "../Screens/CreatePost/CameraScreen";

const Stack = createStackNavigator();

export type CreateStackScreens = 
  | "CameraScreen"
  | "DisplayRenderScreen"
  | "PostCreatorScreen";

const CreateStack = () => {

  return (
    <Stack.Navigator initialRouteName="PostCreatorScreen">
      <Stack.Screen name="CameraScreen" options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false
      }} component={CameraScreen} />
      <Stack.Screen name="DisplayRenderScreen" options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false
      }} component={DisplayRenderScreen} />
      <Stack.Screen name="PostCreatorScreen" options={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false
      }} component={PostCreatorScreenStack} />
    </Stack.Navigator>
  );
};

export default CreateStack;
