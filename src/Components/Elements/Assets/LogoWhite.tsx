import React from 'react';
import { DimensionValue, Image, ImageStyle, StyleProp } from 'react-native';

type PropsType = {
    size?: number;
    margin?: number;
    width?: DimensionValue,
    style?: StyleProp<ImageStyle>,
}

function LogoWhite({ size, margin, width, style }: PropsType) {

    return (
        <Image
            source={require(`./Images/logo_white.png`)}
            style={[{
                width: width ?? '100%',
                height: size ?? 80,
                resizeMode: 'contain',
                margin: margin ?? 10,
                }, style]}
        />
    );
}

export default LogoWhite;
