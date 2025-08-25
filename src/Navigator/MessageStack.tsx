import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useState } from "react";

import { MessagesProvider } from "../Contexts/MessagesContext";
import AddUsersToGuildScreen from "../Screens/Guilds/AddUsersToGuildScreen";
import CreateGuildScreen from "../Screens/Guilds/CreateGuildScreen";
import GuildSettingsScreen from "../Screens/Guilds/GuildSettingsScreen";
import MessageScreen from "../Screens/Messages/MessageScreen";
import { MessageStackParams } from "../Services";

export type MessageStackScreens =
  "MessageScreen" |
  "CreateGroupScreen" |
  "GuildSettingsScreen" |
  "AddUsersToGuildScreen"

const Stack = createStackNavigator();

const MessageStack = () => {

  const [routes] = useState<Array<{
    name: keyof MessageStackParams;
    component: React.ComponentType<any>
  }>>([
    { name: "MessageScreen", component: MessageScreen },
    { name: "CreateGroupScreen", component: CreateGuildScreen },
    { name: "GuildSettingsScreen", component: GuildSettingsScreen },
    { name: "AddUsersToGuildScreen", component: AddUsersToGuildScreen },
  ])

  return (
    <MessagesProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MessageScreen">
        {
          routes.map((r, idx) => <Stack.Screen key={idx} name={r.name} component={r.component} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />)
        }
      </Stack.Navigator>
    </MessagesProvider>

  );
};

export default MessageStack;
