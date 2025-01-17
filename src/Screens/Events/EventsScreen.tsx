import { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { ScreenContainer, useTheme } from "../../Components/Container";
import { getCurrentLocation, handleToast, navigationProps } from "../../Services";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../Components/Header/CustomHeader";
import { useNavigation } from "@react-navigation/native";
import NearbyEventList from "../../Components/Events/NearbyEventList";
import { Loader } from "../../Other";
import { ScrollView } from "react-native";
import RecentEventsList from "../../Components/Events/RecentEventsList";
import PrivateEvents from "../../Components/Events/PrivateEvents";

type LocationType = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

export default function EventsScreen() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const [location, setLocation] = useState<LocationType | undefined>(undefined);

    const start = async () => {
        try {
            const position = await getCurrentLocation();
            if (position) {
                const crd = position.coords;
                const init_location = {
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }
                setLocation(init_location);
            }
        } catch (error) {
            handleToast(JSON.stringify(error))
        }
    }

    useEffect(() => {
        start();
    }, [])

    return (
        <ScreenContainer>
            <CustomHeader title={t("events.header_title")} isHome leftComponent={<Appbar.Action color={colors.text_normal} icon="calendar-edit" onPress={() => navigation.navigate("EventStack", { screen: "CreateEventScreen" })} />} />
            <ScrollView style={{ padding: 10 }}>
                <PrivateEvents />
                <RecentEventsList />
                {
                    location ? <NearbyEventList {...location} /> : <Loader />
                }
            </ScrollView>
        </ScreenContainer>
    )
}