import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import ExploreHeader from '../Components/Header/Explore';

const ExploreScreen = () => {

  return (
    <>
      <ExploreHeader />
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text variant="bodyLarge">Feed Screen</Text>
      </View>
    </>
  );
};

export default ExploreScreen;
