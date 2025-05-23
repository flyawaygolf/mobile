import { FlatList } from "react-native-gesture-handler";
import { handleToast } from "../../Services";
import { useClient, useTheme } from "../Container";
import { useTranslation } from "react-i18next";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import { useCallback, useEffect, useState } from "react";
import EventCard from "./EventCard";
import { RefreshControl } from "react-native";
import { Loader } from "../../Other";
import { Text } from "react-native-paper";

export default function PrivateEvents() {
    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [loaderF, setLoaderF] = useState(false);
    const [events, setEvents] = useState<eventsInterface[]>([]);
    const [paginationKey, setPaginationKey] = useState<string | undefined>(undefined);

    const getData = async (refresh: boolean = false) => {
        if (loaderF) return;
        if (refresh) setLoaderF(true)
        const response = await client.events.favorites({ pagination: { pagination_key: refresh ? undefined : paginationKey } });
        setLoading(false);
        if (refresh) setLoaderF(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if (refresh) setEvents(response.data);
        else setEvents([...events, ...response.data]);
    };

    async function start() {
        getData()
    }

    useEffect(() => {
        start()
    }, [])

    const renderItem = useCallback(({ item }: { item: eventsInterface }) => (
        <EventCard full_width event={item} />
    ), [events]);

    return (
        <FlatList
            ListFooterComponent={loading ? <Loader /> : undefined}
            refreshControl={<RefreshControl
                refreshing={loaderF}
                progressBackgroundColor={colors.bg_primary}
                tintColor={colors.fa_primary}
                colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                onRefresh={() => getData(true)} />}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("events.no_friends_event")}</Text>}
            initialNumToRender={20}
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.event_id}
        />
    )
}