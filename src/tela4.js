// Cherry Bloom — Tela 4: Credits / Créditos
// Mandatory file name: src/tela4.js

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './components/CherryButton';
import CherryPlayer from './components/CherryV2';
import LogoLockup from './components/LogoLockup';
import PhaseBackground from './components/WorldV2';
import { PHASES } from './game/phase';
import { colors, radius, shadows, spacing } from './theme/theme';

export default function Tela4({ navigation }) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <PhaseBackground
        phaseConfig={PHASES.goldenBloom}
        screenWidth={width}
        screenHeight={height}
        animatePetals
        showGround
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: width < 350 ? spacing.md : spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <LogoLockup compact />

            <View style={styles.mascotRow}>
              <CherryPlayer size={54} state="celebrate" />
            </View>

            <Text style={styles.sectionHeader} accessibilityRole="header">
              CRÉDITOS
            </Text>

            {/* Developer Metadata */}
            <View style={styles.infoPanel}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>DESENVOLVEDOR</Text>
                <Text style={styles.infoValuePrimary}>wSp99x</Text>
              </View>
            </View>

            {/* Navigation Actions */}
            <View style={styles.actions}>
              <CherryButton
                title="PLAY"
                variant="primary"
                accessibilityLabel="Jogar Cherry Bloom"
                onPress={() => navigation.navigate('Game')}
                style={styles.btnSpacing}
              />
              <CherryButton
                title="HOME"
                variant="secondary"
                accessibilityLabel="Voltar para a tela inicial"
                onPress={() => navigation.popToTop()}
                style={styles.btnSpacing}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.sunsetPeach,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.cream50,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colors.blossom300,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.warmCard,
  },
  mascotRow: {
    marginVertical: spacing.xs,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.cherry700,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  infoPanel: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom100,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoBlock: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.cherry500,
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValuePrimary: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink900,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
  },
  btnSpacing: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
