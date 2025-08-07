import Clipboard from "@react-native-clipboard/clipboard";
import React, { Dispatch, SetStateAction } from "react";
import { Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useClient, useTheme } from "../../Container";
import { BottomModal, ModalSection } from "../../../Other";
import { handleToast } from "../../../Services";
import { MessageBubbleInfoProps } from "../MessageBubble";

function MessageBox({ info, modalVisible, setModalVisible }: {
    info: MessageBubbleInfoProps;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    modalVisible: boolean;
}) {

    const { client } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();

    const reportMessage = async () => {
        await client.messages.report(info.channel_id, 0);
        handleToast(t("commons.success"));
    }

    const copyText = (text: string) => {
        Clipboard.setString(text);
        handleToast(t("commons.success"));
    }

    return (
        <BottomModal onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)} isVisible={modalVisible}>
            {
                /**
                 *             <ModalSection onPress={() => copyText(info.id)}>
                <>
                    <SvgElement name="copy" margin={5} size={22} />
                    <Text>{t("messages.copy_id")}</Text>
                </>
            </ModalSection>
                 */
            }
            <ModalSection onPress={() => copyText(info.content)}>
                <>
                    <Icon source="content-copy" size={22} />
                    <Text>{t("messages.copy_message")}</Text>
                </>
            </ModalSection>
            <ModalSection onPress={() => reportMessage()}>
                <>
                    <Icon source="cancel" size={22} />
                    <Text>{t("messages.report_message")}</Text>
                </>
            </ModalSection>
            <ModalSection noDivider onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
            </ModalSection>
        </BottomModal>
    )
}

export default MessageBox;
