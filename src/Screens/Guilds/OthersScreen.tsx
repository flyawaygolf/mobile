import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { connect } from "react-redux";
import { useClient, useTheme } from "../../Components/Container";
import GroupInfo from "../../Components/Messages/GuildInfo";
import { RootState, useAppDispatch, useAppSelector } from "../../Redux";
import { initGuildList, setUnreadGuildList } from "../../Redux/guildList/action";
import { guildI } from "../../Redux/guildList";
import { handleToast } from "../../Services";

function OthersScreen() {

    const { client } = useClient();
    const groups = useAppSelector((state) => state.guildListFeed.filter((item) => !item.favorite));
    const dispatch = useAppDispatch();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    async function getUnreads() {
        const request = await client.messages.unreads();
        if (request.error || !request.data) return;
        dispatch(setUnreadGuildList(request.data))
    }

    async function getData() {
        setLoading(true);
        const request = await client.guilds.fetch();
        setLoading(false);
        if(request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
        dispatch(initGuildList(request.data))
        await getUnreads()
    }

    const renderItem = useCallback(({ item }: { item: guildI }) => (
        <GroupInfo info={item} />
    ), []);

    const memoizedValue = useMemo(() => renderItem, [groups]);

    return (
        <FlatList
            style={{
                height: "100%",
            }}
            data={groups}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("messages.no_guilds")}</Text>}
            renderItem={memoizedValue}
            keyExtractor={item => item.guild_id}
            refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => getData()} />}
        />
    )
}

const mapStateToProps = (state: RootState) => {
    return {
      guildListFeed: state.guildListFeed,
    };
  };

const mapDispatchToProps = {
    initGuildList,
    setUnreadGuildList,
};

export default connect(mapStateToProps, mapDispatchToProps)(OthersScreen);
