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
import CherryPlayer from './components/CherryV2';
import PhaseBackground from './components/WorldV2';
import { PHASES } from './game/phase';
import { colors, radius, shadows, spacing, typography } from './theme/theme';

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
                  <Text style={styles.ruleTitle}>Tap to make Cherry jump</Text>
                  <Text style={styles.ruleDesc}>
                    Toque na tela (ou use Clique, Espaço, ↑ / W no Desktop) para impulsionar a Cherry contra a gravidade.
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
                    Cada passagem segura vale +1 ponto. Complete a meta para desbloquear o próximo nível; Continue retorna ao checkpoint salvo.
                  </Text>
                </View>
              </View>
            </View>

            {/* Phase Progression Preview */}
            <View style={styles.phasesRow}>
              <View style={[styles.phasePill, { backgroundColor: '#BFE8EF' }]}>
                <Text style={styles.phasePillText}>1–3 First Bloom</Text>
              </View>
              <View style={[styles.phasePill, { backgroundColor: '#FFE3EA' }]}>
                <Text style={styles.phasePillText}>4–6 Sakura</Text>
              </View>
              <View style={[styles.phasePill, { backgroundColor: '#F6A58A' }]}>
                <Text style={styles.phasePillText}>7–9 Golden</Text>
              </View>
              <View style={[styles.phasePill, { backgroundColor: '#292847' }]}>
                <Text style={[styles.phasePillText, { color: colors.cream50 }]}>
                  10–12 Yozakura
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <CherryButton
                title="PLAY"
                variant="primary"
                accessibilityLabel="Começar a jogar agora"
                onPress={() => navigation.navigate('Game', { levelId: 1, mode: 'campaign' })}
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
    backgroundColor: colors.skyDay,
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
    maxWidth: 440,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: typography.fontFamily.body,
    color: colors.bark600,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  diagramBox: {
    width: '100%',
    height: 90,
    backgroundColor: colors.skyDay,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom300,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  miniBranchTop: {
    position: 'absolute',
    right: 36,
    top: 0,
    width: 28,
    height: 28,
    backgroundColor: colors.bark600,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  miniBranchBottom: {
    position: 'absolute',
    right: 36,
    bottom: 0,
    width: 28,
    height: 28,
    backgroundColor: colors.bark600,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  diagramCenter: {
    alignItems: 'center',
  },
  tapBadge: {
    marginTop: 2,
    backgroundColor: colors.cherry500,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  tapBadgeText: {
    color: colors.cream50,
    fontSize: 10,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
  },
  rulesList: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: colors.blossom100,
  },
  ruleNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.cherry500,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  ruleNumberText: {
    color: colors.cream50,
    fontSize: 13,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
  },
  ruleTextGroup: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.ink900,
    marginBottom: 1,
  },
  ruleDesc: {
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    fontWeight: '600',
    color: colors.bark600,
    lineHeight: 15,
  },
  phasesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    gap: 4,
  },
  phasePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(86, 56, 63, 0.2)',
  },
  phasePillText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: typography.fontFamily.display,
    color: colors.ink900,
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
