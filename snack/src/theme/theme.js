// Cherry Bloom — Design System & Theme Tokens
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md

export const colors = {
  // Core Palette (Section 4.1)
  cherry500: '#E63750',
  cherry700: '#A91532',
  cherry900: '#541021',
  blossom300: '#F5AFC1',
  blossom100: '#FFE3EA',
  cream50: '#FFF8F2',
  leaf500: '#4F8A5B',
  leaf800: '#28533A',
  bark600: '#56383F',
  ink900: '#251A20',

  // Atmosphere Palette (Section 4.2)
  skyDay: '#BFE8EF',
  sunsetPeach: '#F6A58A',
  dusk500: '#735A91',
  night800: '#292847',
  moon100: '#FFF0D0',

  // Semantic Colors (Section 4.3)
  success: '#4F8A5B',
  danger: '#B51F3C',
  surface: '#FFF8F2',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#251A20',
  textOnCherry: '#FFF8F2',
};

// 4-point Spacing Scale (Section 6.1)
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  // Named aliases for convenience
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius (Section 6.2)
export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

// Typography Scale (Section 5.4)
export const typography = {
  displayXl: { fontSize: 48, fontWeight: '900' },
  displayLg: { fontSize: 38, fontWeight: '900' },
  headingLg: { fontSize: 28, fontWeight: '800' },
  headingMd: { fontSize: 22, fontWeight: '800' },
  bodyLg: { fontSize: 18, fontWeight: '600' },
  bodyMd: { fontSize: 16, fontWeight: '500' },
  bodySm: { fontSize: 14, fontWeight: '500' },
  caption: { fontSize: 12, fontWeight: '600' },
  score: { fontSize: 54, fontWeight: '900' },
};

// Motion Durations in ms (Section 14.2)
export const motion = {
  instant: 80,
  fast: 140,
  standard: 220,
  emphasis: 340,
  screen: 420,
  ambient: 1600,
};

// Shadow Presets (Section 6.5)
export const shadows = {
  warmCard: {
    shadowColor: '#541021',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonPrimary: {
    shadowColor: '#541021',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#251A20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};
