// Cherry Bloom — CherryButton Component (3D Tactile Arcade)
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 12.1)

import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, shadows, spacing } from '../theme/theme';
import { audioManager } from '../game/AudioManagerV2';

export default function CherryButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  style,
  compact = false,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressDownAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(pressDownAnim, {
        toValue: 2,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pressDownAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isGold = variant === 'gold';

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }, { translateY: pressDownAnim }] },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        disabled={disabled}
        onPress={event => { audioManager.effect('ui'); onPress?.(event); }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.base,
          compact && styles.compact,
          isSecondary ? styles.secondary : isGhost ? styles.ghost : isGold ? styles.gold : styles.primary,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {/* Subtle top rim highlight for arcade depth */}
        <View style={styles.topRim} pointerEvents="none" />
        <Text
          style={[
            styles.text,
            compact && styles.compactText,
            isSecondary && styles.secondaryText,
            isGhost && styles.ghostText,
            isGold && styles.goldText,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    minWidth: 140,
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    overflow: 'hidden',
  },
  compact: {
    minHeight: 38,
    minWidth: 100,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 4,
  },
  topRim: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1.5,
    backgroundColor: '#FFFFFF',
    opacity: 0.35,
    borderRadius: radius.pill,
  },
  primary: {
    backgroundColor: colors.cherry500,
    borderColor: colors.cherry700,
    borderBottomColor: colors.cherryLip,
    ...shadows.buttonPrimary,
  },
  gold: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
    borderBottomColor: colors.goldLip,
    ...shadows.buttonPrimary,
  },
  secondary: {
    backgroundColor: colors.cream50,
    borderColor: colors.cherry500,
    borderBottomColor: colors.creamLip,
    ...shadows.subtle,
  },
  ghost: {
    backgroundColor: '#FFF0F5',
    borderColor: colors.blossom300,
    borderBottomColor: colors.utilityLip,
  },
  text: {
    fontFamily: fonts.display,
    color: colors.cream50,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  compactText: {
    fontSize: 12,
  },
  secondaryText: {
    color: colors.cherry700,
    textShadowColor: 'transparent',
  },
  goldText: {
    color: '#FFFBEB',
    textShadowColor: 'rgba(146, 64, 14, 0.45)',
  },
  ghostText: {
    color: colors.ink900,
    textShadowColor: 'transparent',
  },
  pressed: {
    opacity: 0.95,
  },
  disabled: {
    opacity: 0.45,
  },
});
