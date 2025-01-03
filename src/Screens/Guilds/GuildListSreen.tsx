import React from 'react';

import GuildNavigator from './GuildNavigator';
import { ScreenContainer } from '../../Components/Container';
import MessageHeader from '../../Components/Header/Message';

const GuildListSreen = () => {

  return (
    <ScreenContainer>
      <MessageHeader />
      <GuildNavigator />
    </ScreenContainer>
  );
};

export default GuildListSreen;
