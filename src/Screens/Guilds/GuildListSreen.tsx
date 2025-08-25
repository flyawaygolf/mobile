import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Chip, Text } from 'react-native-paper';

import { ScreenContainer, useClient, useTheme } from '../../Components/Container';
import { ShrinkEffect } from '../../Components/Effects';
import CustomHeader from '../../Components/Header/CustomHeader';
import MessageHeader from '../../Components/Header/Message';
import GroupInfo from "../../Components/Messages/GuildInfo";
import { useAppDispatch, useAppSelector } from '../../Redux';
import { guildI } from '../../Redux/guildList';
import { initGuildList, setUnreadGuildList } from '../../Redux/guildList/action';
import { handleToast } from '../../Services';

type FilterType = "all" | "unread" | "favorites" | "events" | "others"

type filterChipsType = {
  key: FilterType;
  title: string;
  selected: boolean;
}

const GuildListSreen = () => {

  const { client } = useClient();
  const groups = useAppSelector((state) => state.guildListFeed);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [displayGroups, setDisplayGroups] = useState(groups);
  const [filterChip, setFilterChip] = useState<filterChipsType[]>([
    {
      key: 'all',
      title: t('guilds.all'),
      selected: true
    },
    {
      key: "unread",
      title: t('guilds.unread'),
      selected: false
    },
    {
      key: 'favorites',
      title: t('guilds.favorites'),
      selected: false
    },
    {
      key: 'events',
      title: t('guilds.events'),
      selected: false
    },
    {
      key: 'others',
      title: t('guilds.others'),
      selected: false
    }
  ]);

  async function getUnreads() {
    const request = await client.messages.unreads();
    if (request.error || !request.data) return;
    dispatch(setUnreadGuildList(request.data))
  }

  async function getData() {
    setLoading(true);
    const request = await client.guilds.list();
    setLoading(false);
    if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
    dispatch(initGuildList(request.data))
    await getUnreads()
  }

  useEffect(() => {
    if(groups.length < 1) {
      getData();
    }
  }, []);

  useEffect(() => {
    setDisplayGroups(groups);
    setFilterChip(filterChip.map((item) => ({ ...item, selected: item.key === "all" })));
  }, [groups]);

  const renderItem = useCallback(({ item }: { item: guildI }) => (
    <GroupInfo info={item} />
  ), [groups, displayGroups]);

  const pressChip = async (type: FilterType) => {
    setFilterChip(filterChip.map((item) => ({ ...item, selected: item.key === type })));
    switch (type) {
      case "all":
        setDisplayGroups(groups);
        break;
      case "unread":
        setDisplayGroups(groups.filter((item) => item.unread));
        break;
      case "favorites":
        setDisplayGroups(groups.filter((item) => item.favorite));
        break;
      case "events":
        setDisplayGroups(groups.filter((item) => item.type === 2));
        break;
      case "others":
        setDisplayGroups(groups.filter((item) => !item.favorite && item.type !== 2));
        break;
      default:
        break;
    }
  }

  return (
    <ScreenContainer>
      <CustomHeader title={t("commons.messages")} isHome leftComponent={<MessageHeader />} />
      <View style={{ flex: 1 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.searchChips}>
          {
            filterChip.map((c, idx) => (
              <ShrinkEffect key={idx} shrinkAmount={0.90}>
                <Chip
                  selected={c.selected}
                  icon={c.selected ? "check" : c.key === "unread" ? () => <Avatar.Text size={20} label={groups.filter((item) => item.unread).length.toString()} /> : undefined}
                  style={{ borderRadius: 60, paddingRight: 10, paddingLeft: 10, backgroundColor: colors.bg_secondary }}
                  onPress={() => pressChip(c.key)}>
                  {c.title}
                </Chip>
              </ShrinkEffect>
            ))
          }
        </ScrollView>
        <FlatList
          style={{ height: "100%" }}
          data={displayGroups}
          ListEmptyComponent={<Text style={{ padding: 5 }}>{t("guilds.no_favorite_guilds")}</Text>}
          renderItem={renderItem}
          keyExtractor={item => item.guild_id}
          refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => getData()} />}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  searchChips: {
    marginTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
})

export default memo(GuildListSreen);
