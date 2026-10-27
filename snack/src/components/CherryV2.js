import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import VectorAsset from './VectorAssetV2';
import { GAME } from '../game/constants';

const CherryV2 = memo(function CherryV2({ size = 48, state = 'idle' }) {
  const pose = state === 'celebrate' ? 'jump' : state;
  return <VectorAsset assetKey={`characters/cherry_${pose}`} width={size} height={size} />;
});
export default CherryV2;

export const PlayerActorV2 = memo(forwardRef(function PlayerActorV2({ round, active, onRender }, ref) {
  const [pose, setPose] = useState('idle');
  const poseRef = useRef('idle');
  const x = useRef(new Animated.Value(round.player.x)).current;
  const y = useRef(new Animated.Value(round.player.y)).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const squashX = useRef(new Animated.Value(1)).current;
  const squashY = useRef(new Animated.Value(1)).current;
  const bounce = useRef(new Animated.Value(1)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  onRender?.();
  const changePose = value => { if (poseRef.current !== value) { poseRef.current = value; setPose(value); } };
  useEffect(() => {
    if (!active || round.status !== 'READY') { bob.setValue(0); return undefined; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -5, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 5, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start(); return () => loop.stop();
  }, [active, round, bob]);
  useImperativeHandle(ref, () => ({
    update(player) {
      x.setValue(player.x); y.setValue(player.y);
      tilt.setValue(Math.max(-22, Math.min(28, player.velocity * 0.065)));
      if (player.velocity > 0) changePose('fall');
    },
    reset(player) {
      for (const value of [x, y, tilt, squashX, squashY, bounce, bob, shake]) value.stopAnimation();
      x.setValue(player.x); y.setValue(player.y); tilt.setValue(0); shake.setValue(0); bob.setValue(0);
      squashX.setValue(1); squashY.setValue(1); bounce.setValue(1); changePose('idle');
    },
    jump() {
      changePose('jump'); bob.setValue(0);
      Animated.parallel([
        Animated.sequence([Animated.timing(squashX, { toValue: 1.08, duration: 60, useNativeDriver: true }), Animated.timing(squashX, { toValue: 0.94, duration: 80, useNativeDriver: true }), Animated.timing(squashX, { toValue: 1, duration: 80, useNativeDriver: true })]),
        Animated.sequence([Animated.timing(squashY, { toValue: 0.90, duration: 60, useNativeDriver: true }), Animated.timing(squashY, { toValue: 1.10, duration: 80, useNativeDriver: true }), Animated.timing(squashY, { toValue: 1, duration: 80, useNativeDriver: true })]),
      ]).start();
    },
    score() { Animated.sequence([Animated.timing(bounce, { toValue: 1.08, duration: 90, useNativeDriver: true }), Animated.timing(bounce, { toValue: 1, duration: 110, useNativeDriver: true })]).start(); },
    hit() {
      changePose('hit');
      Animated.parallel([
        Animated.sequence([Animated.timing(squashY, { toValue: 0.78, duration: 90, useNativeDriver: true }), Animated.timing(squashY, { toValue: 1, duration: 140, useNativeDriver: true })]),
        Animated.sequence([8, -8, 6, -6, 0].map(toValue => Animated.timing(shake, { toValue, duration: 45, useNativeDriver: true }))),
      ]).start();
    },
  }));
  useEffect(() => () => { for (const value of [x, y, tilt, squashX, squashY, bounce, bob, shake]) value.stopAnimation(); }, [x, y, tilt, squashX, squashY, bounce, bob, shake]);
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: GAME.playerSize, height: GAME.playerSize, transform: [{ translateX: x }, { translateY: y }] }}>
      <Animated.View style={{ transform: [{ translateY: bob }, { rotate: tilt.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }) }, { rotate: shake.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }) }, { scaleX: squashX }, { scaleY: squashY }, { scale: bounce }] }}>
        <CherryV2 size={GAME.playerSize} state={pose} />
      </Animated.View>
    </Animated.View>
  );
}));
