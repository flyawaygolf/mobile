import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-paper";
import { Text } from "react-native-paper";

import { full_width } from "../../../Style/style";
import { useTheme } from "../../Container";

type SectionProps = {
    title: string,
    description: string,
    onPress?: Function,
    soon?: boolean;
    disable?: boolean;
    leftIcon?: string;
    colors: {
        background: string;
        tint: string;
    };
}

function PremiumButtons({ title, description, soon, leftIcon, disable, colors: color }: SectionProps) {

    const { colors } = useTheme();

    return (
        <View style={{
            width: full_width,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 5,
            borderBottomColor: colors.bg_primary,
            borderBottomWidth: 1,
        }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                {
                    leftIcon && (
                        <View style={{ position: 'relative' }}>
                            <View style={{ backgroundColor: color.background, padding: 5, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <Icon source={leftIcon} color={color.tint} size={20} />
                            </View>
                            {
                                soon && <View style={{
                                    position: 'absolute',
                                    right: -8,
                                    top: 0,
                                    backgroundColor: colors.fa_primary,
                                    paddingHorizontal: 4,
                                    paddingVertical: 2,
                                    borderRadius: 3,
                                    transform: [{ rotate: '45deg' }]
                                }}>
                                    <Text style={{ fontSize: 8, color: '#fff' }}>Soon</Text>
                                </View>
                            }
                        </View>
                    )
                }
                <View style={{ display: "flex", flexDirection: "column", flexWrap: "nowrap", width: "80%" }}>
                    <Text style={{ textDecorationLine: disable ? "line-through" : undefined }}>{title}</Text>
                    <Text style={{ color: colors.text_muted, textDecorationLine: disable ? "line-through" : undefined }}>{description}</Text>
                </View>
            </View>
            { /** <Button textColor={colors.fa_primary} icon={icon ?? "arrow-right-thick"} mode="text" onPress={() => onPress ? onPress() : null}> </Button> */}
        </View>
    )
}

export default PremiumButtons;
