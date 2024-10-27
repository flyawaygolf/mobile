import React from "react";

import { useTheme } from "../Container";
import { StyleProp, Image, ImageStyle, View } from "react-native";

type PropsType = {
    url: string;
    size?: number;
    marginRight?: number;
    marginLeft?: number;
    radius?: number;
    style?: StyleProp<ImageStyle>;
}

export default function Avatar({ url, size = 33, marginRight = 5, marginLeft = 0, style }: PropsType) {

    const { colors } = useTheme();

    return (
        <Image src={url} style={[{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginRight: marginRight,
            marginLeft: marginLeft,
            resizeMode: "cover",
            backgroundColor: colors.bg_secondary
        }, style]} source={{
            cache: "force-cache",
            uri: url
        }} />
    )
}