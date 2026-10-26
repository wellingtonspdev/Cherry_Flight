// Cherry Bloom — Tela 2: Instructions / Como Jogar
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 13.2)
// Mandatory file name: src/tela2.js

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
import CherryPlayer from './components/CherryPlayer';
import PhaseBackground from './components/PhaseBackground';
import { PHASES } from './game/phase';
import { colors, radius, shadows, spacing } from './theme/theme';

export default function Tela2({ navigation }) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <PhaseBackground
        phaseConfig={PHASES.sakuraGarden}
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
            <Text style={styles.headerTitle} accessibilityRole="header">
              HOW TO PLAY
            </Text>
            <Text style={styles.headerSubtitle}>
              Instruções Rápidas do Jogo
            </Text>

            {/* Miniature Gameplay Diagram */}
            <View style={styles.diagramBox}>
              <View style={styles.miniBranchTop} />
              <View style={styles.miniBranchBottom} />

              <View style={styles.diagramCenter}>
                <CherryPlayer size={52} state="jump" />
                <View style={styles.tapBadge}>
                  <Text style={styles.tapBadgeText}>↑ TAP</Text>
                </View>
              </View>
            </View>

            {/* 3 Core Rules (Spec 10.2 & Design System 13.2) */}
            <View style={styles.rulesList}>
              <View style={styles.ruleItem}>
                <View style={styles.ruleNumberBadge}>
                  <Text style={styles.ruleNumberText}>1</Text>
                </View>
                <View style={styles.ruleTextGroup}>
                  <Text style={styles.ruleTitle}>Tap to make Cherri jump</Text>
                  <Text style={styles.ruleDesc}>
                    Toque em qualquer lugar da tela para impulsionar a Cherri para cima contra a gravidade.
                  </Text>
                </View>
              </View>

              <View style={styles.ruleItem}>
                <View style={styles.ruleNumberBadge}>
                  <Text style={styles.ruleNumberText}>2</Text>
                </View>
                <View style={styles.ruleTextGroup}>
                  <Text style={styles.ruleTitle}>Avoid the branches</Text>
                  <Text style={styles.ruleDesc}>
                    Desvie dos galhos floridos superiores, inferiores e não toque no chão do jardim.
                  </Text>
                </View>
              </View>

              <View style={styles.ruleItem}>
                <View style={styles.ruleNumberBadge}>
                  <Text style={styles.ruleNumberText}>3</Text>
                </View>
                <View style={styles.ruleTextGroup}>
                  <Text style={styles.ruleTitle}>Every gap = +1 point</Text>
                  <Text style={styles.ruleDesc}>
                    Cada passagem segura vale +1 ponto e faz o cenário evoluir da alvorada até a noite Yozakura!
                  </Text>
                </View>
              </View>
            </View>

            {/* Phase Progression Preview */}
            <View style={styles.phasesRow}>
              <View style={[styles.phasePill, { backgroundColor: '#BFE8EF' }]}>
                <Text style={styles.phasePillText}>0+ Dawn</Text>
              </View>
              <View style={[styles.phasePill, { backgroundColor: '#FFE3EA' }]}>
                <Text style={styles.phasePillText}>10+ Sakura</Text>
              </View>
              <View style={[styles.phasePill, { backgroundColor: '#F6A58A' }]}>
                <Text style={styles.phasePillText}>20+ Sunset</Text>
              </View>
              <View style={[styles.phasePill, { backgroundColor: '#292847' }]}>
                <Text style={[styles.phasePillText, { color: colors.cream50 }]}>
                  30+ Night
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <CherryButton
                title="PLAY"
                variant="primary"
                accessibilityLabel="Começar a jogar agora"
                onPress={() => navigation.navigate('Game')}
                style={styles.btnSpacing}
              />
              <CherryButton
                title="HOME"
                variant="secondary"
                accessibilityLabel="Voltar para a tela inicial"
                onPress={() => navigation.navigate('Welcome')}
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
    backgroundColor: colors.skyDay,
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.cherry700,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.bark600,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  diagramBox: {
    width: '100%',
    height: 112,
    backgroundColor: colors.skyDay,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom300,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  miniBranchTop: {
    position: 'absolute',
    right: 36,
    top: 0,
    width: 28,
    height: 34,
    backgroundColor: colors.bark600,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  miniBranchBottom: {
    position: 'absolute',
    right: 36,
    bottom: 0,
    width: 28,
    height: 34,
    backgroundColor: colors.bark600,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  diagramCenter: {
    alignItems: 'center',
  },
  tapBadge: {
    marginTop: 4,
    backgroundColor: colors.cherry500,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  tapBadgeText: {
    color: colors.cream50,
    fontSize: 11,
    fontWeight: '800',
  },
  rulesList: {
    width: '100%',
    marginBottom: spacing.md,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.blossom100,
  },
  ruleNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cherry500,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
    marginTop: 2,
  },
  ruleNumberText: {
    color: colors.cream50,
    fontSize: 14,
    fontWeight: '900',
  },
  ruleTextGroup: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink900,
    marginBottom: 2,
  },
  ruleDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.bark600,
    lineHeight: 18,
  },
  phasesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  phasePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginHorizontal: 3,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(86, 56, 63, 0.2)',
  },
  phasePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink900,
  },
  actions: {
    width: '100%',
  },
  btnSpacing: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
