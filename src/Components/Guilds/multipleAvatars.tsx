import React from "react";
import { cdnbaseurl } from "../../Services/constante";
import { Image } from "react-native";

export default function MultipleAvatar({ size = 33 }) {

    return (
        <Image style={{
            width: size,
            height: size,
            borderRadius: 60 / 2,
            marginRight: 5,
            }} source={{
                cache: "force-cache",
                uri: `${cdnbaseurl}/guilds_avatars/guilds_1.png`,
            }} />
    )
}
