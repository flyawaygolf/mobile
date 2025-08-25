import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Platform } from "react-native";
import { Text } from "react-native-paper";

import { BottomModal, Loader } from "../../Other";
import { handleToast, navigationProps } from "../../Services";
import { eventsInterface } from "../../Services/Client/Managers/Interfaces/Events"
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import { useClient } from "../Container";
import { DisplayMember } from "../Member";

type SectionProps = {
    event: eventsInterface;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function EventParticipantsModal({ event, visible, setVisible }: SectionProps) {
    const { client } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();

    const [participants, setParticipants] = useState<userInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [paginationKey, setPaginationKey] = useState<string | undefined>(undefined);

    const getParticipants = async () => {
        setLoading(true);
        const response = await client.events.participants(event.event_id, {
            pagination: {
                pagination_key: paginationKey
            }
        });
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        if (response.data) setParticipants(response.data);
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        return setLoading(false);
    }

    useEffect(() => {
        if (visible) {
            getParticipants();
        }
    }, [visible])

    const renderUsers = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember
            onPress={() => navigation.navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: {
                    nickname: item.nickname
                }
            })}
            informations={item} />
    ), []);

    return (
        <BottomModal isVisible={visible} onSwipeComplete={() => setVisible(false)} dismiss={() => setVisible(false)}>
            {
                loading ? <Loader /> : (
                    <FlatList
                        onScrollEndDrag={() => getParticipants()}
                        scrollEventThrottle={16}
                        data={participants}
                        keyExtractor={(item) => item.user_id}
                        renderItem={renderUsers}
                        ListFooterComponent={loading ? <Loader /> : null}
                        ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("events.no_participants")}</Text>}
                        scrollIndicatorInsets={Platform.OS === "ios" ? {
                            right: 1
                        } : undefined}
                    />
                )
            }
        </BottomModal>
    )
}