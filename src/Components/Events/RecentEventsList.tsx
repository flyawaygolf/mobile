import { FlatList } from "react-native-gesture-handler";
import { handleToast } from "../../Services";
import { useClient, useTheme } from "../Container";
import { useTranslation } from "react-i18next";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import { useCallback, useEffect, useState } from "react";
import EventCard from "./EventCard";
import { RefreshControl, View } from "react-native";
import { Loader } from "../../Other";
import { Text } from "react-native-paper";

export default function RecentEventsList() {
    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [loaderF, setLoaderF] = useState(false);
    const [events, setEvents] = useState<eventsInterface[]>([]);

    async function getData(refresh: boolean = false) {
        if (refresh) {
            setLoaderF(true)
            if (loaderF) return;
        }
        const response = await client.events.fetch();
        if (refresh) setLoaderF(false)
        else setLoading(false)
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setEvents(response.data);
    }

    async function start() {
        getData()
    }

    useEffect(() => {
        start()
    }, [])

    const renderItem = useCallback(({ item }: { item: eventsInterface }) => (
        <EventCard event={item} />
    ), [events]);

    return (
        <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text variant="headlineSmall">{t("events.recents")}</Text>
            </View>
        <FlatList
            horizontal
            ListFooterComponent={loading ? <Loader /> : undefined}
            refreshControl={<RefreshControl
                refreshing={loaderF}
                progressBackgroundColor={colors.bg_primary}
                tintColor={colors.fa_primary}
                colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                onRefresh={() => getData(true)} />}
            ListEmptyComponent={<Text style={{ padding: 5 }}>{t("events.no_events")}</Text>}
            initialNumToRender={20}
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.event_id}
        />
        </View>
    )
}