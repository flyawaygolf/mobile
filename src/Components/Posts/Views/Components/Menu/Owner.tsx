import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import Clipboard from "@react-native-clipboard/clipboard";
import { Button, Dialog, Divider, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { BottomModal } from "../../../../../Other";
import { useClient, useTheme } from "../../../../Container";
import { deleteProfileTrends } from "../../../../../Redux/profileFeed/action";
import { deleteMainTrends } from "../../../../../Redux/mainFeed/action";
import { navigationProps } from "../../../../../Services/navigationProps";
import { posturl } from "../../../../../Services/constante";
import { Share } from "react-native";

type SectionProps = {
    modalVisible: boolean,
    setModalVisible: (bool: boolean) => any,
    pined?: string,
    post_id: string;
}

function Owner({ modalVisible, setModalVisible, pined, post_id }: SectionProps) {

    const { t } = useTranslation();
    const { client } = useClient();
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const deletePost = async () => {
        setLoading(true)
        const currentScreen = navigation.getState().routes[0].name;
        const response = await client.posts.delete(post_id);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        if (currentScreen === "PostScreen" as string) {
            if (navigation.canGoBack()) return navigation.goBack();
        } else if (currentScreen === "ProfileScreen" as string) {
            dispatch(deleteProfileTrends(post_id));
        } else if (currentScreen === "HomeScreen" as string) {
            dispatch(deleteMainTrends(post_id));
        }
        setLoading(false)
        setVisible(false)
        setModalVisible(false);
    }

    const pinPost = async () => {
        const response = await client.posts.pin(post_id);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const unPinPost = async () => {
        const response = await client.posts.unPin(post_id);
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string })
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const copyPostID = () => {
        Clipboard.setString(post_id);
        Toast.show({ text1: t("commons.success") as string })
        setModalVisible(false)
    }

    const onShare = async () => {
        await Share.share({
            message: `${posturl}/${post_id}`,
            url: `${posturl}/${post_id}`
        });
    }

    return (
        <>
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>{t("posts.delete")}</Dialog.Title>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setModalVisible(true)
                            setVisible(false)
                        }}>{t("commons.cancel")}</Button>
                        <Button loading={loading} onPress={() => deletePost()}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <BottomModal onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)} isVisible={modalVisible}>
                <Button uppercase onPress={() => onShare()} icon="share-variant">{t("posts.share")}</Button>
                <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                <Button uppercase onPress={() => copyPostID()} icon="content-copy">{t("posts.copy_post_id")}</Button>
                <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                <Button uppercase onPress={() => {
                    setVisible(true)
                    setModalVisible(false)
                }} icon="trash-can-outline">{t("posts.delete")}</Button>
                <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                {pined && pined === post_id && <Button uppercase onPress={() => unPinPost()} icon="pin-off-outline">{t("posts.unpin")}</Button>}
                {!pined || pined !== post_id ? <Button uppercase onPress={() => pinPost()} icon="pin-outline">{t("posts.pin")}</Button> : null}
                <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                <Button uppercase textColor={colors.warning_color} onPress={() => setModalVisible(false)} icon="keyboard-return">{t("commons.cancel")}</Button>
            </BottomModal>
        </>
    )
}

export default Owner;