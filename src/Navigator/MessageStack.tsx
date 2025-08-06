import React, { useState } from "react";
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import CreateGuildScreen from "../Screens/Messages/CreateGuildScreen";
import MessageScreen from "../Screens/Messages/MessageScreen";
import GuildSettingsScreen from "../Screens/Guilds/GuildSettingsScreen";
import { MessageStackParams } from "../Services";

export type MessageStackScreens =
  "MessageScreen" |
  "CreateGroupScreen" |
  "GuildSettingsScreen"

const Stack = createStackNavigator();

const MessageStack = () => {

  const [routes] = useState<Array<{
    name: keyof MessageStackParams;
    component: React.ComponentType<any>
  }>>([
    { name: "MessageScreen", component: MessageScreen },
    { name: "CreateGroupScreen", component: CreateGuildScreen },
    { name: "GuildSettingsScreen", component: GuildSettingsScreen },
  ])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MessageScreen">
      {
        routes.map((r, idx) => <Stack.Screen key={idx} name={r.name} component={r.component} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />)
      }
    </Stack.Navigator>
  );
};

export default MessageStack;
