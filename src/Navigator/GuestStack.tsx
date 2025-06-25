import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import GuestMapScreen from "../Screens/Guests/GuestMapScreen";

export type GuestStackScreens = "GuestMapScreen";

const Stack = createStackNavigator();

const GuestStack = () => {

  const [routes] = React.useState<Array<{ name: GuestStackScreens, screen: any }>>([
    { name: "GuestMapScreen", screen: GuestMapScreen }
  ]);

  return (
    <Stack.Navigator initialRouteName="GuestMapScreen" screenOptions={{ headerShown: false }}>
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false
        }} />)
      }
    </Stack.Navigator>
  );
};

export default GuestStack;
