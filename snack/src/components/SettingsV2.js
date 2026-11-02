import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './CherryButton';
import { useProgress } from '../game/ProgressProviderV2';
import { colors } from '../theme/theme';

export default function SettingsV2({ navigation }) {
  const { data, loaded, setSetting, warning } = useProgress();
  return <SafeAreaView style={styles.root}><View style={styles.card}>
    <Text accessibilityRole="header" style={styles.title}>SETTINGS</Text>
    {[['music', 'Music'], ['sfx', 'SFX'], ['haptics', 'Vibração']].map(([key, label]) => <View key={key} style={styles.row}><Text style={styles.label}>{label}</Text><Switch accessibilityLabel={label} value={data.settings[key]} disabled={!loaded} onValueChange={value => setSetting(key, value)} trackColor={{ true: colors.cherry700 }} /></View>)}
    {!!warning && <Text style={styles.label}>{warning}</Text>}
    <CherryButton title="HOME" onPress={() => navigation.popToTop()} />
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.cream50, alignItems: 'center', justifyContent: 'center', padding: 16 }, card: { width: '100%', maxWidth: 440, gap: 12 }, title: { fontSize: 26, fontWeight: '900', color: colors.cherry700 }, row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { fontSize: 16, color: colors.ink900 } });
