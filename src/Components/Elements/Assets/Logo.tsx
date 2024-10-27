import React from 'react';
import { DimensionValue, Image } from 'react-native';
import { useTheme } from '../../Container';

type PropsType = {
    size?: number;
    margin?: number;
    width?: DimensionValue
}

function Logo({ size, margin, width }: PropsType) {

    const { theme } = useTheme();

    return (
        <Image
            source={
                theme === "dark" ? 
                    require(`./Images/logo_white.png`) 
                        : require(`./Images/logo_dark.png`)
            }
            style={{
            width: width ?? '100%',
            height: size ?? 150,
            resizeMode: 'contain',
            margin: margin ?? 10,
            }}
        />
    );
}

export default Logo;
