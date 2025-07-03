import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import GolfsProfileScreen from "../Screens/Golfs/GolfsProfileScreen";
import LittleMapScreen from "../Screens/Golfs/LittleMapScreen";
import GolfsPlayedScreen from "../Screens/Golfs/GolfsPlayedScreen";

export type GolfStackScreens = "GolfsProfileScreen" | "LittleMapScreen" | "GolfsPlayedScreen";

const Stack = createStackNavigator();

const GolfsStack = () => {

  const [routes] = React.useState<Array<{ name: GolfStackScreens, screen: any }>>([
    { name: "GolfsProfileScreen", screen: GolfsProfileScreen },
    { name: "LittleMapScreen", screen: LittleMapScreen },
    { name: "GolfsPlayedScreen", screen: GolfsPlayedScreen }
  ]);

  return (
    <Stack.Navigator initialRouteName="GolfsProfileScreen" screenOptions={{ headerShown: false }}>
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false
        }} />)
      }
    </Stack.Navigator>
  );
};

export default GolfsStack;
