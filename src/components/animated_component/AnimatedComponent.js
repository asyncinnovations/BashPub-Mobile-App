import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedComponent = ({children, width}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 500});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: opacity.value}],
  }));

  return (
    <Animated.View style={[{width: width}, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedComponent;
