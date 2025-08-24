import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { LoginRootParamList, ScreenNavigationProps } from '../../Services';
import { Logo } from '../../Components/Elements/Assets';
import { useTheme } from '../../Components/Container';

const WelcomeScreen = ({ navigation }: ScreenNavigationProps<LoginRootParamList, "WelcomeScreen">) => {

  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingLeft: 20, paddingRight: 20, paddingBottom: 10, backgroundColor: colors.bg_primary }}>
      <View style={{ marginBottom: 50, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Logo size={80} style={{
          marginBottom: 20,
        }} />
        <Text variant="headlineLarge" style={{ fontFamily: "Lobster-Regular" }}>FlyAway</Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('LoginScreen')} 
          contentStyle={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 48 }} 
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
          style={{ marginTop: 20, width: "100%", justifyContent: 'center' }}>
          {t("login.connect")}
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate("RegisterEmailUsername", {
            affiliate_to: undefined
          })} 
          contentStyle={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 48 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
          style={{ marginTop: 15, width: "100%", justifyContent: 'center' }}>
          {t("login.register")}
        </Button>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('GuestStack')} 
          contentStyle={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 48 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
          style={{ marginTop: 15, width: "100%", justifyContent: 'center' }}>
          {t("login.continue_as_guest")}
        </Button>
      </View>
    </View>

  );
};

export default WelcomeScreen;
