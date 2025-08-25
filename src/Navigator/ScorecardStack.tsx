import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from "react";

import ScorecardCreateScreen from "../Screens/Scorecard/ScorecardCreateScreen";
import ScorecardFullScreen from "../Screens/Scorecard/ScorecardFullScreen";
import ScorecardHoleFillScreen from "../Screens/Scorecard/ScorecardHoleFillScreen";
import ScorecardHomeScreen from "../Screens/Scorecard/ScorecardHomeScreen";
import ScorecardListScreen from "../Screens/Scorecard/ScorecardListScreen";
import ScorecardSummarizeScreen from "../Screens/Scorecard/ScorecardSummarizeScreen";

export type ScorecardStackScreens =
  "ScorecardHomeScreen" |
  "ScorecardCreateScreen" |
  "ScorecardHoleFillScreen" |
  "ScorecardFullScreen" |
  "ScorecardSummarizeScreen" |
  "ScorecardListScreen";

const Stack = createStackNavigator();

const ScorecardStack = () => {

  const [routes] = React.useState<Array<{ name: ScorecardStackScreens, screen: any }>>([
    { name: "ScorecardHomeScreen", screen: ScorecardHomeScreen },
    { name: "ScorecardCreateScreen", screen: ScorecardCreateScreen },
    { name: "ScorecardHoleFillScreen", screen: ScorecardHoleFillScreen },
    { name: "ScorecardFullScreen", screen: ScorecardFullScreen },
    { name: "ScorecardSummarizeScreen", screen: ScorecardSummarizeScreen },
    { name: "ScorecardListScreen", screen: ScorecardListScreen }
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
