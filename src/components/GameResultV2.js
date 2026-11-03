import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CherryButton from './CherryButton';
import { colors, radius, spacing } from '../theme/theme';

export default function GameResultV2({ status, score, bobuxCollected = 0, level, onRetry, onHome, onNext, onShop, checkpointSaved = false, saving = false, warning = '' }) {
  const complete = status === 'LEVEL_COMPLETE', paused = status === 'PAUSED';
  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text accessibilityRole="header" style={styles.title}>{complete ? `LEVEL ${level.id} COMPLETE` : paused ? 'PAUSED' : 'GAME OVER'}</Text>
          <Text style={styles.chapter}>{level.chapterName} · {score}{complete ? ` / ${level.targetScore}` : ''} pontos</Text>
          {bobuxCollected > 0 && (
            <View style={styles.bobuxReward}>
              <Text style={styles.bobuxRewardText}>🪙 +{bobuxCollected} BOBUX coletados!</Text>
            </View>
          )}
          {complete && checkpointSaved && <Text style={styles.checkpoint}>Checkpoint salvo no início do próximo nível.</Text>}
          {!!warning && <Text style={styles.chapter}>{warning}</Text>}
          {saving && <Text style={styles.chapter}>Salvando progresso…</Text>}
          <View style={styles.actions}>
            {complete ? <CherryButton disabled={saving} title={level.id === 12 ? 'ENDLESS BLOOM' : 'NEXT LEVEL'} accessibilityLabel="Jogar próximo nível" onPress={onNext} style={styles.button} /> : <CherryButton disabled={saving} title={paused ? 'RESUME' : 'RETRY'} accessibilityLabel={paused ? 'Retomar partida' : 'Jogar novamente'} onPress={onRetry} style={styles.button} />}
            {onShop && !paused && <CherryButton disabled={saving} title="SKIN SHOP" variant="secondary" accessibilityLabel="Abrir loja de skins" onPress={onShop} style={styles.button} />}
            <CherryButton disabled={saving} title="HOME" variant="secondary" accessibilityLabel="Voltar para a tela inicial" onPress={onHome} style={styles.button} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37,26,32,.55)', padding: 12, alignItems: 'center', justifyContent: 'center', zIndex: 80 },
  card: { width: '100%', maxWidth: 640, maxHeight: '100%', backgroundColor: colors.cream50, borderRadius: radius.xl, borderWidth: 3, borderColor: colors.blossom300 },
  content: { padding: 24, alignItems: 'center', gap: 12 },
  title: { fontWeight: '900', fontSize: 28, textAlign: 'center', color: colors.cherry700 },
  chapter: { fontWeight: '700', fontSize: 17, textAlign: 'center', color: colors.ink900 },
  bobuxReward: { backgroundColor: '#FEF3C7', borderColor: '#D97706', borderWidth: 1.5, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 6 },
  bobuxRewardText: { color: '#92400E', fontWeight: '900', fontSize: 15 },
  checkpoint: { color: colors.leaf800, fontSize: 14, textAlign: 'center' },
  actions: { width: '100%', flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  button: { flexGrow: 1, minWidth: 168 },
});
