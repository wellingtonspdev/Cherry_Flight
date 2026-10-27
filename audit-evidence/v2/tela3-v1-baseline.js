// Cherry Bloom — Tela 3: Core Gameplay
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 7.3, 8, 9, 10.3)
// Mandatory file name: src/tela3.js

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BloomBranchPair from './components/BloomBranchPair';
import CherryPlayer from './components/CherryPlayer';
import GameOverCard from './components/GameOverCard';
import PhaseBackground from './components/PhaseBackground';
import ScoreHUD from './components/ScoreHUD';
import {
  checkCollision,
  checkPairScored,
  getPlayerHitbox,
} from './game/collision';
import { GAME, GAME_STATE } from './game/constants';
import {
  createInitialObstacles,
  updateAndRecycleObstacles,
} from './game/createObstacle';
import {
  triggerCollisionFeedback,
  triggerJumpFeedback,
  triggerScoreFeedback,
} from './game/feedback';
import { getPhaseConfig } from './game/phase';
import { colors, radius, shadows, spacing } from './theme/theme';

const BEST_SCORE_KEY = '@cherry_bloom_best_score_v1';

export default function Tela3({ navigation }) {
  const { width: rawWidth, height: rawHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [gameArea, setGameArea] = useState(null);

  const screenWidth = gameArea?.width || rawWidth || 844;
  const screenHeight = gameArea?.height || rawHeight || 390;
  const playableHeight = Math.max(1, screenHeight - GAME.groundHeight);
  const playerX = Math.round(screenWidth * GAME.playerXRatio);
  const initialPlayerY = Math.round(playableHeight * 0.44);

  // Semantic UI state
  const [gameState, setGameState] = useState(GAME_STATE.READY);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [cherryPose, setCherryPose] = useState('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [renderTick, setRenderTick] = useState(0);

  // High-frequency mutable physics state in refs
  const gameStateRef = useRef(GAME_STATE.READY);
  const playerYRef = useRef(initialPlayerY);
  const velocityYRef = useRef(0);
  const scoreRef = useRef(0);
  const bestScoreRef = useRef(0);
  const obstaclesRef = useRef(createInitialObstacles(screenWidth, playableHeight));
  const rafIdRef = useRef(null);
  const lastFrameTimeRef = useRef(null);
  const elapsedAccumulatorRef = useRef(0);
  const poseTimeoutRef = useRef(null);

  // Visual squash/stretch and idle bob animations (never alter physics truth)
  const scaleXAnim = useRef(new Animated.Value(1)).current;
  const scaleYAnim = useRef(new Animated.Value(1)).current;
  const readyBobAnim = useRef(new Animated.Value(0)).current;

  // Load persisted best score safely
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(BEST_SCORE_KEY)
      .then((stored) => {
        if (isMounted && stored) {
          const parsed = parseInt(stored, 10);
          if (!Number.isNaN(parsed) && parsed > 0) {
            bestScoreRef.current = parsed;
            setBestScore(parsed);
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Ready state gentle bobbing loop
  useEffect(() => {
    let loop;
    if (gameState === GAME_STATE.READY) {
      readyBobAnim.setValue(0);
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(readyBobAnim, {
            toValue: -5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(readyBobAnim, {
            toValue: 5,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      readyBobAnim.setValue(0);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [gameState, readyBobAnim]);

  const stopGameLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastFrameTimeRef.current = null;
  }, []);

  const clearPoseTimer = useCallback(() => {
    if (poseTimeoutRef.current !== null) {
      clearTimeout(poseTimeoutRef.current);
      poseTimeoutRef.current = null;
    }
  }, []);

  const triggerJumpSquash = useCallback(() => {
    scaleXAnim.setValue(1);
    scaleYAnim.setValue(1);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleXAnim, {
          toValue: 1.08,
          duration: 75,
          useNativeDriver: true,
        }),
        Animated.timing(scaleYAnim, {
          toValue: 0.9,
          duration: 75,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleXAnim, {
          toValue: 0.94,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.timing(scaleYAnim, {
          toValue: 1.1,
          duration: 110,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleXAnim, {
          toValue: 1,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.timing(scaleYAnim, {
          toValue: 1,
          duration: 110,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleXAnim, scaleYAnim]);

  const triggerCollisionSquash = useCallback(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleXAnim, {
          toValue: 1.16,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(scaleYAnim, {
          toValue: 0.78,
          duration: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleXAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(scaleYAnim, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleXAnim, scaleYAnim]);

  const handleGameOver = useCallback(() => {
    stopGameLoop();
    clearPoseTimer();
    gameStateRef.current = GAME_STATE.GAME_OVER;
    setGameState(GAME_STATE.GAME_OVER);
    setCherryPose('hit');
    triggerCollisionSquash();
    triggerCollisionFeedback();

    if (scoreRef.current > bestScoreRef.current) {
      bestScoreRef.current = scoreRef.current;
      setBestScore(scoreRef.current);
      AsyncStorage.setItem(BEST_SCORE_KEY, String(scoreRef.current)).catch(() => {});
    }
  }, [stopGameLoop, clearPoseTimer, triggerCollisionSquash]);

  // Main deterministic delta-time game loop
  const stepFrame = useCallback(
    (timestamp) => {
      if (gameStateRef.current !== GAME_STATE.PLAYING) {
        return;
      }

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const rawDt = (timestamp - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = timestamp;
      const dt = Math.min(Math.max(rawDt, 0.001), GAME.maxDeltaTime);

      // Track game time (optional bonus from academic brief)
      elapsedAccumulatorRef.current += dt;
      const wholeSeconds = Math.floor(elapsedAccumulatorRef.current);
      setElapsedSeconds((prev) => (prev !== wholeSeconds ? wholeSeconds : prev));

      // 1. Integrate vertical velocity & position
      const nextVy = Math.min(
        velocityYRef.current + GAME.gravity * dt,
        GAME.maxFallVelocity
      );
      velocityYRef.current = nextVy;
      const nextY = playerYRef.current + nextVy * dt;
      playerYRef.current = nextY;

      if (nextVy > 140) {
        setCherryPose((prev) => (prev !== 'fall' ? 'fall' : prev));
      }

      // 2. Advance & recycle obstacle pairs
      const updatedPairs = updateAndRecycleObstacles(
        obstaclesRef.current,
        dt,
        playableHeight,
        GAME.obstacleSpeed,
        GAME.obstacleSpacing
      );

      // 3. Check collisions first (Spec AC-113: no score if collision happens before crossing)
      const playerBox = getPlayerHitbox(playerX, nextY, GAME.playerSize);
      const collisionResult = checkCollision(
        playerBox,
        updatedPairs,
        playableHeight
      );

      if (collisionResult.collided) {
        obstaclesRef.current = updatedPairs;
        setRenderTick((t) => (t + 1) % 1000000);
        handleGameOver();
        return;
      }

      // 4. Check scoring (once per crossed pair)
      let gainedPoints = 0;
      for (let i = 0; i < updatedPairs.length; i += 1) {
        const pair = updatedPairs[i];
        if (checkPairScored(playerBox.x, pair)) {
          pair.scored = true;
          gainedPoints += 1;
        }
      }

      if (gainedPoints > 0) {
        scoreRef.current += gainedPoints;
        setScore(scoreRef.current);
        triggerScoreFeedback();
      }

      obstaclesRef.current = updatedPairs;
      setRenderTick((t) => (t + 1) % 1000000);

      rafIdRef.current = requestAnimationFrame(stepFrame);
    },
    [playableHeight, playerX, handleGameOver]
  );

  const startGameLoop = useCallback(() => {
    stopGameLoop();
    lastFrameTimeRef.current = null;
    rafIdRef.current = requestAnimationFrame(stepFrame);
  }, [stopGameLoop, stepFrame]);

  // Apply upward jump impulse
  const applyJump = useCallback(() => {
    velocityYRef.current = GAME.jumpVelocity;
    setCherryPose('jump');
    triggerJumpSquash();
    triggerJumpFeedback();

    clearPoseTimer();
    poseTimeoutRef.current = setTimeout(() => {
      if (gameStateRef.current === GAME_STATE.PLAYING) {
        setCherryPose('idle');
      }
    }, 220);
  }, [triggerJumpSquash, clearPoseTimer]);

  // Tap handler in active game field (Spec 13.3)
  const handleFieldPress = useCallback(() => {
    if (gameStateRef.current === GAME_STATE.GAME_OVER) {
      // Spec 13.3: GAME_OVER tap must not accidentally restart unless on explicit button
      return;
    }

    if (gameStateRef.current === GAME_STATE.READY) {
      gameStateRef.current = GAME_STATE.PLAYING;
      setGameState(GAME_STATE.PLAYING);
      applyJump();
      startGameLoop();
      return;
    }

    if (gameStateRef.current === GAME_STATE.PLAYING) {
      applyJump();
    }
  }, [applyJump, startGameLoop]);

  // Full deterministic state reset for Play Again (Spec 8.8)
  const handleRestart = useCallback(() => {
    stopGameLoop();
    clearPoseTimer();
    scaleXAnim.setValue(1);
    scaleYAnim.setValue(1);
    playerYRef.current = initialPlayerY;
    velocityYRef.current = 0;
    scoreRef.current = 0;
    elapsedAccumulatorRef.current = 0;
    obstaclesRef.current = createInitialObstacles(screenWidth, playableHeight);

    setScore(0);
    setElapsedSeconds(0);
    setCherryPose('idle');
    gameStateRef.current = GAME_STATE.READY;
    setGameState(GAME_STATE.READY);
    setRenderTick((t) => t + 1);
  }, [
    stopGameLoop,
    clearPoseTimer,
    scaleXAnim,
    scaleYAnim,
    initialPlayerY,
    screenWidth,
    playableHeight,
  ]);

  const handleGoHome = useCallback(() => {
    handleRestart();
    navigation.navigate('Welcome');
  }, [handleRestart, navigation]);

  // A resized field starts a fresh round so physics never retain obsolete bounds.
  useEffect(() => {
    handleRestart();
  }, [handleRestart]);

  // Cleanup on unmount or blur, and reset to READY on focus (Spec 7.3 & AC-115)
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (gameStateRef.current !== GAME_STATE.READY) {
        handleRestart();
      }
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      stopGameLoop();
      clearPoseTimer();
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      stopGameLoop();
      clearPoseTimer();
    };
  }, [navigation, handleRestart, stopGameLoop, clearPoseTimer]);

  // Desktop & Web Keyboard Controls (Space, ArrowUp, W -> Jump/Start; R/Enter -> Play Again; Escape/H -> Home)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (!navigation.isFocused()) return;
      if (event.repeat) return;
      const code = event.code || '';
      const key = (event.key || '').toLowerCase();

      if (
        code === 'Space' ||
        code === 'ArrowUp' ||
        code === 'KeyW' ||
        key === ' ' ||
        key === 'arrowup' ||
        key === 'w'
      ) {
        event.preventDefault();
        if (gameStateRef.current === GAME_STATE.GAME_OVER) {
          handleRestart();
        } else {
          handleFieldPress();
        }
        return;
      }

      if (
        (code === 'KeyR' || code === 'Enter' || key === 'r' || key === 'enter') &&
        gameStateRef.current === GAME_STATE.GAME_OVER
      ) {
        event.preventDefault();
        handleRestart();
        return;
      }

      if (code === 'Escape' || code === 'KeyH' || key === 'escape' || key === 'h') {
        event.preventDefault();
        handleGoHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFieldPress, handleRestart, handleGoHome, navigation]);

  const currentPhase = getPhaseConfig(score);

  // Subtle tilt based on vertical velocity
  const tiltDegrees =
    gameState === GAME_STATE.READY
      ? 0
      : Math.max(-22, Math.min(28, Math.round(velocityYRef.current * 0.065)));

  return (
    <View
      style={styles.root}
      onLayout={({ nativeEvent: { layout } }) => {
        setGameArea((previous) =>
          previous?.width === layout.width && previous?.height === layout.height
            ? previous
            : { width: layout.width, height: layout.height }
        );
      }}
    >
      {/* Layer 1–5 & 7: World Phase Background + Petals + Ground */}
      <PhaseBackground
        phaseConfig={currentPhase}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        animatePetals={gameState !== GAME_STATE.GAME_OVER}
        showGround
      />

      {/* Interactive Game Field */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Área do jogo Cherry Bloom. Toque para fazer a Cherry saltar."
        onPressIn={handleFieldPress}
        delayPressIn={0}
        style={styles.gameField}
      >
        {/* Layer 6: Obstacle Pairs */}
        {obstaclesRef.current.map((pair) => (
          <BloomBranchPair
            key={pair.id}
            pair={pair}
            playableHeight={playableHeight}
            phaseVariant={currentPhase.branchVariant}
          />
        ))}

        {/* Layer 8: Cherry Protagonist */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.playerWrapper,
            {
              width: GAME.playerSize,
              height: GAME.playerSize,
              transform: [
                { translateX: playerX },
                { translateY: playerYRef.current },
                { translateY: readyBobAnim },
                { rotate: `${tiltDegrees}deg` },
                { scaleX: scaleXAnim },
                { scaleY: scaleYAnim },
              ],
            },
          ]}
        >
          <CherryPlayer size={GAME.playerSize} state={cherryPose} />
        </Animated.View>

        {/* Ready Prompt Overlay */}
        {gameState === GAME_STATE.READY && (
          <View pointerEvents="none" style={styles.readyOverlay}>
            <View style={styles.readyBanner}>
              <Text style={styles.readyTitle}>TAP TO FLY</Text>
              <Text style={styles.readySubtitle}>
                {Platform.OS === 'web'
                  ? 'Toque, clique ou pressione ESPAÇO / ↑ para voar'
                  : 'Toque na tela para iniciar o voo'}
              </Text>
            </View>
          </View>
        )}
      </Pressable>

      {/* Layer 9: HUD & Safe Top Controls */}
      <ScoreHUD
        score={score}
        phaseConfig={currentPhase}
        topInset={insets.top}
      />

      {/* Top Bar: Home button & Elapsed Time Pill */}
      <View
        pointerEvents="box-none"
        style={[
          styles.topBar,
          {
            top: Math.max(14, insets.top + 8),
            paddingLeft: Math.max(spacing.md, insets.left + spacing.sm),
            paddingRight: Math.max(spacing.md, insets.right + spacing.sm),
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela inicial"
          onPress={handleGoHome}
          style={styles.iconPillButton}
        >
          <Text style={styles.iconPillText}>← HOME</Text>
        </Pressable>

        <View style={styles.timePill} pointerEvents="none">
          <Text style={styles.timePillText}>{elapsedSeconds}s</Text>
        </View>
      </View>

      {/* Game Over Modal Card */}
      {gameState === GAME_STATE.GAME_OVER && (
        <GameOverCard
          score={score}
          bestScore={bestScore}
          phaseLabel={currentPhase.label}
          onPlayAgain={handleRestart}
          onHome={handleGoHome}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.skyDay,
    overflow: 'hidden',
  },
  gameField: {
    flex: 1,
  },
  playerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 30,
  },
  readyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  readyBanner: {
    backgroundColor: 'rgba(255, 248, 242, 0.92)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 2.5,
    borderColor: colors.cherry500,
    alignItems: 'center',
    ...shadows.warmCard,
  },
  readyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.cherry700,
    letterSpacing: 1.2,
  },
  readySubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink900,
    marginTop: 4,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 60,
  },
  iconPillButton: {
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 248, 242, 0.9)',
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.cherry500,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  iconPillText: {
    color: colors.cherry700,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timePill: {
    minHeight: 36,
    minWidth: 58,
    paddingHorizontal: spacing.sm + 4,
    backgroundColor: 'rgba(37, 26, 32, 0.45)',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 248, 242, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePillText: {
    color: colors.cream50,
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
