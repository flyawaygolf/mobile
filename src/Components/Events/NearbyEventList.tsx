import { handleToast } from "../../Services";
import { useClient, useTheme } from "../Container";
import { useTranslation } from "react-i18next";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import { useCallback, useEffect, useState } from "react";
import EventCard from "./EventCard";
import { RefreshControl } from "react-native";
import { Loader } from "../../Other";
import { Text } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";

export default function NearbyEventList() {
    const { client, location } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [loaderF, setLoaderF] = useState(false);
    const [events, setEvents] = useState<eventsInterface[]>([]);

    async function getData(refresh: boolean = false) {
        if (loaderF) return;
        if (refresh) {
            setLoading(true)
            setLoaderF(true)
        }
        const response = await client.search.map.events({
            lat: location.latitude,
            long: location.longitude,
            max_distance: 100
        });
        if (refresh) setLoaderF(false)
        setLoading(false)
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setEvents(response.data.events.items);
    }

    async function start() {
        try {
            await getData();
        } catch (error) {
            await getData();
        }
    }

    useEffect(() => {
        start()
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
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("events.no_events_nearby_you")}</Text>}
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.event_id}
        />
    )
}