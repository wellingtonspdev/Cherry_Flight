import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CherryButton from './CherryButton';
import { colors, radius } from '../theme/theme';

export default function GameResultV2({ status, score, level, onRetry, onHome, onNext, checkpointSaved = false, saving = false, warning = '' }) {
  const complete = status === 'LEVEL_COMPLETE', paused = status === 'PAUSED';
  return <View style={styles.overlay} accessibilityViewIsModal>
    <View style={styles.card}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>{complete ? `LEVEL ${level.id} COMPLETE` : paused ? 'PAUSED' : 'GAME OVER'}</Text>
        <Text style={styles.chapter}>{level.chapterName} · {score}{complete ? ` / ${level.targetScore}` : ''} pontos</Text>
        {complete && checkpointSaved && <Text style={styles.checkpoint}>Checkpoint salvo no início do próximo nível.</Text>}
        {!!warning && <Text style={styles.chapter}>{warning}</Text>}
        {saving && <Text style={styles.chapter}>Salvando progresso…</Text>}
        <View style={styles.actions}>
          {complete ? <CherryButton disabled={saving} title={level.id === 12 ? 'ENDLESS BLOOM' : 'NEXT LEVEL'} accessibilityLabel="Jogar próximo nível" onPress={onNext} style={styles.button} /> : <CherryButton disabled={saving} title={paused ? 'RESUME' : 'RETRY'} accessibilityLabel={paused ? 'Retomar partida' : 'Jogar novamente'} onPress={onRetry} style={styles.button} />}
          <CherryButton disabled={saving} title="HOME" variant="secondary" accessibilityLabel="Voltar para a tela inicial" onPress={onHome} style={styles.button} />
        </View>
      </ScrollView>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37,26,32,.55)', padding: 12, alignItems: 'center', justifyContent: 'center', zIndex: 80 },
  card: { width: '100%', maxWidth: 640, maxHeight: '100%', backgroundColor: colors.cream50, borderRadius: radius.xl, borderWidth: 3, borderColor: colors.blossom300 },
  content: { padding: 24, alignItems: 'center', gap: 12 },
  title: { fontWeight: '900', fontSize: 28, textAlign: 'center', color: colors.cherry700 },
  chapter: { fontWeight: '700', fontSize: 17, textAlign: 'center', color: colors.ink900 },
  checkpoint: { color: colors.leaf800, fontSize: 14, textAlign: 'center' },
  actions: { width: '100%', flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  button: { flexGrow: 1, minWidth: 168 },
});
