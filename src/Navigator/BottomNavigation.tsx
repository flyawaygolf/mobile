import React, { useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, TouchableRipple, Icon, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { GuildListSreen, MapScreen } from '../Screens';
import { useClient, useTheme } from '../Components/Container';
import HomeScreen from '../Screens/Home/HomeScreen';
import { RootState, useAppDispatch, useAppSelector } from '../Redux';
import { initNotificationFeed } from '../Redux/NotificationFeed/action';
import { EventsScreen } from '../Screens/Events';
import { getCurrentLocation, navigationProps, parseURL } from '../Services';

export type BottomStackScreens = "HomeScreen" | "MapScreen" | "Messages" | "EventsScreen";

const Tab = createBottomTabNavigator();

function BottomStack({ navigation }: { navigation: navigationProps }) {

    const { colors } = useTheme();
    const client = useClient();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.notificationFeed);
    const guilds = useAppSelector((state) => state.guildListFeed);

    const notificationList = async () => {
        const request = await client.client.notifications.fetch();
        if (!request.data) return;
        if (request.data.length < 1) return;
        dispatch(initNotificationFeed(request.data));
    }

    const countNotifications = () => notifications.length > 0 ? notifications.filter(n => (n?.read ?? true) === false).length : undefined;
    const countUnreadsDM = () => guilds.length > 0 ? guilds.filter(g => (g?.unread ?? false) === true).length : undefined;

    const navigateToPost = (post_id: string) => {
        if (navigation) return navigation.navigate("PostsStack", { screen: "PostScreen", params: { post_id: post_id } })
    }

    const navigateToGolf = (golf_id: string) => {
        if (navigation) return navigation.navigate("GolfsStack", { screen: "GolfsProfileScreen", params: { golf_id: golf_id } })
    }

    const navigateToEvent = (event_id: string) => {
        if (navigation) return navigation.navigate("EventStack", { screen: "DisplayEventScreen", params: { event_id: event_id } })
    }

    const navigateToProfile = (nickname: string) => {
        if (navigation) return navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: nickname } })
    }

    const navigateToMessage = async (guild_id: string) => {
        const guild_info = await client.client.guilds.fetch(guild_id);
        if (navigation) return navigation.navigate("MessagesStack", { screen: "MessageScreen", params: { guild: guild_info } })
    }

    const redirectLink = (url: string | false) => {
        if (typeof url !== "string") return;
        if (url.startsWith("/posts")) return navigateToPost(url.split("/posts").slice(1)[0].replace("/", ""));
        if (url.startsWith("/golfs")) return navigateToGolf(url.split("/golfs").slice(1)[0].replace("/", ""));
        if (url.startsWith("/events")) return navigateToEvent(url.split("/events").slice(1)[0].replace("/", ""));
        if (url.startsWith("/users")) return navigateToProfile(url.split("/users").slice(1)[0].replace("/", ""));
        if (url.startsWith("/messages")) return navigateToMessage(url.split("/messages").slice(1)[0].replace("/", ""));
        return;
    }

    const getUrlAsync = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (!initialUrl) return;
        const param = parseURL(initialUrl);
        return redirectLink(param);
    };

    const updateLocation = async () => {
        try {
            const position = await getCurrentLocation();           
            if (position) {
                const crd = position.coords;
                const init_location = {
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }
                client.setValue({ ...client, location: init_location });
            }
        } catch (error) {
            return error;
        }
    };

    const fetchDatas = async () => {
        await Promise.all([
            notificationList(),
            updateLocation()
        ])
    };

    useEffect(() => {
        getUrlAsync();
        Linking.addEventListener("url", ({ url }) => redirectLink(parseURL(url)));
        fetchDatas();
    }, [])

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                // animation: "shift"
            }}
            initialRouteName="HomeScreen"
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    labeled={true}
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
                    renderLabel={({ route, color }) => {
                        const { options } = descriptors[route.key];
                        return options.title ? (
                            <Text
                                style={{
                                    color,
                                    fontSize: 12,
                                    textAlign: 'center',
                                }}
                            >
                                {options.title}
                            </Text>
                        ) : null;
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
                    title: t("bottom.home"),
                    tabBarBadgeStyle: {
                        color: colors.text_normal,
                        backgroundColor: colors.badge_color,
                    },
                    tabBarBadge: countNotifications()
                }}
            />
            {
                /**
                 *             <Tab.Screen
                name="ScorecardHomeScreen"
                component={ScorecardHomeScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "golf-tee" : "golf-tee"} size={size} color={color} />;
                    },
                    title: t("bottom.games")
                }}
            />
                 */
            }
            <Tab.Screen
                name="MapScreen"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "map-marker" : "map-marker-outline"} size={size} color={color} />;
                    },
                    tabBarButton: () => { return null; },
                    title: t("bottom.map")
                }}
            />
            <Tab.Screen
                name="EventsScreen"
                component={EventsScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => {
                        return <Icon source={focused ? "calendar-month" : "calendar-month-outline"} size={size} color={color} />;
                    },
                    title: t("bottom.events")
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
                    tabBarBadge: countUnreadsDM(),
                    title: t("bottom.messages")
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