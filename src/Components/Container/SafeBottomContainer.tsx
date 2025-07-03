import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import useTheme from './Theme/useTheme';

type SectionProps = PropsWithChildren<{
    safeAreaInsets?: {
        left: number;
        right: number;
        bottom: number;
        [x: string]: any
    };
    padding?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    }
}>

function SafeBottomContainer({ children, safeAreaInsets, padding = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
} }: SectionProps) {
    const BOTTOM_INSET = getBottomSpace();
    const { colors } = useTheme();

    const insets = {
        left: safeAreaInsets?.left ?? 0,
        right: safeAreaInsets?.right ?? 0,
        bottom: safeAreaInsets?.bottom ?? BOTTOM_INSET,
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.bg_primary,
            marginBottom: insets.bottom,
            marginHorizontal: Math.max(insets.left, insets.right),
            paddingTop: padding.top,
            paddingBottom: padding.bottom,
            paddingLeft: padding.left,
            paddingRight: padding.right,
        }}>
            {children}
        </View>
    );
}

export default SafeBottomContainer;
