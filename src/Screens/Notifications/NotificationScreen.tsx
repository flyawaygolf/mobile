import * as React from 'react';

import NotificationListScreen from './NotificationListScreen';
import { NotificationContainer } from '../../Components/Container';


function NotificationScreen() {
  return (
    <NotificationContainer>
      <NotificationListScreen />
    </NotificationContainer>
  );
}

export default NotificationScreen;