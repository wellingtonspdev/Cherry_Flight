import React, { forwardRef, memo, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import VectorAsset from './VectorAssetV2';

export default memo(forwardRef(function BloomBranchV2({ pair, playableHeight, onMount, onPrepared, onRender }, ref) {
  const [visual, setVisual] = useState(() => ({ ...pair }));
  const x = useRef(new Animated.Value(pair.x)).current;
  const epoch = useRef(pair.epoch);
  const lastBobuxCollected = useRef(pair.bobux?.collected);
  const onMountRef = useRef(onMount);
  onRender?.();
  useEffect(() => { onMountRef.current?.(pair.id); }, [pair.id]);
  useEffect(() => { onPrepared?.(visual.id, visual.epoch); }, [visual, onPrepared]);
  useImperativeHandle(ref, () => ({
    prepare(next) {
      epoch.current = next.epoch;
      lastBobuxCollected.current = next.bobux?.collected;
      setVisual({ ...next });
      x.setValue(next.x);
    },
    update(next) {
      x.setValue(next.x);
      const bobuxChanged = lastBobuxCollected.current !== next.bobux?.collected;
      if (epoch.current !== next.epoch || bobuxChanged) {
        epoch.current = next.epoch;
        lastBobuxCollected.current = next.bobux?.collected;
        setVisual({ ...next });
      }
    },
  }), [x]);

  const base = `obstacles/${visual.biome}/`;
  const variant = visual.variant;
  const topHeight = visual.gapY;
  const bottomY = visual.gapY + visual.gapSize;
  const bottomHeight = Math.max(0, playableHeight - bottomY);

  function trunk(isTop, height) {
    if (height <= 0) return null;
    const cap = `cap_${isTop ? 'bottom' : 'top'}_${variant % 2 ? 'b' : 'a'}`;
    const showBranch = height > 78;
    const branchVariant = (Math.floor(variant / 2) % 3) + 1;
    const branchLeft = variant % 2 === 0 ? -12 : -2;

    return (
      <View style={[styles.trunk, { top: isTop ? 0 : bottomY, height, width: visual.width }]}>
        {/* Core cel-shaded wooden pillar */}
        <VectorAsset assetKey={base + 'trunk_body'} width={visual.width} height={height} viewBox="18 0 124 320" stretch />
        <View style={StyleSheet.absoluteFill}>
          <VectorAsset assetKey={base + 'trunk_edge_overlay'} width={visual.width} height={height} viewBox="18 0 124 320" stretch opacity={0.65} />
        </View>

        {/* Natural side branches extending beyond trunk */}
        {showBranch && (
          <View
            style={{
              position: 'absolute',
              left: branchLeft,
              top: isTop ? Math.max(12, height - 76) : 32,
              width: visual.width + 14,
              height: 44,
              zIndex: 3,
            }}
          >
            <VectorAsset assetKey={base + `side_branch_${branchVariant}`} width={visual.width + 14} height={44} stretch />
            <View style={StyleSheet.absoluteFill}>
              <VectorAsset assetKey={base + 'leaves_cluster'} width={visual.width + 14} height={40} stretch opacity={0.92} />
            </View>
          </View>
        )}

        {/* Arcade Crown at gap opening (wooden cap + rich blossom cluster) */}
        <View
          style={{
            position: 'absolute',
            left: -6,
            top: isTop ? Math.max(0, height - 32) : 0,
            width: visual.width + 12,
            height: 32,
            zIndex: 4,
          }}
        >
          <VectorAsset assetKey={base + cap} width={visual.width + 12} height={32} stretch />
          <View style={{ position: 'absolute', left: 4, top: isTop ? -8 : 7 }}>
            <VectorAsset assetKey={base + `blossom_cluster_${variant % 2 ? 'b' : 'a'}`} width={visual.width + 4} height={24} stretch />
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: visual.width, height: playableHeight, transform: [{ translateX: x }] }}>
      {trunk(true, topHeight)}
      {trunk(false, bottomHeight)}
      {visual.bobux && !visual.bobux.collected ? (
        <View style={[styles.bobux, { top: visual.bobux.y, left: visual.bobux.relativeX, width: visual.bobux.size, height: visual.bobux.size }]}>
          <VectorAsset assetKey="collectibles/bobux_coin" width={visual.bobux.size} height={visual.bobux.size} />
        </View>
      ) : null}
    </Animated.View>
  );
}));

const styles = StyleSheet.create({
  trunk: { position: 'absolute', overflow: 'visible' },
  bobux: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
