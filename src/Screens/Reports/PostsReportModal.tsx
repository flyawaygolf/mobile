import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button, Divider, RadioButton, Text } from "react-native-paper";

import { useClient, useTheme } from "../../Components/Container";
import { BottomModal } from "../../Other";
import { handleToast } from "../../Services";
import { ReportReason } from "../../Services/reports";


type PostsReportModalProps = {
    target_id: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

export default function PostsReportModal({ target_id, visible, setVisible }: PostsReportModalProps) {
    const { t } = useTranslation();
    const { client } = useClient();
    const { colors } = useTheme();
    const [value, setValue] = useState("0");

    const reasons = [
        ReportReason.NSFW_NOT_MARKED,
        ReportReason.COPYRIGHT_INFRINGEMENT,
        ReportReason.MISINFORMATION,
        ReportReason.POLITICAL_CONTENT,
        ReportReason.COMMERCIAL_SPAM,
        ReportReason.SCAM_FRAUD,
        ReportReason.SELF_HARM,
        ReportReason.VIOLENCE_THREATS,
        ReportReason.ILLEGAL_CONTENT,
        ReportReason.OTHER
    ]

    const report = async () => {
        const reason = parseInt(value);

        const response = await client.posts.report(target_id, reason);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        handleToast(t("commons.success"));
        setVisible(false);
    }

    return (
        <BottomModal isVisible={visible} onSwipeComplete={() => setVisible(false)} dismiss={() => setVisible(false)}>
            <ScrollView>
                <View style={{ alignItems: 'flex-start', marginLeft: 15, marginBottom: 5 }}>
                    <Text variant="titleLarge">{t("reports.title")}</Text>
                    <Text variant="titleMedium">{t("reports.select_reason")}</Text>
                </View>
                <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                    {reasons.map((value, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                            <RadioButton.Android value={value.toString()} />
                            <Text style={{ marginLeft: 8 }}>{t(`reports.${value}`)}</Text>
                            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                        </View>
                    ))}
                </RadioButton.Group>

                <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                <Button mode="contained" onPress={() => report()} icon="receipt-text-send">{t("reports.send_report")}</Button>
                <Button uppercase textColor={colors.warning_color} onPress={() => setVisible(false)} icon="keyboard-return">{t("commons.cancel")}</Button>
            </ScrollView>
        </BottomModal>
    )


}