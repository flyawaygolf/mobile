import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import useTheme from './Theme/useTheme';
import { full_height, full_width } from '../../Style/style';

function ScreenContainer({ children }: PropsWithChildren) {

    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.bg_primary, width: full_width, height: full_height }}>
            { children }
        </View>
    );
}

export default ScreenContainer;
