import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LEVEL_CONFIG } from '../game/levelConfigV2';
import { isUnlocked } from '../game/progressionV2';
import { useProgress } from '../game/ProgressProviderV2';
import { colors, radius, spacing, typography } from '../theme/theme';
import World from './WorldV2';
import CherryButton from './CherryButton';

export default function LevelSelectV2({ navigation }) {
  const { width, height } = useWindowDimensions();
  const { data, loaded, begin, warning } = useProgress();

  const open = async id => {
    if (!loaded || !isUnlocked(data, id)) return;
    await begin(id);
    navigation.navigate('Game', { levelId: id, mode: 'campaign' });
  };

  return (
    <View style={styles.root}>
      <World
        biome="sakura_garden"
        screenWidth={width}
        screenHeight={height}
        animatePetals
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <CherryButton
              title="← HOME"
              variant="secondary"
              accessibilityLabel="Voltar para a tela inicial"
              onPress={() => navigation.popToTop()}
              style={styles.backBtn}
            />
            <Text accessibilityRole="header" style={styles.title}>BLOOM JOURNEY</Text>
            <View style={styles.placeholder} />
          </View>

          {!!warning && <Text style={styles.warningText}>{warning}</Text>}

          {[0, 1, 2, 3].map(chapter => (
            <View key={chapter} style={styles.chapterCard}>
              <Text accessibilityRole="header" style={styles.chapterHeading}>
                {LEVEL_CONFIG.levels[chapter * 3].chapterName}
              </Text>

              <View style={styles.row}>
                {LEVEL_CONFIG.levels.slice(chapter * 3, chapter * 3 + 3).map(level => {
                  const available = loaded && isUnlocked(data, level.id);
                  const completed = data.levelResults[level.id]?.completed;
                  const checkpoint = available && data.lastPlayedLevel === level.id;
                  const state = completed
                    ? 'Concluído'
                    : !available
                    ? 'Bloqueado'
                    : checkpoint
                    ? 'Checkpoint'
                    : 'Disponível';

                  return (
                    <Pressable
                      key={level.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Level ${level.id}. ${state}${completed && checkpoint ? '. Checkpoint atual' : ''}`}
                      accessibilityState={{ disabled: !available }}
                      disabled={!available}
                      onPress={() => open(level.id)}
                      style={[
                        styles.level,
                        !available && styles.locked,
                        checkpoint && styles.checkpointLevel,
                        completed && styles.completedLevel,
                      ]}
                    >
                      <View style={styles.levelHeaderRow}>
                        <Text style={[styles.levelTitle, !available && styles.lockedText]}>
                          L{level.id}
                        </Text>
                        {completed ? (
                          <Text style={styles.badgeSuccess}>✓</Text>
                        ) : !available ? (
                          <Text style={styles.badgeLocked}>🔒</Text>
                        ) : checkpoint ? (
                          <Text style={styles.badgeCheckpoint}>★</Text>
                        ) : null}
                      </View>

                      <Text style={[styles.levelState, checkpoint && styles.checkpointStateText]}>
                        {state}
                      </Text>

                      <Text style={styles.levelScore}>
                        Meta: {level.targetScore} pts
                      </Text>

                      {completed && (
                        <Text style={styles.levelRecord}>
                          Rec: {data.levelResults[level.id]?.bestScore || 0}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {data.endlessUnlocked && (
            <View style={styles.endlessCard}>
              <CherryButton
                title="ENDLESS BLOOM ∞"
                variant="gold"
                accessibilityLabel="Jogar modo Endless Bloom infinito"
                onPress={() => navigation.navigate('Game', { levelId: 10, mode: 'endless' })}
                style={styles.endlessBtn}
              />
              <Text style={styles.endlessRecord}>
                Melhor Recorde: {data.levelResults.endless?.bestScore || 0} pontos
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream50,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backBtn: {
    minWidth: 100,
  },
  placeholder: {
    minWidth: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    letterSpacing: 0.8,
  },
  warningText: {
    color: colors.cherry700,
    fontFamily: typography.fontFamily.body,
    fontSize: 13,
    textAlign: 'center',
  },
  chapterCard: {
    backgroundColor: 'rgba(255, 248, 242, 0.94)',
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.blossom300,
    borderBottomWidth: 4,
    borderBottomColor: colors.cherryLip,
    padding: 12,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  chapterHeading: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  level: {
    flex: 1,
    padding: 10,
    minHeight: 84,
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.blossom200,
    borderBottomWidth: 4,
    borderBottomColor: colors.blossom300,
    justifyContent: 'space-between',
  },
  checkpointLevel: {
    borderColor: '#F59E0B',
    borderBottomColor: '#B45309',
    backgroundColor: '#FFFBEB',
  },
  completedLevel: {
    borderColor: colors.cherry300,
    borderBottomColor: colors.cherryLip,
  },
  locked: {
    opacity: 0.5,
    backgroundColor: 'rgba(240, 235, 230, 0.7)',
    borderColor: '#D4C9C0',
    borderBottomColor: '#B0A298',
  },
  levelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
  },
  lockedText: {
    color: colors.ink700,
  },
  badgeSuccess: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.leaf700,
  },
  badgeLocked: {
    fontSize: 11,
  },
  badgeCheckpoint: {
    fontSize: 13,
    color: '#D97706',
  },
  levelState: {
    color: colors.ink700,
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    fontWeight: '700',
  },
  checkpointStateText: {
    color: '#B45309',
    fontWeight: '800',
  },
  levelScore: {
    color: colors.ink900,
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    fontWeight: '600',
  },
  levelRecord: {
    color: colors.cherry500,
    fontSize: 10,
    fontFamily: typography.fontFamily.body,
    fontWeight: '800',
  },
  endlessCard: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  endlessBtn: {
    minWidth: 240,
  },
  endlessRecord: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
  },
});
