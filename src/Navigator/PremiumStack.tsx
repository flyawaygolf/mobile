import React from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import HomePremiumSettingsScreen from "../Screens/Premium/HomePremiumSettingsScreen";
import AvailabilityPremiumSettingsScreen from "../Screens/Premium/AvailabilityPremiumSettingsScreen";

export type PremiumStackScreens = "HomePremiumSettingsScreen" | "AvailabilityPremiumSettingsScreen";

const Stack = createStackNavigator();

const PremiumStack = () => {

  const [routes] = React.useState<Array<{ name: PremiumStackScreens, screen: any }>>([
    { name: "HomePremiumSettingsScreen", screen: HomePremiumSettingsScreen },
    { name: "AvailabilityPremiumSettingsScreen", screen: AvailabilityPremiumSettingsScreen }
  ]);

  return (
    <Stack.Navigator initialRouteName="HomePremiumSettingsScreen" screenOptions={{ headerShown: false }}>
      {
        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false
        }} />)
      }
    </Stack.Navigator>
  );
};

export default PremiumStack;
