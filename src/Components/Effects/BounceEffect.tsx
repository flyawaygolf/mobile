import React, { PropsWithChildren, useCallback } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

function BounceEffect({ children }: PropsWithChildren) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.90, { damping: 2, stiffness: 200 });
    }, []);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 2, stiffness: 200 });
    }, []);

    return (
        <Animated.View
            style={animatedStyle}
            onTouchStart={handlePressIn}
            onTouchEnd={handlePressOut}
        >
            {children}
        </Animated.View>
    );
}

export default BounceEffect;
