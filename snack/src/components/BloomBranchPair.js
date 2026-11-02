// Cherry Bloom — BloomBranchPair (Obstacle System)
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 10)
// Rule 10.2: Visual blossom decoration must NEVER obscure the true collision edge.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, G } from 'react-native-svg';
import { colors } from '../theme/theme';

const VARIANT_PALETTE = {
  lightBlossom: {
    trunkFill: colors.bark600,
    trunkStripe: '#704B53',
    trunkBorder: '#2B1B21',
    capFill: '#6A464E',
    petalFill: colors.blossom300,
    petalCenter: '#FFF0A8',
    leafFill: colors.leaf500,
  },
  leafyBranch: {
    trunkFill: '#4E363A',
    trunkStripe: '#694A4F',
    trunkBorder: '#26181B',
    capFill: '#3F6E4A',
    petalFill: colors.blossom100,
    petalCenter: colors.cherry500,
    leafFill: colors.leaf500,
  },
  oldBark: {
    trunkFill: '#462C33',
    trunkStripe: '#63414A',
    trunkBorder: '#221317',
    capFill: '#56383F',
    petalFill: '#F6A58A',
    petalCenter: '#FFF0D0',
    leafFill: '#3B6945',
  },
  nightBranch: {
    trunkFill: '#2E1F35',
    trunkStripe: '#473252',
    trunkBorder: '#160E1B',
    capFill: '#3D2946',
    petalFill: colors.blossom300,
    petalCenter: colors.moon100,
    leafFill: colors.leaf800,
  },
};

function BranchOrnament({ palette, isTop }) {
  return (
    <View style={[styles.ornamentWrap, isTop ? styles.ornamentTop : styles.ornamentBottom]}>
      <Svg width={56} height={24} viewBox="0 0 56 24">
        {/* Leaves tucked inside trunk width so they never obscure gap edge */}
        <Ellipse
          cx="14"
          cy="12"
          rx="8"
          ry="4"
          transform="rotate(-22 14 12)"
          fill={palette.leafFill}
          stroke={colors.leaf800}
          strokeWidth="1.2"
        />
        <Ellipse
          cx="42"
          cy="12"
          rx="8"
          ry="4"
          transform="rotate(22 42 12)"
          fill={palette.leafFill}
          stroke={colors.leaf800}
          strokeWidth="1.2"
        />
        {/* 5-petal Sakura Blossom */}
        <G transform="translate(28, 12)">
          <Circle cx="0" cy="-5" r="4" fill={palette.petalFill} />
          <Circle cx="5" cy="-1.5" r="4" fill={palette.petalFill} />
          <Circle cx="3" cy="4.5" r="4" fill={palette.petalFill} />
          <Circle cx="-3" cy="4.5" r="4" fill={palette.petalFill} />
          <Circle cx="-5" cy="-1.5" r="4" fill={palette.petalFill} />
          <Circle cx="0" cy="0" r="2.5" fill={palette.petalCenter} />
        </G>
      </Svg>
    </View>
  );
}

export default function BloomBranchPair({ pair, playableHeight, phaseVariant }) {
  const palette =
    VARIANT_PALETTE[pair.variant] ||
    VARIANT_PALETTE[phaseVariant] ||
    VARIANT_PALETTE.lightBlossom;

  const topHeight = Math.max(0, pair.gapY);
  const bottomY = pair.gapY + pair.gapSize;
  const bottomHeight = Math.max(0, playableHeight - bottomY);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.pairContainer,
        {
          width: pair.width,
          height: playableHeight,
          transform: [{ translateX: pair.x }],
        },
      ]}
    >
      {/* Top Branch */}
      {topHeight > 0 && (
        <View
          style={[
            styles.trunk,
            styles.topTrunk,
            {
              height: topHeight,
              backgroundColor: palette.trunkFill,
              borderColor: palette.trunkBorder,
            },
          ]}
        >
          <View style={[styles.barkGrain, { backgroundColor: palette.trunkStripe }]} />
          <View
            style={[
              styles.branchCap,
              styles.topCap,
              {
                backgroundColor: palette.capFill,
                borderColor: palette.trunkBorder,
              },
            ]}
          >
            <BranchOrnament palette={palette} isTop />
          </View>
        </View>
      )}

      {/* Bottom Branch */}
      {bottomHeight > 0 && (
        <View
          style={[
            styles.trunk,
            styles.bottomTrunk,
            {
              top: bottomY,
              height: bottomHeight,
              backgroundColor: palette.trunkFill,
              borderColor: palette.trunkBorder,
            },
          ]}
        >
          <View
            style={[
              styles.branchCap,
              styles.bottomCap,
              {
                backgroundColor: palette.capFill,
                borderColor: palette.trunkBorder,
              },
            ]}
          >
            <BranchOrnament palette={palette} isTop={false} />
          </View>
          <View style={[styles.barkGrain, { backgroundColor: palette.trunkStripe }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pairContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  trunk: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderWidth: 2.5,
    overflow: 'hidden',
    alignItems: 'center',
  },
  topTrunk: {
    top: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'flex-end',
  },
  bottomTrunk: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'flex-start',
  },
  barkGrain: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 12,
    width: 8,
    opacity: 0.45,
    borderRadius: 4,
  },
  branchCap: {
    width: '100%',
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCap: {
    borderTopWidth: 2,
  },
  bottomCap: {
    borderBottomWidth: 2,
  },
  ornamentWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ornamentTop: {
    marginTop: 1,
  },
  ornamentBottom: {
    marginBottom: 1,
  },
});
