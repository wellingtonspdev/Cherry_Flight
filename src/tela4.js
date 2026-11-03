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
import { colors, radius, shadows, spacing, typography } from './theme/theme';

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
                style={styles.actionBtn}
              />
              <CherryButton
                title="HOME"
                variant="secondary"
                accessibilityLabel="Voltar para a tela inicial"
                onPress={() => navigation.popToTop()}
                style={styles.actionBtn}
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
    paddingVertical: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.cream50,
    borderRadius: radius.xxl,
    borderWidth: 3,
    borderColor: colors.blossom300,
    borderBottomWidth: 6,
    borderBottomColor: colors.cherryLip,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.warmCard,
  },
  mascotRow: {
    marginVertical: spacing.xs,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  infoPanel: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom100,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  infoBlock: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry500,
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValuePrimary: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.ink900,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  actionBtn: {
    flex: 1,
  },
});
