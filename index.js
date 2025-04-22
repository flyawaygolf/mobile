import 'react-native-gesture-handler';
import { AppRegistry, Platform } from 'react-native';

import { setBackgroundMessageHandler } from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

import App from './src/App';
import { name as appName } from './app.json';
import { messagesNotificationsChannel, messaging } from './src/Services/notifications';

Platform.OS === 'android' && setBackgroundMessageHandler(messaging, async remoteMessage => {
    if (!remoteMessage?.data?.notifee) return console.log(!remoteMessage?.data?.notifee);
    const data = JSON.parse(remoteMessage.data.notifee);
    notifee.displayNotification(data);
});

messagesNotificationsChannel();

AppRegistry.registerComponent(appName, () => App);
