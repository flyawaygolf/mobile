import React from 'react';
import { Alert, Animated, StyleSheet, View } from "react-native";
import { Appbar, IconButton, Text, Tooltip } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Clipboard from "@react-native-clipboard/clipboard";
import { useRealm } from "@realm/react";

import { handleToast, navigationProps } from "../../Services";
import { useClient, useProfile, useTheme } from "../Container";
import { deleteUser } from "../../Services/Realm/userDatabase";
import { getStorageInfo, setStorage, settingsStorageI } from "../../Services/storage";
import { Ithemes } from "../Container/Theme/Themes";

type ProfileHeaderProps = {
    navigation: navigationProps;
    headerOpacity: Animated.AnimatedInterpolation<string | number>;
}

const ProfileHeader = ({ navigation, headerOpacity }: ProfileHeaderProps) => {

    const { user, client, setValue } = useClient();
    const { user_info, setUserInfo } = useProfile();
    const { colors, theme, setTheme } = useTheme();
    const { t } = useTranslation();
    const realm = useRealm();

    const Disconnect = () => {
        Alert.alert(t("settings.logout"), t("settings.sure_logout"), [
            {
                text: t("commons.no"),
                style: "cancel",
            },
            {
                text: t("commons.yes"),
                onPress: async () => {
                    await client.sessions.logout();
                    deleteUser(realm, user.user_id)
                    setValue({ ...client, client: client, token: user.token, user: user, state: "switch_user" })
                },
                style: "default",
            },
        ])
    }

    const copyUserID = () => {
        Clipboard.setString(user_info.user_id);
        handleToast(t("commons.success"))
    }

    const report = async () => {
        Alert.alert(t("profile.report_alert_title", { username: user_info.username }), t("profile.report_alert_description"), [{
            text: t("commons.no"),
            style: "cancel",
        },
        {
            text: t("commons.yes"),
            onPress: async () => {
                const response = await client.user.report(user_info.user_id, 1);
                if (response.error) return handleToast(t(`errors.${response.error.code}`))
                handleToast(t("commons.success"));
            },
            style: "default",
        }])
    }

    const block = async () => {
        Alert.alert(t("profile.block_alert_title", { username: user_info.username }), t("profile.block_alert_description"), [{
            text: t("commons.no"),
            style: "cancel",
        },
        {
            text: t("commons.yes"),
            onPress: async () => {
                const response = await client.block.create(user_info.user_id);
                if (response.error) return handleToast(t(`errors.${response.error.code}`))
                handleToast(t("commons.success"))
            },
            style: "default",
        }])
    }

    const addFavorite = async () => {
        const response = await client.favorites.create(user_info.user_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        setUserInfo({ ...user_info, is_favorite: true })
        handleToast(t("commons.success"))
    };

    const deleteFavorite = async () => {
        const response = await client.favorites.delete(user_info.user_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        setUserInfo({ ...user_info, is_favorite: false })
        handleToast(t("commons.success"))
    }

    const changeStorage = (type: "theme" | "language", txt: Ithemes | string) => {
        const settings = getStorageInfo("settings") as settingsStorageI;

        switch (type) {
            case "theme":
                setStorage("settings", {
                    theme: txt,
                    locale: settings?.locale,
                })
                setTheme(txt as Ithemes)
                break;
            case "language":
                setStorage("settings", {
                    theme: settings?.theme,
                    locale: txt,
                })
                break;
            default:
                break;
        }
    }


    return (
        <View>
            {
                user_info.user_id ? (
                    <>
                        <Appbar.Header style={[styles.header]}>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                                <Animated.View style={{ opacity: headerOpacity, flexDirection: 'column', alignItems: 'flex-start', }}>
                                    <Text style={styles.headerName}>{user_info.username}</Text>
                                    <Text variant="labelSmall" style={{ fontWeight: '700', color: colors.text_muted }}>@{user_info.nickname}</Text>
                                </Animated.View>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                {
                                    user_info.user_id && (
                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                            {
                                                user.user_id !== user_info.user_id && (
                                                    <>
                                                        <Tooltip title={t("profile.favorite")}>
                                                            {
                                                                user_info.is_favorite ? (
                                                                    <IconButton style={{ margin: 0 }} iconColor={colors.color_yellow} icon={"star"} onPress={() => deleteFavorite()} />
                                                                ) : (
                                                                    <IconButton style={{ margin: 0 }} icon={"star-outline"} onPress={() => addFavorite()} />
                                                                )
                                                            }
                                                        </Tooltip>
                                                        <Tooltip title={t("profile.copy_id")}>
                                                            <IconButton style={{ margin: 0 }} icon={"content-copy"} onPress={() => copyUserID()} />
                                                        </Tooltip>
                                                        <Tooltip title={t("profile.block")}>
                                                            <IconButton style={{ margin: 0 }} icon={"block-helper"} onPress={() => block()} />
                                                        </Tooltip>
                                                        <Tooltip title={t("profile.report")}>
                                                            <IconButton style={{ margin: 0 }} icon={"flag-variant"} onPress={() => report()} />
                                                        </Tooltip>
                                                    </>
                                                )
                                            }
                                        </View>
                                    )
                                }
                            </View>
                        </Appbar.Header>
                    </>
                ) : (
                    <Appbar.Header style={[styles.header]}>
                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                            <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                        </View>
                    </Appbar.Header>
                )
            }
        </View>
    )
};


const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileHeader;