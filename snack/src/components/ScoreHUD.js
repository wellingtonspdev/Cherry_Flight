// Cherry Bloom — ScoreHUD & PhaseBadge
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 4.4, 12.3, 12.4)

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

export default function ScoreHUD({ score, phaseConfig, topInset = 12 }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const prevPhaseId = useRef(phaseConfig?.id);

  // Micro-bounce on score increment (Design System 8.4: 180-220ms, peak scale 1.12)
  useEffect(() => {
    if (score > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.14,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 110,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [score, pulseAnim]);

  // 1-second phase transition banner when phase changes (Design System 12.4)
  useEffect(() => {
    if (phaseConfig?.id && prevPhaseId.current !== phaseConfig.id) {
      prevPhaseId.current = phaseConfig.id;
      Animated.sequence([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.delay(950),
        Animated.timing(badgeOpacity, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [phaseConfig?.id, badgeOpacity]);

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { top: Math.max(12, topInset + 6) }]}
    >
      <Animated.View
        style={[
          styles.scoreBacking,
          {
            backgroundColor: phaseConfig?.hudScrim || 'rgba(37, 26, 32, 0.25)',
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text
          style={styles.score}
          accessibilityLabel={`Pontuação atual: ${score}`}
        >
          {score}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.phaseBadge, { opacity: badgeOpacity }]}>
        <Text style={styles.phaseBadgeText}>{phaseConfig?.label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  scoreBacking: {
    minWidth: 76,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 248, 242, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    color: colors.cream50,
    fontSize: 48,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(37, 26, 32, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  phaseBadge: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(84, 16, 33, 0.85)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.blossom300,
  },
  phaseBadgeText: {
    color: colors.cream50,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
