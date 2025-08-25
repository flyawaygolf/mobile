import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../Components/Container';
import { Logo } from '../Components/Elements/Assets';
import { Loader } from '../Other';
import { deviceInfo } from '../Services';
import { full_height, full_width } from '../Style/style';

const SplashScreen = () => {

  const { colors } = useTheme();
  const [appInfo, setAppInfo] = useState<any>(undefined);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    setAppInfo(deviceInfo());
  }, []);

  return (
    <View style={{
      width: full_width,
      height: full_height,
      paddingBottom: bottom,
      position: 'absolute',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg_primary,
    }}>
      <Logo />
      <Loader />
      {appInfo && <Text variant="bodyLarge" style={{ position: 'absolute', bottom: 20 }}>{appInfo.version} ({appInfo.build_number})</Text>}
    </View>
  );
};

export default SplashScreen;

