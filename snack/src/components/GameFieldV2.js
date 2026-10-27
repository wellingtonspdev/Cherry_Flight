import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, AppState, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createRound, jumpRound, stepRound, recordRoundMetric, LEVELS } from '../game/engineV2';
import { GAME } from '../game/constants';
import { preloadChapter, vectorRegistry } from '../game/assetPreloaderV2';
import { triggerCollisionFeedback, triggerJumpFeedback, triggerScoreFeedback } from '../game/feedback';
import { PlayerActorV2 } from './CherryV2';
import BloomBranch from './BloomBranchV2';
import World from './WorldV2';
import ScoreHUD from './ScoreHUD';
import GameResult from './GameResultV2';
import BloomBurst from './BloomBurstV2';
import { colors, radius, spacing } from '../theme/theme';

export default function GameFieldV2({ navigation, route }) {
  const viewport = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const [layout, setLayout] = useState(null);
  const [scene, setScene] = useState(null);
  const [status, setStatus] = useState('LOADING');
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [biome, setBiome] = useState('first_bloom');
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState('');
  const roundRef = useRef(null);
  const raf = useRef(null);
  const lastTime = useRef(null);
  const shownSeconds = useRef(0);
  const actor = useRef(null);
  const slots = useMemo(() => Array.from({ length: 5 }, () => createRef()), []);
  const distance = useRef(new Animated.Value(0)).current;
  const diagnostics = useRef({ frames: 0, rootRenders: 0, pairRenders: 0, pairMounts: 0, actorRenders: 0, longFrames: 0, maxFrameMs: 0, inputCount: 0 });
  diagnostics.current.rootRenders++;
  const width = Math.round(layout?.width || viewport.width || 844);
  const height = Math.round(layout?.height || viewport.height || 390);
  const levelId = Number(route?.params?.levelId || 1);
  const endless = route?.params?.mode === 'endless';
  const onPairRender = useCallback(() => { diagnostics.current.pairRenders++; }, []);
  const onActorRender = useCallback(() => { diagnostics.current.actorRenders++; }, []);
  const onPrepared = useCallback((id, epoch) => { if (roundRef.current) recordRoundMetric(roundRef.current, 'pair_visual_prepared', { id, epoch }); }, []);
  const onMount = useCallback(id => {
    diagnostics.current.pairMounts++;
    if (roundRef.current) recordRoundMetric(roundRef.current, 'pair_mounted', { id });
  }, []);

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null; lastTime.current = null;
    vectorRegistry.setPlaying(false);
  }, []);

  useEffect(() => {
    if (!focused) return undefined;
    let cancelled = false;
    stop(); setStatus('LOADING'); setError('');
    (async () => {
      try {
        const next = createRound({ width, height: height - GAME.groundHeight, levelId, endless });
        await preloadChapter(next.biome, width, height, endless);
        if (cancelled) return;
        roundRef.current = next;
        setScore(0); setSeconds(0); shownSeconds.current = 0; setBiome(next.biome); distance.setValue(0);
        setScene(next);
      } catch (failure) {
        if (!cancelled) setError(failure.message === 'Game field is too small for safe obstacle geometry' ? 'Aumente a altura da janela para jogar com segurança.' : 'Não foi possível preparar este nível. Volte e tente novamente.');
      }
    })();
    return () => { cancelled = true; stop(); };
  }, [focused, width, height, levelId, endless, retry, stop, distance]);

  useEffect(() => {
    if (!scene || !focused) return;
    for (let i = 0; i < scene.pairs.length; i++) slots[i].current?.prepare(scene.pairs[i]);
    actor.current?.reset(scene.player);
    recordRoundMetric(scene, 'renderer_ready', { mountedPairs: scene.pairs.length, futurePrepared: scene.future.length });
    setStatus('READY');
  }, [scene, slots, focused]);

  const frame = useCallback(timestamp => {
    const round = roundRef.current;
    if (!round || round.status !== 'PLAYING') { raf.current = null; return; }
    const elapsed = lastTime.current === null ? 0 : (timestamp - lastTime.current) / 1000;
    lastTime.current = timestamp;
    diagnostics.current.frames++;
    diagnostics.current.maxFrameMs = Math.max(diagnostics.current.maxFrameMs, elapsed * 1000);
    if (elapsed > 0.05) diagnostics.current.longFrames++;
    stepRound(round, elapsed);
    actor.current?.update(round.player);
    for (let i = 0; i < round.pairs.length; i++) slots[i].current?.update(round.pairs[i]);
    distance.setValue(round.distance);
    const wholeSeconds = Math.floor(round.elapsed);
    if (shownSeconds.current !== wholeSeconds) { shownSeconds.current = wholeSeconds; setSeconds(wholeSeconds); }
    for (const event of round.events) {
      if (event.type === 'score') { setScore(round.score); actor.current?.score(); triggerScoreFeedback(); }
      if (event.type === 'collision') { actor.current?.hit(); triggerCollisionFeedback(); }
      if (event.type === 'biome') setBiome(event.biome);
    }
    if (round.status !== 'PLAYING') { stop(); setStatus(round.status); return; }
    raf.current = requestAnimationFrame(frame);
  }, [distance, slots, stop]);

  const jump = useCallback(() => {
    if (!focused) return;
    const round = roundRef.current;
    if (!round || status === 'LOADING') return;
    const wasReady = round.status === 'READY';
    if (!jumpRound(round)) return;
    diagnostics.current.inputCount++;
    actor.current?.jump(); triggerJumpFeedback();
    if (wasReady) {
      vectorRegistry.setPlaying(true); setStatus('PLAYING');
      lastTime.current = null; raf.current = requestAnimationFrame(frame);
    }
  }, [focused, status, frame]);

  const goHome = useCallback(() => { stop(); navigation.popToTop(); }, [stop, navigation]);
  const retryLevel = useCallback(() => { stop(); setRetry(value => value + 1); }, [stop]);
  const togglePause = useCallback(() => {
    const round = roundRef.current;
    if (!round) return;
    if (round.status === 'PLAYING') { round.status = 'PAUSED'; stop(); setStatus('PAUSED'); }
    else if (round.status === 'PAUSED') {
      round.status = 'PLAYING'; vectorRegistry.setPlaying(true); setStatus('PLAYING');
      lastTime.current = null; raf.current = requestAnimationFrame(frame);
    }
  }, [stop, frame]);

  useEffect(() => {
    if (!focused) return undefined;
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active' && roundRef.current?.status === 'PLAYING') togglePause();
    });
    return () => subscription.remove();
  }, [focused, togglePause]);

  useEffect(() => {
    if (!focused || Platform.OS !== 'web') return undefined;
    const handler = event => {
      if (event.repeat) return;
      if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) { event.preventDefault(); jump(); }
      if (['KeyR', 'Enter'].includes(event.code) && roundRef.current?.status === 'GAME_OVER') { event.preventDefault(); retryLevel(); }
      if (event.code === 'KeyP') { event.preventDefault(); togglePause(); }
      if (['Escape', 'KeyH'].includes(event.code)) { event.preventDefault(); goHome(); }
    };
    window.addEventListener('keydown', handler);
    const debug = {
      snapshot: () => {
        const r = roundRef.current;
        return r ? { status: r.status, levelId: r.levelId, endless: r.endless, biome: r.biome, score: r.score, elapsed: r.elapsed, player: { ...r.player }, pairs: r.pairs.map(p => ({ ...p })), future: r.future.map(p => ({ ...p, x: p.worldX - r.distance })), params: { ...r.params }, rafActive: raf.current !== null, diagnostics: { ...diagnostics.current }, metrics: [...r.metrics], vectorStats: { parses: vectorRegistry.stats.parses, parsesDuringPlay: vectorRegistry.stats.parsesDuringPlay, chapters: [...vectorRegistry.stats.chapters] } } : null;
      },
    };
    if (__DEV__) window.__CHERRY_BLOOM_V2__ = debug;
    return () => { window.removeEventListener('keydown', handler); if (window.__CHERRY_BLOOM_V2__ === debug) delete window.__CHERRY_BLOOM_V2__; };
  }, [focused, jump, retryLevel, togglePause, goHome]);

  const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];
  const phaseConfig = { id: biome, label: level.chapterName.toUpperCase(), hudScrim: 'rgba(37,26,32,.45)' };
  return (
    <View style={styles.root} onLayout={({ nativeEvent: { layout: next } }) => { if (next.width > 0 && next.height > 0) setLayout(old => old?.width === next.width && old?.height === next.height ? old : { width: next.width, height: next.height }); }}>
      <World biome={biome} screenWidth={width} screenHeight={height} distance={distance} animatePetals={focused && ['READY', 'PLAYING'].includes(status)} />
      <Pressable accessibilityRole="button" accessibilityLabel="Área do jogo Cherry Bloom. Toque para fazer a Cherry saltar." onPressIn={jump} delayPressIn={0} disabled={status === 'LOADING'} style={styles.field}>
        {scene && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: status === 'LOADING' ? 0 : 1 }]}>
          {scene.pairs.map((pair, index) => <BloomBranch key={pair.id} ref={slots[index]} pair={pair} playableHeight={scene.height} onMount={onMount} onPrepared={onPrepared} onRender={onPairRender} />)}
          <PlayerActorV2 ref={actor} round={scene} active={focused && status === 'READY'} onRender={onActorRender} />
        </View>}
        {status === 'READY' && <View pointerEvents="none" style={styles.prompt}><View style={styles.banner}><Text style={styles.readyTitle}>TAP TO FLY</Text><Text style={styles.hint}>{endless ? 'Endless Bloom' : `LEVEL ${level.id} · ${level.targetScore} pontos`} · Toque ou use ESPAÇO</Text></View></View>}
      </Pressable>
      <ScoreHUD score={score} phaseConfig={phaseConfig} topInset={insets.top} />
      <View pointerEvents="box-none" style={[styles.topBar, { top: Math.max(8, insets.top + 4), paddingLeft: Math.max(12, insets.left + 8), paddingRight: Math.max(12, insets.right + 8) }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar para a tela inicial" onPress={goHome} style={styles.pill}><Text style={styles.pillText}>← HOME</Text></Pressable>
        <View style={styles.rightBar}>
          <View pointerEvents="none" style={styles.time}><Text style={styles.timeText}>{endless ? '∞' : `L${level.id}`} · {seconds}s</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel={status === 'PAUSED' ? 'Retomar partida' : 'Pausar partida'} onPress={togglePause} style={styles.pill}><Text style={styles.pillText}>{status === 'PAUSED' ? '▶' : 'Ⅱ'}</Text></Pressable>
        </View>
      </View>
      {status === 'LOADING' && <View style={styles.loading} accessibilityLiveRegion="polite"><Text style={styles.readyTitle}>{error || 'Preparando o jardim…'}</Text><Text style={styles.hint}>Assets e obstáculos ficam prontos antes do voo.</Text>{!!error && <Pressable onPress={goHome} style={styles.pill}><Text style={styles.pillText}>HOME</Text></Pressable>}</View>}
      {status === 'PAUSED' && <GameResult status="PAUSED" score={score} level={level} onRetry={togglePause} onHome={goHome} />}
      {['GAME_OVER', 'LEVEL_COMPLETE'].includes(status) && <>
        {status === 'LEVEL_COMPLETE' && <BloomBurst biome={biome} />}
        <GameResult status={status} score={score} level={level} onRetry={retryLevel} onHome={goHome} onNext={() => navigation.setParams({ levelId: Math.min(12, levelId + 1) })} />
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden', backgroundColor: colors.cream50 },
  field: { flex: 1 },
  topBar: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 },
  rightBar: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  pill: { minWidth: 44, minHeight: 44, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.cream50, borderWidth: 2, borderColor: colors.cherry700, alignItems: 'center', justifyContent: 'center' },
  pillText: { color: colors.cherry700, fontWeight: '800', fontSize: 13 },
  time: { borderRadius: radius.pill, backgroundColor: 'rgba(37,26,32,.6)', padding: 10 },
  timeText: { color: colors.cream50, fontWeight: '800', fontSize: 12 },
  prompt: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 16 },
  banner: { backgroundColor: 'rgba(255,248,242,.95)', borderRadius: radius.lg, borderWidth: 2, borderColor: colors.cherry700, padding: spacing.md, alignItems: 'center' },
  readyTitle: { fontSize: 22, fontWeight: '900', color: colors.cherry700, textAlign: 'center' },
  hint: { fontSize: 13, color: colors.ink900, textAlign: 'center', marginTop: 4 },
  loading: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.cream50, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12, zIndex: 70 },
});
