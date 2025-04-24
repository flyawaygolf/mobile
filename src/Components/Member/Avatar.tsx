import React from "react";

import { useTheme } from "../Container";
import { StyleProp } from "react-native";
import FastImage, { ImageStyle } from "@d11/react-native-fast-image";

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
        <FastImage
            onError={() => console.log("error loading avatar")}
            resizeMode="cover"
            style={[{
                width: size,
                height: size,
                borderRadius: radius ? radius : rounded ? size / 2 : undefined,
                marginRight: marginRight,
                marginLeft: marginLeft,
                backgroundColor: colors.bg_secondary,
            }, style]} source={{
                uri: url,
                priority: FastImage.priority.normal,
            }} />
    )
}
