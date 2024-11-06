import React, { PropsWithChildren, useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

function SlideEffect({ children }: PropsWithChildren) {
    const translateX = useSharedValue(100);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    useEffect(() => {
        translateX.value = withSpring(0);
    }, []);

    return (
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    );
}

export default SlideEffect;
