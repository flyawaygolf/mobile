import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { navigationProps } from '../Services';
import ExploreHeader from '../Components/Header/Explore';

const ExploreScreen = () => {
  const navigation = useNavigation<navigationProps>();

  return (
    <>
      <ExploreHeader />
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text variant="bodyLarge">Feed Screen</Text>
      </View>
    </>
  );
};

export default ExploreScreen;