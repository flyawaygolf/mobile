import React from 'react';
import MessageHeader from '../Components/Header/Message';
import { useTheme } from '../Components/Container';
import GuildList from '../Components/Messages/GuildList';
import { View } from 'react-native';

const GuildListSreen = () => {

  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
      <MessageHeader />
      <View style={{ flex: 1 }}>
        <GuildList />
      </View>
    </View>
  );
};

export default GuildListSreen;