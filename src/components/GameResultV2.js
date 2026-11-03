import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CherryButton from './CherryButton';
import CherryPlayer from './CherryV2';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function GameResultV2({
  status,
  score,
  bobuxCollected = 0,
  level,
  onRetry,
  onHome,
  onNext,
  onShop,
  checkpointSaved = false,
  saving = false,
  warning = '',
}) {
  const complete = status === 'LEVEL_COMPLETE';
  const paused = status === 'PAUSED';
  const isGameOver = status === 'GAME_OVER';

  const avatarState = complete ? 'celebrate' : isGameOver ? 'hit' : 'idle';
  const remaining = level?.targetScore ? Math.max(0, level.targetScore - score) : 0;

  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarWrap}>
            <CherryPlayer size={56} state={avatarState} />
          </View>

          <Text accessibilityRole="header" style={styles.title}>
            {complete ? `LEVEL ${level.id} COMPLETE` : paused ? 'PAUSADO' : 'GAME OVER'}
          </Text>

          <Text style={styles.chapter}>
            {level.chapterName} · {score}{complete && level.targetScore ? ` / ${level.targetScore}` : ''} pontos
          </Text>

          {isGameOver && remaining > 0 && (
            <View style={styles.nearMissBox}>
              <Text style={styles.nearMissText}>
                Faltaram apenas {remaining} {remaining === 1 ? 'ponto' : 'pontos'} para concluir!
              </Text>
            </View>
          )}

          {bobuxCollected > 0 && (
            <View style={styles.bobuxReward}>
              <Text style={styles.bobuxRewardText}>🪙 +{bobuxCollected} BOBUX coletados!</Text>
            </View>
          )}

          {complete && checkpointSaved && (
            <Text style={styles.checkpoint}>✓ Checkpoint salvo no início do próximo nível.</Text>
          )}

          {!!warning && <Text style={styles.warningText}>{warning}</Text>}
          {saving && <Text style={styles.savingText}>Salvando progresso…</Text>}

          <View style={styles.actions}>
            {complete ? (
              <CherryButton
                disabled={saving}
                title={level.id === 12 ? 'ENDLESS BLOOM' : 'NEXT LEVEL'}
                accessibilityLabel="Jogar próximo nível"
                onPress={onNext}
                style={styles.button}
              />
            ) : (
              <CherryButton
                disabled={saving}
                title={paused ? 'RESUME' : 'RETRY'}
                accessibilityLabel={paused ? 'Retomar partida' : 'Jogar novamente'}
                onPress={onRetry}
                style={styles.button}
              />
            )}
            {onShop && !paused && (
              <CherryButton
                disabled={saving}
                title="SKIN SHOP"
                variant="gold"
                accessibilityLabel="Abrir loja de skins"
                onPress={onShop}
                style={styles.button}
              />
            )}
            <CherryButton
              disabled={saving}
              title="HOME"
              variant="secondary"
              accessibilityLabel="Voltar para a tela inicial"
              onPress={onHome}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(37, 26, 32, 0.65)',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 80,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '94%',
    backgroundColor: colors.cream50,
    borderRadius: radius.xxl,
    borderWidth: 3,
    borderColor: colors.blossom300,
    borderBottomWidth: 6,
    borderBottomColor: colors.cherryLip,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  content: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    marginBottom: -2,
  },
  title: {
    fontWeight: '900',
    fontSize: 26,
    fontFamily: typography.fontFamily.display,
    textAlign: 'center',
    color: colors.cherry700,
    letterSpacing: 0.8,
  },
  chapter: {
    fontWeight: '700',
    fontFamily: typography.fontFamily.body,
    fontSize: 16,
    textAlign: 'center',
    color: colors.ink900,
  },
  nearMissBox: {
    backgroundColor: 'rgba(194, 43, 78, 0.1)',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.cherry300,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  nearMissText: {
    color: colors.cherry700,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
  },
  bobuxReward: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderBottomColor: '#B45309',
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  bobuxRewardText: {
    color: '#92400E',
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  checkpoint: {
    color: colors.leaf800,
    fontSize: 13,
    fontFamily: typography.fontFamily.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  warningText: {
    color: colors.cherry700,
    fontSize: 13,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
  },
  savingText: {
    color: colors.ink700,
    fontSize: 13,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  button: {
    flexGrow: 1,
    minWidth: 120,
    maxWidth: 160,
  },
});
