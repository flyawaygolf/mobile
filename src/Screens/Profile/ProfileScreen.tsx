import React, { useCallback, useEffect, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Badge, Button, Card, IconButton, Text, Tooltip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';

import { SafeBottomContainer, ScreenContainer, useClient, useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';
import { Avatar } from '../../Components/Member';
import { displayHCP } from '../../Services/handicapNumbers';
import { handleToast, navigationProps } from '../../Services';
import { ProfileStackParams, ScreenNavigationProps } from '../../Services';
import { useDispatch } from 'react-redux';
import { addGuildList } from '../../Redux/guildList/action';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';
import { Loader } from '../../Other';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Search';
import { DisplayGolfs } from '../../Components/Golfs';

const ProfileScreen = ({ route }: ScreenNavigationProps<ProfileStackParams, "ProfileScreen">) => {
  const { user_id } = route.params;
  const { user, client } = useClient();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<navigationProps>();
  const dispatch = useDispatch();
  const [user_info, setUserInfo] = React.useState<userInfo>({} as userInfo);
  const [golfs, setGolfs] = React.useState<golfInterface[]>([]);
  const [paginationKey, setPaginationKey] = React.useState<string | undefined>(undefined);

  const copyNickname = () => {
    Clipboard.setString(user_info.nickname);
    handleToast(t("commons.success"));
  }

  useEffect(() => {
    console.log(user_id)
    getUserInfo();
    getGolfs();
  }, [user_id]);

  const getUserInfo = async () => {
    const response = await client.user.fetch(user_id);
    if (response.error) return handleToast(t(`errors.${response.error.code}`));
    if (!response.data) return;
    setUserInfo(response.data);
  };

  const getGolfs = async () => {
    const response = await client.golfs.link.golfs(user_id, { pagination: { pagination_key: paginationKey } });
    if (response.error) return handleToast(t(`errors.${response.error.code}`))
    if (!response.data) return;
    if (response.data.length < 1) return;
    if (response.pagination_key) setPaginationKey(response.pagination_key);
    if (golfs.length > 0) setGolfs([...golfs, ...response.data]);
    setGolfs(response.data);
  };

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

  const report = async () => {
    Alert.alert(t("profile.report_alert_title", { username: user_info.username }), t("profile.report_alert_description"), [{
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
    Alert.alert(t("profile.block_alert_title", { username: user_info.username }), t("profile.block_alert_description"), [{
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

  const renderItem = useCallback(({ item }: { item: golfInterface }) => (
    <DisplayGolfs
      onPress={() => navigation.navigate("GolfsStack", {
        screen: "GolfsProfileScreen",
        params: {
          golf_id: item.golf_id,
        }
      })}
      informations={item} />
  ), []);

  const memoizedValue = useMemo(() => renderItem, [golfs]);

  return (
    <SafeBottomContainer padding={0}>
      <ScreenContainer>
        <Appbar.Header style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
          {
            user_info.user_id && (
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                <Tooltip title={t("profile.copy_user_id")}>
                  <IconButton style={{ margin: 0 }} icon={"content-copy"} onPress={() => copyUserID()} />
                </Tooltip>
                {
                  user.user_id !== user_info.user_id && (
                    <>
                      <Tooltip title={t("profile.block")}>
                        <IconButton style={{ margin: 0 }} icon={"block-helper"} onPress={() => block()} />
                      </Tooltip>
                      <Tooltip title={t("profile.report")}>
                        <IconButton style={{ margin: 0 }} icon={"flag-variant"} onPress={() => report()} />
                      </Tooltip>
                    </>
                  )
                }
              </View>
            )
          }
        </Appbar.Header>

        {
          user_info.user_id ? (
            <FlatList
              ListHeaderComponent={() => (
                <>
                  <View style={{ height: 125 }}>
                    <View style={[style.banner_image, { backgroundColor: user_info.accent_color }]} />
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
                          backgroundColor: colors.bg_secondary,
                        }}
                        url={`${client.user.avatar(user_info.user_id, user_info.avatar)}`}
                      />
                      <Badge size={20} style={{ marginLeft: -30 }}>{displayHCP(user_info.golf_info.handicap)}</Badge>
                    </View>
                    <View style={{ position: "absolute", right: 5 }}>
                      {user.user_id === user_info.user_id ? <Button icon="account-edit" onPress={() => navigation.navigate("ProfileEditScreen")}>{t("profile.edit")}</Button> : <Button icon="message-text" onPress={() => createDM()}>{t("profile.send_message")}</Button>}
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
                        <Text style={{ fontWeight: '900' }}>{t("profile.description")}</Text>
                        <Text>{user_info.description}</Text>
                      </View>
                    </Card.Content>
                  </Card>
                  <Text style={{ fontWeight: '900', padding: 5 }}>{t("profile.golf_linked")} :</Text>
                </>
              )}
              data={golfs}
              keyExtractor={(item) => item.golf_id}
              renderItem={memoizedValue}
              onScrollEndDrag={() => getGolfs()}
              ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("profile.no_linked_golfs")}</Text>}
            />
          ) : <Loader />
        }
      </ScreenContainer>
    </SafeBottomContainer>
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
    alignItems: 'center',
  },
})

export default ProfileScreen;
