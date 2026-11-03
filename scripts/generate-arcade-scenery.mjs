// Generates high-fidelity Arcade Scenery SVGs for all 4 biomes
// Mathematically compensated for landscape aspect-ratio stretch (3.85x horizontal)
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
    treeBark: '#4E2D27',
    foliageShadow: '#D87A93',
    foliageMid: '#F8A5BA',
    foliageLight: '#FFE3EC',
    bridgeRail: '#991B1B',
    bridgeBase: '#DC2626',
    bridgeFloor: '#B91C1C',
    bridgePillars: '#3B1A17',
    goldTrim: '#F59E0B',
    lanternGlow: '#FEF08A',
    petalColor: '#F7C5D2',
    petalCore: '#E63750',
    leafBase: '#3F7A4B',
    leafVein: '#20482E',
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
    treeBark: '#542E3B',
    foliageShadow: '#DB2777',
    foliageMid: '#F472B6',
    foliageLight: '#FCE7F3',
    bridgeRail: '#9F1239',
    bridgeBase: '#E11D48',
    bridgeFloor: '#BE123C',
    bridgePillars: '#3D1B25',
    goldTrim: '#FBBF24',
    lanternGlow: '#FFFBEB',
    petalColor: '#FFCCD7',
    petalCore: '#FF6B8B',
    leafBase: '#4D8A5E',
    leafVein: '#254E34',
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
    treeBark: '#4A250E',
    foliageShadow: '#B45309',
    foliageMid: '#F59E0B',
    foliageLight: '#FEF08A',
    bridgeRail: '#7C2D12',
    bridgeBase: '#C2410C',
    bridgeFloor: '#9A3412',
    bridgePillars: '#331201',
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
    treeBark: '#171233',
    foliageShadow: '#6B21A8',
    foliageMid: '#A855F7',
    foliageLight: '#F0ABFC',
    bridgeRail: '#831843',
    bridgeBase: '#BE185D',
    bridgeFloor: '#9D174D',
    bridgePillars: '#120D21',
    goldTrim: '#38BDF8',
    lanternGlow: '#FDE047',
    petalColor: '#E879F9',
    petalCore: '#C084FC',
    leafBase: '#0F766E',
    leafVein: '#042F2C',
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
    <!-- Distant Mount Fuji (tall & narrow in SVG so 3.85x horizontal stretch creates majestic mountain silhouette) -->
    <path d="M440 1350 L480 940 Q490 910 500 910 Q510 910 520 940 L560 1350 Z" fill="${palette.fujiBase}" opacity=".55"/>
    <path d="M480 940 Q490 910 500 910 Q510 910 520 940 L516 975 Q509 962 500 970 Q491 962 484 975 Z" fill="${palette.fujiSnow}" opacity=".85"/>
    <!-- Distant 5-Story Pagoda Silhouette on hill -->
    <path d="M720 1280 L736 1280 L736 1250 L742 1250 L732 1238 L724 1250 L730 1250 L730 1215 L738 1215 L728 1205 L718 1215 L724 1215 L724 1180 L734 1180 L726 1170 L716 1180 L722 1180 L722 1150 L728 1130 L726 1150 L720 1280 Z" fill="${palette.pagoda}" opacity=".45"/>
    <!-- Rolling Far Hills (scaled down to y=1920 to eliminate gaps) -->
    <path d="M0 1240 Q180 1100 340 1220 Q520 1020 700 1230 Q880 1110 1080 1250 V1920 H0 Z" fill="${palette.hillFar}" opacity=".72"/>
    <!-- Near Mist Hills anchored to bottom -->
    <path d="M0 1370 Q220 1190 440 1370 Q640 1175 860 1370 Q960 1270 1080 1360 V1920 H0 Z" fill="${palette.hillNear}" opacity=".85"/>
</svg>`;
}

function renderTree(trunkX, canopyY, scale, palette) {
  // Generates an organic gnarled cherry tree with tall billowing cloud lobes
  // Tall in SVG so 3.85x horizontal stretch creates natural round/fluffy sakura canopies
  const tw = Math.round(14 * scale);
  const cx = trunkX;
  const cy = canopyY;
  const rw = Math.round(48 * scale);
  const rh = Math.round(180 * scale);

  return `
    <!-- Tree Trunk rooted firmly at y=1720 -->
    <path d="M${cx} 1720 Q${cx - 6} ${cy + 180} ${cx + 4} ${cy + 90}" stroke="${palette.treeBark}" stroke-width="${tw}" fill="none" stroke-linecap="round"/>
    <path d="M${cx + 4} ${cy + 90} Q${cx - 16} ${cy + 40} ${cx - 24} ${cy}" stroke="${palette.treeBark}" stroke-width="${Math.round(tw * 0.7)}" fill="none" stroke-linecap="round"/>
    <path d="M${cx + 4} ${cy + 90} Q${cx + 20} ${cy + 40} ${cx + 28} ${cy}" stroke="${palette.treeBark}" stroke-width="${Math.round(tw * 0.65)}" fill="none" stroke-linecap="round"/>
    <!-- Multi-lobed billowing sakura clouds (tall in SVG -> round on screen) -->
    <!-- Base shadow volume -->
    <ellipse cx="${cx - 18}" cy="${cy + 20}" rx="${rw * 0.75}" ry="${rh * 0.7}" fill="${palette.foliageShadow}" opacity=".92"/>
    <ellipse cx="${cx + 20}" cy="${cy + 22}" rx="${rw * 0.72}" ry="${rh * 0.68}" fill="${palette.foliageShadow}" opacity=".92"/>
    <ellipse cx="${cx}" cy="${cy - 30}" rx="${rw}" ry="${rh * 0.85}" fill="${palette.foliageShadow}" opacity=".94"/>
    <!-- Midtone vibrant bloom volume -->
    <ellipse cx="${cx - 16}" cy="${cy + 12}" rx="${rw * 0.68}" ry="${rh * 0.65}" fill="${palette.foliageMid}" opacity=".95"/>
    <ellipse cx="${cx + 18}" cy="${cy + 14}" rx="${rw * 0.65}" ry="${rh * 0.62}" fill="${palette.foliageMid}" opacity=".95"/>
    <ellipse cx="${cx}" cy="${cy - 38}" rx="${rw * 0.92}" ry="${rh * 0.8}" fill="${palette.foliageMid}" opacity=".96"/>
    <!-- Top highlight petals volume -->
    <ellipse cx="${cx - 12}" cy="${cy + 2}" rx="${rw * 0.55}" ry="${rh * 0.5}" fill="${palette.foliageLight}" opacity=".88"/>
    <ellipse cx="${cx + 14}" cy="${cy + 4}" rx="${rw * 0.52}" ry="${rh * 0.48}" fill="${palette.foliageLight}" opacity=".88"/>
    <ellipse cx="${cx}" cy="${cy - 48}" rx="${rw * 0.75}" ry="${rh * 0.65}" fill="${palette.foliageLight}" opacity=".92"/>
  `;
}

function generateMidground(palette) {
  // Trees and bridge anchored at ground level (y ~1654 in SVG is screen ground line)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <!-- Tree 1 (Left Fore-Midground) -->
    ${renderTree(140, 1380, 1.05, palette)}

    <!-- Tree 2 (Mid-Left Distant Tree) -->
    ${renderTree(340, 1420, 0.75, palette)}

    <!-- Traditional Taiko-bashi Arched Bridge (centered, steep traditional arch) -->
    <!-- Pillars descending deep into ground/water level -->
    <path d="M508 1720 L508 1630 M524 1720 L524 1585 M540 1720 L540 1565 M556 1720 L556 1585 M572 1720 L572 1630" stroke="${palette.bridgePillars}" stroke-width="6" stroke-linecap="round"/>
    <!-- Vermillion Lacquer Arched Deck Beam -->
    <path d="M495 1665 Q540 1530 585 1665" stroke="${palette.bridgeFloor}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M497 1660 Q540 1535 583 1660" stroke="${palette.bridgeBase}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- Railing Arc -->
    <path d="M500 1630 Q540 1500 580 1630" stroke="${palette.bridgeRail}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <!-- Railing Vertical Posts -->
    <path d="M508 1645 L508 1608 M520 1625 L520 1572 M532 1610 L532 1548 M540 1605 L540 1540 M548 1610 L548 1548 M560 1625 L560 1572 M572 1645 L572 1608" stroke="${palette.bridgeRail}" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Golden Finials (Giboshi) atop the bridge posts -->
    <circle cx="508" cy="1606" r="3.2" fill="${palette.goldTrim}"/>
    <circle cx="520" cy="1570" r="3.4" fill="${palette.goldTrim}"/>
    <circle cx="532" cy="1546" r="3.6" fill="${palette.goldTrim}"/>
    <circle cx="540" cy="1538" r="4.0" fill="${palette.goldTrim}"/>
    <circle cx="548" cy="1546" r="3.6" fill="${palette.goldTrim}"/>
    <circle cx="560" cy="1570" r="3.4" fill="${palette.goldTrim}"/>
    <circle cx="572" cy="1606" r="3.2" fill="${palette.goldTrim}"/>
    <!-- Little Stone Lantern (Tōrō) on ground next to bridge -->
    <path d="M480 1720 L480 1655 L475 1650 L485 1650 Z" fill="${palette.treeBark}"/>
    <rect x="476" y="1638" width="8" height="12" rx="2" fill="${palette.lanternGlow}" opacity=".9"/>
    <path d="M473 1638 L487 1638 L480 1630 Z" fill="${palette.treeBark}"/>

    <!-- Tree 3 (Right Midground Tree) -->
    ${renderTree(780, 1400, 0.95, palette)}

    <!-- Tree 4 (Far Right Small Tree) -->
    ${renderTree(960, 1430, 0.7, palette)}
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
  // Beautiful hanging branches in the upper corners (y < 420), leaving lower 78% completely free for gameplay!
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <!-- Top-Left Corner Branch -->
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

    <!-- Top-Right Corner Branch -->
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
  // Slender in SVG (rx=3 to 4, ry=10 to 14) so 3.85x horizontal stretch creates natural floating petals
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

console.log('Arcade Scenery SVGs refreshed successfully for all 4 biomes!');
