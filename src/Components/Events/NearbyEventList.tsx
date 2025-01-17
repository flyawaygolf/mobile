import { FlatList } from "react-native-gesture-handler";
import { handleToast } from "../../Services";
import { useClient, useTheme } from "../Container";
import { useTranslation } from "react-i18next";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import { useCallback, useEffect, useState } from "react";
import EventCard from "./EventCard";
import { RefreshControl, View } from "react-native";
import { Loader } from "../../Other";
import { IconButton, Text } from "react-native-paper";

type SectionProps = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

export default function NearbyEventList({ latitude, longitude }: SectionProps) {
    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [loaderF, setLoaderF] = useState(false);
    const [events, setEvents] = useState<eventsInterface[]>([]);

    async function getData(refresh: boolean = false) {
        setLoading(true)
        if (refresh) {
            setLoaderF(true)
            if (loaderF) return;
        }
        const response = await client.search.map.events({
            lat: latitude,
            long: longitude,
            max_distance: 100000
        });
        if (refresh) setLoaderF(false)
        setLoading(false)
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setEvents(response.data.events.items);
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
                <Text variant="headlineSmall">{t("events.nearby_you")}</Text>
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
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("events.no_events_nearby_you")}</Text>}
                initialNumToRender={20}
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.event_id}
            />
        </View>
    )
}