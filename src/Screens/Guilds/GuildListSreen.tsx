import React, { memo } from 'react';

import GuildNavigator from './GuildNavigator';
import { ScreenContainer } from '../../Components/Container';
import MessageHeader from '../../Components/Header/Message';
import CustomHeader from '../../Components/Header/CustomHeader';
import { useTranslation } from 'react-i18next';

const GuildListSreen = () => {

  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <CustomHeader title={t("commons.messages")} isHome leftComponent={<MessageHeader />} />
      <GuildNavigator />
    </ScreenContainer>
  );
};

export default memo(GuildListSreen);
