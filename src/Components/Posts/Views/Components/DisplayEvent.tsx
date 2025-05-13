import React from "react";
import { Text, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { View } from "react-native";
import { navigationProps } from "../../../../Services";
import { postEventInterface } from "../../../../Services/Client/Managers/Interfaces/Events";
import { ShrinkEffect } from "../../../Effects";
import { useTheme } from "../../../Container";

type displayEmbedType = {
    event: postEventInterface
}

export default function DisplayEvent({ event }: displayEmbedType) {
    const navigation = useNavigation<navigationProps>();
    const { colors } = useTheme();

    return (
        <View style={{ alignItems: "center", justifyContent: "center", paddingLeft: 10, paddingRight: 10}}>
            <ShrinkEffect
                onPress={() => event.deleted ? null : navigation.navigate("EventStack", { screen: "DisplayEventScreen", params: { event_id: event.event_id } })}
                style={{
                    width: "100%",
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10
                }}>
                <View style={{ padding: 10, flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 10, gap: 5 }}>
                        <Icon source="calendar-month" size={20} />
                        <Text variant="labelMedium">{dayjs(event.start_date).format("dddd, LL")}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 10, gap: 5 }}>
                        <Icon source="clock" size={20} />
                        <Text variant="labelMedium">{dayjs(event.start_date).format("LT")} Tee Time</Text>
                    </View>
                </View>
            </ShrinkEffect>
        </View>

    )
}