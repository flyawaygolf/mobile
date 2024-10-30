import messaging from "@react-native-firebase/messaging";
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
import { getStorageInfo, setStorage, userStorageI } from "../storage";

export const resetFcmToken = async (user_info: userStorageI, refresh: boolean = false) => {
  try {
    if(refresh) {
      await messaging().deleteToken();
    }
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      setStorage("user_info", {
        ...user_info,
        fcm_token: fcmToken
      });
      return fcmToken
    }
  } catch (error) {
    console.log(`Error firebase getToken : ${error}`);
  }
  return;
}

export const initNotificationToken = async (refresh: boolean = false) => {
  const user_info = getStorageInfo("user_info") as userStorageI;  
  if(refresh) {
    const fcmToken = await resetFcmToken(user_info, refresh);
    return fcmToken;
  }
  if(user_info?.fcm_token) return;
  const fcmToken = await resetFcmToken(user_info, refresh);
  return fcmToken;
}

export async function requestNotificationPermission(refresh: boolean = false) {
  const notificationPermission = await checkNotifications();  
  if(notificationPermission.status === RESULTS.GRANTED || notificationPermission.status === RESULTS.LIMITED) return await initNotificationToken(refresh);

  const requestPermissions = await requestNotifications(["alert", "badge", "sound"]);
  if(requestPermissions.status === "granted" || requestPermissions.status === "limited") return await initNotificationToken(refresh);

  return undefined;
}

export const notificationListener = async () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage.notification);
    // navigation.navigate(remoteMessage.data.type);
  });

  /*messaging().onMessage((message) => {
    console.log("Receive message on foreground", message.data.notifee);
  })*/

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      // setLoading(false);
    });
}