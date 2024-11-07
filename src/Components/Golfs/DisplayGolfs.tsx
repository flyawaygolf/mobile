import React from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";

import styles from "../../Style/style";
import { GolfsAvatar } from ".";
import { useTheme } from "../Container";
import { formatDistance } from "../../Services";
import { ShrinkEffect } from "../Effects";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Search";

type PropsType = {
    informations: golfInterface;
    onPress: () => any;
    full_width?: boolean;
}

function DisplayGolfs({ informations, onPress, full_width = false }: PropsType) {

    const { colors } = useTheme();

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
                    <GolfsAvatar size={33} label={informations.name} />
                    <View>
                        <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{informations.name}</Text>
                        <Text style={{ color: colors.text_muted, fontSize: 13 }}>{informations.city} - {informations.country}</Text>
                    </View>
                </View>
                {informations?.distance && <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{`${formatDistance(informations.distance)}Km`}</Text>}

            </View>
        </ShrinkEffect>
    );
}

export default DisplayGolfs;
