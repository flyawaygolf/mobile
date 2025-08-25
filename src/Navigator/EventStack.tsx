import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useState } from "react";

import { CreateEventScreen, DisplayEventScreen } from "../Screens/Events";

const Stack = createStackNavigator();

export type EventStackScreens =
  | "CreateEventScreen"
  | "DisplayEventScreen"

const EventStack = () => {

  const [routes] = useState([
    { name: "CreateEventScreen", screen: CreateEventScreen },
    { name: "DisplayEventScreen", screen: DisplayEventScreen }
  ])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CreateEventScreen">
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }} />)
      }
    </Stack.Navigator>
  );
};

export default EventStack;
