// Cherry Bloom — GameOverCard Component
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 12.2, 12.5)

import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme/theme';
import CherryButton from './CherryButton';
import CherryPlayer from './CherryPlayer';

export default function GameOverCard({
  score,
  bestScore,
  phaseLabel,
  onPlayAgain,
  onHome,
}) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 75,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <Animated.View
        style={[
          styles.card,
          isLandscape && styles.landscapeCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView contentContainerStyle={[styles.cardContent, isLandscape && styles.landscapeContent]}>
        <Text style={styles.title} accessibilityRole="header">
          GAME OVER
        </Text>

        {!isLandscape && <View style={styles.characterWrap}>
          <CherryPlayer size={58} state="hit" />
        </View>}

        {phaseLabel && !isLandscape ? (
          <View style={styles.phaseChip}>
            <Text style={styles.phaseChipText}>{phaseLabel}</Text>
          </View>
        ) : null}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text
              style={styles.statValue}
              accessibilityLabel={`Pontuação da partida: ${score}`}
            >
              {score}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>BEST</Text>
            <Text
              style={[styles.statValue, styles.bestValue]}
              accessibilityLabel={`Melhor pontuação: ${bestScore}`}
            >
              {bestScore}
            </Text>
          </View>
        </View>

        <View style={[styles.actions, isLandscape && styles.landscapeActions]}>
          <CherryButton
            title="PLAY AGAIN"
            onPress={onPlayAgain}
            variant="primary"
            accessibilityLabel="Jogar novamente"
            style={[styles.buttonSpacing, isLandscape && styles.landscapeButton]}
          />
          <CherryButton
            title="HOME"
            onPress={onHome}
            variant="secondary"
            accessibilityLabel="Voltar para a tela inicial"
            style={[styles.buttonSpacing, isLandscape && styles.landscapeButton]}
          />
        </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(37, 26, 32, 0.56)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    zIndex: 80,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '100%',
    backgroundColor: colors.cream50,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.blossom300,
    ...shadows.warmCard,
  },
  landscapeCard: {
    maxWidth: 560,
  },
  landscapeContent: {
    paddingVertical: spacing.md,
  },
  landscapeActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  landscapeButton: {
    flex: 1,
    width: undefined,
    marginBottom: 0,
  },
  cardContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.cherry700,
    letterSpacing: 1.2,
  },
  characterWrap: {
    marginVertical: spacing.sm,
  },
  phaseChip: {
    backgroundColor: colors.blossom100,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  phaseChipText: {
    color: colors.cherry700,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom100,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 2,
    height: 44,
    backgroundColor: colors.blossom100,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.bark600,
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.ink900,
    fontVariant: ['tabular-nums'],
  },
  bestValue: {
    color: colors.cherry500,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  },
  buttonSpacing: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
