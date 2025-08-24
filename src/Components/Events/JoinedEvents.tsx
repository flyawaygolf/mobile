import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { handleToast } from "../../Services";
import { useClient, useTheme } from "../Container";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import EventCard from "./EventCard";
import { Loader } from "../../Other";
import { FlashList } from "@shopify/flash-list";

export default function JoinedEvents() {
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
        const response = await client.events.joined({ pagination: { pagination_key: refresh ? undefined : paginationKey } });
        setLoading(false);
        if (refresh) setLoaderF(false);        
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        
        if (refresh) setEvents(response.data);
        else setEvents([...events, ...response.data]);
    };

    useEffect(() => {
        getData()
    }, [])

    const renderItem = useCallback(({ item }: { item: eventsInterface }) => (
        <EventCard full_width event={item} />
    ), [events]);

    return (
        <FlashList
            ListFooterComponent={loading ? <Loader /> : undefined}
            refreshControl={<RefreshControl
                refreshing={loaderF}
                progressBackgroundColor={colors.bg_primary}
                tintColor={colors.fa_primary}
                colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                onRefresh={() => getData(true)} />}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("events.no_joined_events")}</Text>}
            data={events}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item?.event_id}+${index}`}
        />
    )
}