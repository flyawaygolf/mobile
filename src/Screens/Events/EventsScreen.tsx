import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Appbar } from "react-native-paper";

import EventsNavigator from "./EventsNavigator";
import { ScreenContainer, useTheme } from "../../Components/Container";
import CustomHeader from "../../Components/Header/CustomHeader";
import { navigationProps } from "../../Services";



export default function EventsScreen() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    return (
        <ScreenContainer>
            <CustomHeader title={t("events.header_title")} isHome leftComponent={<Appbar.Action color={colors.text_normal} icon="calendar-edit" onPress={() => navigation.navigate("EventStack", { screen: "CreateEventScreen" })} />} />
            <EventsNavigator />
        </ScreenContainer>
    )
}