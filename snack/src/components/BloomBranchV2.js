import React, { forwardRef, memo, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import VectorAsset from './VectorAssetV2';

export default memo(forwardRef(function BloomBranchV2({ pair, playableHeight, onMount, onPrepared, onRender }, ref) {
  const [visual, setVisual] = useState(() => ({ ...pair }));
  const x = useRef(new Animated.Value(pair.x)).current;
  const epoch = useRef(pair.epoch);
  const onMountRef = useRef(onMount);
  onRender?.();
  useEffect(() => { onMountRef.current?.(pair.id); }, [pair.id]);
  useEffect(() => { onPrepared?.(visual.id, visual.epoch); }, [visual, onPrepared]);
  useImperativeHandle(ref, () => ({
    prepare(next) { epoch.current = next.epoch; setVisual({ ...next }); x.setValue(next.x); },
    update(next) {
      x.setValue(next.x);
      if (epoch.current !== next.epoch) { epoch.current = next.epoch; setVisual({ ...next }); }
    },
  }), [x]);
  const base = `obstacles/${visual.biome}/`;
  const variant = visual.variant;
  const topHeight = visual.gapY;
  const bottomY = visual.gapY + visual.gapSize;
  const bottomHeight = Math.max(0, playableHeight - bottomY);
  function trunk(isTop, height) {
    const cap = `cap_${isTop ? 'bottom' : 'top'}_${variant % 2 ? 'b' : 'a'}`;
    return (
      <View style={[styles.trunk, { top: isTop ? 0 : bottomY, height, width: visual.width }]}>
        <VectorAsset assetKey={base + 'trunk_body'} width={visual.width} height={height} viewBox="18 0 124 320" stretch />
        <View style={StyleSheet.absoluteFill}>
          <VectorAsset assetKey={base + 'trunk_edge_overlay'} width={visual.width} height={height} viewBox="18 0 124 320" stretch opacity={0.45} />
        </View>
        <View style={{ position: 'absolute', left: 0, top: isTop ? Math.max(0, height - 75) : 34, width: visual.width, height: 42 }}>
          <VectorAsset assetKey={base + `side_branch_${Math.floor(variant / 2) % 3 + 1}`} width={visual.width} height={42} />
          <View style={StyleSheet.absoluteFill}><VectorAsset assetKey={base + 'leaves_cluster'} width={visual.width} height={36} opacity={0.9} /></View>
        </View>
        <View style={{ position: 'absolute', left: 0, top: isTop ? Math.max(0, height - 29) : 0 }}>
          <VectorAsset assetKey={base + cap} width={visual.width} height={29} stretch />
          <View style={{ position: 'absolute', left: 5, top: isTop ? -9 : 7 }}><VectorAsset assetKey={base + `blossom_cluster_${variant % 2 ? 'b' : 'a'}`} width={visual.width - 10} height={22} /></View>
        </View>
      </View>
    );
  }
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: visual.width, height: playableHeight, transform: [{ translateX: x }] }}>
      {trunk(true, topHeight)}{trunk(false, bottomHeight)}
    </Animated.View>
  );
}));

const styles = StyleSheet.create({ trunk: { position: 'absolute', overflow: 'hidden' } });
