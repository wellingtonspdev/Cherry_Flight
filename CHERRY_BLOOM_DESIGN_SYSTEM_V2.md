# Cherry Bloom — Design System & Game Art Bible V2

**Version:** 2.0  
**Status:** Official V2 source of truth  
**Primary delivery target:** Expo SDK 54 + Expo Snack  
**Parallel local target:** Expo SDK 57  
**Official protagonist name:** **Cherry**

> V2 supersedes the V1 visual/game-art rules. Any use of “Cherri” is deprecated and must be replaced by **Cherry** in product-facing copy, accessibility text, documentation and generated asset naming.

## 1. V2 product direction
Cherry Bloom is now a **chapter-based arcade campaign** with a post-campaign Endless mode. The core one-tap flight mechanic remains simple and recognizable, but progression, obstacle art, backgrounds, audio, checkpoints and difficulty are organized as a coherent game system.

### Design pillars
1. Gameplay readability beats decoration.
2. **Cherry = player/action; Blossom = world/progression.**
3. Four chapters must feel visually distinct while staying one brand.
4. Difficulty increases through geometry, speed, spacing and sequence constraints—not arbitrary changes to Cherry's fundamental jump feel.
5. Obstacles are modular and pooled; no runtime image generation.
6. SDK 54 / Snack compatibility is the delivery authority.

## 2. Identity
- Product: **Cherry Bloom**
- Protagonist: **Cherry**
- World: Bloom Garden
- Primary obstacle family: Bloom Branches
- Optional tagline: *Fly Through the Blossom*

### Character V2
Authoritative vector states are in `assets/v2/characters/`:
- `cherry_idle.svg/png`
- `cherry_jump.svg/png`
- `cherry_fall.svg/png`
- `cherry_hit.svg/png`

The SVG is the source file. PNG is the runtime fallback/export.

## 3. Core color tokens
| Token | Hex | Use |
|---|---:|---|
| Cherry 500 | `#E63750` | player/CTA |
| Cherry 700 | `#A91532` | pressed/deep accents |
| Cherry 900 | `#541021` | outline/shadow |
| Blossom 300 | `#F5AFC1` | blossoms |
| Cream 50 | `#FFF8F2` | UI surfaces |
| Leaf 500 | `#4F8A5B` | leaves/success |
| Leaf 800 | `#28533A` | dark leaves |
| Bark 600 | `#56383F` | base branch family |
| Ink 900 | `#251A20` | text |
| Sky Day | `#BFE8EF` | day atmosphere |
| Sunset | `#F6A58A` | Golden Bloom |
| Dusk | `#735A91` | transitions |
| Night | `#292847` | Yozakura |

## 4. Campaign visual system

### Chapter 1 — First Bloom (Levels 1–3)
**Mood:** dawn, discovery, low visual density.  
**Obstacle kit:** light warm bark, buds, sparse pale blossoms, bright leaves.  
**FX:** small petals, soft morning glow.  
**Background files:** `assets/v2/backgrounds/first_bloom/`.

### Chapter 2 — Sakura Garden (Levels 4–6)
**Mood:** bright spring, full bloom, energetic color.  
**Obstacle kit:** warmer bark, dense sakura clusters, stronger green.  
**FX:** more petals and blossom bursts.  
**Background files:** `assets/v2/backgrounds/sakura_garden/`.

### Chapter 3 — Golden Bloom (Levels 7–9)
**Mood:** sunset, warm contrast, advanced play.  
**Obstacle kit:** copper bark, coral blossom, olive/gold leaf accents.  
**FX:** warm motes + sparse falling leaves.  
**Background files:** `assets/v2/backgrounds/golden_bloom/`.

### Chapter 4 — Yozakura (Levels 10–12)
**Mood:** moonlit, high contrast, final challenge.  
**Obstacle kit:** dark plum bark, magenta blossoms, cool leaves, glow particles.  
**FX:** petals + fireflies/moon glow.  
**Background files:** `assets/v2/backgrounds/yozakura/`.

## 5. Background architecture
Every chapter ships as layered assets:
- `background_base.svg/png` — sky, sun/moon, large terrain;
- `midground.svg/png` — distant trees/bridge/environment;
- `foreground_frame.svg/png` — decorative edge framing only;
- `overlay_fx.svg/png` — transparent petals/motes/fireflies;
- `background_composite.svg/png` — low-complexity fallback and preview.

### Parallax guidance
| Layer | Relative speed |
|---|---:|
| Sky | 0.00× |
| Mountains | 0.05× |
| Midground | 0.12× |
| Foreground scenery | 0.22–0.40× |
| Obstacles | 1.00× |
| FX particles | independent |

Do not animate decorative layers if frame stability falls below the gameplay target.

## 6. Obstacle V2 system
Obstacles must no longer be a single monolithic image. Each biome kit includes:
- `trunk_body`
- `trunk_edge_overlay`
- `cap_top_a`, `cap_top_b`
- `cap_bottom_a`, `cap_bottom_b`
- `side_branch_1`, `side_branch_2`, `side_branch_3`
- `leaves_cluster`
- `blossom_cluster_a`, `blossom_cluster_b`
- `accent_particles`

All are transparent SVG source assets with PNG exports.

### Runtime composition
A rendered obstacle is assembled from a small approved combination:
`trunk body + cap + optional side branch + foliage + blossom/accent`.

### Variety rule
Variation is achieved by component combination and safe vertical geometry, not by loading a new giant bitmap per obstacle.

### Collision rule
Decorative blossoms/leaves do **not** expand the collision rectangle unless explicitly mapped. Collision corresponds to the readable wood/trunk silhouette.

## 7. Obstacle rendering/performance rule
- Preload current chapter assets **before PLAYING**.
- Keep **minimum 4 pooled pairs** mounted; Level 7+ may use 5.
- Keep at least **3 future pairs prewarmed/offscreen**.
- Recycle pair position, gap, variant and scored flag.
- Never create a future obstacle because it is already about to enter the viewport.
- Movement uses `translateX` / shared values or equivalent; avoid full-tree React re-render per frame.
- No remote image dependency for gameplay-critical assets.

## 8. Progression UX
Home V2 actions:
- **Continue** — resumes at last played/unlocked level start;
- **Levels** — campaign map/level select;
- How to Play;
- Credits.

Locked levels display a lock state. Current checkpoint gets a clear marker. Completed levels display completion/best score.

## 9. Checkpoint visual language
A checkpoint means **level start unlocked**, never frame-perfect save state.

On level completion:
1. score target reached;
2. play Bloom Ring / petal burst;
3. short checkpoint SFX/haptic (optional);
4. persist level completion;
5. unlock next level;
6. show Continue / Next Level.

## 10. Difficulty presentation
Do not communicate difficulty only through hidden numbers. Levels may use subtle labels, chapter dots or progression count. Do not clutter gameplay HUD with tuning values.

## 11. Motion V2
### Cherry
- Idle: ±4–6dp bob.
- Tap/jump: immediate upward response + 100–160ms squash/stretch.
- Fall: gradual downward tilt.
- Hit: short squash + 6–10° shake/rotation.

### UI
- Press: scale `1 → .96 → 1`.
- Score: micro-bounce `1 → 1.08 → 1`.
- Checkpoint: bloom ring + 6–12 petals.
- Level complete: restrained petal shower.
- New chapter: crossfade background palette, never hard flash.

### FX budgets
- Gameplay petals: target 8–20 active elements depending on device.
- Fireflies: 6–12.
- Decorative motion must never intercept touch (`pointerEvents="none"`).

## 12. Audio identity V2
Audio is a subsystem, not ad hoc calls.

### Music themes
- `music_first_bloom`
- `music_sakura_garden`
- `music_golden_bloom`
- `music_yozakura`

### SFX
- jump/tap
- score
- collision
- checkpoint
- level complete
- unlock
- UI button
- pause/resume

Music loops; SFX are short and preloaded. Persist music/SFX preferences. Audio failure must never block gameplay.

## 13. Screen system V2
The academic files remain authoritative:
- `tela1.js` Welcome/Home — adds Continue/Levels;
- `tela2.js` Instructions;
- `tela3.js` Game — chapter/level driven;
- `tela4.js` Credits.

Level Select may be a component/modal nested in the academic screen architecture; do not remove required files.

## 14. Accessibility
- minimum 44×44dp touch targets;
- readable contrast across all four backgrounds;
- mute toggles labelled;
- decorative overlays `pointerEvents="none"`;
- gameplay cannot rely on sound or color alone.

## 15. Asset authority
For V2 visual implementation, prefer `assets/v2/` over V1 concept art. Old raster boards remain references only.
