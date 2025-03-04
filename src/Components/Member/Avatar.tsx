import React from "react";

import { useTheme } from "../Container";
import { StyleProp, Image, ImageStyle } from "react-native";

type PropsType = {
    url: string;
    size?: number;
    marginRight?: number;
    marginLeft?: number;
    radius?: number;
    style?: StyleProp<ImageStyle>;
    rounded?: boolean;
}

export default function Avatar({ url, size = 33, marginRight = 5, marginLeft = 0, style, rounded = true, radius }: PropsType) {

    const { colors } = useTheme();

    return (
        <Image src={url} style={[{
            width: size,
            height: size,
            borderRadius: radius ? radius : rounded ? size / 2 : undefined,
            marginRight: marginRight,
            marginLeft: marginLeft,
            resizeMode: "cover",
            backgroundColor: colors.bg_secondary,
        }, style]} source={{
            cache: "force-cache",
            uri: url,
        }} />
    )
}
