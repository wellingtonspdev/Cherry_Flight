// Generates high-fidelity Arcade Obstacle SVGs for all 4 biomes
// Designed for crisp readability, tactile wooden textures, and lush cherry blossoms
import fs from 'node:fs';
import path from 'node:path';

const BIOMES = {
  first_bloom: {
    woodStart: '#4E2D27',
    woodMid: '#7A4B3E',
    woodEnd: '#4E2D27',
    woodOutline: '#2B1612',
    woodHighlight: '#FFE4DB',
    woodShadow: '#1F0F0D',
    capBase: '#5E382F',
    capHighlight: '#8A584A',
    studColor: '#F5C042',
    studBorder: '#8C4806',
    petalBase: '#FFB8CB',
    petalHighlight: '#FFF0F5',
    petalCore: '#D81B43',
    petalStamen: '#FDE047',
    leafBase: '#2E8540',
    leafLight: '#4ADE80',
    leafVein: '#166534',
  },
  sakura_garden: {
    woodStart: '#542E3B',
    woodMid: '#824859',
    woodEnd: '#542E3B',
    woodOutline: '#2A131C',
    woodHighlight: '#FFE0EB',
    woodShadow: '#1D0B12',
    capBase: '#663747',
    capHighlight: '#945568',
    studColor: '#FCD34D',
    studBorder: '#A16207',
    petalBase: '#FF9EC2',
    petalHighlight: '#FFF5F8',
    petalCore: '#BE185D',
    petalStamen: '#FEF08A',
    leafBase: '#2D8A68',
    leafLight: '#34D399',
    leafVein: '#065F46',
  },
  golden_bloom: {
    woodStart: '#5C3317',
    woodMid: '#8B5128',
    woodEnd: '#5C3317',
    woodOutline: '#2E1708',
    woodHighlight: '#FEF3C7',
    woodShadow: '#1B0C04',
    capBase: '#6D3F1E',
    capHighlight: '#9E5F32',
    studColor: '#FBBF24',
    studBorder: '#78350F',
    petalBase: '#FDBA74',
    petalHighlight: '#FFF7ED',
    petalCore: '#EA580C',
    petalStamen: '#FEF08A',
    leafBase: '#B45309',
    leafLight: '#FBBF24',
    leafVein: '#78350F',
  },
  yozakura: {
    woodStart: '#1E1940',
    woodMid: '#38306E',
    woodEnd: '#1E1940',
    woodOutline: '#0E0B20',
    woodHighlight: '#DDD6FE',
    woodShadow: '#090714',
    capBase: '#262052',
    capHighlight: '#483E88',
    studColor: '#38BDF8',
    studBorder: '#0369A1',
    petalBase: '#E879F9',
    petalHighlight: '#FDF4FF',
    petalCore: '#9333EA',
    petalStamen: '#F0ABFC',
    leafBase: '#0D9488',
    leafLight: '#2DD4BF',
    leafVein: '#115E59',
  },
};

function generateTrunkBody(palette) {
  // MUST have <linearGradient id="wood" ...> for test assertions
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="320" viewBox="0 0 160 320">
  <defs>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${palette.woodStart}"/>
      <stop offset="35%" stop-color="${palette.woodMid}"/>
      <stop offset="70%" stop-color="${palette.woodStart}"/>
      <stop offset="100%" stop-color="${palette.woodShadow}"/>
    </linearGradient>
  </defs>
  <!-- Main Wood Pillar Body -->
  <rect x="18" y="0" width="124" height="320" fill="url(#wood)" stroke="${palette.woodOutline}" stroke-width="5"/>
  <!-- Left Rounded Cylinder Highlight Band -->
  <rect x="23" y="0" width="22" height="320" fill="${palette.woodHighlight}" opacity=".26"/>
  <line x1="25" y1="0" x2="25" y2="320" stroke="#FFFFFF" stroke-width="3" opacity=".35"/>
  <!-- Right Shadow Band -->
  <rect x="108" y="0" width="31" height="320" fill="${palette.woodShadow}" opacity=".48"/>
  <line x1="108" y1="0" x2="108" y2="320" stroke="${palette.woodOutline}" stroke-width="2" opacity=".4"/>
  <!-- Wavy Wood Grain Chiseled Lines -->
  <path d="M48 0 C42 60 62 120 50 180 C40 230 54 280 48 320" stroke="${palette.woodHighlight}" stroke-width="3" opacity=".28" fill="none"/>
  <path d="M82 0 C92 70 74 140 84 210 C94 260 78 300 82 320" stroke="${palette.woodOutline}" stroke-width="3" opacity=".4" fill="none"/>
  <!-- Stylized Japanese Cherry Tree Knot (Upper) -->
  <ellipse cx="66" cy="110" rx="10" ry="16" fill="${palette.woodOutline}"/>
  <ellipse cx="66" cy="110" rx="6" ry="10" fill="${palette.woodMid}"/>
  <path d="M66 94 C76 98 76 122 66 126" stroke="${palette.woodHighlight}" stroke-width="2.5" opacity=".45" fill="none"/>
  <!-- Stylized Japanese Cherry Tree Knot (Lower) -->
  <ellipse cx="96" cy="240" rx="8" ry="13" fill="${palette.woodOutline}"/>
  <ellipse cx="96" cy="240" rx="5" ry="8" fill="${palette.woodStart}"/>
  <path d="M96 228 C87 232 87 248 96 252" stroke="${palette.woodHighlight}" stroke-width="2" opacity=".4" fill="none"/>
</svg>`;
}

function generateTrunkEdgeOverlay(palette) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="320" viewBox="0 0 160 320">
  <rect x="18" y="0" width="124" height="320" fill="none" stroke="${palette.woodOutline}" stroke-width="5"/>
  <line x1="23" y1="0" x2="23" y2="320" stroke="${palette.woodHighlight}" stroke-width="2" opacity=".4"/>
  <line x1="137" y1="0" x2="137" y2="320" stroke="${palette.woodShadow}" stroke-width="3" opacity=".5"/>
</svg>`;
}

function renderBlossom(cx, cy, r, palette) {
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const px = cx + Math.cos(angle) * (r * 0.72);
    const py = cy + Math.sin(angle) * (r * 0.72);
    petals.push(
      `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * 0.62).toFixed(1)}" ry="${(r * 0.92).toFixed(1)}" fill="${palette.petalBase}" stroke="${palette.woodOutline}" stroke-width="1.8" transform="rotate(${i * 72} ${px.toFixed(1)} ${py.toFixed(1)})"/>` +
      `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * 0.38).toFixed(1)}" ry="${(r * 0.65).toFixed(1)}" fill="${palette.petalHighlight}" opacity=".5" transform="rotate(${i * 72} ${px.toFixed(1)} ${py.toFixed(1)})"/>`
    );
  }
  return petals.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.44).toFixed(1)}" fill="${palette.petalCore}" stroke="${palette.woodOutline}" stroke-width="1"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.22).toFixed(1)}" fill="${palette.petalStamen}"/>`;
}

function renderLeaf(x1, y1, x2, y2, palette) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const nx = -dy * 0.4;
  const ny = dx * 0.4;
  return `<path d="M${x1} ${y1} Q${mx + nx} ${my + ny} ${x2} ${y2} Q${mx - nx} ${my - ny} ${x1} ${y1} Z" fill="${palette.leafBase}" stroke="${palette.woodOutline}" stroke-width="1.5"/><path d="M${x1} ${y1} Q${mx + nx * 0.5} ${my + ny * 0.5} ${x2} ${y2} Z" fill="${palette.leafLight}" opacity=".4"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${palette.leafVein}" stroke-width="1.2"/>`;
}

// Cap pointing DOWN towards the gap (for obstacle hanging from top)
function generateCapBottom(palette, isVariantB) {
  // viewBox="0 0 160 80"
  // Collar is at y=10..42, with rich sakura blossoms and leaves draping downward (y=32..76)
  const b1 = isVariantB ? renderBlossom(110, 48, 16, palette) : renderBlossom(50, 48, 16, palette);
  const b2 = isVariantB ? renderBlossom(70, 56, 14, palette) : renderBlossom(90, 56, 14, palette);
  const b3 = isVariantB ? renderBlossom(35, 46, 12, palette) : renderBlossom(125, 46, 12, palette);
  const l1 = isVariantB ? renderLeaf(85, 48, 105, 68, palette) : renderLeaf(65, 48, 45, 68, palette);
  const l2 = isVariantB ? renderLeaf(45, 50, 25, 66, palette) : renderLeaf(105, 50, 125, 66, palette);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80">
  <!-- Chunky Arcade Wooden Collar Lip -->
  <path d="M6 10 L154 10 L146 42 Q80 54 14 42 Z" fill="${palette.capBase}" stroke="${palette.woodOutline}" stroke-width="5"/>
  <path d="M10 13 L150 13 L144 32 Q80 44 16 32 Z" fill="${palette.capHighlight}" opacity=".75"/>
  <!-- Polished Brass Arcade Rivets -->
  <circle cx="35" cy="27" r="4.5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
  <circle cx="80" cy="33" r="5.2" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
  <circle cx="125" cy="27" r="4.5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
  <!-- Draping Leaves & Blossoms -->
  ${l1}
  ${l2}
  ${b3}
  ${b2}
  ${b1}
</svg>`;
}

// Cap pointing UP towards the gap (for obstacle rising from bottom)
function generateCapTop(palette, isVariantB) {
  // viewBox="0 0 160 80"
  // Collar is at y=38..70, with rich sakura blossoms and leaves draping upward (y=4..48)
  const b1 = isVariantB ? renderBlossom(110, 32, 16, palette) : renderBlossom(50, 32, 16, palette);
  const b2 = isVariantB ? renderBlossom(70, 24, 14, palette) : renderBlossom(90, 24, 14, palette);
  const b3 = isVariantB ? renderBlossom(35, 34, 12, palette) : renderBlossom(125, 34, 12, palette);
  const l1 = isVariantB ? renderLeaf(85, 32, 105, 12, palette) : renderLeaf(65, 32, 45, 12, palette);
  const l2 = isVariantB ? renderLeaf(45, 30, 25, 14, palette) : renderLeaf(105, 30, 125, 14, palette);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80">
  <!-- Chunky Arcade Wooden Collar Lip -->
  <path d="M6 70 L154 70 L146 38 Q80 26 14 38 Z" fill="${palette.capBase}" stroke="${palette.woodOutline}" stroke-width="5"/>
  <path d="M10 67 L150 67 L144 48 Q80 36 16 48 Z" fill="${palette.capHighlight}" opacity=".75"/>
  <!-- Polished Brass Arcade Rivets -->
  <circle cx="35" cy="53" r="4.5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
  <circle cx="80" cy="47" r="5.2" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
  <circle cx="125" cy="53" r="4.5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
  <!-- Rising Leaves & Blossoms -->
  ${l1}
  ${l2}
  ${b3}
  ${b2}
  ${b1}
</svg>`;
}

function generateSideBranch(palette, index) {
  if (index === 1) {
    // Branch curving to the right
    return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120" viewBox="0 0 180 120">
    <path d="M10 85 C65 82 85 55 145 32" stroke="${palette.woodOutline}" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M10 85 C65 82 85 55 145 32" stroke="${palette.woodMid}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M14 83 C66 80 86 54 143 33" stroke="${palette.woodHighlight}" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>
    ${renderLeaf(95, 52, 118, 36, palette)}
    ${renderBlossom(140, 32, 17, palette)}
    ${renderBlossom(108, 58, 12, palette)}
  </svg>`;
  } else if (index === 2) {
    // Branch curving to the left
    return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120" viewBox="0 0 180 120">
    <path d="M170 85 C115 82 95 55 35 32" stroke="${palette.woodOutline}" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M170 85 C115 82 95 55 35 32" stroke="${palette.woodMid}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M166 83 C114 80 94 54 37 33" stroke="${palette.woodHighlight}" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>
    ${renderLeaf(85, 52, 62, 36, palette)}
    ${renderBlossom(40, 32, 17, palette)}
    ${renderBlossom(72, 58, 12, palette)}
  </svg>`;
  } else {
    // Forked branch
    return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120" viewBox="0 0 180 120">
    <path d="M12 95 C60 92 85 68 135 50" stroke="${palette.woodOutline}" stroke-width="20" fill="none" stroke-linecap="round"/>
    <path d="M12 95 C60 92 85 68 135 50" stroke="${palette.woodMid}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M90 72 C115 65 140 76 165 78" stroke="${palette.woodOutline}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M90 72 C115 65 140 76 165 78" stroke="${palette.woodMid}" stroke-width="9" fill="none" stroke-linecap="round"/>
    ${renderLeaf(105, 46, 126, 30, palette)}
    ${renderBlossom(135, 50, 16, palette)}
    ${renderBlossom(165, 78, 13, palette)}
  </svg>`;
  }
}

function generateLeavesCluster(palette) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120" viewBox="0 0 180 120">
  ${renderLeaf(50, 60, 75, 42, palette)}
  ${renderLeaf(80, 52, 105, 36, palette)}
  ${renderLeaf(100, 62, 125, 48, palette)}
</svg>`;
}

function generateBlossomCluster(palette, isVariantB) {
  if (!isVariantB) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100" viewBox="0 0 160 100">
    ${renderLeaf(30, 52, 12, 38, palette)}
    ${renderLeaf(130, 52, 148, 38, palette)}
    ${renderBlossom(80, 50, 20, palette)}
    ${renderBlossom(42, 50, 15, palette)}
    ${renderBlossom(118, 50, 15, palette)}
  </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100" viewBox="0 0 160 100">
    ${renderLeaf(25, 50, 10, 68, palette)}
    ${renderLeaf(135, 50, 150, 68, palette)}
    ${renderBlossom(58, 48, 18, palette)}
    ${renderBlossom(102, 50, 17, palette)}
    ${renderBlossom(80, 68, 13, palette)}
  </svg>`;
  }
}

for (const [biome, palette] of Object.entries(BIOMES)) {
  const dir = path.join('assets/v2/obstacles', biome);
  fs.writeFileSync(path.join(dir, 'trunk_body.svg'), generateTrunkBody(palette));
  fs.writeFileSync(path.join(dir, 'trunk_edge_overlay.svg'), generateTrunkEdgeOverlay(palette));
  fs.writeFileSync(path.join(dir, 'cap_bottom_a.svg'), generateCapBottom(palette, false));
  fs.writeFileSync(path.join(dir, 'cap_bottom_b.svg'), generateCapBottom(palette, true));
  fs.writeFileSync(path.join(dir, 'cap_top_a.svg'), generateCapTop(palette, false));
  fs.writeFileSync(path.join(dir, 'cap_top_b.svg'), generateCapTop(palette, true));
  fs.writeFileSync(path.join(dir, 'side_branch_1.svg'), generateSideBranch(palette, 1));
  fs.writeFileSync(path.join(dir, 'side_branch_2.svg'), generateSideBranch(palette, 2));
  fs.writeFileSync(path.join(dir, 'side_branch_3.svg'), generateSideBranch(palette, 3));
  fs.writeFileSync(path.join(dir, 'leaves_cluster.svg'), generateLeavesCluster(palette));
  fs.writeFileSync(path.join(dir, 'blossom_cluster_a.svg'), generateBlossomCluster(palette, false));
  fs.writeFileSync(path.join(dir, 'blossom_cluster_b.svg'), generateBlossomCluster(palette, true));
}

console.log('Obstacle SVGs generated successfully for all 4 biomes!');
