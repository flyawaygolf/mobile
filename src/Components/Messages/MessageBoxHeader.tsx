import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, View } from "react-native";
import { Appbar, Icon, Text } from "react-native-paper";

import MessagesContext from "../../Contexts/MessagesContext";
import { guildI } from "../../Redux/guildList";
import { navigationProps } from "../../Services";
import { fetchGuildResponseSchema } from "../../Services/Client/Managers/Interfaces/Guild";
import { messageurl } from "../../Services/constante";
import { full_width } from "../../Style/style";
import { useClient, useTheme } from "../Container";
import { ShrinkEffect } from "../Effects";
import { Avatar } from "../Member";

type sectionProps = {
    guild: guildI | fetchGuildResponseSchema;
}

export default function MessageBoxHeader({ guild }: sectionProps) {

    const [members, setMembers] = useState(guild.members)
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();
    const [guildInfo, setGuildInfo] = useState(guild);
    const MessageContext = useContext(MessagesContext);

    useEffect(() => {
        if (MessageContext?.guild) {
            setGuildInfo(MessageContext.guild)
            setMembers(MessageContext.guild.members.filter(u => u.user_id !== user.user_id));
        } else {
            setMembers(members.filter(u => u.user_id !== user.user_id))
        }
    }, [guild])

    const onShare = async () => {
        await Share.share({
            message: `${messageurl}/${guildInfo.guild_id}`,
            url: `${messageurl}/${guildInfo.guild_id}`
        });
    }

    useEffect(() => {
        if (MessageContext && MessageContext.guild) {
            setGuildInfo(MessageContext.guild);
            setMembers(MessageContext.guild.members.filter(u => u.user_id !== user.user_id));
        }
    }, [MessageContext]);

    return (
        <Appbar.Header style={{ width: full_width, flexDirection: "row", alignContent: "center", justifyContent: "space-between", borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1, minWidth: 0 }}>
                <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                <ShrinkEffect
                    onPress={() =>
                        guildInfo.type === 0 ? navigation.navigate('ProfileStack', { screen: "ProfileScreen", params: { nickname: members[0].nickname } })
                            : guildInfo.type === 1 ? undefined
                                : guildInfo.type === 2 && guildInfo.event_id ? navigation.navigate('EventStack', { screen: "DisplayEventScreen", params: { event_id: guildInfo.event_id } }) : undefined}
                    style={{ flexDirection: "row", alignItems: "center", maxWidth: "65%" }}>
                    {
                        guildInfo.type === 0 && <Avatar url={client.user.avatar(members[0].user_id, members[0].avatar)} />
                    }
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {
                            guildInfo.type === 0 ? (
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700' }} numberOfLines={1} ellipsizeMode="tail">{`${members[0].username}`}</Text>
                                    <Icon source="chevron-right" size={22} color={colors.text_normal} />
                                </View>
                            ) : (
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '700' }} numberOfLines={1} ellipsizeMode="tail">{`${guildInfo.guild_name}`}</Text>
                                    <Text style={{ color: colors.text_muted, fontSize: 14 }} numberOfLines={1} ellipsizeMode="tail">{t("commons.you")}, {members.slice(0, 3).map((member) => member.username).join(", ")}</Text>
                                </View>
                            )
                        }
                    </View>
                </ShrinkEffect>
            </View>
            <View style={{ flexDirection: "row", flexShrink: 0 }}>
                <Appbar.Action icon="cog" onPress={() => navigation.navigate('MessagesStack', { screen: "GuildSettingsScreen", params: { guild: guild } })} />
                <Appbar.Action icon="share-variant" onPress={() => onShare()} />
            </View>
        </Appbar.Header>
    )
}
