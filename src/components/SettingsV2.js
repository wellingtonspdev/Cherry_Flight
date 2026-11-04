import React from 'react';
import { StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './CherryButton';
import CherryPlayer from './CherryV2';
import World from './WorldV2';
import { useProgress } from '../game/ProgressProviderV2';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function SettingsV2({ navigation }) {
  const { width, height } = useWindowDimensions();
  const { data, loaded, setSetting, warning } = useProgress();

  return (
    <View style={styles.root}>
      <World
        biome="golden_bloom"
        screenWidth={width}
        screenHeight={height}
        animatePetals
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <CherryPlayer size={48} state="idle" />
            <Text accessibilityRole="header" style={styles.title}>AJUSTES</Text>
          </View>

          <View style={styles.settingsList}>
            {[
              ['music', 'Música do Jogo', 'Desligue para ouvir seu Spotify / app de música'],
              ['sfx', 'Efeitos Sonoros (SFX)', 'Sons táteis (tocam junto do seu app de música)'],
              ['haptics', 'Vibração Tátil', 'Feedback nos saltos'],
            ].map(([key, label, desc]) => (
              <View key={key} style={styles.row}>
                <View style={styles.labelCol}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.desc}>{desc}</Text>
                </View>
                <Switch
                  accessibilityLabel={label}
                  value={data.settings[key]}
                  disabled={!loaded}
                  onValueChange={value => setSetting(key, value)}
                  trackColor={{ true: colors.cherry700, false: '#D4C9C0' }}
                  thumbColor={data.settings[key] ? '#FFF8F2' : '#F4ECE4'}
                />
              </View>
            ))}
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              🎧 <Text style={styles.tipBold}>Dica:</Text> Desligue a "Música do Jogo" para curtir suas playlists no Spotify ou YouTube Music enquanto joga. Seus pulos e moedas continuam soando normalmente!
            </Text>
          </View>

          {!!warning && <Text style={styles.warningText}>{warning}</Text>}

          <CherryButton
            title="HOME"
            variant="secondary"
            accessibilityLabel="Voltar para a tela inicial"
            onPress={() => navigation.popToTop()}
            style={styles.homeBtn}
          />
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: 'rgba(255, 248, 242, 0.96)',
    borderRadius: radius.xxl,
    borderWidth: 3,
    borderColor: colors.blossom300,
    borderBottomWidth: 6,
    borderBottomColor: colors.cherryLip,
    padding: spacing.lg,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    letterSpacing: 0.8,
  },
  settingsList: {
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom100,
    padding: 12,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  labelCol: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: typography.fontFamily.display,
    color: colors.ink900,
  },
  desc: {
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    color: colors.ink700,
    marginTop: 2,
  },
  warningText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
    color: colors.cherry700,
    textAlign: 'center',
  },
  tipBox: {
    backgroundColor: '#F3EFEA',
    borderRadius: radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2D7CC',
  },
  tipText: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: typography.fontFamily.body,
    color: colors.ink700,
    textAlign: 'center',
  },
  tipBold: {
    fontWeight: '800',
    color: colors.cherry700,
  },
  homeBtn: {
    width: '100%',
  },
});
