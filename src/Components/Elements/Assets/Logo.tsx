import React from 'react';
import { DimensionValue, Image, ImageStyle, StyleProp } from 'react-native';

import { useTheme } from '../../Container';

type PropsType = {
    size?: number;
    margin?: number;
    width?: DimensionValue,
    style?: StyleProp<ImageStyle>,
}

function Logo({ size, margin, width, style }: PropsType) {

    const { theme } = useTheme();

    return (
        <Image
            source={
                theme === "dark" ?
                    require(`./Images/logo_white.png`)
                        : require(`./Images/logo_dark.png`)
            }
            style={[{
                width: width ?? '100%',
                height: size ?? 80,
                resizeMode: 'contain',
                margin: margin ?? 10,
                }, style]}
        />
    );
}

export default Logo;
