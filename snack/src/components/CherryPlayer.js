// Cherry Bloom — CherryPlayer (Cherry Character System)
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 8)

import React from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { colors } from '../theme/theme';

/**
 * Lightweight, Snack-safe SVG Cherry with state-based facial expressions:
 * - 'idle' | 'jump' | 'fall' | 'hit' | 'celebrate'
 */
export default function CherryPlayer({ size = 48, state = 'idle' }) {
  const isJump = state === 'jump' || state === 'celebrate';
  const isHit = state === 'hit';
  const isFall = state === 'fall';

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* Curved Brown Stem */}
      <Path
        d="M33 21C35 11 43 6 53 5"
        stroke={colors.bark600}
        strokeWidth="4.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Green Leaf */}
      <Path
        d="M45 9C50 3 58 3 62 6C59 13 53 16 45 14Z"
        fill={colors.leaf500}
        stroke={colors.leaf800}
        strokeWidth="1.6"
      />
      <Path
        d="M47 11C52 9 56 8 60 6"
        stroke={colors.leaf800}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Glossy Red Cherry Body */}
      <Circle
        cx="30"
        cy="38"
        r="21.5"
        fill={colors.cherry500}
        stroke={colors.cherry700}
        strokeWidth="2.6"
      />
      {/* Subtle Bottom Shadow */}
      <Path
        d="M13 46C18 55 42 55 47 46"
        stroke={colors.cherry700}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      {/* Glossy Highlight */}
      <Ellipse
        cx="21"
        cy="29"
        rx="4.8"
        ry="6.8"
        transform="rotate(-20 21 29)"
        fill="#FFFFFF"
        opacity="0.76"
      />
      <Circle cx="18" cy="37" r="1.8" fill="#FFFFFF" opacity="0.65" />

      {/* Cheeks */}
      <Ellipse cx="18.5" cy="42" rx="3.2" ry="1.8" fill={colors.blossom300} opacity="0.75" />
      <Ellipse cx="41.5" cy="42" rx="3.2" ry="1.8" fill={colors.blossom300} opacity="0.75" />

      {/* Eyes & Mouth by State */}
      {isHit ? (
        <G>
          {/* Squeezed > < Eyes */}
          <Path
            d="M20 35L25 38L20 41"
            stroke={colors.ink900}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M40 35L35 38L40 41"
            stroke={colors.ink900}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Dizzy/Sad Mouth */}
          <Path
            d="M26 47Q30 43 34 47"
            stroke={colors.ink900}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </G>
      ) : isJump ? (
        <G>
          {/* Happy Arc Eyes */}
          <Path
            d="M20 38Q23 34 26 38"
            stroke={colors.ink900}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M34 38Q37 34 40 38"
            stroke={colors.ink900}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Open Excited Mouth */}
          <Path
            d="M26 43Q30 50 34 43Z"
            fill={colors.cherry900}
            stroke={colors.ink900}
            strokeWidth="1.8"
          />
        </G>
      ) : (
        <G>
          {/* Standard Cute Eyes with Specular Dot */}
          <Circle cx="23.5" cy="38" r="2.6" fill={colors.ink900} />
          <Circle cx="24.3" cy="37.2" r="0.9" fill="#FFFFFF" />
          <Circle cx="36.5" cy="38" r="2.6" fill={colors.ink900} />
          <Circle cx="37.3" cy="37.2" r="0.9" fill="#FFFFFF" />
          {/* Mouth */}
          {isFall ? (
            <Circle cx="30" cy="45.5" r="2" fill={colors.ink900} />
          ) : (
            <Path
              d="M26.5 44.5Q30 48 33.5 44.5"
              stroke={colors.ink900}
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </G>
      )}
    </Svg>
  );
}
