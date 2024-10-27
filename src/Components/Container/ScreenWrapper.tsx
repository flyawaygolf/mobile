import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import useTheme from './Theme/useTheme';

type SectionProps = PropsWithChildren

function ScreenWrapper({ children }: SectionProps) {

    const { colors } = useTheme();

    return (
        <View style={{
            backgroundColor: colors.bg_primary,
        }}>
            {children}
        </View>
    );
}

export default ScreenWrapper;
