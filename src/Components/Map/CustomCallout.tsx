import { Alert, StyleSheet, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Badge, Button, Card, IconButton, Text, Tooltip } from "react-native-paper";
import { useClient, useTheme } from "../Container";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import { displayHCP } from "../../Services/handicapNumbers";
import { useTranslation } from "react-i18next";
import { handleToast, navigationProps } from "../../Services";
import { addGuildList } from "../../Redux/guildList/action";
import { useDispatch } from "react-redux";
import Clipboard from "@react-native-clipboard/clipboard";
import { full_width } from "../../Style/style";
import { Avatar } from "../Member";

const CustomCallout = ({ user_info, onDismiss }: { user_info: userInfo, onDismiss: () => void }) => {
  const { colors } = useTheme();
  const { client, user } = useClient();
  const { t } = useTranslation();
  const navigation = useNavigation<navigationProps>();
  const dispatch = useDispatch();

  const createDM = async () => {
    const response = await client.guilds.create([user_info.user_id]);
    if (response.error) return handleToast(t(`errors.${response.error.code}`))
    dispatch(addGuildList([response.data as any]));
    setTimeout(() => {
      navigation.navigate("MessagesStack", {
        screen: "MessageScreen",
        params: response.data,
      })
    }, 500)
  }

  const copyNickname = () => {
    Clipboard.setString(user_info.nickname);
    handleToast(t("commons.success"));
  }

  const report = async () => {
    Alert.alert(`Report ${user_info.username}`, "Are you sure you want to report this user ?", [{
      text: t("commons.no"),
      style: "cancel",
  },
  {
      text: t("commons.yes"),
      onPress: async () => {
        const response = await client.user.report(user_info.user_id, 1);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        handleToast(t("commons.success"));
      },
      style: "default",
  }])
}

  const block = async () => {
    Alert.alert(`Block ${user_info.username}`, "Are you sure you want to block this user ?", [{
      text: t("commons.no"),
      style: "cancel",
  },
  {
      text: t("commons.yes"),
      onPress: async () => {
        const response = await client.block.create(user_info.user_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        handleToast(t("commons.success"))
      },
      style: "default",
  }])
  }

  const copyUserID = () => {
    Clipboard.setString(user_info.user_id);
    handleToast(t("commons.success"))
  }

  return (
    <View>
      <View style={{ height: 125, position: "relative" }}>
        <View style={[style.banner_image, { backgroundColor: user_info.accent_color }]} />
      </View>
      <Card mode="contained" style={{ position: "absolute", zIndex: 99, right: 0, top: 5 }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Tooltip title={t("profile.copy_user_id")}>
            <IconButton style={{ margin: 0 }} icon={"content-copy"} onPress={() => copyUserID()} />
          </Tooltip>
          <Tooltip title={t("profile.block")}>
            <IconButton style={{ margin: 0 }} icon={"block-helper"} onPress={() => block()} />
          </Tooltip>
          <Tooltip title={t("profile.report")}>
            <IconButton style={{ margin: 0 }} icon={"flag-variant"} onPress={() => report()} />
          </Tooltip>
          <IconButton style={{ margin: 0 }} icon={"close-circle"} onPress={() => onDismiss()} />
        </View>
      </Card>
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
              backgroundColor: colors.bg_secondary,
            }}
            url={`${client.user.avatar(user_info.user_id, user_info.avatar)}`}
          />
          <Badge size={20} style={{ marginLeft: -30 }}>{displayHCP(user_info.golf_info.handicap)}</Badge>
        </View>
        <View style={{ position: "absolute", right: 5 }}>
          {user_info.user_id === user.user_id ? <Button icon="account-edit" onPress={() => navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: user_info.nickname } })}>Edit</Button> : <Button icon="message-text" onPress={() => createDM()}>Send DM</Button>}
        </View>
      </View>
      <Card style={{ margin: 5 }} mode="contained">
        <Card.Title
          titleStyle={{
            fontWeight: 800,
          }}
          subtitleStyle={{
            fontWeight: 500,
          }}
          left={() => <IconButton mode="contained" icon="content-copy" onPress={() => copyNickname()} />}
          titleVariant="titleLarge"
          subtitleVariant="labelLarge"
          title={user_info.username}
          subtitle={`@${user_info.nickname}`}
        />
      </Card>
      <Card style={{ margin: 5 }} mode="contained">
        <Card.Content>
          <View style={{ marginBottom: 5 }}>
            <Text style={{ fontWeight: '900' }}>Description</Text>
            <Text>{user_info.description}</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  )
}

const style = StyleSheet.create({
  banner_image: {
    width: full_width,
    height: "100%",
    ...StyleSheet.absoluteFillObject,
  },
  row: {
    flexDirection: "row",
    alignItems: 'center',
  },
})

export default CustomCallout;
