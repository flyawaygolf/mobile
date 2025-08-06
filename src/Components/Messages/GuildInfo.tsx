import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { Text, Badge, Card, Icon } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { full_width } from "../../Style/style";
import { useClient, useTheme } from "../Container";
import { Avatar } from "../Member";
import { BottomModal, ModalSection } from "../../Other";
import { MultipleAvatar } from "../Guilds";
import { connect, useDispatch } from "react-redux";
import { RootState } from "../../Redux";
import { deleteGuildList } from "../../Redux/guildList/action";
import { guildI } from "../../Redux/guildList";
import { handleToast, navigationProps } from "../../Services";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";

type sectionProps = {
    info: guildI;
}

function GuildInfo({ info }: sectionProps) {

    const { client, user } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<navigationProps>();
    const [users, setUsers] = useState<userInfo[]>(info.users)

    const leaveGroup = async () => {
        await client.guilds.leave(info.guild_id);
        dispatch(deleteGuildList(info.guild_id));
        setModalVisible(false)
    }

        const leaveGroupAlert = () => {
            Alert.alert(
                t("messages.leave_conversation"),
                t("messages.leave_conversation_confirmation"),
                [
                    {
                        text: t("commons.cancel"),
                        style: "cancel",
                    },
                    {
                        text: t("commons.leave"),
                        onPress: () => leaveGroup(),
                        style: "destructive",
                    },
                ],
                { cancelable: true }
            );
        }

    const copyText = (text: string) => {
        Clipboard.setString(text);
        handleToast(t(`commons.success`))
    }

    useEffect(() => {
        setUsers(info.users.filter(u => u.user_id !== user.user_id))
    }, [info])

    return (
        <View>
            <BottomModal onSwipeComplete={() => setModalVisible(false)} dismiss={() => setModalVisible(false)} isVisible={modalVisible}>
                <ModalSection onPress={() => copyText(info.guild_id)}>
                    <Icon source="content-copy" size={22} />
                    <Text>{t("messages.copy_id")}</Text>
                </ModalSection>
                <ModalSection onPress={() => leaveGroupAlert()}>
                    <Icon source="exit-to-app" size={22} />
                    <Text>{t("messages.leave_conversation")}</Text>
                </ModalSection>
                <ModalSection noDivider onPress={() => setModalVisible(false)} >
                    <Text style={{ color: colors.warning_color }}>{t("commons.cancel")}</Text>
                </ModalSection>
            </BottomModal>
            <Card mode="contained" style={{
                margin: 10,
                backgroundColor: info.unread ? colors.bg_third : colors.bg_secondary,
                padding: 5, borderRadius: 5, marginBottom: 5,
            }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("MessagesStack", {
                        screen: "MessageScreen",
                        params: {
                            guild: info,
                        },
                    })}
                    onLongPress={() => setModalVisible(true)}>
                    <View style={{ flexDirection: "row", alignItems: "center", width: full_width, position: "relative" }}>
                        {info.unread && <Badge style={{ position: "absolute", top: 2, left: -2, zIndex: 2 }} size={10} />}
                        {info.type === 2 ? <Avatar url={client.user.avatar(users[0]?.user_id, users[0]?.avatar)} /> : users.length > 1 ? <MultipleAvatar /> : <Avatar url={client.user.avatar(users[0]?.user_id, users[0]?.avatar)} />}
                        <View style={{ width: "70%", position: "relative" }}>
                            { info.title ? <Text numberOfLines={1} textBreakStrategy="balanced">{info.title}</Text> : <Text numberOfLines={1} textBreakStrategy="balanced">{users.map(u => u.username).join(", ")}</Text> }
                            {
                                info.last_message && (
                                    <Text
                                        style={{
                                            color: colors.text_muted,
                                        }}
                                        numberOfLines={1}
                                        textBreakStrategy="balanced">{info?.last_message?.content.substring(0, 100)}</Text>
                                )
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </Card>
        </View>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        guildListFeed: state.guildListFeed,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GuildInfo);
