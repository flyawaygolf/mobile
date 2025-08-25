import Clipboard from "@react-native-clipboard/clipboard";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share } from "react-native";
import { Button, Divider } from "react-native-paper";
import Toast from 'react-native-toast-message';

import { BottomModal } from "../../../../../Other";
import PostsReportModal from "../../../../../Screens/Reports/PostsReportModal";
import { posturl } from "../../../../../Services/constante";
import { useClient, useTheme } from "../../../../Container";
import { SinglePostContext } from "../../../PostContext";



type SectionProps = {
    modalVisible: boolean,
    setModalVisible: () => any
}

function User({ modalVisible, setModalVisible }: SectionProps) {

    const { t } = useTranslation();
    const { client } = useClient();
    const { info } = useContext(SinglePostContext);
    const { colors } = useTheme();

    const [reportModalVisible, setReportModalVisible] = useState(false);

    const block = async () => {
        const response = await client.block.create(info.from.user_id);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible()
    }

    const copyPostID = () => {
        Clipboard.setString(info.post_id);
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible()
    }

    const onShare = async () => {
        await Share.share({
            message: `${posturl}/${info.post_id}`,
            url: `${posturl}/${info.post_id}`
        });
    }

    return (
        <BottomModal onSwipeComplete={() => setModalVisible()} dismiss={() => setModalVisible()} isVisible={modalVisible}>
            <PostsReportModal visible={reportModalVisible} setVisible={setReportModalVisible} target_id={info.post_id} />
            {
                /**
                 * <Button uppercase onPress={() => download()} icon="download">{t("commons.download")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                 */
            }
            <Button uppercase onPress={() => onShare()} icon="share-variant">{t("posts.share")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => copyPostID()} icon="content-copy">{t("posts.copy_post_id")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => setReportModalVisible(true)} icon="flag-variant">{t("commons.report")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase onPress={() => block()} icon="block-helper">{t("profile.block")}</Button>
            <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
            <Button uppercase textColor={colors.warning_color} onPress={() => setModalVisible()} icon="keyboard-return">{t("commons.cancel")}</Button>
        </BottomModal>
    )
}

export default User;