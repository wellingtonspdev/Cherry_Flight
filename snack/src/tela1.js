// Cherry Bloom — Tela 1: Welcome / Boas-vindas
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 13.1)
// Mandatory file name: src/tela1.js

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './components/CherryButton';
import CherryPlayer from './components/CherryV2';
import LogoLockup from './components/LogoLockup';
import PhaseBackground from './components/WorldV2';
import { PHASES } from './game/phase';
import { usePwaInstall } from './game/pwa';
import { colors, radius, shadows, spacing } from './theme/theme';
import { useProgress } from './game/ProgressProviderV2';
import { useIsFocused } from '@react-navigation/native';
import { audioManager } from './game/AudioManagerV2';

export default function Tela1({ navigation }) {
  const progress = useProgress();
  const focused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 360 || height < 660;
  const isLandscape = width > height;
  const { canInstall, isIosSafariPrompt, promptInstall } = usePwaInstall();
  useEffect(() => {
    if (!focused) return undefined;
    audioManager.prepare('first_bloom');
    return () => audioManager.release();
  }, [focused]);

  // Motion: logo reveal 400ms, Cherry idle bob 1600ms, buttons stagger
  const logoAnim = useRef(new Animated.Value(0)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;
  const btn1Anim = useRef(new Animated.Value(0)).current;
  const btn2Anim = useRef(new Animated.Value(0)).current;
  const btn3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!focused) return undefined;
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.stagger(60, [
        Animated.timing(btn1Anim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(btn2Anim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(btn3Anim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: -6,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 6,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop.start();

    return () => {
      bobLoop.stop();
    };
  }, [logoAnim, bobAnim, btn1Anim, btn2Anim, btn3Anim, focused]);

  return (
    <View style={styles.root}>
      <PhaseBackground
        phaseConfig={PHASES.firstBloom}
        screenWidth={width}
        screenHeight={height}
        animatePetals
        showGround
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isLandscape && styles.landscapeContent,
            { paddingHorizontal: width < 350 ? spacing.md : spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Logo Lockup */}
          <View style={isLandscape && styles.brandColumn}>
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: logoAnim,
                transform: [
                  {
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.88, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <LogoLockup compact={isCompact} />
          </Animated.View>

          {/* 2. Cherry Idle Mascot Showcase */}
          <View style={styles.heroCenter}>
            <View style={[styles.mascotHalo, isLandscape && styles.landscapeHalo]}>
              <Animated.View style={{ transform: [{ translateY: bobAnim }] }}>
                <CherryPlayer size={isLandscape ? 64 : isCompact ? 76 : 92} state="idle" />
              </Animated.View>
            </View>
            <View style={styles.lorePill}>
              <Text style={styles.loreText}>
                Ajude a Cherry a cruzar o Bloom Garden!
              </Text>
            </View>
          </View>

          </View>

          {/* 3. Navigation Actions (Play, How to Play, Credits) */}
          <View style={[styles.menuCard, isLandscape && styles.landscapeMenu]}>
            <Animated.View style={[styles.btnWrap, { opacity: btn1Anim }]}>
              <CherryButton
                title={progress.hasSave ? 'CONTINUE' : 'PLAY'}
                variant="primary"
                accessibilityLabel="Iniciar o jogo Cherry Bloom"
                disabled={!progress.loaded}
                onPress={async () => { const id = progress.data.lastPlayedLevel; await progress.begin(id); navigation.navigate('Game', { levelId: id, mode: 'campaign' }); }}
                style={styles.fullWidthBtn}
              />
            </Animated.View>

            <View style={styles.btnWrap}><CherryButton title="LEVEL SELECT" variant="secondary" disabled={!progress.loaded} onPress={() => navigation.navigate('LevelSelect')} style={styles.fullWidthBtn} /></View>
            <View style={styles.btnWrap}><CherryButton title="SETTINGS" variant="ghost" onPress={() => navigation.navigate('Settings')} style={styles.fullWidthBtn} /></View>
            {!!progress.warning && <Text style={styles.loreText}>{progress.warning}</Text>}

            <Animated.View style={[styles.btnWrap, { opacity: btn2Anim }]}>
              <CherryButton
                title="HOW TO PLAY"
                variant="secondary"
                accessibilityLabel="Ver instruções de como jogar"
                onPress={() => navigation.navigate('Instructions')}
                style={styles.fullWidthBtn}
              />
            </Animated.View>

            <Animated.View style={[styles.btnWrapLast, { opacity: btn3Anim }]}>
              <CherryButton
                title="CREDITS"
                variant="ghost"
                accessibilityLabel="Ver créditos acadêmicos da FATEC"
                onPress={() => navigation.navigate('Credits')}
                style={styles.fullWidthBtn}
              />
            </Animated.View>

            {canInstall && (
              <View style={styles.pwaWrap}>
                <CherryButton
                  title="INSTALAR APP (PWA)"
                  variant="secondary"
                  accessibilityLabel="Instalar Cherry Bloom como aplicativo no dispositivo"
                  onPress={promptInstall}
                  style={styles.fullWidthBtn}
                />
              </View>
            )}

            {!canInstall && isIosSafariPrompt && (
              <View style={styles.iosPwaHint}>
                <Text style={styles.iosPwaHintText}>
                  Para instalar no iPhone/iPad: toque em Compartilhar e selecione "Adicionar à Tela de Início".
                </Text>
              </View>
            )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + 16,
  },
  logoSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  landscapeContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  brandColumn: {
    flex: 1,
    maxWidth: 380,
    alignItems: 'center',
  },
  landscapeMenu: {
    flex: 1,
  },
  landscapeHalo: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  heroCenter: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  mascotHalo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 248, 242, 0.72)',
    borderWidth: 3,
    borderColor: colors.blossom300,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.warmCard,
  },
  lorePill: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255, 248, 242, 0.92)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.blossom300,
  },
  loreText: {
    color: colors.ink900,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  menuCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(255, 248, 242, 0.92)',
    borderRadius: radius.xl,
    borderWidth: 2.5,
    borderColor: colors.blossom300,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.warmCard,
  },
  btnWrap: {
    width: '100%',
    marginBottom: spacing.sm + 4,
  },
  btnWrapLast: {
    width: '100%',
  },
  pwaWrap: {
    width: '100%',
    marginTop: spacing.sm + 4,
  },
  iosPwaHint: {
    width: '100%',
    marginTop: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.blossom300,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 4,
  },
  iosPwaHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.bark600,
    textAlign: 'center',
    lineHeight: 16,
  },
  fullWidthBtn: {
    width: '100%',
  },
});
