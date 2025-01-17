import React, { useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, TouchableRipple, Icon } from 'react-native-paper';

import { GuildListSreen, MapScreen } from '../Screens';
import { useClient, useTheme } from '../Components/Container';
import HomeScreen from '../Screens/Home/HomeScreen';
import { RootState, useAppDispatch, useAppSelector } from '../Redux';
import { initNotificationFeed } from '../Redux/NotificationFeed/action';
import { connect } from 'react-redux';
import { EventsScreen } from '../Screens/Events';

export type BottomStackScreens = "HomeScreen" | "MapScreen" | "Messages" | "EventsScreen";

const Tab = createBottomTabNavigator();

function BottomStack() {

    const { colors } = useTheme();
    const { client } = useClient();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.notificationFeed);
    const guilds = useAppSelector((state) => state.guildListFeed);

    const notificationList = async () => {
        const request = await client.notifications.fetch();
        if (!request.data) return;
        if (request.data.length < 1) return;
        dispatch(initNotificationFeed(request.data));
    }

    const countNotifications = () => notifications.length > 0 ? notifications.filter(n => (n?.read ?? true) === false).length : undefined;
    const countUnreadsDM = () => guilds.length > 0 ? guilds.filter(g => (g?.unread ?? false) === true).length : undefined;

    useEffect(() => {
        notificationList()
    }, [])

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="HomeScreen"
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
                    getBadge={({ route }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarBadge) {
                            const count = Number(options.tabBarBadge);
                            return count > 9 ? "+9" : count;
                        }
                        return undefined;
                    }}
                    renderTouchable={(props) => {
                        const { key, ...restProps } = props;
                        return <TouchableRipple key={key} {...restProps} />;
                    }}
                />
            )}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "home" : "home-outline"} size={size} color={color} />;
                    },
                    tabBarBadgeStyle: {
                        color: colors.text_normal,
                        backgroundColor: colors.badge_color,
                    },
                    tabBarBadge: countNotifications()
                }}
            />
            <Tab.Screen
                name="EventsScreen"
                component={EventsScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "calendar-month" : "calendar-month-outline"} size={size} color={color} />;
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
                name="Messages"
                component={GuildListSreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "message-text" : "message-text-outline"} size={size} color={color} />;
                    },
                    tabBarBadgeStyle: {
                        color: colors.text_normal,
                        backgroundColor: colors.badge_color
                    },
                    tabBarBadge: countUnreadsDM()
                }}
            />
            {
                /**
                 *             <Tab.Screen
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
                 */
            }
        </Tab.Navigator>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        notificationFeed: state.notificationFeed,
    };
};

export default connect(mapStateToProps)(BottomStack);