import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function BloomBurstV2({ biome }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.timing(progress, { toValue: 1, duration: 1100, useNativeDriver: true });
    animation.start(); return () => animation.stop();
  }, [progress]);
  const color = biome === 'golden_bloom' ? '#FFE7A0' : biome === 'yozakura' ? '#D481D9' : '#F5AFC1';
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', zIndex: 90 }]}>
    <Animated.View style={{ position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: color, opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.1, 3] }) }] }} />
    {Array.from({ length: 10 }, (_, i) => <Animated.View key={i} style={{ position: 'absolute', width: 9, height: 14, borderRadius: 8, backgroundColor: color, opacity: progress.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }), transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(i * Math.PI / 5) * 130] }) }, { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(i * Math.PI / 5) * 110] }) }, { rotate: `${i * 36}deg` }] }} />)}
  </View>;
}
