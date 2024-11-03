import React, { PropsWithChildren, useCallback } from 'react';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface ShrinkEffectProps extends PropsWithChildren {
  shrinkAmount?: number;
  duration?: number;
}

function ShrinkEffect({ 
  children, 
  shrinkAmount = 0.95, 
  duration = 100 
}: ShrinkEffectProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = useCallback(() => {
        scale.value = withTiming(shrinkAmount, {
            duration: duration,
            easing: Easing.inOut(Easing.quad)
        });
    }, [shrinkAmount, duration]);

    const handlePressOut = useCallback(() => {
        scale.value = withTiming(1, {
            duration: duration,
            easing: Easing.inOut(Easing.quad)
        });
    }, [duration]);

    return (
        <Animated.View
            style={animatedStyle}
            onTouchStart={handlePressIn}
            onTouchEnd={handlePressOut}
            onTouchCancel={handlePressOut}
        >
            {children}
        </Animated.View>
    );
}

export default ShrinkEffect;