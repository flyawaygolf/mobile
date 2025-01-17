import React, { PropsWithChildren, useRef } from 'react';
import { Animated } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, HandlerStateChangeEvent } from 'react-native-gesture-handler';
import { full_width } from '../../Style/style';

const SWIPE_LIMIT = full_width * 0.33;

type SectionProps = PropsWithChildren<{
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
}>;

const SwipeEffect = ({ children, onSwipeLeft, onSwipeRight }: SectionProps) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const onSwipe = (event: PanGestureHandlerGestureEvent): void => {
    const { translationX } = event.nativeEvent;
    if (Math.abs(translationX) <= SWIPE_LIMIT) {
      translateX.setValue(translationX);
    }
  };

  const onSwipeEnd = (event: HandlerStateChangeEvent<Record<string, unknown>>): void => {
    const translationX = event.nativeEvent.translationX as number;
    if (translationX > 0) {
      onSwipeRight && onSwipeRight();
    } else {
      onSwipeLeft && onSwipeLeft();
    }
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={onSwipe} onEnded={onSwipeEnd}>
        <Animated.View style={[{ transform: [{ translateX }] }]}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default SwipeEffect;