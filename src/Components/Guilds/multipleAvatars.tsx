import React from "react";
import { cdnbaseurl } from "../../Services/constante";
import FastImage from "@d11/react-native-fast-image";

export default function MultipleAvatar({ size = 33 }) {

    return (
        <FastImage style={{
            width: size,
            height: size,
            borderRadius: 60 / 2,
            marginRight: 5,
            }} source={{
                uri: `${cdnbaseurl}/guilds_avatars/guilds_1.png`,
            }} />
    )
}
