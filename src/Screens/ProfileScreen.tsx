import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { navigationProps } from '../Services';
import CustomHeader from '../Components/Header/Profile';
import { useClient, useTheme } from '../Components/Container';
import { full_width } from '../Style/style';
import { Avatar } from '../Components/Member';
import { Markdown } from '../Components/Text';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
  const navigation = useNavigation<navigationProps>();
  const { user, client } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const createDM = () => { };

  const likeProfile = () => { };

  return (
    <>
      <CustomHeader />
      <View style={{
        width: full_width
      }}>
        <View style={{ alignItems: "center" }}>
          <Avatar
            size={75}
            url={`${client.user.avatar(user.user_id, user.avatar)}`} />
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Text>{user.username}</Text>
            <Text>@{user.nickname}</Text>
          </View>
        </View>
        <View style={{ padding: 5, alignItems: "center", justifyContent: "space-evenly", flexDirection: "row" }}>
          <View style={{
            width: 50,
            height: 50,
            borderColor: colors.fa_primary,
            borderRadius: 50 / 2,
            borderWidth: 3,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Text variant='titleMedium'>{17}</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <IconButton onPress={() => createDM()} icon="email" />
            <Text variant="labelMedium">{t("profile.send_message")}</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <IconButton onPress={() => likeProfile()} icon="heart" />
            <Text variant="labelMedium">{t("posts.like")}</Text>
          </View>
          <Markdown content={user?.description ?? ""} />
        </View>
      </View>
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

export default ProfileScreen;