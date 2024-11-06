import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';

interface FadeInFromBottomProps extends ViewProps {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    distance?: number;
}

const FadeInFromBottom: React.FC<FadeInFromBottomProps> = ({
    children,
    duration = 500,
    delay = 0,
    distance = 50,
    style,
    ...props
}) => {
    const animation = useSharedValue(0);

    useEffect(() => {
        animation.value = withDelay(
            delay,
            withTiming(1, {
                duration,
                easing: Easing.out(Easing.exp),
            })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animation.value,
            [0, 1],
            [0, 1],
            Extrapolation.CLAMP
        );
        const translateY = interpolate(
            animation.value,
            [0, 1],
            [distance, 0], // Changé de [-distance, 0] à [distance, 0]
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (
        <Animated.View style={[animatedStyle, style]} {...props}>
            {children}
        </Animated.View>
    );
};

export default FadeInFromBottom;