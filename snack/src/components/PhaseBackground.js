// Cherry Bloom — PhaseBackground & Floating Sakura Petals
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 9 & 11)

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { GAME } from '../game/constants';
import { PHASES } from '../game/phase';
import { colors } from '../theme/theme';

const PETAL_SEEDS = [
  { id: 'p1', left: '12%', size: 10, delay: 0, duration: 5400 },
  { id: 'p2', left: '28%', size: 8, delay: 900, duration: 6200 },
  { id: 'p3', left: '48%', size: 12, delay: 1800, duration: 5800 },
  { id: 'p4', left: '68%', size: 9, delay: 600, duration: 6600 },
  { id: 'p5', left: '84%', size: 11, delay: 1400, duration: 5100 },
  { id: 'p6', left: '38%', size: 7, delay: 2300, duration: 6900 },
];

function DriftingPetal({ seed, color, screenHeight, active }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop;
    if (active) {
      progress.setValue(0);
      loop = Animated.loop(
        Animated.sequence([
          Animated.delay(seed.delay),
          Animated.timing(progress, {
            toValue: 1,
            duration: seed.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [active, progress, seed.delay, seed.duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, Math.max(480, screenHeight)],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -18, -36],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '220deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.petal,
        {
          left: seed.left,
          width: seed.size,
          height: seed.size * 0.75,
          backgroundColor: color,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    />
  );
}

export default function PhaseBackground({
  phaseConfig = PHASES.firstBloom,
  screenWidth = 360,
  screenHeight = 640,
  animatePetals = true,
  showGround = true,
}) {
  const isNight = phaseConfig.id === 'yozakura';

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Layer 1: Sky Gradient */}
      <LinearGradient
        colors={[phaseConfig.skyTop, phaseConfig.skyBottom]}
        style={StyleSheet.absoluteFill}
      />

      {/* Layer 2: Sun or Moon */}
      <View
        style={[
          styles.celestialBody,
          {
            backgroundColor: phaseConfig.celestialColor,
            top: isNight ? '13%' : '18%',
            right: isNight ? '16%' : '22%',
          },
        ]}
      />

      {/* Night Stars for Yozakura */}
      {isNight && (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.star, { top: '10%', left: '18%' }]} />
          <View style={[styles.star, { top: '16%', left: '42%' }]} />
          <View style={[styles.star, { top: '8%', left: '64%' }]} />
          <View style={[styles.star, { top: '22%', left: '25%' }]} />
          <View style={[styles.star, { top: '26%', left: '78%' }]} />
        </View>
      )}

      {/* Layer 3 & 4: Distant Mountains & Blossom Hills Silhouette */}
      <View style={[styles.sceneryBottom, { bottom: showGround ? GAME.groundHeight : 0 }]}>
        <Svg
          width={screenWidth}
          height={180}
          viewBox="0 0 400 180"
          preserveAspectRatio="none"
        >
          {/* Far Mountains */}
          <Path
            d="M0 180 L0 110 L75 52 L155 115 L250 38 L340 105 L400 68 L400 180 Z"
            fill={phaseConfig.mountainFar}
            opacity="0.7"
          />
          {/* Near Mountains */}
          <Path
            d="M0 180 L0 130 L110 78 L205 132 L305 74 L400 124 L400 180 Z"
            fill={phaseConfig.mountainNear}
            opacity="0.82"
          />
          {/* Distant Sakura Canopy Silhouette */}
          <Circle cx="45" cy="165" r="42" fill={phaseConfig.treeFar} opacity="0.65" />
          <Circle cx="115" cy="172" r="36" fill={phaseConfig.treeFar} opacity="0.65" />
          <Circle cx="290" cy="168" r="44" fill={phaseConfig.treeFar} opacity="0.65" />
          <Circle cx="365" cy="162" r="48" fill={phaseConfig.treeFar} opacity="0.65" />
          {/* Mid-ground Blossom Shapes */}
          <Circle cx="20" cy="178" r="32" fill={phaseConfig.treeMid} opacity="0.55" />
          <Circle cx="380" cy="176" r="34" fill={phaseConfig.treeMid} opacity="0.55" />
        </Svg>
      </View>

      {/* Layer 7: Drifting Sakura Petals (Capped at 6 lightweight views) */}
      <View style={StyleSheet.absoluteFill}>
        {PETAL_SEEDS.map((seed) => (
          <DriftingPetal
            key={seed.id}
            seed={seed}
            color={phaseConfig.petalColor}
            screenHeight={screenHeight}
            active={animatePetals}
          />
        ))}
      </View>

      {/* Garden Floor Strip */}
      {showGround && (
        <View
          style={[
            styles.groundStrip,
            {
              height: GAME.groundHeight,
              backgroundColor: phaseConfig.groundBottom,
              borderTopColor: phaseConfig.groundTop,
            },
          ]}
        >
          <View style={styles.groundBlossomDots}>
            <View style={styles.groundDot} />
            <View style={styles.groundDot} />
            <View style={styles.groundDot} />
            <View style={styles.groundDot} />
            <View style={styles.groundDot} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  celestialBody: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    opacity: 0.88,
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.moon100,
    opacity: 0.8,
  },
  sceneryBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 180,
  },
  petal: {
    position: 'absolute',
    top: -20,
    borderRadius: 8,
    opacity: 0.65,
  },
  groundStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 6,
    justifyContent: 'center',
  },
  groundBlossomDots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  groundDot: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.blossom300,
    opacity: 0.65,
  },
});
