import React, { useEffect, useState } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import messaging from "@react-native-firebase/messaging";

import { SplashScreen } from './Screens';
import { DrawerNavigation, LoginNavigation } from './Navigator';

import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import { useClient, useWebSocket } from './Components/Container';
import { RootState, useAppDispatch, useAppSelector } from './Redux';
import { initGuildList, modifyGuildList, setUnreadGuildList } from './Redux/guildList/action';
import { webSocketRoutes } from './Services/Client';
import { changeElementPlaceArray, getAppInfo } from './Services';
import UpdateScreen from './Screens/UpdateScreen';
import { requestNotificationPermission } from './Services/notifications';

const Stack = createStackNavigator();

function Routes() {

    const { state, client } = useClient();
    const { i18n } = useTranslation();
    const { notification } = useWebSocket();
    const DmGroupList = useAppSelector((state) => state.guildListFeed);
    const dispatch = useAppDispatch();
    const [updateRequire, setUpdateRequire] = useState<boolean>(false);

    const [routes] = useState([
        { name: "DrawerNavigation", screen: DrawerNavigation },
    ])

    async function getUnreads() {
        const request = await client.messages.unreads();
        if (request.error || !request.data) return;
        dispatch(setUnreadGuildList(request.data))
    }

    async function getGuilds() {
        const request = await client.guilds.fetch();
        if (request.error || !request.data) return;
        dispatch(initGuildList(request.data));
        await getUnreads()
    }

    const registerFCMToken = async () => {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) await client.pushNotification.register(fcmToken);
        return;
    }

    async function start() {        
        const update_require = await getAppInfo();
        if (update_require) return setUpdateRequire(true);
        else {
            if (state === "loged") {
                await getGuilds()
                registerFCMToken()
                messaging().onTokenRefresh(async token => {
                    await client.pushNotification.register(token);
                });
            }
        }
    }

    useEffect(() => {        
        start()
    }, [state])

    useEffect(() => {
        if (notification.code === webSocketRoutes.SEND_MESSAGE) {
            const data: any = notification.data;
            const idx = DmGroupList.findIndex(g => g.guild_id === data.channel_id);
            if (idx < 0) return;
            dispatch(initGuildList(changeElementPlaceArray(DmGroupList, 0, idx)));
            dispatch(modifyGuildList({ guild_id: data.channel_id, content: data.content, created_at: data.created_at, message_id: data.message_id, unread: true }))
        } /*else if(notification.code === webSocketRoutes.RECEIVE_NOTIFICATION) {
            const data: any = notification.data;
            if(!data) return;
            dispatch(addNotificationFeed([data]))
        }*/
    }, [notification])

    useEffect(() => {
        dayjs.locale(i18n.language);
    }, [i18n.language]);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            {
                updateRequire ? <Stack.Screen name="UpdateScreen" component={UpdateScreen} /> :
                    state === "loading" || state === "switch_user" ? <Stack.Screen name="Splash" component={SplashScreen} />
                        : state === "logout" ? <Stack.Screen name="LoginNavigator" component={LoginNavigation} />
                            : state === "loged" && (
                                <>
                                    {
                                        routes.map((r, index) => <Stack.Screen key={index} name={r.name} component={r.screen} options={{
                                            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                                        }} />)
                                    }
                                </>
                            )
            }
        </Stack.Navigator>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        guildListFeed: state.guildListFeed,
    };
};

const mapDispatchToProps = {
    initGuildList,
    modifyGuildList,
    setUnreadGuildList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
