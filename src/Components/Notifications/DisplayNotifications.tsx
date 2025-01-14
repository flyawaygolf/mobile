import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from '@react-navigation/native';
import { useClient, useTheme } from "../Container";
import { Username, Avatar } from "../Member";
import styles from "../../Style/style";
import { navigationProps } from "../../Services";
import { Icon, IconButton } from "react-native-paper";
import { NotificationInterface } from "../../Services/Client/Managers/Interfaces";
import { notificationTypeInterface } from "../../Services/Client/Managers/Interfaces/Global";
import { Markdown } from "../Text";

type sectionProps = {
    info: NotificationInterface.notificationFetchResponseSchema;
    readOneNotification: (notification_id: string) => Promise<void>;
}

const DisplayNotifications = ({ info, readOneNotification }: sectionProps) => {

    const { client, token } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();

    const svgName = (type: notificationTypeInterface) => {
        switch (type) {
            case "likes":
                return "heart"
            case "mentions":
                return "at"
            case "shares":
                return "share"
            case "follows":
                return "account-plus"
            case "comments":
                return "comment"
            case "events":
                return "calendar-month"
            default:
                return ""
        }
    }

    const navigateScreen = async (notification_type: notificationTypeInterface) => {
        if (!navigation) return;
        await readOneNotification(info.notification_id)
        switch (notification_type) {
            case "follows":
                return navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: info.from.nickname } })
            case "likes":
                return navigation.navigate("PostsStack", { screen: "PostScreen", params: { post_id: info?.post?.post_id } })
            case "mentions":
                return navigation.navigate("PostsStack", { screen: "PostScreen", params: { post_id: info?.post?.post_id } })
            case "comments":
                return navigation.navigate("PostsStack", { screen: "PostScreen", params: { post_id: info?.post?.post_id } })
            case "shares":
                return navigation.navigate("PostsStack", { screen: "PostScreen", params: { post_id: info?.post?.post_id } })
            /*case "events":
                return navigation.navigate("EventsStack", { screen: "EventScreen", params: { event_id: info?.event.event_id }})*/
            default:
                return ""
        }
    }

    const displayedText = () => {
        const user = info.from;
        const golf_info = info.event?.golf_info;
        const post_info = info.post;
        switch (info.notification_type) {
            case "follows":
                return t("notification.follows", { username: user.username });
            case "likes":
                return t("notification.like", { username: user.username, post: post_info?.content ?? "..." });
            case "comments":
                return t("notification.comment", { username: user.username, post: post_info?.content ?? "..." });
            case "shares":
                return t("notification.share", { username: user.username, post: post_info?.content ?? "..." });
            case "mentions":
                return t("notification.mention", { username: user.username, post: post_info?.content ?? "..." });
            case "events":
                return t("notification.event", { username: user.username, event: golf_info?.name ?? "..." });
            default:
                return ""
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigateScreen(info?.notification_type ?? "none")}>
            <View style={{
                padding: 5,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                borderBottomColor: colors.bg_secondary,
                backgroundColor: info?.read ? undefined : colors.bg_secondary,
                borderBottomWidth: 1
            }}>
                <View style={[styles.row, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                    <View style={{ position: "relative" }}>
                        <Avatar size={40} url={client.user.avatar(info?.from?.user_id, info?.from?.avatar)} />
                        <View style={{ bottom: -10, right: 0, width: 25, height: 25, position: "absolute", backgroundColor: colors.badge_color, borderRadius: 60 / 2, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Icon source={svgName(info.notification_type)} size={13} />
                        </View>
                    </View>
                    <Username user={info?.from} created_at={info?.created_at} />
                </View>
                <View style={{ paddingLeft: 5 }}>
                    <Markdown token={token} maxLine={3} content={displayedText()} />
                </View>
            </View>
        </TouchableOpacity>
    )

}

export default DisplayNotifications;