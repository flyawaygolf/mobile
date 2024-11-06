import React from "react";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "react-native-paper";
import { useTheme } from "../../Container";
import { full_width } from "../../../Style/style";

type SectionProps = {
    t?: string | any,
    onPress?: Function,
    icon?: string;
    disable?: boolean;
}

function SettingsButtons({ t, onPress, icon, disable }: SectionProps) {

    const { colors } = useTheme();

    return (
        <TouchableOpacity style={{
            width: full_width,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 40,
            marginTop: 5,
            borderBottomColor: colors.bg_primary,
            borderBottomWidth: 1,
        }} onPress={() => onPress ? onPress() : null }>
            <Text style={{ textDecorationLine: disable ? "line-through" : undefined }}>{t ?? "Undefined"}</Text>
            <Button textColor={colors.fa_primary} icon={icon ?? "arrow-right-thick"} mode="text" onPress={() => onPress ? onPress() : null}> </Button>
        </TouchableOpacity>
    )
}

export default SettingsButtons;
