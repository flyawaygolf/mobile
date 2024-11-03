import React, { PropsWithChildren, useCallback, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

type PropsType = PropsWithChildren<{
    shakeOnDisplay?: boolean;
    style?: ViewStyle
}>

function ShakeEffect({ children, shakeOnDisplay, style }: PropsType) {
    const translateX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    useEffect(() => {
        if(shakeOnDisplay) handleShake()
    }, [])

    const handleShake = useCallback(() => {
        translateX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 100 }),
            withTiming(-10, { duration: 100 }),
            withTiming(10, { duration: 100 }),
            withTiming(0, { duration: 50 })
        );
    }, []);

    return (
        <Animated.View style={[style, animatedStyle]} onTouchEnd={handleShake}>
            {children}
        </Animated.View>
    );
}

export default ShakeEffect;