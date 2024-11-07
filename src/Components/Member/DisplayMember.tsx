import React from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";

import styles from "../../Style/style";
import { Avatar } from "./";
import { useClient, useTheme } from "../Container";
import UserPermissions from "../../Services/Client/Permissions/UserPermissions";
import { formatDistance } from "../../Services";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import { ShrinkEffect } from "../Effects";

type PropsType = {
    informations: userInfo;
    onPress: () => any;
    full_width?: boolean;
}

function DisplayMember({ informations, onPress, full_width = false }: PropsType) {

    const { client } = useClient();
    const { colors } = useTheme();
    const flags = new UserPermissions(informations?.flags);

    return (
        <ShrinkEffect onPress={() => onPress()}>
            <View
                
                style={[
                    styles.row,
                    {
                        backgroundColor: colors.bg_secondary,
                        borderRadius: 12,
                        padding: 10,
                        margin: 5,
                        width: full_width ? "100%" : undefined,
                        justifyContent: "space-between",
                    },
                ]}>
                { /** typeof index !== "undefined" ? <View style={{ backgroundColor: colors.bg_primary, borderRadius: 60, marginRight: 5, width: 30, height: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}><Text>{`${index+1}`}</Text></View> : null */}
                <View style={styles.row}>
                    <Avatar size={33} url={client.user.avatar(informations.user_id, informations.avatar)} />
                    <View>
                        <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{informations.username}</Text>
                        <Text style={{ color: colors.text_muted, fontSize: 13 }}>@{informations.nickname}</Text>
                    </View>
                </View>
                {informations?.distance && <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{`${formatDistance(informations.distance)}Km`}</Text>}
            </View>
        </ShrinkEffect>
    );
}

export default DisplayMember;
