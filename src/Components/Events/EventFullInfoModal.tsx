import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Card, Icon, Paragraph, Title } from "react-native-paper";

import { BottomModal } from "../../Other";
import { handleToast, messageFormatDate } from "../../Services";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events";
import { cdnbaseurl } from "../../Services/constante";
import { useClient, useTheme } from "../Container";

// https://dribbble.com/shots/19828369-Toket-com-Event-Mobile-Apps

type SectionProps = {
    event: eventsInterface;
    visible: boolean;
    setModalVisible: (visible: boolean) => any
}

export default function EventFullInfoModal({ event, setModalVisible, visible }: SectionProps) {

    const { t } = useTranslation();
    const { client } = useClient();
    const { colors } = useTheme();
    const [eventInfo, setEventInfo] = useState<eventsInterface>(event);

    const joinEvent = async () => {
        const response = await client.events.join(eventInfo.event_id);
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        handleToast(t(`events.join_success`));
        setEventInfo({ ...eventInfo, joined: true });
    }

    const leaveEvent = async () => {
        const response = await client.events.leave(eventInfo.event_id);
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        handleToast(t(`events.leave_success`));
        setEventInfo({ ...eventInfo, joined: false });
    }


    return (
        <BottomModal isVisible={visible} onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)}>
            <Card style={{ padding: 10, backgroundColor: colors.bg_secondary, margin: 5, width: 300 }}>
                <Card.Cover style={{ backgroundColor: colors.fa_third, marginBottom: 5 }} source={{ uri: `${cdnbaseurl}/assets/background/events.jpg`, cache: "force-cache" }} />
                <View style={{ position: 'absolute', top: 10, right: 10 }}>
                    {
                        eventInfo.favorites && <Icon source='star' color='#FFD700' size={24} />
                    }
                </View>
                <Title numberOfLines={1}>{eventInfo.title}</Title>
                <Paragraph style={{ color: colors.text_muted, alignItems: "center" }}>
                    <Icon source="calendar-clock" size={16} color={colors.text_muted} /> {' '}{messageFormatDate(eventInfo.start_date).fullDate()}
                </Paragraph>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Paragraph>
                        {t("events.participants")} : {eventInfo.participants}
                    </Paragraph>
                    <Card.Actions>
                        <Button icon={eventInfo.joined ? "account-minus" : "account-plus"} onPress={eventInfo.joined ? leaveEvent : joinEvent}>
                            {eventInfo.joined ? t('events.leave') : t('events.join')}
                        </Button>
                    </Card.Actions>
                </View>
            </Card>
        </BottomModal>
    )
}