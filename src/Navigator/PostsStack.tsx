import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useState } from "react";

import BookmarksScreen from "../Screens/Posts/BookmarksScreen";
import PostScreen from "../Screens/Posts/PostScreen";
import PostScreenSearch from "../Screens/Posts/PostScreenSearch";
import PostScreenShares from "../Screens/Posts/PostScreenShares";

const Stack = createStackNavigator();

export type PostsStackScreens =
    "PostScreen" |
    "PostScreenSearch" |
    "PostScreenShares" |
    "BookmarksScreen"

const PostStack = () => {

  const [routes] = useState([
    { name: "PostScreen", screen: PostScreen },
    { name: "PostScreenSearch", screen: PostScreenSearch },
    { name: "PostScreenShares", screen: PostScreenShares },
    { name: "BookmarksScreen", screen: BookmarksScreen }
  ])

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }} />)
        }
      </Stack.Navigator>
  );
};

export default PostStack;
