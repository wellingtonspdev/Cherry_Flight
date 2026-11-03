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
    <!-- Distant Mount Fuji (tall & narrow in SVG so 3.85x horizontal stretch creates majestic mountain silhouette) -->
    <path d="M420 1350 L475 920 Q485 890 500 890 Q515 890 525 920 L580 1350 Z" fill="${palette.fujiBase}" opacity=".55"/>
    <path d="M475 920 Q485 890 500 890 Q515 890 525 920 L520 965 Q512 950 500 960 Q488 950 480 965 Z" fill="${palette.fujiSnow}" opacity=".85"/>
    <!-- Distant 5-Story Pagoda Silhouette on hill -->
    <path d="M720 1280 L736 1280 L736 1250 L742 1250 L732 1238 L724 1250 L730 1250 L730 1215 L738 1215 L728 1205 L718 1215 L724 1215 L724 1180 L734 1180 L726 1170 L716 1180 L722 1180 L722 1150 L728 1130 L726 1150 L720 1280 Z" fill="${palette.pagoda}" opacity=".45"/>
    <!-- Rolling Far Hills (scaled down to y=1920 to eliminate gaps) -->
    <path d="M0 1240 Q180 1100 340 1220 Q520 1020 700 1230 Q880 1110 1080 1250 V1920 H0 Z" fill="${palette.hillFar}" opacity=".72"/>
    <!-- Near Mist Hills anchored to bottom -->
    <path d="M0 1370 Q220 1190 440 1370 Q640 1175 860 1370 Q960 1270 1080 1360 V1920 H0 Z" fill="${palette.hillNear}" opacity=".85"/>
</svg>`;
}

function generateMidground(palette) {
  // Trees and bridge anchored at ground level (y ~1654 in SVG is screen ground line)
  // Gnarled organic Japanese cherry tree trunks branching into clouds of blossoms
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <!-- Tree 1 (Left Fore-Midground): Gnarled trunk rising from ground line -->
    <path d="M110 1720 Q100 1560 125 1460" stroke="${palette.treeBark}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M125 1460 Q90 1400 70 1350" stroke="${palette.treeBark}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M125 1460 Q155 1395 180 1350" stroke="${palette.treeBark}" stroke-width="11" fill="none" stroke-linecap="round"/>
    <path d="M108 1420 Q80 1435 60 1445" stroke="${palette.treeBark}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <!-- Tree 1 Multi-Cloud Fluffy Sakura Canopy -->
    <!-- Lower shadow volume -->
    <path d="M45 1440 C25 1380 30 1290 65 1240 C90 1190 140 1200 165 1250 C195 1240 220 1280 215 1350 C210 1420 170 1470 120 1475 C80 1480 55 1470 45 1440 Z" fill="${palette.foliageShadow}" opacity=".92"/>
    <!-- Midtone blossom cloud -->
    <path d="M55 1420 C38 1365 42 1295 72 1250 C95 1205 138 1215 160 1260 C185 1250 208 1290 202 1350 C198 1410 162 1455 118 1460 C82 1465 62 1450 55 1420 Z" fill="${palette.foliageMid}" opacity=".96"/>
    <!-- Top highlight petals cloud -->
    <path d="M68 1390 C55 1340 60 1285 85 1250 C105 1220 138 1230 152 1270 C175 1265 190 1300 188 1345 C185 1390 155 1425 120 1430 C90 1435 74 1420 68 1390 Z" fill="${palette.foliageLight}" opacity=".85"/>

    <!-- Tree 2 (Mid-Left Distant Tree) -->
    <path d="M260 1720 Q255 1580 270 1490" stroke="${palette.treeBark}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M270 1490 Q245 1430 230 1390" stroke="${palette.treeBark}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M270 1490 Q295 1430 315 1390" stroke="${palette.treeBark}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Tree 2 Canopy -->
    <path d="M220 1450 C205 1395 210 1320 240 1280 C265 1240 300 1250 315 1295 C335 1290 350 1330 345 1380 C340 1430 310 1470 275 1475 C245 1480 228 1470 220 1450 Z" fill="${palette.foliageShadow}" opacity=".88"/>
    <path d="M228 1435 C215 1385 220 1325 245 1290 C268 1255 298 1262 310 1302 C328 1298 340 1332 336 1378 C332 1420 305 1455 275 1460 C248 1465 235 1452 228 1435 Z" fill="${palette.foliageMid}" opacity=".92"/>

    <!-- Tree 3 (Right Midground Tree) -->
    <path d="M880 1720 Q890 1560 865 1460" stroke="${palette.treeBark}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M865 1460 Q830 1400 810 1350" stroke="${palette.treeBark}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M865 1460 Q895 1395 920 1350" stroke="${palette.treeBark}" stroke-width="11" fill="none" stroke-linecap="round"/>
    <path d="M875 1420 Q900 1435 925 1445" stroke="${palette.treeBark}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <!-- Tree 3 Multi-Cloud Fluffy Sakura Canopy -->
    <path d="M785 1440 C765 1380 770 1290 805 1240 C830 1190 880 1200 905 1250 C935 1240 960 1280 955 1350 C950 1420 910 1470 860 1475 C820 1480 795 1470 785 1440 Z" fill="${palette.foliageShadow}" opacity=".92"/>
    <path d="M795 1420 C778 1365 782 1295 812 1250 C835 1205 878 1215 900 1260 C925 1250 948 1290 942 1350 C938 1410 902 1455 858 1460 C822 1465 802 1450 795 1420 Z" fill="${palette.foliageMid}" opacity=".96"/>
    <path d="M808 1390 C795 1340 800 1285 825 1250 C845 1220 878 1230 892 1270 C915 1265 930 1300 928 1345 C925 1390 895 1425 860 1430 C830 1435 814 1420 808 1390 Z" fill="${palette.foliageLight}" opacity=".85"/>

    <!-- Traditional Taiko-bashi Arched Bridge (grounded firmly at y ~1654) -->
    <!-- Sturdy Wooden Posts descending into water/ground -->
    <path d="M485 1720 L485 1635 M512 1720 L512 1608 M540 1720 L540 1595 M568 1720 L568 1608 M595 1720 L595 1635" stroke="${palette.bridgePillars}" stroke-width="7" stroke-linecap="round"/>
    <!-- Vermillion Lacquer Arched Deck Beam -->
    <path d="M465 1665 Q540 1565 615 1665" stroke="${palette.bridgeFloor}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M468 1660 Q540 1570 612 1660" stroke="${palette.bridgeBase}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Upper Railing -->
    <path d="M472 1632 Q540 1538 608 1632" stroke="${palette.bridgeRail}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- Railing Vertical Posts -->
    <path d="M482 1650 L482 1618 M502 1632 L502 1595 M522 1618 L522 1578 M540 1612 L540 1572 M558 1618 L558 1578 M578 1632 L578 1595 M598 1650 L598 1618" stroke="${palette.bridgeRail}" stroke-width="4" stroke-linecap="round"/>
    <!-- Golden Finials (Giboshi) atop the bridge posts -->
    <circle cx="482" cy="1616" r="3.5" fill="${palette.goldTrim}"/>
    <circle cx="502" cy="1593" r="3.5" fill="${palette.goldTrim}"/>
    <circle cx="522" cy="1576" r="3.8" fill="${palette.goldTrim}"/>
    <circle cx="540" cy="1570" r="4.2" fill="${palette.goldTrim}"/>
    <circle cx="558" cy="1576" r="3.8" fill="${palette.goldTrim}"/>
    <circle cx="578" cy="1593" r="3.5" fill="${palette.goldTrim}"/>
    <circle cx="598" cy="1616" r="3.5" fill="${palette.goldTrim}"/>
    <!-- Little Stone Lantern (Tōrō) on ground mound next to bridge -->
    <path d="M440 1720 L440 1655 L435 1650 L445 1650 Z" fill="${palette.treeBark}"/>
    <rect x="435" y="1638" width="10" height="12" rx="2" fill="${palette.lanternGlow}" opacity=".9"/>
    <path d="M432 1638 L448 1638 L440 1630 Z" fill="${palette.treeBark}"/>
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
