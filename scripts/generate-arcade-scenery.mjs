// Generates high-fidelity Arcade Scenery SVGs for all 4 biomes
// Mathematically compensated for landscape aspect-ratio stretch (3.85x)
import fs from 'node:fs';
import path from 'node:path';

const BIOMES = {
  first_bloom: {
    skyTop: '#9BD6EE',
    skyBottom: '#FFF2E2',
    sunColor: '#FFF0B5',
    fujiBase: '#8AAEA5',
    fujiSnow: '#FFFFFF',
    hillFar: '#8EAEA5',
    hillNear: '#628E83',
    pagoda: '#4A2F35',
    treeBark: '#55342F',
    foliageShadow: '#D87A93',
    foliageMid: '#F8A5BA',
    foliageLight: '#FFD6E3',
    bridgeRail: '#991B1B',
    bridgeBase: '#DC2626',
    bridgeFloor: '#B91C1C',
    bridgePillars: '#4E2A27',
    goldTrim: '#F59E0B',
    lanternGlow: '#FEF08A',
    petalColor: '#F7C5D2',
    petalCore: '#E63750',
    leafBase: '#4F8A5B',
    leafVein: '#28533A',
  },
  sakura_garden: {
    skyTop: '#A0D8F1',
    skyBottom: '#FCE7F3',
    sunColor: '#FEF08A',
    fujiBase: '#91A4BE',
    fujiSnow: '#FFFFFF',
    hillFar: '#7E9BB8',
    hillNear: '#547D9E',
    pagoda: '#562534',
    treeBark: '#5A313C',
    foliageShadow: '#DB2777',
    foliageMid: '#F472B6',
    foliageLight: '#FBCFE8',
    bridgeRail: '#9F1239',
    bridgeBase: '#E11D48',
    bridgeFloor: '#BE123C',
    bridgePillars: '#4C2430',
    goldTrim: '#FBBF24',
    lanternGlow: '#FFFBEB',
    petalColor: '#FFCCD7',
    petalCore: '#FF6B8B',
    leafBase: '#5C946E',
    leafVein: '#2D593E',
  },
  golden_bloom: {
    skyTop: '#EA580C',
    skyBottom: '#FEF08A',
    sunColor: '#FDE047',
    fujiBase: '#6B4165',
    fujiSnow: '#FDE68A',
    hillFar: '#8B4B62',
    hillNear: '#5E2F45',
    pagoda: '#4A2012',
    treeBark: '#5C3417',
    foliageShadow: '#B45309',
    foliageMid: '#F59E0B',
    foliageLight: '#FEF08A',
    bridgeRail: '#7C2D12',
    bridgeBase: '#C2410C',
    bridgeFloor: '#9A3412',
    bridgePillars: '#451A03',
    goldTrim: '#FBBF24',
    lanternGlow: '#FEF9C3',
    petalColor: '#FED7AA',
    petalCore: '#F59E0B',
    leafBase: '#D97706',
    leafVein: '#78350F',
  },
  yozakura: {
    skyTop: '#090D1B',
    skyBottom: '#3B1F54',
    sunColor: '#FEF3C7',
    fujiBase: '#1B173B',
    fujiSnow: '#6D67A8',
    hillFar: '#1E1942',
    hillNear: '#141030',
    pagoda: '#110D26',
    treeBark: '#211C3D',
    foliageShadow: '#6B21A8',
    foliageMid: '#A855F7',
    foliageLight: '#E879F9',
    bridgeRail: '#831843',
    bridgeBase: '#BE185D',
    bridgeFloor: '#9D174D',
    bridgePillars: '#18122B',
    goldTrim: '#38BDF8',
    lanternGlow: '#FDE047',
    petalColor: '#E879F9',
    petalCore: '#C084FC',
    leafBase: '#2DD4BF',
    leafVein: '#0F766E',
  },
};

function generateBackgroundBase(palette) {
  // MUST have <circle cx="820" cy="320" r="110" ...> for test assertions
  // ALL paths must be self-closing <path ... /> for vectorCacheV2 parser
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${palette.skyTop}"/>
        <stop offset="100%" stop-color="${palette.skyBottom}"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#sky)"/>
    <circle cx="820" cy="320" r="110" fill="${palette.sunColor}" opacity=".92"/>
    <!-- Distant Mount Fuji (tall & narrow in SVG so it stretches to majestic proportions) -->
    <path d="M410 1350 L470 940 Q485 910 500 910 Q515 910 530 940 L590 1350 Z" fill="${palette.fujiBase}" opacity=".55"/>
    <path d="M470 940 Q485 910 500 910 Q515 910 530 940 L522 985 Q512 970 500 980 Q488 970 478 985 Z" fill="${palette.fujiSnow}" opacity=".8"/>
    <!-- Distant 5-Story Pagoda Silhouette on hill -->
    <path d="M720 1280 L736 1280 L736 1250 L742 1250 L732 1238 L724 1250 L730 1250 L730 1215 L738 1215 L728 1205 L718 1215 L724 1215 L724 1180 L734 1180 L726 1170 L716 1180 L722 1180 L722 1150 L728 1130 L726 1150 L720 1280 Z" fill="${palette.pagoda}" opacity=".45"/>
    <!-- Rolling Far Hills (scaled down to y=1920 to eliminate gaps) -->
    <path d="M0 1240 Q180 1100 340 1220 Q520 1020 700 1230 Q880 1110 1080 1250 V1920 H0 Z" fill="${palette.hillFar}" opacity=".72"/>
    <!-- Near Mist Hills anchored to bottom -->
    <path d="M0 1370 Q220 1190 440 1370 Q640 1175 860 1370 Q960 1270 1080 1360 V1920 H0 Z" fill="${palette.hillNear}" opacity=".85"/>
</svg>`;
}

function generateMidground(palette) {
  // Trees and bridge anchored down to y=1920 (ground)
  // Canopies drawn narrow in SVG so 3.85x horizontal stretch makes them round and plump
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <!-- Tree 1 (Left): trunk grounded to y=1920 -->
    <path d="M85 1920 L85 1400 Q80 1180 98 1020" stroke="${palette.treeBark}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M90 1220 Q110 1150 125 1160" stroke="${palette.treeBark}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Tree 1 Canopies (narrow in SVG for round arcade stretch) -->
    <path d="M60 1100 C45 1030 50 940 85 890 C110 840 145 880 145 950 C155 1010 130 1100 95 1120 C75 1125 65 1115 60 1100 Z" fill="${palette.foliageShadow}" opacity=".92"/>
    <path d="M68 1080 C55 1020 60 950 88 910 C108 870 135 900 135 960 C142 1010 122 1080 95 1095 C80 1100 72 1092 68 1080 Z" fill="${palette.foliageMid}" opacity=".95"/>
    <path d="M75 1050 C68 1010 72 960 90 930 C104 900 122 920 122 965 C126 1000 112 1050 94 1065 C84 1070 78 1060 75 1050 Z" fill="${palette.foliageLight}" opacity=".8"/>

    <!-- Tree 2 (Mid-Left): trunk grounded to y=1920 -->
    <path d="M210 1920 L210 1420 Q205 1240 220 1080" stroke="${palette.treeBark}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <!-- Tree 2 Canopies -->
    <path d="M190 1140 C175 1080 180 1000 210 960 C232 920 258 950 258 1010 C265 1060 245 1130 218 1150 C202 1155 194 1148 190 1140 Z" fill="${palette.foliageShadow}" opacity=".88"/>
    <path d="M196 1120 C184 1070 188 1010 212 975 C230 940 250 965 250 1015 C255 1055 238 1115 218 1130 C206 1135 200 1128 196 1120 Z" fill="${palette.foliageMid}" opacity=".92"/>

    <!-- Tree 3 (Right): trunk grounded to y=1920 -->
    <path d="M890 1920 L890 1390 Q895 1190 875 1030" stroke="${palette.treeBark}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M885 1230 Q865 1160 850 1170" stroke="${palette.treeBark}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Tree 3 Canopies -->
    <path d="M840 1110 C825 1040 830 950 865 900 C890 850 925 890 925 960 C935 1020 910 1110 875 1130 C855 1135 845 1125 840 1110 Z" fill="${palette.foliageShadow}" opacity=".92"/>
    <path d="M848 1090 C835 1030 840 960 868 920 C888 880 915 910 915 970 C922 1020 902 1090 875 1105 C860 1110 852 1102 848 1090 Z" fill="${palette.foliageMid}" opacity=".95"/>
    <path d="M855 1060 C848 1020 852 970 870 940 C884 910 902 930 902 975 C906 1010 892 1060 874 1075 C864 1080 858 1070 855 1060 Z" fill="${palette.foliageLight}" opacity=".8"/>

    <!-- Traditional Taiko-bashi Arched Bridge (width ~110px in SVG -> ~420px on screen) -->
    <!-- Pillars anchored to y=1920 -->
    <path d="M495 1920 L495 1570 M520 1920 L520 1545 M545 1920 L545 1530 M570 1920 L570 1545 M595 1920 L595 1570" stroke="${palette.bridgePillars}" stroke-width="6" stroke-linecap="round"/>
    <!-- Vermillion Lacquer Arched Beam -->
    <path d="M475 1630 Q545 1490 615 1630" stroke="${palette.bridgeFloor}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M478 1626 Q545 1494 612 1626" stroke="${palette.bridgeBase}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Upper Railing -->
    <path d="M482 1595 Q545 1460 608 1595" stroke="${palette.bridgeRail}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- Railing Vertical Posts -->
    <path d="M492 1615 L492 1580 M512 1590 L512 1550 M532 1575 L532 1532 M545 1568 L545 1526 M558 1575 L558 1532 M578 1590 L578 1550 M598 1615 L598 1580" stroke="${palette.bridgeRail}" stroke-width="4" stroke-linecap="round"/>
    <!-- Golden Finials (Giboshi) atop the posts -->
    <circle cx="492" cy="1578" r="3.5" fill="${palette.goldTrim}"/>
    <circle cx="512" cy="1548" r="3.5" fill="${palette.goldTrim}"/>
    <circle cx="532" cy="1530" r="3.8" fill="${palette.goldTrim}"/>
    <circle cx="545" cy="1524" r="4.2" fill="${palette.goldTrim}"/>
    <circle cx="558" cy="1530" r="3.8" fill="${palette.goldTrim}"/>
    <circle cx="578" cy="1548" r="3.5" fill="${palette.goldTrim}"/>
    <circle cx="598" cy="1578" r="3.5" fill="${palette.goldTrim}"/>
    <!-- Stone Lantern with Warm Glowing Core near bridge -->
    <path d="M455 1920 L455 1630 L450 1625 L460 1625 Z" fill="${palette.treeBark}"/>
    <rect x="450" y="1612" width="10" height="12" rx="2" fill="${palette.lanternGlow}" opacity=".9"/>
    <path d="M447 1612 L463 1612 L455 1604 Z" fill="${palette.treeBark}"/>
</svg>`;
}

function renderCornerBlossom(cx, cy, r, palette) {
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const px = cx + Math.cos(angle) * (r * 0.7);
    const py = cy + Math.sin(angle) * (r * 0.7);
    petals.push(`<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * 0.58).toFixed(1)}" ry="${(r * 0.85).toFixed(1)}" fill="${palette.petalColor}" stroke="${palette.treeBark}" stroke-width="1.2" transform="rotate(${i * 72} ${px.toFixed(1)} ${py.toFixed(1)})"/>`);
  }
  return petals.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.42).toFixed(1)}" fill="${palette.petalCore}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.2).toFixed(1)}" fill="${palette.goldTrim}"/>`;
}

function generateForegroundFrame(palette) {
  // Left half viewBox="0 0 540 1920", Right half viewBox="540 0 540 1920"
  // Beautiful hanging branches in the upper corners (y < 450), leaving lower 75% completely free for gameplay!
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <!-- Top-Left Corner Branch (Arching gently, well above flight zone) -->
    <path d="M0 0 Q90 120 180 180 Q240 220 300 240" stroke="${palette.treeBark}" stroke-width="32" fill="none" stroke-linecap="round"/>
    <path d="M0 0 Q90 120 180 180 Q240 220 300 240" stroke="${palette.foliageShadow}" stroke-width="18" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M120 140 Q160 210 200 250" stroke="${palette.treeBark}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <!-- Left Leaves -->
    <path d="M180 180 Q205 160 230 180 Q205 198 180 180 Z" fill="${palette.leafBase}" stroke="${palette.treeBark}" stroke-width="1.2"/>
    <path d="M260 230 Q285 210 310 230 Q285 248 260 230 Z" fill="${palette.leafBase}" stroke="${palette.treeBark}" stroke-width="1.2"/>
    <!-- Left Blossoms -->
    ${renderCornerBlossom(140, 150, 18, palette)}
    ${renderCornerBlossom(200, 210, 20, palette)}
    ${renderCornerBlossom(250, 235, 16, palette)}
    ${renderCornerBlossom(300, 240, 14, palette)}
    ${renderCornerBlossom(190, 260, 13, palette)}

    <!-- Top-Right Corner Branch (Arching gently from right) -->
    <path d="M1080 0 Q990 120 900 180 Q840 220 780 240" stroke="${palette.treeBark}" stroke-width="32" fill="none" stroke-linecap="round"/>
    <path d="M1080 0 Q990 120 900 180 Q840 220 780 240" stroke="${palette.foliageShadow}" stroke-width="18" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M960 140 Q920 210 880 250" stroke="${palette.treeBark}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <!-- Right Leaves -->
    <path d="M900 180 Q875 160 850 180 Q875 198 900 180 Z" fill="${palette.leafBase}" stroke="${palette.treeBark}" stroke-width="1.2"/>
    <path d="M820 230 Q795 210 770 230 Q795 248 820 230 Z" fill="${palette.leafBase}" stroke="${palette.treeBark}" stroke-width="1.2"/>
    <!-- Right Blossoms -->
    ${renderCornerBlossom(940, 150, 18, palette)}
    ${renderCornerBlossom(880, 210, 20, palette)}
    ${renderCornerBlossom(830, 235, 16, palette)}
    ${renderCornerBlossom(780, 240, 14, palette)}
    ${renderCornerBlossom(890, 260, 13, palette)}
</svg>`;
}

function generateOverlayFx(palette) {
  // Delicate cherry petals falling
  // In SVG, petals are drawn slender (rx=3 to 4, ry=10 to 14) so 3.85x horizontal stretch makes them perfectly shaped petals
  const petals = [];
  const coords = [
    [50, 120, 3.2, 11, 24, 0.45],
    [140, 380, 3.8, 13, -35, 0.6],
    [260, 210, 3.0, 10, 50, 0.4],
    [320, 680, 4.0, 14, -18, 0.7],
    [430, 450, 3.5, 12, 42, 0.55],
    [520, 160, 3.2, 11, -60, 0.45],
    [580, 840, 4.2, 15, 15, 0.75],
    [690, 310, 3.6, 12, -40, 0.5],
    [760, 920, 3.8, 13, 30, 0.65],
    [850, 220, 3.0, 10, -15, 0.4],
    [920, 640, 4.0, 14, 48, 0.7],
    [1020, 410, 3.4, 12, -32, 0.5],
    [90, 1150, 3.5, 12, 20, 0.55],
    [220, 1380, 4.0, 14, -45, 0.65],
    [380, 1220, 3.2, 11, 35, 0.45],
    [510, 1540, 4.2, 15, -25, 0.7],
    [670, 1310, 3.6, 12, 55, 0.5],
    [810, 1620, 4.0, 14, -15, 0.65],
    [950, 1440, 3.2, 11, 40, 0.5],
  ];

  for (const [cx, cy, rx, ry, rot, op] of coords) {
    petals.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${palette.petalColor}" opacity="${op}" transform="rotate(${rot} ${cx} ${cy})"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    ${petals.join('\n    ')}
</svg>`;
}

for (const [biome, palette] of Object.entries(BIOMES)) {
  const dir = path.join('assets/v2/backgrounds', biome);
  fs.writeFileSync(path.join(dir, 'background_base.svg'), generateBackgroundBase(palette));
  fs.writeFileSync(path.join(dir, 'midground.svg'), generateMidground(palette));
  fs.writeFileSync(path.join(dir, 'foreground_frame.svg'), generateForegroundFrame(palette));
  fs.writeFileSync(path.join(dir, 'overlay_fx.svg'), generateOverlayFx(palette));
}

console.log('Scenery SVGs generated successfully for all 4 biomes!');
