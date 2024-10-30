import React from "react";
import { useTranslation } from "react-i18next";
import { Icon, IconButton, Text } from "react-native-paper";
import { View } from "react-native";
import { fetchSessionsResponseSchema } from "../../../Services/Client/Managers/Interfaces/Session";
import { useTheme } from "../../Container";
import { messageFormatDate } from "../../../Services";

type sectionProps = { 
    item: fetchSessionsResponseSchema, 
    session_id: string, 
    onPress: () => any
}

function SessionBox({ item, session_id, onPress }: sectionProps) {

    const { colors } = useTheme();
    const { i18n } = useTranslation();

    const deviceIcon = (name: string) => {

        if(name.match(/android/gi)) {
            return "android"
        } else if(name.match(/apple/gi) || name.match(/ios/gi)) {
            return "apple"
        } else if(name.match(/edge/gi)) {
            return "microsoft-edge"
        } else if(name.match(/chrome/gi)) {
            return "google-chrome"
        } else {
            return "devices"
        }
    }
    
    return (
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderColor: colors.text_normal, borderWidth: 1, padding: 5, borderRadius: 60 / 2 }}>
                <Icon size={22} source={deviceIcon(item?.device_name ?? "")} />
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-start", padding: 5, paddingLeft: 10, justifyContent: "flex-start", width: `80%` }}>
                <Text style={{ flex: 1, flexWrap: 'wrap' }} >{`${item.device_name}`}</Text>
                <Text>{`${item.from?.city}, ${item.from?.country}`}</Text>
                <Text>{`${messageFormatDate(item.created_at).fromNow(i18n.language)}`}</Text>
            </View>
            { session_id !== item.session_id && <IconButton onPress={() => onPress()} size={22} icon={"close-circle"} /> }
        </View>
    )
}

export default SessionBox;