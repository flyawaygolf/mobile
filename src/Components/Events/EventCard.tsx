import FastImage from "@d11/react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button, Card, Icon, Text } from "react-native-paper";

import { messageFormatDate, navigationProps } from "../../Services";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import { useClient, useTheme } from "../Container";
import { ShrinkEffect } from "../Effects";
import { Avatar } from "../Member";


type SectionProps = {
    event: eventsInterface;
    full_width?: boolean;
}

export default function EventCard({ event, full_width }: SectionProps) {

    const { t } = useTranslation()
    const { client } = useClient();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    return (
        <ShrinkEffect onPress={() => event.deleted ? null : navigation.navigate("EventStack", { screen: "DisplayEventScreen", params: { event_id: event.event_id } })}>
            <Card style={{ backgroundColor: event.deleted ? colors.bg_third : colors.bg_secondary, margin: 5, width: full_width ? "auto" : 300 }}>
                <View style={{ width: "100%", height: 150, borderTopRightRadius: 10, borderTopLeftRadius: 10, overflow: "hidden", position: "relative" }}>
                <FastImage
                    resizeMode="cover"
                    style={{ backgroundColor: colors.good_color, ...StyleSheet.absoluteFillObject }}
                    source={{ uri: client.golfs.cover(event?.golf_info.golf_id) }} />
                </View>
                <View style={{ padding: 20, paddingTop: 5 }}>
                    <Text variant="titleLarge" style={{ fontWeight: "bold" }} numberOfLines={1}>{event.title}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                        <Avatar url={client.golfs.avatar(event.golf_info.golf_id)} size={40} radius={8} />
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
                            {
                                event.deleted ? <Button textColor={colors.badge_color}>{t('events.deleted')}</Button> : <Button>{t('events.display_more')}</Button>
                            }
                        </Card.Actions>
                    </View>
                </View>
            </Card>
        </ShrinkEffect>
    )
}