# Cherry Bloom — Asset Manifest

## 1. Policy
All bundled project art/audio in this handoff is original generated/prototype material. No external stock media, copyrighted Flappy Bird assets, third-party font files or scraped game art are included.

Generated visual material is a starting point; authoritative tokens and rules live in `CHERRY_BLOOM_DESIGN_SYSTEM.md`.

## 2. Concept art

| File | Purpose | Runtime? |
|---|---|---|
| `assets/generated/concept/cherry_bloom_concept_board.png` | overall art direction board | reference only |
| `assets/generated/backgrounds/cherry_bloom_phase_sheet.png` | four-phase comparison | reference only |

## 3. Character PNGs

| File | Intended use |
|---|---|
| `cherri_idle.png` | menu/idle |
| `cherri_happy.png` | positive state |
| `cherri_fall.png` | falling reference |
| `cherri_wink.png` | menu polish |
| `cherri_hit.png` | collision reference |
| `cherri_dizzy.png` | Game Over reference |
| `cherri_celebrate.png` | score/celebration |
| `cherri_neutral.png` | neutral alternate |
| `cherri_sprite_sheet.png` | source/reference sheet |
| `app_icon_candidate.jpg` | prototype icon reference |

The individual images were cropped from the generated sheet. Validate transparent padding and visual consistency before production use.

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
