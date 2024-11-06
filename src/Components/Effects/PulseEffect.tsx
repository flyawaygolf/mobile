import React, { PropsWithChildren, useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

function PulseEffect({ children }: PropsWithChildren) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.2, { duration: 500, easing: Easing.ease }),
            -1,
            true
        );
    }, []);

    return (
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    );
}

export default PulseEffect;
