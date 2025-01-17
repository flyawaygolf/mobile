import React from "react";

import { StyleProp, ViewStyle } from "react-native";
import { Avatar } from "react-native-paper";

type PropsType = {
    label: string;
    size?: number;
    marginRight?: number;
    marginLeft?: number;
    style?: StyleProp<ViewStyle>;
}

export default function GolfsAvatar({ label, size = 33, marginRight = 5, marginLeft = 0, style }: PropsType) {

    return (
        <Avatar.Text label={label} size={size} style={[{
            marginRight: marginRight,
            marginLeft: marginLeft,
        }, style]} />
    )
}
