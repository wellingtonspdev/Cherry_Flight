# Cherry Bloom — Asset Manifest

## 1. Policy
All bundled project art/audio in this handoff is original generated/prototype material. No external stock media, copyrighted Flappy Bird assets, third-party font files or scraped game art are included.

Generated visual material is a starting point; authoritative tokens and rules live in `CHERRY_BLOOM_DESIGN_SYSTEM.md`.

## 2. Concept art

| File | Purpose | Runtime? |
|---|---|---|
| Concept board | overall art direction board | original sheet absent from this checkout; do not assume it is bundled |
| Phase comparison sheet | four-phase comparison | original sheet absent; four separate images are bundled |

## 3. Character PNGs

| File | Intended use |
|---|---|
| `cherry_idle.png` | menu/idle |
| `cherry_happy.png` | positive state |
| `cherry_fall.png` | falling reference |
| `cherry_wink.png` | menu polish |
| `cherry_hit.png` | collision reference |
| `cherry_dizzy.png` | Game Over reference |
| `cherry_celebrate.png` | score/celebration |
| `cherry_neutral.png` | neutral alternate |
| Source sprite sheet (not bundled) | original reference; individual crops are available |
| `app_icon_candidate.jpg` | prototype icon reference |

The individual images were cropped from the generated sheet. Validate transparent padding and visual consistency before production use.

Character images reside in `assets/characters/`; phase images reside in `assets/backgrounds/`. The official character name is Cherry. Earlier filenames using the previous spelling were renamed consistently before publication. Runtime art currently uses `react-native-svg`/Views; rich raster images remain supplied references and must be adapted for landscape rather than stretched.

## 4. Background phase images

| File | Phase |
|---|---|
| `01_first_bloom.jpg` | dawn |
| `02_sakura_garden.jpg` | bright spring |
| `03_golden_bloom.jpg` | sunset |
| `04_yozakura.jpg` | night |

These are prototype/rich backgrounds. For the safest Snack performance, implement a lightweight programmatic background first and add these only after performance review.

## 5. Vector assets

| File | Purpose |
|---|---|
| `cherry_mark.svg` | brand/icon reference |
| `blossom.svg` | sakura ornament |
| `leaf.svg` | foliage ornament |
| `branch_top.svg` | obstacle prototype |
| `branch_bottom.svg` | obstacle prototype |
| `logo_lockup.svg` | wordmark reference |

Raw SVGs are provided for design handoff. In React Native, prefer `react-native-svg` components rather than assuming direct SVG file import/transformers are configured in Snack.

## 6. Prototype audio

| File | Event |
|---|---|
| `ui_tap.wav` | UI button tap |
| `jump_pop.wav` | jump |
| `score_chime.wav` | point |
| `collision_thump.wav` | collision |
| `ambient_bloom_prototype.wav` | optional menu ambience |

Audio is original synthesized prototype material. It is optional and must not block the game if disabled.

## 7. User/reference files

- `references/Atividade_Pratica_09_Flappy_Bird.pdf`
- `references/LICOES_APRENDIDAS_PDM2.md`

## 8. Do not bundle
- proprietary fonts;
- downloaded third-party music without a verified redistribution license;
- Flappy Bird sprites;
- screenshots/artwork copied from inspiration references;
- remote URLs required at runtime.
