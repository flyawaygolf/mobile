import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { FlatList, RefreshControl } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useClient, useTheme } from '../../Components/Container';
import { FollowInterface } from '../../Services/Client/Managers/Interfaces';
import { DisplayMember } from '../../Components/Member';
import { navigationProps } from '../../Services';
import { useNavigation } from '@react-navigation/native';

const FollowListScreen = () => {

  const { colors } = useTheme();
  const { client } = useClient();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<FollowInterface.notificationFollowInterface[]>([]);
  const navigation = useNavigation<navigationProps>();

  const followList = async () => {
    setLoading(true);
    const request = await client.follows.unacceptedList();
    setLoading(false);
    if (request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
    if (!request.data) return;
    if (request.data.length < 1) return;
    setList(request.data);
  }

  useEffect(() => {
    followList()
  }, [])

  const accept_follow = async (index: number) => {
    var new_array = [...list];

    const element = new_array[index];
    if (!element) return;
    if (element.accepted) return;

    if (typeof element.follow_id === "undefined") return;
    const response = await client.follows.accept(element.follow_id);
    if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });

    new_array[index].accepted = true;
    setList(new_array);
  }

  return (
    <FlatList
      style={{
        height: "100%"
      }}
      data={list}
      keyExtractor={item => item.user_id}
      renderItem={({ item, index }) => <DisplayMember
        full_width
        informations={item.user_info}
        LeftComponent={<Button onPress={() => accept_follow(index)} mode='contained-tonal'>{item.accepted ? t("commons.accepted") : t("commons.waiting")}</Button>}
        onPress={() => navigation.navigate("ProfileStack", {
          screen: "ProfileScreen",
          params: {
            nickname: item.user_info.nickname
          }
        }
        )}
      />}
      refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => followList()} />}
      ListEmptyComponent={() => <Text style={{ padding: 5 }}>{t("notification.no_new_followers")}</Text>}
    />
  );
};

export default FollowListScreen;