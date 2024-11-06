import React, { PropsWithChildren, useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

function FadeEffect({ children }: PropsWithChildren) {
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 500, easing: Easing.ease });
    }, []);

    return (
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    );
}

export default FadeEffect;
