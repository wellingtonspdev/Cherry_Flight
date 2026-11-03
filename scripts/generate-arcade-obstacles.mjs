// Generates high-fidelity Arcade Obstacle SVGs for all 4 biomes
import fs from 'node:fs';
import path from 'node:path';

const BIOMES = {
  first_bloom: {
    woodStart: '#5D403B',
    woodMid: '#8D5B4C',
    woodEnd: '#5D403B',
    woodOutline: '#331E1A',
    woodHighlight: '#FFE0D6',
    woodShadow: '#1A0D0B',
    capBase: '#6D4C41',
    capHighlight: '#8D6E63',
    studColor: '#F5C042',
    studBorder: '#B45309',
    petalBase: '#F7C5D2',
    petalCore: '#E63750',
    petalStamen: '#FFF3DE',
    leafBase: '#4F8A5B',
    leafVein: '#28533A',
  },
  sakura_garden: {
    woodStart: '#6B3F49',
    woodMid: '#965C68',
    woodEnd: '#6B3F49',
    woodOutline: '#361920',
    woodHighlight: '#FFD9E2',
    woodShadow: '#220D13',
    capBase: '#784752',
    capHighlight: '#9E6773',
    studColor: '#FCD34D',
    studBorder: '#D97706',
    petalBase: '#FFCCD7',
    petalCore: '#FF6B8B',
    petalStamen: '#FFF8E7',
    leafBase: '#5C946E',
    leafVein: '#2D593E',
  },
  golden_bloom: {
    woodStart: '#6E4324',
    woodMid: '#9C6538',
    woodEnd: '#6E4324',
    woodOutline: '#3D2210',
    woodHighlight: '#FEF3C7',
    woodShadow: '#201004',
    capBase: '#7D4D29',
    capHighlight: '#A36C3D',
    studColor: '#FBBF24',
    studBorder: '#92400E',
    petalBase: '#FED7AA',
    petalCore: '#F59E0B',
    petalStamen: '#FEF3C7',
    leafBase: '#D97706',
    leafVein: '#78350F',
  },
  yozakura: {
    woodStart: '#25224A',
    woodMid: '#433E78',
    woodEnd: '#25224A',
    woodOutline: '#131128',
    woodHighlight: '#DDD6FE',
    woodShadow: '#0A0817',
    capBase: '#2D2A54',
    capHighlight: '#4A4582',
    studColor: '#38BDF8',
    studBorder: '#0284C7',
    petalBase: '#E879F9',
    petalCore: '#A855F7',
    petalStamen: '#F0ABFC',
    leafBase: '#2DD4BF',
    leafVein: '#0F766E',
  },
};

function generateTrunkBody(palette) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="320" viewBox="0 0 160 320">
    <defs>
      <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${palette.woodStart}"/>
        <stop offset="40%" stop-color="${palette.woodMid}"/>
        <stop offset="100%" stop-color="${palette.woodEnd}"/>
      </linearGradient>
    </defs>
    <!-- Solid arcade cel-shaded wooden pillar -->
    <rect x="18" y="0" width="124" height="320" fill="url(#wood)" stroke="${palette.woodOutline}" stroke-width="6"/>
    <!-- Left highlight cylinder band -->
    <rect x="21" y="0" width="26" height="320" fill="${palette.woodHighlight}" opacity=".22"/>
    <line x1="22" y1="0" x2="22" y2="320" stroke="#FFFFFF" stroke-width="3" opacity=".35"/>
    <!-- Right deep shadow cylinder band -->
    <rect x="106" y="0" width="33" height="320" fill="${palette.woodShadow}" opacity=".42"/>
    <line x1="106" y1="0" x2="106" y2="320" stroke="${palette.woodShadow}" stroke-width="2.5" opacity=".5"/>
    <!-- Stylized wood grain lines -->
    <path d="M48 0 C44 55 64 110 52 170 C42 220 56 275 50 320" stroke="${palette.woodHighlight}" stroke-width="3.5" opacity=".3" fill="none"/>
    <path d="M84 0 C94 65 76 135 86 200 C96 250 80 290 84 320" stroke="${palette.woodShadow}" stroke-width="3" opacity=".35" fill="none"/>
    <!-- Stylized tree knots -->
    <ellipse cx="68" cy="120" rx="9" ry="14" fill="${palette.woodOutline}" stroke="${palette.woodShadow}" stroke-width="2.5"/>
    <ellipse cx="68" cy="120" rx="4.5" ry="7.5" fill="${palette.woodMid}"/>
    <path d="M68 104 C78 108 78 132 68 136" stroke="${palette.woodHighlight}" stroke-width="2" opacity=".4" fill="none"/>
    <ellipse cx="94" cy="245" rx="7" ry="11" fill="${palette.woodOutline}" stroke="${palette.woodShadow}" stroke-width="2"/>
    <ellipse cx="94" cy="245" rx="3.5" ry="5.5" fill="${palette.woodMid}"/>
</svg>`;
}

function generateTrunkEdgeOverlay(palette) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="320" viewBox="0 0 160 320">
    <rect x="18" y="0" width="124" height="320" fill="none" stroke="${palette.woodOutline}" stroke-width="6"/>
    <line x1="24" y1="0" x2="24" y2="320" stroke="#FFFFFF" stroke-width="2.5" opacity=".35"/>
    <line x1="136" y1="0" x2="136" y2="320" stroke="${palette.woodShadow}" stroke-width="3.5" opacity=".45"/>
</svg>`;
}

function renderBlossom(cx, cy, r, palette) {
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const px = cx + Math.cos(angle) * (r * 0.7);
    const py = cy + Math.sin(angle) * (r * 0.7);
    petals.push(`<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * 0.58).toFixed(1)}" ry="${(r * 0.85).toFixed(1)}" fill="${palette.petalBase}" stroke="${palette.woodOutline}" stroke-width="1.2" transform="rotate(${i * 72} ${px.toFixed(1)} ${py.toFixed(1)})"/>`);
  }
  return petals.join('') +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.42).toFixed(1)}" fill="${palette.petalCore}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.22).toFixed(1)}" fill="${palette.petalStamen}"/>`;
}

function renderLeaf(x1, y1, x2, y2, palette) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `<path d="M${x1} ${y1} Q${mx - 8} ${my - 8} ${x2} ${y2} Q${mx + 8} ${my + 8} ${x1} ${y1} Z" fill="${palette.leafBase}" stroke="${palette.woodOutline}" stroke-width="1.2"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${palette.leafVein}" stroke-width="1"/>`;
}

function generateCapBottom(palette, isVariantB) {
  const b1 = isVariantB ? renderBlossom(145, 66, 17, palette) : renderBlossom(65, 66, 17, palette);
  const b2 = isVariantB ? renderBlossom(95, 78, 14, palette) : renderBlossom(115, 78, 14, palette);
  const b3 = isVariantB ? renderBlossom(50, 68, 12, palette) : renderBlossom(160, 68, 12, palette);
  const l1 = isVariantB ? renderLeaf(115, 68, 135, 90, palette) : renderLeaf(85, 68, 65, 90, palette);
  const l2 = isVariantB ? renderLeaf(68, 70, 48, 88, palette) : renderLeaf(135, 70, 155, 88, palette);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="120" viewBox="0 0 210 120">
    <!-- Carved wooden collar at gap opening -->
    <path d="M12 20 L198 20 L188 64 Q105 88 22 64 Z" fill="${palette.capBase}" stroke="${palette.woodOutline}" stroke-width="6"/>
    <path d="M16 24 L194 24 L185 48 Q105 68 25 48 Z" fill="${palette.capHighlight}" opacity=".7"/>
    <!-- Stud accents -->
    <circle cx="48" cy="46" r="5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
    <circle cx="105" cy="56" r="6" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
    <circle cx="162" cy="46" r="5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
    <!-- Foliage & sakura blossoms draping downward -->
    ${l1}
    ${l2}
    ${b3}
    ${b2}
    ${b1}
</svg>`;
}

function generateCapTop(palette, isVariantB) {
  const b1 = isVariantB ? renderBlossom(145, 54, 17, palette) : renderBlossom(65, 54, 17, palette);
  const b2 = isVariantB ? renderBlossom(95, 42, 14, palette) : renderBlossom(115, 42, 14, palette);
  const b3 = isVariantB ? renderBlossom(50, 52, 12, palette) : renderBlossom(160, 52, 12, palette);
  const l1 = isVariantB ? renderLeaf(115, 52, 135, 30, palette) : renderLeaf(85, 52, 65, 30, palette);
  const l2 = isVariantB ? renderLeaf(68, 50, 48, 32, palette) : renderLeaf(135, 50, 155, 32, palette);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="120" viewBox="0 0 210 120">
    <!-- Carved wooden collar at gap opening pointing up -->
    <path d="M12 100 L198 100 L188 56 Q105 32 22 56 Z" fill="${palette.capBase}" stroke="${palette.woodOutline}" stroke-width="6"/>
    <path d="M16 96 L194 96 L185 72 Q105 52 25 72 Z" fill="${palette.capHighlight}" opacity=".7"/>
    <!-- Stud accents -->
    <circle cx="48" cy="74" r="5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
    <circle cx="105" cy="64" r="6" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
    <circle cx="162" cy="74" r="5" fill="${palette.studColor}" stroke="${palette.studBorder}" stroke-width="1.5"/>
    <!-- Foliage & sakura blossoms draping upward -->
    ${l1}
    ${l2}
    ${b3}
    ${b2}
    ${b1}
</svg>`;
}

function generateSideBranch(palette, index) {
  if (index === 1) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
      <path d="M15 130 C75 125 105 85 190 48" stroke="${palette.woodOutline}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <path d="M15 130 C75 125 105 85 190 48" stroke="${palette.woodMid}" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M20 128 C80 123 108 86 188 50" stroke="${palette.woodHighlight}" stroke-width="4" opacity=".5" fill="none" stroke-linecap="round"/>
      ${renderLeaf(120, 75, 145, 55, palette)}
      ${renderBlossom(180, 48, 16, palette)}
      ${renderBlossom(140, 80, 11, palette)}
    </svg>`;
  } else if (index === 2) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
      <path d="M225 130 C165 125 135 85 50 48" stroke="${palette.woodOutline}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <path d="M225 130 C165 125 135 85 50 48" stroke="${palette.woodMid}" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M220 128 C160 123 132 86 52 50" stroke="${palette.woodHighlight}" stroke-width="4" opacity=".5" fill="none" stroke-linecap="round"/>
      ${renderLeaf(120, 75, 95, 55, palette)}
      ${renderBlossom(60, 48, 16, palette)}
      ${renderBlossom(100, 80, 11, palette)}
    </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
      <path d="M20 140 C80 135 110 100 170 75" stroke="${palette.woodOutline}" stroke-width="26" fill="none" stroke-linecap="round"/>
      <path d="M20 140 C80 135 110 100 170 75" stroke="${palette.woodMid}" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M120 105 C150 95 180 110 215 115" stroke="${palette.woodOutline}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M120 105 C150 95 180 110 215 115" stroke="${palette.woodMid}" stroke-width="10" fill="none" stroke-linecap="round"/>
      ${renderLeaf(140, 65, 165, 45, palette)}
      ${renderBlossom(170, 75, 15, palette)}
      ${renderBlossom(215, 115, 13, palette)}
    </svg>`;
  }
}

function generateLeavesCluster(palette) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180">
    ${renderLeaf(80, 90, 110, 70, palette)}
    ${renderLeaf(115, 80, 145, 60, palette)}
    ${renderLeaf(140, 90, 170, 75, palette)}
</svg>`;
}

function generateBlossomCluster(palette, isVariantB) {
  if (!isVariantB) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="150" viewBox="0 0 160 150">
      ${renderLeaf(40, 80, 20, 60, palette)}
      ${renderLeaf(120, 80, 140, 60, palette)}
      ${renderBlossom(80, 75, 20, palette)}
      ${renderBlossom(45, 75, 14, palette)}
      ${renderBlossom(115, 75, 14, palette)}
    </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="150" viewBox="0 0 160 150">
      ${renderLeaf(30, 75, 15, 95, palette)}
      ${renderLeaf(125, 75, 145, 95, palette)}
      ${renderBlossom(60, 70, 18, palette)}
      ${renderBlossom(105, 72, 17, palette)}
      ${renderBlossom(82, 92, 12, palette)}
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
