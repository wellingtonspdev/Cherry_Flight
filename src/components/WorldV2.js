import React, { memo, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import VectorAsset from './VectorAssetV2';
import { GAME } from '../game/constants';

const IDS = { firstBloom: 'first_bloom', sakuraGarden: 'sakura_garden', goldenBloom: 'golden_bloom', yozakura: 'yozakura' };
export default memo(function WorldV2({ biome, phaseConfig, screenWidth = 844, screenHeight = 390, distance, animatePetals = true, showGround = true }) {
  biome = biome || IDS[phaseConfig?.id] || 'first_bloom';
  const width = Math.round(screenWidth), height = Math.round(screenHeight);
  const zero = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(1)).current;
  const lastBiome = useRef(biome);
  const [previousBiome, setPreviousBiome] = useState(null);
  const [reduced, setReduced] = useState(false);
  const focused = useIsFocused();
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReduced(value); }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => { mounted = false; subscription.remove(); };
  }, []);
  useEffect(() => {
    if (!animatePetals || reduced || !focused) return undefined;
    const loop = Animated.loop(Animated.timing(drift, { toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: true }));
    loop.start(); return () => loop.stop();
  }, [animatePetals, drift, reduced, focused]);
  useEffect(() => {
    if (lastBiome.current === biome) return undefined;
    setPreviousBiome(lastBiome.current); lastBiome.current = biome;
    reveal.setValue(0);
    const animation = Animated.timing(reveal, { toValue: 1, duration: 420, useNativeDriver: true });
    animation.start(({ finished }) => { if (finished) setPreviousBiome(null); }); return () => animation.stop();
  }, [biome, reveal]);
  const movement = reduced ? zero : (distance || zero);
  function panorama(base, name, speed, part = '') {
    const offset = Animated.multiply(Animated.modulo(Animated.multiply(movement, speed), width), -1);
    return (
      <Animated.View style={{ position: 'absolute', left: 0, top: 0, width: width * 2, height, opacity: name === 'midground' ? 0.4 : 1, flexDirection: 'row', transform: [{ translateX: offset }] }}>
        {[0, 1].map(i => <VectorAsset key={i} assetKey={base + name} width={width} height={height} viewportWidth={width} viewportHeight={height} part={part} stretch />)}
      </Animated.View>
    );
  }
  const edgeWidth = height * 540 / 1920;
  function renderScene(theme, current) {
    const base = `backgrounds/${theme}/`;
    return (
    <Animated.View key={theme} pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: current ? reveal : 1, backgroundColor: theme === 'yozakura' ? '#292847' : '#FFF8F2' }]}>
      <VectorAsset assetKey={base + 'background_base'} width={width} height={height} viewportWidth={width} viewportHeight={height} part="sky" stretch />
      {panorama(base, 'background_base', 0.05, 'terrain')}
      {panorama(base, 'midground', 0.12)}
      <View style={{ position: 'absolute', left: 0, top: 0, opacity: 0.28 }}><VectorAsset assetKey={base + 'foreground_frame'} width={edgeWidth} height={height} viewBox="0 0 540 1920" stretch /></View>
      <View style={{ position: 'absolute', right: 0, top: 0, opacity: 0.28 }}><VectorAsset assetKey={base + 'foreground_frame'} width={edgeWidth} height={height} viewBox="540 0 540 1920" stretch /></View>
      <Animated.View style={{ position: 'absolute', top: -height, left: 0, width, height: height * 2, opacity: 0.65, transform: [{ translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, height] }) }] }}>
        {[0, 1].map(i => <VectorAsset key={i} assetKey={base + 'overlay_fx'} width={width} height={height} viewportWidth={width} viewportHeight={height} stretch />)}
      </Animated.View>
      {showGround && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: GAME.groundHeight, borderTopWidth: 3, borderTopColor: '#4F8A5B', backgroundColor: theme === 'yozakura' ? '#1B2732' : '#28533A', opacity: 0.9 }} />}
    </Animated.View>
    );
  }
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{previousBiome && renderScene(previousBiome, false)}{renderScene(biome, true)}</View>;
});
