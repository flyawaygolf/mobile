import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Badge, Button, Card, IconButton, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';

import { SafeBottomContainer, useClient, useNavigation, useTheme } from '../Components/Container';
import { full_width } from '../Style/style';
import { Avatar } from '../Components/Member';
import { getStorageInfo, setStorage, settingsStorageI } from '../Services/storage';
import { Ithemes } from '../Components/Container/Theme/Themes';
import SettingsModifyProfile from '../Components/Settings/Settings';
import { displayHCP } from '../Services/handicapNumbers';
import { BottomModal } from '../Other';
import { handleToast } from '../Services';
import { deleteUser } from '../Services/Realm/userDatabase';
import { useRealm } from '@realm/react';

const SettingsScreen = () => {
  const { user, client, setValue } = useClient();
  const { t } = useTranslation();
  const { colors, setTheme, theme } = useTheme();
  const navigation = useNavigation();
  const realm = useRealm();
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const changeStorage = (type: "theme" | "language", txt: Ithemes | string) => {
    const settings = getStorageInfo("settings") as settingsStorageI;

    switch (type) {
      case "theme":
        setStorage("settings", {
          theme: txt,
          locale: settings?.locale
        })
        setTheme(txt as Ithemes)
        break;
      case "language":
        setStorage("settings", {
          theme: settings?.theme,
          locale: txt
        })
        break;
      default:
        break;
    }
  }

  const copyNickname = () => {
    Clipboard.setString(user.nickname);
    handleToast(t("commons.success"));
  }

  const Disconnect = () => {
    Alert.alert(t("settings.logout"), t("settings.sure_logout"), [
        {
            text: t("commons.no"),
            style: "cancel"
        },
        {
            text: t("commons.yes"),
            onPress: async () => {
                await client.sessions.logout();
                deleteUser(realm, user.user_id)
                setValue({ ...client, client: client, token: user.token, user: user, state: "switch_user" })
            },
            style: "default"
        }
    ])
}

  return (
    <>
      <BottomModal onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)} isVisible={modalVisible}>
        <SettingsModifyProfile setModalVisible={setModalVisible} />
      </BottomModal>
      <SafeBottomContainer padding={0}>
        <Card mode='contained' style={{ position: "absolute", zIndex: 99, right: 0 }}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <IconButton style={{ margin: 0 }} icon={"theme-light-dark"} onPress={() => changeStorage("theme", theme === "auto" || theme === "white" ? "dark" : "white")} />
            <IconButton style={{ margin: 0 }} icon={"cog"} onPress={() => setModalVisible(true)} />
            <IconButton style={{ margin: 0 }} icon={"exit-to-app"} onPress={() => Disconnect()} />
          </View>
        </Card>
        <View style={{ height: 125 }}>
          <View style={[style.banner_image, { backgroundColor: user.accent_color }]} />
        </View>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
            <Avatar
              size={80}
              style={{
                borderRadius: 80 / 2,
                borderColor: colors.bg_primary,
                borderWidth: 3,
                marginTop: -40,
                marginLeft: 10,
                backgroundColor: colors.bg_secondary
              }}
              url={`${client.user.avatar(user.user_id, user.avatar)}`}
            />
            <Badge size={20} style={{ marginLeft: -30 }}>{displayHCP(user.golf_info.handicap)}</Badge>
          </View>
          <View style={{ position: "absolute", right: 5 }}>
            <Button icon="account-edit" onPress={() => navigation.push("ProfileEditScreen")}>Edit</Button>
          </View>
        </View>
        <Card style={{ margin: 5 }} mode='contained'>
          <Card.Title
            titleStyle={{
              fontWeight: 800
            }}
            subtitleStyle={{
              fontWeight: 500
            }}
            left={() => <IconButton mode='contained' icon="content-copy" onPress={() => copyNickname()} />}
            titleVariant='titleLarge'
            subtitleVariant='labelLarge'
            title={user.username}
            subtitle={`@${user.nickname}`}
          />
        </Card>
        <Card style={{ margin: 5 }} mode='contained'>
          <Card.Content>
            <View style={{ marginBottom: 5 }}>
              <Text style={{ fontWeight: '900' }}>Description</Text>
              <Text>{user.description}</Text>
            </View>
            {
              /**
               *             <View style={[{ marginBottom: 5, backgroundColor: "red" }]}>
              <Text style={{ fontWeight: '900' }}>Gender</Text>
              {
                !user.gender ? <Text>-</Text> : <Icon size={20} color={user.gender === 1 ? colors.color_male : colors.color_female} source={user.gender === 1 ? "gender-male" : "gender-female"} />
              }
            </View>
               */
              /**
               *             <View style={{ marginBottom: 5 }}>
              <Text style={{ fontWeight: '900' }}>Started at </Text>
              <Text>{user.golf_info?.started ? messageFormatDate(user.golf_info?.started).fromNow(i18n.language) : "-"}</Text>
            </View>
               */
            }
          </Card.Content>
        </Card>
      </SafeBottomContainer>
    </>
  );
};

const style = StyleSheet.create({
  banner_image: {
    width: full_width,
    height: "100%",
    ...StyleSheet.absoluteFillObject,
  },
  row: {
    flexDirection: "row",
    alignItems: 'center'
  }
})

export default SettingsScreen;