import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    withDelay,
    Extrapolation
} from 'react-native-reanimated';

interface FadeInFromTopProps extends ViewProps {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    distance?: number;
}

const FadeInFromTop: React.FC<FadeInFromTopProps> = ({
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
            Extrapolation.CLAMP // Utilisez Extrapolation.CLAMP au lieu de Extrapolate.CLAMP
        );
        const translateY = interpolate(
            animation.value,
            [0, 1],
            [-distance, 0],
            Extrapolation.CLAMP // Ici aussi
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

export default FadeInFromTop;