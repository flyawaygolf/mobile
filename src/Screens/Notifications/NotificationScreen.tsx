import * as React from 'react';
import NotificationNavigator from './NotificationNavigator';
import { NotificationContainer } from '../../Components/Container';
import NotificationListScreen from './NotificationListScreen';


function NotificationScreen() {
  return (
    <NotificationContainer>
      <NotificationListScreen />
    </NotificationContainer>
  );
}

export default NotificationScreen;