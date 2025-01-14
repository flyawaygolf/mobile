import React from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";
import dayjs from "dayjs";
import styles from "../../Style/style";
import { useTheme } from "../Container";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from "react-i18next";
import { messageFormatDate } from "../../Services";
import UserPermissions from "../../Services/Client/Permissions/UserPermissions";
import { userFlags } from "../../Services/Client";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import { myInformationInterface } from "../../Services/Client/Managers/Interfaces/Me";

dayjs.extend(relativeTime)

type SectionProps = {
    user: userInfo|myInformationInterface,
    created_at?: Date | string,
    lefComponent?: React.ReactNode,
}

export default function Username({ user, created_at, lefComponent }: SectionProps) {

    const { colors } = useTheme();
    const flags = new UserPermissions(user?.flags);
    const { i18n } = useTranslation();

    return (
        <View>
            <View>
                <View style={[styles.row, { marginBottom: 5 }]}>
                    <Text numberOfLines={1} style={{ marginRight: 5 }}>{user?.username}</Text>
                    { user?.is_private && <Icon size={15} source="lock" color={colors.text_normal} /> }
                    { flags.has(userFlags.VERIFIED_USER) && <Icon source="check-decagram" size={15} /> }
                </View>
                <View style={[styles.row, { marginTop: -5 }]}>
                    { created_at && <Text style={{ color: colors.text_muted, fontSize: 13 }}>{`${messageFormatDate(created_at).postDate(i18n.language)}`}</Text> }
                    { lefComponent && lefComponent }
                </View>
            </View>
        </View>
    )
}