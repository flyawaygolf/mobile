import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Alert } from "react-native";
import { Appbar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Clipboard from "@react-native-clipboard/clipboard";
import { useRealm } from '@realm/react';

import { SettingsContainer, useClient, useTheme } from '../../Components/Container';
import { deviceInfo, navigationProps, openURL } from '../../Services';
import { deleteUser } from '../../Services/Realm/userDatabase';

import { SettingsStackScreens } from '../../Navigator/SettingsStack';
import SettingsButtons from '../../Components/Settings/Settings/SettingsButtons';
import { useNavigation } from '@react-navigation/native';
import { websiteurl } from '../../Services/constante';

function HomeSettingsScreen() {

  const { t } = useTranslation();
  const navigation = useNavigation<navigationProps>();
  const [appInfo, setAppInfo] = useState<any>(undefined);
  const { colors } = useTheme();
  const { client, user, setValue } = useClient();
  const realm = useRealm();

  const getInfo = async () => {
    setAppInfo(await deviceInfo())
  }

  useEffect(() => {
    getInfo()
  }, [])

  const Disconnect = () => {
    Alert.alert(t("settings.logout"), t("settings.sure_logout"), [
      {
        text: t("commons.no"),
        style: "cancel",
      },
      {
        text: t("commons.yes"),
        onPress: async () => {
          await client.sessions.logout();
          deleteUser(realm, user.user_id)
          setValue({ ...client, client: client, token: user.token, user: user, state: "switch_user" })
        },
        style: "default",
      },
    ])
  }

  const copyText = () => {
    Clipboard.setString(`App informations : ${JSON.stringify(appInfo)}`);
    Toast.show({ text1: t(`commons.success`) as string });
  }

  const [routes] = useState<Array<{
    title: string;
    route: SettingsStackScreens,
    leftIcon?: string
  }>>([
    {
      route: "PremiumScreen",
      title: t("settings.premium"),
      leftIcon: "star-shooting"
    },
    {
      route: "SessionScreen",
      title: t("settings.sessions"),
      leftIcon: "monitor-cellphone"
    },
    {
      route: "BlockedScreen",
      title: t("settings.blocked"),
      leftIcon: "account-cancel"
    },
    {
      route: "SecurityScreen",
      title: t("settings.security"),
      leftIcon: "security"
    },
    {
      route: "AppScreen",
      title: t("settings.app"),
      leftIcon: "cellphone-cog"
    }
  ]);

  return (
    <SettingsContainer leftComponent={<Appbar.Action color={colors.text_normal} icon="exit-to-app" onPress={() => Disconnect()} />} title={t("settings.settings")}>
      <ScrollView>
        {
          routes.map((r, index) => <SettingsButtons leftIcon={r.leftIcon && r.leftIcon} key={index} onPress={() => navigation.navigate("SettingsStack", {
            screen: r.route
          })} t={r.title} />)
        }
        <SettingsButtons onPress={async () => await openURL(websiteurl)} t={t("commons.website")} icon={"web"} />
        {appInfo && <SettingsButtons onPress={() => copyText()} t={`${t("settings.app_version")} : ${appInfo.version} (${appInfo.build_number})`} icon={"content-copy"} />}
      </ScrollView>
    </SettingsContainer>
  )
}

export default HomeSettingsScreen;