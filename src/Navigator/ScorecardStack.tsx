import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import ScorecardHomeScreen from "../Screens/Scorecard/ScorecardHomeScreen";
import ScorecardCreateScreen from "../Screens/Scorecard/ScorecardCreateScreen";

export type ScorecardStackScreens = "ScorecardHomeScreen" | "ScorecardCreateScreen";

const Stack = createStackNavigator();

const ScorecardStack = () => {

  const [routes] = React.useState<Array<{ name: ScorecardStackScreens, screen: any }>>([
    { name: "ScorecardHomeScreen", screen: ScorecardHomeScreen },
    { name: "ScorecardCreateScreen", screen: ScorecardCreateScreen }
  ]);

  return (
    <Stack.Navigator initialRouteName="ScorecardHomeScreen" screenOptions={{ headerShown: false }}>
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false
        }} />)
      }
    </Stack.Navigator>
  );
};

export default ScorecardStack;
