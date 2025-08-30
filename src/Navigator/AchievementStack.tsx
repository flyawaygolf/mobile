import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useState } from "react";
import AchievementsListScreen from '../Screens/Achievement/AchievementsListScreen';


export type AchievementStackScreens =
  "AchievementsListScreen"

const Stack = createStackNavigator();

const AchievementStack = () => {

  const [routes] = useState<Array<{
    name: AchievementStackScreens;
    component: React.ComponentType<any>
  }>>([
    { name: "AchievementsListScreen", component: AchievementsListScreen }
  ])

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AchievementsListScreen">
        {
          routes.map((r, idx) => <Stack.Screen key={idx} name={r.name} component={r.component} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />)
        }
      </Stack.Navigator>

  );
};

export default AchievementStack;
