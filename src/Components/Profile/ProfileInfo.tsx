import React, { useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Button, Card, Divider, Icon, IconButton, List, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Clipboard from "@react-native-clipboard/clipboard";
import { handleToast, navigationProps } from "../../Services";
import { Avatar } from "../Member";
import { useClient, useProfile, useTheme } from "../Container";
import { displayHCP } from "../../Services/handicapNumbers";
import { addGuildList } from "../../Redux/guildList/action";
import { profileInformationsInterface } from "../../Services/Client/Managers/Interfaces/User";
import { userFlags } from '../../Services/Client';
import { ShrinkEffect } from '../Effects';
import FastImage from '@d11/react-native-fast-image';
import ShowAvailability from '../Premium/ShowAvalability';
import { availabilityDefault, premiumAdvantages } from '../../Services/premiumAdvantages';

type ProfileInfoProps = {
    navigation: navigationProps;
    setUserInfo: React.Dispatch<React.SetStateAction<profileInformationsInterface>>;
}

const ProfileInfo = ({ navigation, setUserInfo }: ProfileInfoProps) => {

    const { client, user } = useClient();
    const { user_info } = useProfile();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [flags] = useState(client.user.flags(user_info.flags.toString()));
    const [showDetails, setShowDetails] = useState(true);
    const [schedule] = useState(user_info.premium_settings?.availability || availabilityDefault);

    const follow = async () => {
        const response = await client.follows.create(user_info.user_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        setUserInfo({ ...user_info, followed: true, subscribers: user_info.subscribers + 1 })
        handleToast(t("commons.success"))
    }

    const unfollow = async () => {
        const response = await client.follows.delete(user_info.user_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        setUserInfo({ ...user_info, followed: false, subscribers: user_info.subscribers - 1 })
        handleToast(t("commons.success"))
    }

    const createDM = async () => {
        const response = await client.guilds.create([user_info.user_id]);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        if (!response.data) return handleToast(t("commons.app_error"));
        dispatch(addGuildList([response.data]));
        setTimeout(() => {
            navigation.navigate("MessagesStack", {
                screen: "MessageScreen",
                params: {
                    guild: response.data
                },
            })
        }, 500)
    }

    const copyNickname = () => {
        Clipboard.setString(user_info.nickname);
        handleToast(t("commons.success"));
    }

    const showBadgeName = (badge: string) => {
        handleToast(t(`badges.${badge}`));
    }

    return (
        <Animated.View>
            <View style={{ height: 125 }}>
                <View style={[styles.banner_image]}>
                    {
                        user_info.banner ? <FastImage style={[styles.banner_image, { backgroundColor: user_info.accent_color }]} source={{ uri: `${client.user.banner(user_info.user_id, user_info.banner)}` }} /> : <View style={[styles.banner_image, { backgroundColor: user_info.accent_color }]} />
                    }
                </View>
            </View>
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                    <Avatar
                        size={80}
                        style={{
                            borderRadius: 80 / 2,
                            borderColor: colors.bg_primary,
                            borderWidth: 3,
                            marginTop: -40,
                            marginLeft: 10,
                            backgroundColor: colors.bg_secondary,
                        }}
                        url={`${client.user.avatar(user_info.user_id, user_info.avatar)}`}
                    />
                    <Badge size={20} style={{ marginLeft: -30 }}>{displayHCP(user_info.golf_info.handicap)}</Badge>
                    <View style={{ marginLeft: 10, marginTop: 5, flexDirection: "row", alignItems: "center", gap: 5 }}>
                        {flags.has(userFlags.FLYAWAY_EMPLOYEE) && <ShrinkEffect onPress={() => showBadgeName("FLYAWAY_EMPLOYEE")}><Text><Icon source="shield-check" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {flags.has(userFlags.EARLY_SUPPORTER) && <ShrinkEffect onPress={() => showBadgeName("EARLY_SUPPORTER")}><Text><Icon source="account-star" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {user_info.premium_type > 0 && <ShrinkEffect onPress={() => showBadgeName("PREMIUM_USER")}><Text><Icon source="star-shooting" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {flags.has(userFlags.VERIFIED_USER) && <ShrinkEffect onPress={() => showBadgeName("VERIFIED_USER")}><Text><Icon source="check-decagram" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {flags.has(userFlags.FLYAWAY_PARTNER) && <ShrinkEffect onPress={() => showBadgeName("FLYAWAY_PARTNER")}><Text><Icon source="infinity" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                    </View>
                </View>
                <View style={{ position: "absolute", right: 5, flexDirection: "row", alignItems: "center" }}>
                    {user.user_id === user_info.user_id ? <Button icon="account-edit" onPress={() => navigation.navigate("ProfileStack", {
                        screen: "ProfileEditScreen"
                    })}>{t("profile.edit")}</Button> : <Button icon="message-text" onPress={() => createDM()}>{t("profile.send_message")}</Button>}
                </View>
            </View>
            <List.Accordion expanded={showDetails} onPress={() => setShowDetails(!showDetails)} title={t("profile.details")} id="1">
                <Card style={{ margin: 5 }} mode="contained">
                    <Card.Title
                        titleStyle={{
                            fontWeight: 800,
                        }}
                        subtitleStyle={{
                            fontWeight: 500,
                        }}
                        left={() => <IconButton mode="contained" icon="content-copy" onPress={() => copyNickname()} />}
                        titleVariant="titleLarge"
                        subtitleVariant="labelLarge"
                        title={user_info.username}
                        subtitle={`@${user_info.nickname}`}
                    />

                </Card>
                <Card style={{ margin: 5 }} mode="contained">
                    <Card.Content>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={{ fontWeight: '900' }}>{t("profile.description")}</Text>
                            <Text>{user_info.description}</Text>
                        </View>
                    </Card.Content>
                </Card>
                {
                    premiumAdvantages(user_info.premium_type, user_info.flags).showAvailability() && user_info.premium_settings?.show_availability && (
                        <Card style={{ margin: 5 }} mode="contained">
                            <Card.Content>
                                <Text variant="titleMedium">{t("premium.availability_title")}</Text>
                                <ShowAvailability schedule={schedule} />
                            </Card.Content>
                        </Card>
                    )
                }
            </List.Accordion>
            {!showDetails && <Divider horizontalInset style={{ marginBottom: 10 }} />}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10 }}>
                <TouchableOpacity style={[styles.column, { alignItems: "center" }]} onPress={() => navigation.navigate("ProfileStack", { screen: "ProfileFollower", params: { type: "subscriptions", nickname: user_info.nickname } })}>
                    <Text variant="bodyLarge" style={{ fontWeight: "900" }}>{user_info.subscriptions}</Text>
                    <Text variant="bodySmall" style={{ color: colors.text_normal_hover }}>{t("profile.subscriptions")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.column, { alignItems: "center" }]} onPress={() => navigation.navigate("ProfileStack", { screen: "ProfileFollower", params: { type: "subscribers", nickname: user_info.nickname } })}>
                    <Text variant="bodyLarge" style={{ fontWeight: "900" }}>{user_info.subscribers}</Text>
                    <Text variant="bodySmall" style={{ color: colors.text_normal_hover }}>{t("profile.subscribers")}</Text>
                </TouchableOpacity>
                <View style={[styles.column, { alignItems: "center" }]}>
                    <Text variant="bodyMedium" style={{ textTransform: "capitalize", fontWeight: "900" }}>{user_info.total_posts}</Text>
                    <Text variant="bodySmall" style={{ color: colors.text_normal_hover }}>{t("profile.posts")}</Text>
                </View>
            </View>
            <View style={{ margin: 5 }}>
                {user.user_id !== user_info.user_id && <Button mode="contained" icon={user_info.followed ? "account-heart" : "account-plus"} onPress={() => user_info.followed ? unfollow() : follow()} >{t(`profile.${user_info.followed ? "unfollow" : "follow"}`)}</Button>}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    banner_image: {
        width: "100%",
        height: '100%',
        ...StyleSheet.absoluteFillObject,
    },
    column: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center'
    },
});

export default ProfileInfo;