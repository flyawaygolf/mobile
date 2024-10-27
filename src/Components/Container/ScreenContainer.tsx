import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import useTheme from './Theme/useTheme';

function ScreenContainer({ children }: PropsWithChildren) {

    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.bg_primary }}>
            { children }
        </View>
    );
}

export default ScreenContainer;
