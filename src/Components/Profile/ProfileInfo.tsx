import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Button, Card, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { handleToast, navigationProps } from "../../Services";
import { Avatar } from "../Member";
import { useClient, useProfile, useTheme } from "../Container";
import { displayHCP } from "../../Services/handicapNumbers";
import { full_width } from "../../Style/style";
import { addGuildList } from "../../Redux/guildList/action";
import Clipboard from "@react-native-clipboard/clipboard";
import { profileInformationsInterface } from "../../Services/Client/Managers/Interfaces/User";

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

    const follow = async () => {
        const response = await client.follows.create(user_info.user_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        setUserInfo({ ...user_info, followed: true })
        handleToast(t("commons.success"))
    }

    const unfollow = async () => {
        const response = await client.follows.delete(user_info.user_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        setUserInfo({ ...user_info, followed: false })
        handleToast(t("commons.success"))
    }

    const createDM = async () => {
        const response = await client.guilds.create([user_info.user_id]);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        dispatch(addGuildList([response.data as any]));
        setTimeout(() => {
            navigation.navigate("MessagesStack", {
                screen: "MessageScreen",
                params: response.data,
            })
        }, 500)
    }
    const copyNickname = () => {
        Clipboard.setString(user_info.nickname);
        handleToast(t("commons.success"));
    }

    return (
        <Animated.View>
            <View style={{ height: 125 }}>
                <View style={[styles.banner_image, { backgroundColor: user_info.accent_color }]} />
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
                </View>
                <View style={{ position: "absolute", right: 5, flexDirection: "row", alignItems: "center" }}>
                    {user.user_id === user_info.user_id ? <Button icon="account-edit" onPress={() => navigation.navigate("ProfileStack", {
                        screen: "ProfileEditScreen"
                    })}>{t("profile.edit")}</Button> : <Button icon="message-text" onPress={() => createDM()}>{t("profile.send_message")}</Button>}
                </View>
            </View>
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
                {user.user_id !== user_info.user_id && <Button mode="contained" icon={user_info.followed ? "account-heart" : "account"} onPress={() => user_info.followed ? unfollow() : follow()} >{t(`profile.${user_info.followed ? "unfollow" : "follow"}`)}</Button>}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    banner_image: {
        width: full_width,
        height: "100%",
        ...StyleSheet.absoluteFillObject,
    },
    column: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center'
    },
});

export default ProfileInfo;