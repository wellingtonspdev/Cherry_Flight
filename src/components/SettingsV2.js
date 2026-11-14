import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './CherryButton';
import CherryPlayer from './CherryV2';
import World from './WorldV2';
import { useProgress } from '../game/ProgressProviderV2';
import { MUSIC_TRACKS } from '../game/audioSourcesV2';
import { audioManager } from '../game/AudioManagerV2';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function SettingsV2({ navigation }) {
  const { width, height } = useWindowDimensions();
  const { data, loaded, setSetting, selectMusic, warning } = useProgress();

  const selectedId = data.selectedMusic || 'auto';
  const currentIndex = Math.max(0, MUSIC_TRACKS.findIndex(t => t.id === selectedId));
  const currentTrack = MUSIC_TRACKS[currentIndex] || MUSIC_TRACKS[0];

  useEffect(() => {
    return () => {
      audioManager.release();
    };
  }, []);

  const changeTrackByIndex = (delta) => {
    if (!loaded) return;
    const nextIndex = (currentIndex + delta + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    const nextTrack = MUSIC_TRACKS[nextIndex];
    selectMusic(nextTrack.id);
    if (data.settings.music) {
      audioManager.settings({ selectedMusic: nextTrack.id });
      audioManager.prepare(nextTrack.id === 'auto' ? 'first_bloom' : nextTrack.id);
      audioManager.start();
    }
  };

  const handleSelectTrack = (trackId) => {
    if (!loaded) return;
    selectMusic(trackId);
    if (data.settings.music) {
      audioManager.settings({ selectedMusic: trackId });
      audioManager.prepare(trackId === 'auto' ? 'first_bloom' : trackId);
      audioManager.start();
    }
  };

  return (
    <View style={styles.root}>
      <World
        biome="golden_bloom"
        screenWidth={width}
        screenHeight={height}
        animatePetals
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <CherryPlayer size={44} state="idle" />
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
                    onValueChange={value => {
                      setSetting(key, value);
                      if (key === 'music' && !value) {
                        audioManager.pause();
                      }
                    }}
                    trackColor={{ true: colors.cherry700, false: '#D4C9C0' }}
                    thumbColor={data.settings[key] ? '#FFF8F2' : '#F4ECE4'}
                  />
                </View>
              ))}
            </View>

            {/* Seletor de Trilha Sonora / Jukebox */}
            <View style={styles.jukeboxSection}>
              <View style={styles.jukeboxHeader}>
                <Text style={styles.jukeboxTitle}>🎵 Trilha Sonora (BGM)</Text>
                <Text style={styles.jukeboxSubtitle}>Escolha a música que toca no jogo</Text>
              </View>

              <View style={styles.trackCard}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Música anterior"
                  onPress={() => changeTrackByIndex(-1)}
                  style={styles.navButton}
                >
                  <Text style={styles.navButtonText}>◀</Text>
                </Pressable>

                <View style={styles.trackInfo}>
                  <Text numberOfLines={1} style={styles.trackTitle}>{currentTrack.title}</Text>
                  <Text numberOfLines={1} style={styles.trackArtist}>{currentTrack.artist}</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Próxima música"
                  onPress={() => changeTrackByIndex(1)}
                  style={styles.navButton}
                >
                  <Text style={styles.navButtonText}>▶</Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {MUSIC_TRACKS.map(track => {
                  const active = track.id === selectedId;
                  return (
                    <Pressable
                      key={track.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar faixa ${track.title}`}
                      onPress={() => handleSelectTrack(track.id)}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {track.id === 'auto' ? '⚡ Auto' : track.id === 'luolei_yuexinmiao' ? '🌟 落泪 (月薪喵)' : track.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                🎧 <Text style={styles.tipBold}>Dica:</Text> Você pode escolher qualquer música do catálogo ou selecionar "落泪 (我真的特别爱你)" para curtir enquanto joga!
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255, 248, 242, 0.96)',
    borderRadius: radius.xxl,
    borderWidth: 3,
    borderColor: colors.blossom300,
    borderBottomWidth: 6,
    borderBottomColor: colors.cherryLip,
    padding: spacing.md,
    gap: 12,
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
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    letterSpacing: 0.8,
  },
  settingsList: {
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom100,
    padding: 10,
  },
  row: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  labelCol: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: typography.fontFamily.display,
    color: colors.ink900,
  },
  desc: {
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    color: colors.ink700,
    marginTop: 1,
  },
  jukeboxSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.blossom200,
    padding: 10,
    gap: 8,
  },
  jukeboxHeader: {
    flexDirection: 'column',
    gap: 2,
  },
  jukeboxTitle: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
  },
  jukeboxSubtitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    color: colors.ink700,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8F2',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.blossom300,
    padding: 6,
    gap: 8,
  },
  trackInfo: {
    flex: 1,
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: typography.fontFamily.display,
    color: colors.cherry700,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    color: colors.ink700,
    textAlign: 'center',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cherryLip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#FFF8F2',
    fontSize: 13,
    fontWeight: '900',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: '#F3EFEA',
    borderWidth: 1.5,
    borderColor: '#E2D7CC',
  },
  chipActive: {
    backgroundColor: colors.cherryLip,
    borderColor: colors.cherry700,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: typography.fontFamily.body,
    color: colors.ink900,
  },
  chipTextActive: {
    color: '#FFF8F2',
    fontWeight: '800',
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
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2D7CC',
  },
  tipText: {
    fontSize: 11,
    lineHeight: 14,
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

