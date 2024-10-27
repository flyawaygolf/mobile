import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const NotificationScreen = () => {
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Text variant="bodyLarge">Notification Screen</Text>
    </View>
  );
};

export default NotificationScreen;