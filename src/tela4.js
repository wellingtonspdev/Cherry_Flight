// Cherry Bloom — Tela 4: Academic Credits / Créditos
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 4 & 10.4)
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
import { ACADEMIC_INFO } from './game/constants';
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
              CRÉDITOS ACADÊMICOS
            </Text>

            {/* Student & Institution Metadata */}
            <View style={styles.infoPanel}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>ALUNO / AUTOR</Text>
                <Text style={styles.infoValuePrimary}>
                  {ACADEMIC_INFO.studentName}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>INSTITUIÇÃO</Text>
                <Text style={styles.infoValue}>{ACADEMIC_INFO.institution}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>CURSO</Text>
                <Text style={styles.infoValue}>{ACADEMIC_INFO.course}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>DISCIPLINA & PROFESSOR</Text>
                <Text style={styles.infoValue}>{ACADEMIC_INFO.discipline}</Text>
                <Text style={styles.infoSubvalue}>
                  {ACADEMIC_INFO.professor} • {ACADEMIC_INFO.semester}
                </Text>
              </View>
            </View>

            {/* Mandatory Verbatim Academic Disclaimer (Spec Section 4) */}
            <View
              style={styles.disclaimerBox}
              accessibilityLabel={ACADEMIC_INFO.mandatoryDisclaimer}
            >
              <Text style={styles.disclaimerText}>
                {ACADEMIC_INFO.mandatoryDisclaimer}
              </Text>
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
                onPress={() => navigation.navigate('Home')}
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
    marginBottom: spacing.md,
  },
  infoBlock: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.cherry500,
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoValuePrimary: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink900,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink900,
    textAlign: 'center',
  },
  infoSubvalue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.bark600,
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: colors.blossom100,
    marginVertical: spacing.sm,
  },
  disclaimerBox: {
    width: '100%',
    backgroundColor: colors.blossom100,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.cherry500,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  disclaimerText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink900,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    width: '100%',
  },
  btnSpacing: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
