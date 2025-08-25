import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Icon } from "react-native-paper";
import { Text } from "react-native-paper";

import { full_width } from "../../../Style/style";
import { useTheme } from "../../Container";

type SectionProps = {
    t?: string | any,
    onPress?: Function,
    icon?: string;
    disable?: boolean;
    leftIcon?: string;
}

function SettingsButtons({ t, onPress, icon, leftIcon, disable }: SectionProps) {

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
        }} onPress={() => onPress ? onPress() : null}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                {
                    leftIcon && <Icon source={leftIcon} color={colors.fa_primary} size={20} />
                }
                <Text style={{ textDecorationLine: disable ? "line-through" : undefined }}>{t ?? "Undefined"}</Text>
            </View>
            <Button textColor={colors.fa_primary} icon={icon ?? "arrow-right-thick"} mode="text" onPress={() => onPress ? onPress() : null}> </Button>
        </TouchableOpacity>
    )
}

export default SettingsButtons;
