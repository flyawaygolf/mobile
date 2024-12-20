import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import useTheme from './Theme/useTheme';
import { full_height, full_width } from '../../Style/style';

type SectionProps = PropsWithChildren

function ScreenWrapper({ children }: SectionProps) {

    const { colors } = useTheme();

    return (
        <View style={{
            backgroundColor: colors.bg_primary,
            height: full_height,
            width: full_width
        }}>
            {children}
        </View>
    );
}

export default ScreenWrapper;
