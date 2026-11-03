// Cherry Bloom — ScoreHUD & PhaseBadge
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 4.4, 12.3, 12.4)

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function ScoreHUD({
  score,
  bobuxCount = 0,
  phaseConfig,
  targetScore = null,
  topInset = 12,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bobuxPulseAnim = useRef(new Animated.Value(1)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const prevPhaseId = useRef(phaseConfig?.id);

  // Micro-bounce on score increment (Design System 8.4: 180-220ms, peak scale 1.14)
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

  // Micro-bounce on bobux collected
  useEffect(() => {
    if (bobuxCount > 0) {
      Animated.sequence([
        Animated.timing(bobuxPulseAnim, {
          toValue: 1.18,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(bobuxPulseAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [bobuxCount, bobuxPulseAnim]);

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

  const progressPercent = targetScore && targetScore > 0
    ? Math.min(100, Math.round((score / targetScore) * 100))
    : null;

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { top: Math.max(10, topInset + 4) }]}
    >
      <Animated.View
        style={[
          styles.scoreBacking,
          {
            backgroundColor: phaseConfig?.hudScrim || 'rgba(37, 26, 32, 0.45)',
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

        {progressPercent !== null && (
          <View style={styles.goalWrap}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: score >= targetScore ? colors.gold : colors.cherryLip,
                  },
                ]}
              />
            </View>
            <Text style={styles.goalText}>
              {score >= targetScore ? '★ META ATINGIDA' : `META: ${targetScore}`}
            </Text>
          </View>
        )}
      </Animated.View>

      {bobuxCount > 0 && (
        <Animated.View
          style={[
            styles.bobuxBadge,
            {
              transform: [{ scale: bobuxPulseAnim }],
            },
          ]}
        >
          <Text style={styles.bobuxText} accessibilityLabel={`${bobuxCount} Bobux coletados`}>
            🪙 {bobuxCount}
          </Text>
        </Animated.View>
      )}

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
    minWidth: 84,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(255, 248, 242, 0.55)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255, 248, 242, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  score: {
    color: colors.cream50,
    fontSize: 42,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(37, 26, 32, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 46,
  },
  goalWrap: {
    alignItems: 'center',
    width: 68,
    marginTop: 2,
  },
  progressBarTrack: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 248, 242, 0.25)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalText: {
    color: 'rgba(255, 248, 242, 0.85)',
    fontSize: 9,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  bobuxBadge: {
    marginTop: 5,
    backgroundColor: 'rgba(217, 119, 6, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    borderBottomWidth: 3,
    borderBottomColor: '#B45309',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  bobuxText: {
    color: '#FFFBEB',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    letterSpacing: 0.8,
  },
  phaseBadge: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(84, 16, 33, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.blossom300,
    borderBottomWidth: 3,
    borderBottomColor: colors.cherryLip,
  },
  phaseBadgeText: {
    color: colors.cream50,
    fontSize: 11,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    letterSpacing: 1.2,
  },
});
