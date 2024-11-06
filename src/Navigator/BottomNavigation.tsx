import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, Avatar, TouchableRipple, Icon } from 'react-native-paper';

import { GuildListSreen, MapScreen, SettingsScreen } from '../Screens';
import { useClient, useTheme } from '../Components/Container';

const Tab = createBottomTabNavigator();

export default function BottomStack() {

    const { colors } = useTheme();
    const { user, client } = useClient();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="MapScreen"
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    labeled={false}
                    style={{
                        borderTopColor: colors.bg_secondary,
                        borderTopWidth: 1,
                    }}
                    navigationState={state}
                    safeAreaInsets={insets}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (event.defaultPrevented) {
                            preventDefault();
                        } else {
                            navigation.dispatch({
                                ...CommonActions.navigate(route.name, route.params),
                                target: state.key,
                            });
                        }
                    }}
                    renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({ focused, color, size: 24 });
                        }
                        return null;
                    }}
                    renderTouchable={(props) => {
                        const { key, ...restProps } = props;
                        return <TouchableRipple key={key} {...restProps} />;
                    }}
                />
            )}
        >
            <Tab.Screen
                name="Home"
                component={GuildListSreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "message-text" : "message-text-outline"} size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="MapScreen"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "map-marker" : "map-marker-outline"} size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ size }) => {
                        return <Avatar.Image size={size} source={{
                            cache: "force-cache",
                            uri: client.user.avatar(user.user_id, user.avatar),
                        }} />;
                    },
                }}
            />
        </Tab.Navigator>
    );
}
