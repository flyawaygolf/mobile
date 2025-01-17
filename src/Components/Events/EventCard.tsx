import { Button, Card, Icon, Paragraph, Title } from "react-native-paper";
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
}

export default function EventCard({ event }: SectionProps) {

    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    return (
        <ShrinkEffect onPress={() => navigation.navigate("EventStack", { screen: "DisplayEventScreen", params: { event_id: event.event_id } })}>
            <Card style={{ padding: 10, backgroundColor: colors.bg_secondary, margin: 5, width: 300 }}>
                <Card.Cover style={{ backgroundColor: colors.fa_third, marginBottom: 5 }} source={{ uri: `${cdnbaseurl}/assets/background/events.jpg`, cache: "force-cache" }} />
                <View style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {
                        event.joined && <Icon source='heart' color={colors.color_red} size={24} />
                    }
                    {
                        event.favorites && <Icon source='account-star-outline' color={colors.color_yellow} size={24} />
                    }
                </View>
                <Title numberOfLines={1}>{event.title}</Title>
                <Paragraph style={{ color: colors.text_muted, alignItems: "center" }}>
                    <Icon source="calendar-clock" size={16} color={colors.text_muted} /> {' '}{messageFormatDate(event.start_date).fullDate()}
                </Paragraph>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Paragraph>
                        {t("events.participants")} : {event.participants}
                    </Paragraph>
                    <Card.Actions>
                        <Button>
                            {t('events.display_more')}
                        </Button>
                    </Card.Actions>
                </View>
            </Card>
        </ShrinkEffect>
    )
}