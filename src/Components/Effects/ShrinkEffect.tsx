import React, { useCallback } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';

interface ShrinkEffectProps extends ViewProps {
    children: React.ReactNode;
    shrinkAmount?: number;
    duration?: number;
    delay?: number;
    distance?: number;
    onPress?: () => void;
}

function ShrinkEffect({
    children,
    shrinkAmount = 0.95,
    duration = 100,
    style,
    onPress,
    ...props
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
            easing: Easing.inOut(Easing.quad),
        });
    }, [shrinkAmount, duration]);

    const handlePressOut = useCallback(() => {
        scale.value = withTiming(1, {
            duration: duration,
            easing: Easing.inOut(Easing.quad),
        });
    }, [duration]);

    return (
        <Animated.View
            style={[animatedStyle, style]}
            onTouchStart={() => handlePressIn()}
            onTouchEnd={() => {
                handlePressOut()
                onPress && onPress()
            }}
            onTouchCancel={handlePressOut}
            {...props}>
            {children}
        </Animated.View>
    );
}

export default ShrinkEffect;
