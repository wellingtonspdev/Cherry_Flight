import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LEVEL_CONFIG } from '../game/levelConfigV2';
import { isUnlocked } from '../game/progressionV2';
import { useProgress } from '../game/ProgressProviderV2';
import { colors } from '../theme/theme';

export default function LevelSelectV2({ navigation }) {
  const { data, loaded, begin, warning } = useProgress();
  const open = async id => {
    if (!loaded || !isUnlocked(data, id)) return;
    await begin(id);
    navigation.navigate('Game', { levelId: id, mode: 'campaign' });
  };
  return <SafeAreaView style={styles.root}><ScrollView contentContainerStyle={styles.content}>
    <Pressable accessibilityRole="button" onPress={() => navigation.popToTop()} style={styles.button}><Text style={styles.text}>← HOME</Text></Pressable>
    <Text accessibilityRole="header" style={styles.title}>BLOOM JOURNEY</Text>
    {!!warning && <Text style={styles.text}>{warning}</Text>}
    {[0, 1, 2, 3].map(chapter => <View key={chapter} style={styles.chapter}>
      <Text accessibilityRole="header" style={styles.heading}>{LEVEL_CONFIG.levels[chapter * 3].chapterName}</Text>
      <View style={styles.row}>{LEVEL_CONFIG.levels.slice(chapter * 3, chapter * 3 + 3).map(level => {
        const available = loaded && isUnlocked(data, level.id);
        const completed = data.levelResults[level.id]?.completed;
        const checkpoint = available && data.lastPlayedLevel === level.id;
        const state = data.levelResults[level.id]?.completed ? 'Concluído' : !available ? 'Bloqueado' : data.lastPlayedLevel === level.id ? 'Checkpoint atual' : 'Disponível';
        return <Pressable key={level.id} accessibilityRole="button" accessibilityLabel={`Level ${level.id}. ${state}${completed && checkpoint ? '. Checkpoint atual' : ''}`} accessibilityState={{ disabled: !available }} disabled={!available} onPress={() => open(level.id)} style={[styles.level, !available && styles.locked]}>
          <Text style={styles.heading}>LEVEL {level.id}</Text><Text style={styles.text}>{state}</Text><Text style={styles.text}>{level.targetScore} pontos · Recorde {data.levelResults[level.id]?.bestScore || 0}</Text>
          {completed && checkpoint && <Text style={styles.text}>● Checkpoint atual</Text>}
        </Pressable>;
      })}</View>
    </View>)}
    {data.endlessUnlocked && <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Game', { levelId: 10, mode: 'endless' })} style={styles.button}><Text style={styles.heading}>ENDLESS BLOOM ∞</Text><Text style={styles.text}>Recorde {data.levelResults.endless?.bestScore || 0}</Text></Pressable>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream50 }, content: { padding: 16, gap: 12, maxWidth: 1000, width: '100%', alignSelf: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: colors.cherry700 }, heading: { fontSize: 17, fontWeight: '800', color: colors.cherry700 }, text: { color: colors.ink900, fontSize: 13 },
  chapter: { gap: 8 }, row: { flexDirection: 'row', gap: 10 }, level: { flex: 1, padding: 12, minHeight: 88, borderRadius: 18, borderWidth: 2, borderColor: colors.blossom300, gap: 4 },
  locked: { opacity: 0.55 }, button: { minHeight: 44, padding: 12, borderRadius: 18, borderWidth: 2, borderColor: colors.cherry700, alignSelf: 'flex-start' },
});
