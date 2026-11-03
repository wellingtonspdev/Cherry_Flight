// Generates high-fidelity Arcade Cherry Character SVGs for all 8 skins and 6 poses
// Invariant: <ellipse cx="78" cy="88" rx="55" ry="52" .../> preserved for hitbox tests.
import fs from 'node:fs';
import path from 'node:path';

const PALETTES = {
  classic: {
    gradStart: '#FF6075',
    gradMid: '#E11D48',
    gradEnd: '#881337',
    bodyOutline: '#4C0519',
    dimple: '#4C0519',
    rimLight: '#FDA4AF',
    stemColor: '#4A2810',
    stemLight: '#78350F',
    leafStart: '#22C55E',
    leafEnd: '#15803D',
    leafVein: '#14532D',
    blush: '#FB7185',
  },
  sakura: {
    gradStart: '#FFF1F5',
    gradMid: '#F472B6',
    gradEnd: '#9D174D',
    bodyOutline: '#500724',
    dimple: '#500724',
    rimLight: '#FBCFE8',
    stemColor: '#4A2430',
    stemLight: '#831843',
    leafStart: '#86EFAC',
    leafEnd: '#22C55E',
    leafVein: '#166534',
    blush: '#F43F5E',
  },
  noob: {
    gradStart: '#FEF08A',
    gradMid: '#EAB308',
    gradEnd: '#854D0E',
    bodyOutline: '#422006',
    dimple: '#422006',
    rimLight: '#FEF9C3',
    stemColor: '#451A03',
    stemLight: '#78350F',
    leafStart: '#3B82F6',
    leafEnd: '#1D4ED8',
    leafVein: '#1E3A8A',
    blush: '#22C55E',
  },
  matcha: {
    gradStart: '#BBF7D0',
    gradMid: '#4ADE80',
    gradEnd: '#15803D',
    bodyOutline: '#052E16',
    dimple: '#052E16',
    rimLight: '#DCFCE7',
    stemColor: '#272018',
    stemLight: '#57412A',
    leafStart: '#86EFAC',
    leafEnd: '#16A34A',
    leafVein: '#14532D',
    blush: '#F87171',
  },
  golden: {
    gradStart: '#FEF9C3',
    gradMid: '#F59E0B',
    gradEnd: '#92400E',
    bodyOutline: '#451A03',
    dimple: '#451A03',
    rimLight: '#FEF08A',
    stemColor: '#5C3317',
    stemLight: '#A16207',
    leafStart: '#FDE047',
    leafEnd: '#CA8A04',
    leafVein: '#713F12',
    blush: '#F97316',
  },
  yozakura: {
    gradStart: '#E9D5FF',
    gradMid: '#9333EA',
    gradEnd: '#3B0764',
    bodyOutline: '#1E0533',
    dimple: '#1E0533',
    rimLight: '#F0ABFC',
    stemColor: '#1E1B4B',
    stemLight: '#4338CA',
    leafStart: '#22D3EE',
    leafEnd: '#0891B2',
    leafVein: '#164E63',
    blush: '#EC4899',
  },
  kitsune: {
    gradStart: '#FFFFFF',
    gradMid: '#FCE7F3',
    gradEnd: '#BE123C',
    bodyOutline: '#4C0519',
    dimple: '#4C0519',
    rimLight: '#FDA4AF',
    stemColor: '#4A2810',
    stemLight: '#78350F',
    leafStart: '#EF4444',
    leafEnd: '#B91C1C',
    leafVein: '#7F1D1D',
    blush: '#E11D48',
  },
  unicorn: {
    gradStart: '#FFFFFF',
    gradMid: '#F5D0FE',
    gradEnd: '#7E22CE',
    bodyOutline: '#3B0764',
    dimple: '#3B0764',
    rimLight: '#E9D5FF',
    stemColor: '#F59E0B',
    stemLight: '#FDE047',
    leafStart: '#38BDF8',
    leafEnd: '#6366F1',
    leafVein: '#4338CA',
    blush: '#F472B6',
  },
};

function renderStemAndLeaf(pose, palette) {
  let stemD = 'M78 50 C88 34 110 22 132 8';
  let leafAngle = -18;
  let leafX = 129;
  let leafY = 31;

  if (pose === 'jump') {
    stemD = 'M78 50 C86 36 104 26 128 14';
    leafAngle = -32;
    leafX = 126;
    leafY = 34;
  } else if (pose === 'glide') {
    stemD = 'M78 50 C92 36 116 28 136 18';
    leafAngle = -10;
    leafX = 132;
    leafY = 30;
  } else if (pose === 'fall') {
    stemD = 'M78 50 C84 30 96 16 120 4';
    leafAngle = 5;
    leafX = 122;
    leafY = 24;
  } else if (pose === 'hit') {
    stemD = 'M78 50 C80 35 115 30 134 12';
    leafAngle = 28;
    leafX = 128;
    leafY = 32;
  } else if (pose === 'celebrate') {
    stemD = 'M78 50 C90 32 112 18 135 6';
    leafAngle = -42;
    leafX = 130;
    leafY = 26;
  }

  return `
    <!-- Calyx Dimple (covinha superior de cereja) -->
    <path d="M64 47 Q78 54 92 47" stroke="${palette.dimple}" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>
    <!-- Organic Stem -->
    <path d="${stemD}" fill="none" stroke="${palette.stemColor}" stroke-width="8" stroke-linecap="round"/>
    <path d="${stemD}" fill="none" stroke="${palette.stemLight}" stroke-width="2.5" opacity=".6" stroke-linecap="round"/>
    <!-- Leaf with outline & two-tone cel-shading -->
    <g transform="rotate(${leafAngle} ${leafX} ${leafY})">
      <path d="M ${leafX - 20} ${leafY} Q ${leafX} ${leafY - 20} ${leafX + 23} ${leafY} Q ${leafX} ${leafY + 17} ${leafX - 20} ${leafY} Z" fill="${palette.leafStart}" stroke="${palette.bodyOutline}" stroke-width="2"/>
      <path d="M ${leafX - 20} ${leafY} Q ${leafX} ${leafY + 17} ${leafX + 23} ${leafY} Z" fill="${palette.leafEnd}" opacity=".7"/>
      <line x1="${leafX - 16}" y1="${leafY}" x2="${leafX + 18}" y2="${leafY}" stroke="${palette.leafVein}" stroke-width="2" stroke-linecap="round"/>
      <line x1="${leafX - 4}" y1="${leafY}" x2="${leafX + 2}" y2="${leafY - 6}" stroke="${palette.leafVein}" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="${leafX + 6}" y1="${leafY}" x2="${leafX + 12}" y2="${leafY - 5}" stroke="${palette.leafVein}" stroke-width="1.2" stroke-linecap="round"/>
    </g>
  `;
}

function renderFace(pose, palette) {
  let eyes = '';
  let mouth = '';
  let extra = '';

  if (pose === 'idle') {
    eyes = `
      <!-- Solid Arcade Eyes with Dual Catchlights -->
      <ellipse cx="56" cy="74" rx="5.5" ry="7.5" fill="#1A1218"/>
      <circle cx="54" cy="71" r="2.4" fill="#FFFFFF"/>
      <circle cx="58" cy="77" r="1.2" fill="#FFFFFF"/>
      <ellipse cx="100" cy="74" rx="5.5" ry="7.5" fill="#1A1218"/>
      <circle cx="98" cy="71" r="2.4" fill="#FFFFFF"/>
      <circle cx="102" cy="77" r="1.2" fill="#FFFFFF"/>
    `;
    mouth = `<path d="M71 85 Q78 92 85 85" stroke="#1A1218" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  } else if (pose === 'jump') {
    eyes = `
      <!-- Cheerful Kawaii Arched Eyes -->
      <path d="M49 76 Q56 66 63 76" stroke="#1A1218" stroke-width="4.8" fill="none" stroke-linecap="round"/>
      <path d="M93 76 Q100 66 107 76" stroke="#1A1218" stroke-width="4.8" fill="none" stroke-linecap="round"/>
    `;
    mouth = `
      <!-- Open Happy Mouth with Tongue -->
      <path d="M70 82 Q78 96 86 82 Z" fill="#D81B43" stroke="#1A1218" stroke-width="2.8"/>
      <path d="M73 89 Q78 96 83 89 Z" fill="#FFAEC0"/>
    `;
  } else if (pose === 'glide') {
    eyes = `
      <!-- Winking Eyeball Left, Happy Arch Right -->
      <ellipse cx="56" cy="74" rx="5.5" ry="7.5" fill="#1A1218"/>
      <circle cx="54" cy="71" r="2.4" fill="#FFFFFF"/>
      <circle cx="58" cy="77" r="1.2" fill="#FFFFFF"/>
      <path d="M94 75 Q100 67 106 75" stroke="#1A1218" stroke-width="4.8" fill="none" stroke-linecap="round"/>
    `;
    mouth = `<path d="M72 84 Q80 88 88 83" stroke="#1A1218" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  } else if (pose === 'fall') {
    eyes = `
      <!-- Focused Downward Looking Eyes -->
      <ellipse cx="56" cy="75" rx="6" ry="8" fill="#1A1218"/>
      <circle cx="55" cy="76" r="2.6" fill="#FFFFFF"/>
      <circle cx="58" cy="72" r="1.2" fill="#FFFFFF"/>
      <ellipse cx="100" cy="75" rx="6" ry="8" fill="#1A1218"/>
      <circle cx="99" cy="76" r="2.6" fill="#FFFFFF"/>
      <circle cx="102" cy="72" r="1.2" fill="#FFFFFF"/>
    `;
    mouth = `<ellipse cx="78" cy="88" rx="4.5" ry="6" fill="#1A1218"/>`;
  } else if (pose === 'hit') {
    eyes = `
      <!-- Anime > < Collision Eyes -->
      <path d="M51 69 L61 74 L51 79" stroke="#1A1218" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M105 69 L95 74 L105 79" stroke="#1A1218" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    `;
    mouth = `<path d="M69 90 L73 87 L77 90 L81 87 L85 90" stroke="#1A1218" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    extra = `
      <!-- Comic Impact Spark -->
      <path d="M124 44 L126 50 L132 51 L127 55 L129 61 L124 57 L119 60 L121 54 L117 51 L122 49 Z" fill="#FBBF24" stroke="#92400E" stroke-width="1.2"/>
    `;
  } else if (pose === 'celebrate') {
    eyes = `
      <!-- Starry Victory Eyes -->
      <polygon points="56,66 58,72 64,74 59,77 60,83 56,79 52,83 53,77 48,74 54,72" fill="#FBBF24" stroke="#78350F" stroke-width="1.5"/>
      <polygon points="100,66 102,72 108,74 103,77 104,83 100,79 96,83 97,77 92,74 98,72" fill="#FBBF24" stroke="#78350F" stroke-width="1.5"/>
    `;
    mouth = `
      <path d="M68 81 Q78 98 88 81 Z" fill="#D81B43" stroke="#1A1218" stroke-width="2.8"/>
      <path d="M71 89 Q78 98 85 89 Z" fill="#FFAEC0"/>
    `;
    extra = `
      <!-- Confetti Sparkles -->
      <circle cx="28" cy="48" r="3.2" fill="#FBBF24"/>
      <circle cx="132" cy="54" r="3.2" fill="#EC4899"/>
      <circle cx="34" cy="118" r="2.8" fill="#38BDF8"/>
      <polygon points="128,110 130,113 133,114 130,115 128,118 126,115 123,114 126,113" fill="#F59E0B"/>
    `;
  }

  return `
    ${eyes}
    ${mouth}
    ${extra}
    <!-- Soft Cheeks -->
    <ellipse cx="42" cy="89" rx="7.5" ry="5.5" fill="${palette.blush}" opacity=".65"/>
    <ellipse cx="114" cy="89" rx="7.5" ry="5.5" fill="${palette.blush}" opacity=".65"/>
  `;
}

function renderAccessories(skin, pose, palette) {
  if (skin === 'sakura') {
    return `
      <!-- Sakura Flower accessory on stem -->
      <g transform="translate(90, 36) scale(0.65)">
        <ellipse cx="0" cy="-14" rx="6" ry="10" fill="#FFCCD7" stroke="#9D174D" stroke-width="1.2"/>
        <ellipse cx="13" cy="-4" rx="6" ry="10" fill="#FFCCD7" stroke="#9D174D" stroke-width="1.2" transform="rotate(72 13 -4)"/>
        <ellipse cx="8" cy="11" rx="6" ry="10" fill="#FFCCD7" stroke="#9D174D" stroke-width="1.2" transform="rotate(144 8 11)"/>
        <ellipse cx="-8" cy="11" rx="6" ry="10" fill="#FFCCD7" stroke="#9D174D" stroke-width="1.2" transform="rotate(216 -8 11)"/>
        <ellipse cx="-13" cy="-4" rx="6" ry="10" fill="#FFCCD7" stroke="#9D174D" stroke-width="1.2" transform="rotate(288 -13 -4)"/>
        <circle cx="0" cy="0" r="4.5" fill="#E11D48"/>
        <circle cx="0" cy="0" r="2" fill="#FBBF24"/>
      </g>
    `;
  } else if (skin === 'noob') {
    return `
      <!-- Classic Blox Cap / Visor -->
      <path d="M48 48 Q78 30 108 48 L106 55 Q78 40 50 55 Z" fill="#1D4ED8" stroke="#1E3A8A" stroke-width="2.5"/>
      <ellipse cx="78" cy="36" rx="8" ry="4" fill="#2563EB" stroke="#1E3A8A" stroke-width="1.5"/>
      <circle cx="78" cy="34" r="2.5" fill="#FACC15"/>
    `;
  } else if (skin === 'matcha') {
    return `
      <!-- Ninja Hachimaki Headband -->
      <path d="M30 63 Q78 73 126 63 L127 71 Q78 81 29 71 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="2"/>
      <rect x="67" y="65" width="22" height="9" rx="2" fill="#F1F5F9" stroke="#475569" stroke-width="1.2"/>
      <circle cx="78" cy="69.5" r="2.5" fill="#DC2626"/>
      <!-- Headband Flying Tails -->
      <path d="M125 64 Q142 58 152 68 Q140 68 126 70 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="1"/>
      <path d="M125 68 Q140 76 150 84 Q138 78 126 72 Z" fill="#B91C1C" stroke="#7F1D1D" stroke-width="1"/>
    `;
  } else if (skin === 'golden') {
    return `
      <!-- Golden Royal Crown & Bobux Insignia -->
      <path d="M58 48 L60 30 L69 40 L78 24 L87 40 L96 30 L98 48 Z" fill="#FDE047" stroke="#78350F" stroke-width="2.2"/>
      <circle cx="60" cy="30" r="2.5" fill="#EF4444"/>
      <circle cx="78" cy="24" r="3" fill="#3B82F6"/>
      <circle cx="96" cy="30" r="2.5" fill="#EF4444"/>
      <!-- Hexagonal Bobux Medallion -->
      <polygon points="78,40 84,43 84,51 78,54 72,51 72,43" fill="#CA8A04" stroke="#78350F" stroke-width="1.2"/>
      <text x="78" y="49" font-family="monospace" font-size="7" font-weight="bold" fill="#FEF08A" text-anchor="middle">B</text>
    `;
  } else if (skin === 'yozakura') {
    return `
      <!-- Translucent Cyber Visor -->
      <path d="M40 66 Q78 76 116 66 L114 80 Q78 89 42 80 Z" fill="#06B6D4" opacity=".5" stroke="#22D3EE" stroke-width="2"/>
      <line x1="48" y1="73" x2="108" y2="73" stroke="#67E8F9" stroke-width="1.5" stroke-dasharray="6,3" opacity=".8"/>
    `;
  } else if (skin === 'kitsune') {
    return `
      <!-- Kitsune Fox Ears with Torii Red Tips -->
      <path d="M46 50 L34 20 L60 38 Z" fill="#FFFFFF" stroke="#7F1D1D" stroke-width="2.2"/>
      <path d="M42 38 L36 24 L52 35 Z" fill="#DC2626"/>
      <path d="M110 50 L122 20 L96 38 Z" fill="#FFFFFF" stroke="#7F1D1D" stroke-width="2.2"/>
      <path d="M114 38 L120 24 L104 35 Z" fill="#DC2626"/>
      <!-- Shrine Markings on Cheeks -->
      <path d="M28 84 Q38 86 34 94" stroke="#DC2626" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M128 84 Q118 86 122 94" stroke="#DC2626" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    `;
  } else if (skin === 'unicorn') {
    return `
      <!-- Legendary Unicorn Horn & Pegasus Wings -->
      <!-- Unicorn Spiral Golden Horn -->
      <path d="M72 44 L78 6 L84 44 Z" fill="#FDE047" stroke="#78350F" stroke-width="2.2"/>
      <path d="M74 36 L82 32 M75 26 L81 22 M76 16 L80 13" stroke="#B45309" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Glowing Star at Horn Tip -->
      <polygon points="78,0 79.5,4.5 84,6 79.5,7.5 78,12 76.5,7.5 72,6 76.5,4.5" fill="#FFFFFF" stroke="#FBBF24" stroke-width="0.8"/>
      <!-- Unicorn Ears -->
      <path d="M48 46 L38 22 L58 38 Z" fill="#FFFFFF" stroke="#7E22CE" stroke-width="2"/>
      <path d="M45 37 L40 26 L53 36 Z" fill="#F472B6"/>
      <path d="M108 46 L118 22 L98 38 Z" fill="#FFFFFF" stroke="#7E22CE" stroke-width="2"/>
      <path d="M111 37 L116 26 L103 36 Z" fill="#F472B6"/>
      <!-- Multi-Color Rainbow Mane -->
      <path d="M52 46 C44 54 44 68 50 74 C47 66 48 56 54 50 Z" fill="#F472B6"/>
      <path d="M54 50 C48 60 49 72 55 78 C51 70 53 60 58 54 Z" fill="#FBBF24"/>
      <path d="M57 54 C52 64 54 75 60 81 C56 73 57 63 61 57 Z" fill="#34D399"/>
      <path d="M60 57 C56 67 58 78 64 83 C60 76 61 66 64 60 Z" fill="#38BDF8"/>
      <!-- Left & Right Pegasus Feathered Wings -->
      <path d="M26 84 C14 74 12 56 26 52 C22 62 28 74 36 78 Z" fill="#FFFFFF" stroke="#7E22CE" stroke-width="1.8"/>
      <path d="M130 84 C142 74 144 56 130 52 C134 62 128 74 120 78 Z" fill="#FFFFFF" stroke="#7E22CE" stroke-width="1.8"/>
    `;
  }
  return '';
}

function generateSvg(skin, pose) {
  const palette = PALETTES[skin] || PALETTES.classic;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="150" viewBox="0 0 160 150">
  <defs>
    <radialGradient id="cherry_grad" cx="35%" cy="28%">
      <stop offset="0%" stop-color="${palette.gradStart}"/>
      <stop offset="42%" stop-color="${palette.gradMid}"/>
      <stop offset="100%" stop-color="${palette.gradEnd}"/>
    </radialGradient>
  </defs>
  <!-- Invariant Hitbox Body: ellipse cx="78" cy="88" rx="55" ry="52" -->
  <ellipse cx="78" cy="88" rx="55" ry="52" fill="url(#cherry_grad)" stroke="${palette.bodyOutline}" stroke-width="4.5"/>
  <!-- Primary Glossy Jelly Highlight -->
  <ellipse cx="54" cy="58" rx="14" ry="9" fill="#FFFFFF" opacity=".78" transform="rotate(-30 54 58)"/>
  <ellipse cx="44" cy="74" rx="7" ry="5" fill="#FFFFFF" opacity=".5" transform="rotate(-20 44 74)"/>
  <!-- Bottom Rim Light -->
  <path d="M42 110 Q78 134 114 110" stroke="${palette.rimLight}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
  <!-- Stem & Leaf Secondary Motion -->
  ${renderStemAndLeaf(pose, palette)}
  <!-- Skin Exclusive Accessories -->
  ${renderAccessories(skin, pose, palette)}
  <!-- Arcade Eyes & Face Expression -->
  ${renderFace(pose, palette)}
</svg>`;
}

const dir = 'assets/v2/characters';
const skins = Object.keys(PALETTES);
const poses = ['idle', 'jump', 'glide', 'fall', 'hit', 'celebrate'];

let count = 0;
for (const skin of skins) {
  for (const pose of poses) {
    const filename = `${skin}_${pose}.svg`;
    fs.writeFileSync(path.join(dir, filename), generateSvg(skin, pose));
    count++;
  }
}

// Generate base cherry_* files
for (const pose of poses) {
  const filename = `cherry_${pose}.svg`;
  fs.writeFileSync(path.join(dir, filename), generateSvg('classic', pose));
  count++;
}

console.log(`Generated ${count} high-fidelity Arcade Cherry SVGs across 8 skins and 6 poses!`);
