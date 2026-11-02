// Cherry Bloom — LogoLockup Component
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 3)

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, radius, shadows, spacing } from '../theme/theme';

export default function LogoLockup({ compact = false }) {
  return (
    <View
      style={[styles.container, compact && styles.containerCompact]}
      accessibilityRole="header"
      accessibilityLabel="Cherry Bloom - Fly Through the Blossom"
    >
      <View style={styles.badge}>
        {/* Decorative Left Sakura Petal */}
        <View style={styles.leftOrnament}>
          <Svg width={28} height={28} viewBox="0 0 64 64">
            <Circle cx="32" cy="18" r="10" fill={colors.blossom300} />
            <Circle cx="46" cy="28" r="10" fill={colors.blossom300} />
            <Circle cx="40" cy="44" r="10" fill={colors.blossom300} />
            <Circle cx="24" cy="44" r="10" fill={colors.blossom300} />
            <Circle cx="18" cy="28" r="10" fill={colors.blossom300} />
            <Circle cx="32" cy="32" r="6" fill="#FFF0A8" />
          </Svg>
        </View>

        <View style={styles.wordmarkGroup}>
          <Text style={[styles.cherryWord, compact && styles.cherryWordCompact]}>
            CHERRY
          </Text>
          <View style={styles.bloomRow}>
            <Text style={[styles.bloomWord, compact && styles.bloomWordCompact]}>
              BLOOM
            </Text>
            <View style={styles.miniCherry}>
              <Svg width={compact ? 24 : 30} height={compact ? 24 : 30} viewBox="0 0 64 64">
                <Defs>
                  <LinearGradient id="cherryGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FF6B7F" />
                    <Stop offset="1" stopColor={colors.cherry500} />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M32 22C35 10 44 6 54 5"
                  stroke={colors.bark600}
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M44 9C50 4 57 4 61 8C57 15 50 17 44 14Z"
                  fill={colors.leaf500}
                />
                <Circle
                  cx="28"
                  cy="38"
                  r="18"
                  fill="url(#cherryGrad)"
                  stroke={colors.cherry700}
                  strokeWidth="3"
                />
                <Circle cx="22" cy="32" r="4" fill="#FFFFFF" opacity="0.75" />
              </Svg>
            </View>
          </View>
        </View>
      </View>

      {!compact && (
        <View style={styles.taglinePill}>
          <Text style={styles.taglineText}>Fly Through the Blossom</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerCompact: {
    transform: [{ scale: 0.9 }],
  },
  badge: {
    backgroundColor: colors.cream50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.blossom300,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.warmCard,
  },
  leftOrnament: {
    position: 'absolute',
    top: -10,
    left: -10,
  },
  wordmarkGroup: {
    alignItems: 'center',
  },
  cherryWord: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.cherry500,
    letterSpacing: 1.5,
    lineHeight: 44,
    textShadowColor: colors.cherry900,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  cherryWordCompact: {
    fontSize: 30,
    lineHeight: 34,
  },
  bloomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
  },
  bloomWord: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.cherry700,
    letterSpacing: 2,
    lineHeight: 42,
  },
  bloomWordCompact: {
    fontSize: 28,
    lineHeight: 32,
  },
  miniCherry: {
    marginLeft: 4,
  },
  taglinePill: {
    marginTop: -10,
    backgroundColor: colors.cherry700,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.cream50,
  },
  taglineText: {
    color: colors.cream50,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
