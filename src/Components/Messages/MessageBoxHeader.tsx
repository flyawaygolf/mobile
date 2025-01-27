import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { Avatar } from "../Member";
import { full_width } from "../../Style/style";
import { useClient, useTheme } from "../Container";
import { guildI } from "../../Redux/guildList";
import { navigationProps } from "../../Services";
import { ShrinkEffect } from "../Effects";

type sectionProps = {
    params: guildI;
}

export default function MessageBoxHeader({ params }: sectionProps) {

    const [users, setUsers] = useState(params.users)
    const { colors } = useTheme();
    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();

    useEffect(() => {
        setUsers(users.filter(u => u.user_id !== user.user_id))
    }, [params])

    return (
        <Appbar.Header style={{ width: full_width, flexDirection: "row", alignContent: "center", borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
            <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
            <ShrinkEffect
                onPress={() =>
                    params.type === 0 ? navigation.navigate('ProfileStack', { screen: "ProfileScreen", params: { nickname: users[0].nickname } })
                        : params.type === 1 ? undefined
                            : params.type === 2 && params.event_id ? navigation.navigate('EventStack', { screen: "DisplayEventScreen", params: { event_id: params.event_id } }) : undefined}
                style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar url={client.user.avatar(users[0]?.user_id, users[0]?.avatar)} />
                <View>
                    {params.title ? <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{`${params.title}`}</Text> : params.type === 1 ? <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{users[0].username}</Text> : <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{`${users.map(u => u.username).join(", ")}`}</Text>}
                    {params.type === 0 && <Text style={{ fontSize: 12, fontWeight: '700', marginLeft: 5 }}>{`@${users[0].nickname}`}</Text>}
                </View>
            </ShrinkEffect>
        </Appbar.Header>
    )
}
