// Cherry Bloom — CherryButton Component
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 12.1)

import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme/theme';

export default function CherryButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  style,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.base,
          isSecondary ? styles.secondary : isGhost ? styles.ghost : styles.primary,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.text,
            isSecondary && styles.secondaryText,
            isGhost && styles.ghostText,
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
    minHeight: 52,
    minWidth: 168,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.cherry700,
    borderWidth: 2,
    borderColor: colors.cherry700,
    ...shadows.buttonPrimary,
  },
  secondary: {
    backgroundColor: colors.cream50,
    borderWidth: 2,
    borderColor: colors.cherry500,
    ...shadows.subtle,
  },
  ghost: {
    backgroundColor: 'rgba(255, 248, 242, 0.85)',
    borderWidth: 1.5,
    borderColor: colors.blossom300,
  },
  text: {
    color: colors.cream50,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  secondaryText: {
    color: colors.cherry700,
  },
  ghostText: {
    color: colors.ink900,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.45,
  },
});
