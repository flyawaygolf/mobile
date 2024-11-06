import React, { PropsWithChildren, useCallback } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

function RotateEffect({ children }: PropsWithChildren) {
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });

    const handlePress = useCallback(() => {
        rotation.value = withTiming(rotation.value + 360, { duration: 1000, easing: Easing.linear });
    }, []);

    return (
        <Animated.View style={animatedStyle} onTouchEnd={handlePress}>
            {children}
        </Animated.View>
    );
}

export default RotateEffect;
