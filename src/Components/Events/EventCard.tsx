import { Avatar, Button, Card, Icon, Text, Title } from "react-native-paper";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import { View } from "react-native";
import { messageFormatDate, navigationProps } from "../../Services";
import { useTranslation } from "react-i18next";
import { useTheme } from "../Container";
import { cdnbaseurl } from "../../Services/constante";
import { ShrinkEffect } from "../Effects";
import { useNavigation } from "@react-navigation/native";

type SectionProps = {
    event: eventsInterface;
    full_width?: boolean;
}

export default function EventCard({ event, full_width }: SectionProps) {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    return (
        <ShrinkEffect onPress={() => navigation.navigate("EventStack", { screen: "DisplayEventScreen", params: { event_id: event.event_id } })}>
            <Card style={{ backgroundColor: colors.bg_secondary, margin: 5, width: full_width ? "auto" : 300 }}>
                <Card.Cover
                    style={{ backgroundColor: colors.good_color, marginBottom: 5, borderRadius: 0, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                    source={{ uri: `${cdnbaseurl}/assets/background/events.jpg`, cache: "force-cache" }} />
                <View style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {
                        event.joined && <Icon source='heart' color={colors.color_red} size={24} />
                    }
                    {
                        event.favorites && <Icon source='account-star-outline' color={colors.color_yellow} size={24} />
                    }
                </View>
                <View style={{ padding: 20, paddingTop: 5 }}>
                    <Title style={{ fontWeight: "bold" }} numberOfLines={1}>{event.title}</Title>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                        <Avatar.Text label={event.golf_info.name} size={40} style={{ borderRadius: 8 }} />
                        <Text style={{ marginLeft: 5 }}>{event.golf_info.name}</Text>
                    </View>
                    <View style={{ alignItems: "center", flexDirection: "row", display: "flex", marginTop: 5 }}>
                        <Icon source="calendar-clock" size={20} color={colors.good_color} />
                        <Text>  {messageFormatDate(event.start_date).fullDate()}</Text>
                    </View>
                    <View style={{ alignItems: "center", flexDirection: "row", display: "flex", marginTop: 5 }}>
                        <Icon source="account-group-outline" size={20} color={colors.good_color} />
                        <Text>  {t("events.participants")}: {event.participants} /{event?.max_participants ?? 2}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                        <View style={{ alignItems: "flex-start", flexDirection: "column", justifyContent: "flex-start", display: "flex", marginTop: 5 }}>
                            <Text style={{ fontSize: 12 }}>{t("events.from")}</Text>
                            <Text style={{ fontSize: 18, color: colors.good_color, fontWeight: "bold" }}>€{event?.greenfee ?? "..."}</Text>
                            <Text style={{ fontSize: 12 }}>{t("events.per_person")}</Text>
                        </View>
                        <Card.Actions>
                            <Button>
                                {t('events.display_more')}
                            </Button>
                        </Card.Actions>
                    </View>
                </View>
            </Card>
        </ShrinkEffect>
    )
}