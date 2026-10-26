# Cherry Bloom — Design System & Game Art Bible

**Version:** 1.0  
**Status:** Approved handoff baseline  
**Project:** Atividade Prática 9 — PDM II / FATEC  
**Primary delivery target:** Expo SDK 54 + Expo Snack  
**Parallel local target:** Expo SDK 57  
**Theme:** Cherry / Cherry Blossom / arcade flight game  

**Atualização de contrato — 26/10/2026:** por determinação do usuário, o produto deve funcionar em paisagem (horizontal). Referências e proporções verticais deste handoff permanecem históricas. A implementação usa a área horizontal real, menus adaptados e Game Over compacto; o navegador em retrato solicita a rotação do dispositivo.

> This document is the visual and interaction source of truth. If generated concept art conflicts with tokens or rules in this document, **this document wins**.

---

## 1. Product identity

### 1.1 Name
**Cherry Bloom**

### 1.2 Optional tagline
**Fly Through the Blossom**

### 1.3 High-level concept
Cherry Bloom is a compact arcade game inspired by the core interaction pattern of Flappy Bird, but with an original cherry-and-blossom identity. The player controls **Cherry**, a living cherry carried through the **Bloom Garden**, avoiding flowering branches while the environment transitions from morning to night as the score rises.

### 1.4 Brand promise
A game that **looks calm, soft and delightful but plays fast and demanding**.

### 1.5 Design pillars
1. **Readable at game speed** — gameplay silhouette and gap readability always beat decoration.
2. **Cherry = gameplay; blossom = world** — cherryes represent player/action; sakura represents atmosphere/progression.
3. **Soft UI, fast mechanics** — menus float and bounce; gameplay reacts instantly.
4. **Original, not a pink Flappy Bird clone** — no green pipes, no copied bird sprite, no copied title treatment.
5. **Snack-safe first** — the visual system must remain implementable in Expo SDK 54 / Snack without a heavy native graphics stack.

---

## 2. Narrative foundation

### 2.1 Protagonist
**Cherry** — a small cherry born from the Bloom Tree.

### 2.2 Minimal lore
At the beginning of spring, a gust of wind separates Cherry from her branch. She must cross the Bloom Garden, using the wind and drifting petals to stay in the air until she reaches the Heart Tree.

The lore exists to make design decisions coherent. It does **not** require cutscenes or long text.

### 2.3 World vocabulary
- **Bloom Garden** — overall world.
- **Bloom Branch** — primary obstacle family.
- **Bloom Petal** — particle and optional collectible family.
- **Heart Tree** — lore destination, not required for MVP gameplay.
- **First Bloom** — phase 1.
- **Sakura Garden** — phase 2.
- **Golden Bloom** — phase 3.
- **Yozakura** — phase 4 / night phase.

---

## 3. Logo system

### 3.1 Primary lockup
Two-line wordmark:

```text
CHERRY
BLOOM
```

Characteristics:
- rounded, bold, arcade-friendly letterforms;
- cherry red top line;
- deep cherry lower line;
- optional small blossom integrated into an `O` or between the words;
- must remain legible on 320 px-wide devices.

### 3.2 Compact mark
`CB` + cherry icon.

### 3.3 Icon mark
Single Cherry/cherry symbol, no text.

### 3.4 Usage rules
- Do not stretch.
- Do not add uncontrolled glows.
- Do not place on high-detail backgrounds without a cream/dark scrim.
- Minimum clear space: 0.5× cherry body diameter.
- In gameplay, do not display the full logo.

### 3.5 Bundled references
- `assets/vector/logo_lockup.svg`
- `assets/vector/cherry_mark.svg`
- original concept board (not included in this checkout; see the asset manifest)

The generated board is a **visual reference**, not the source of truth for text, numbers, colors, or layout measurements.

---

## 4. Color system

### 4.1 Core palette

| Token | Hex | Usage |
|---|---:|---|
| `cherry.500` | `#E63750` | primary CTA, Cherry base, highlights |
| `cherry.700` | `#A91532` | pressed states, titles, deep accents |
| `cherry.900` | `#541021` | dark contrast, deep shadows |
| `blossom.300` | `#F5AFC1` | flowers, decorative surfaces |
| `blossom.100` | `#FFE3EA` | soft cards and background fills |
| `cream.50` | `#FFF8F2` | primary light surface |
| `leaf.500` | `#4F8A5B` | leaves, success accents |
| `leaf.800` | `#28533A` | leaf outlines / dark greens |
| `bark.600` | `#56383F` | obstacles / branch trunks |
| `ink.900` | `#251A20` | body text |

### 4.2 Atmosphere palette

| Token | Hex | Phase |
|---|---:|---|
| `sky.day` | `#BFE8EF` | First Bloom / Sakura Garden |
| `sunset.peach` | `#F6A58A` | Golden Bloom |
| `dusk.500` | `#735A91` | sunset transition |
| `night.800` | `#292847` | Yozakura |
| `moon.100` | `#FFF0D0` | Yozakura moon / warm highlights |

### 4.3 Semantic colors

| Token | Value | Use |
|---|---:|---|
| `success` | `#4F8A5B` | success / unlocked |
| `danger` | `#B51F3C` | collision / destructive state |
| `surface` | `#FFF8F2` | default card |
| `surfaceElevated` | `#FFFFFF` | high-contrast panel |
| `textPrimary` | `#251A20` | standard text |
| `textOnCherry` | `#FFF8F2` | primary button text |

### 4.4 Contrast rule
Gameplay HUD must remain readable against all four background phases. Use cream/white text with a dark shadow/stroke or a semi-transparent backing shape where necessary.

---

## 5. Typography

### 5.1 Principle
Typography is playful but never childish enough to hurt legibility.

### 5.2 Recommended families
Preferred visual references:
- Fredoka
- Nunito
- Baloo 2

**Do not bundle font binaries in the handoff package.** Use system fonts first for the SDK 54 Snack baseline unless runtime font loading is explicitly validated.

### 5.3 Baseline font strategy

| Role | Baseline |
|---|---|
| Display/logo | system rounded/bold fallback or asset logo |
| Headings | system sans, weight 800/900 |
| Body | system sans, weight 400–600 |
| Score | system sans, weight 900, tabular-friendly |

### 5.4 Type scale

| Token | Size | Weight | Usage |
|---|---:|---:|---|
| `display.xl` | 48 | 900 | title where space allows |
| `display.lg` | 38 | 900 | compact title |
| `heading.lg` | 28 | 800 | screen title |
| `heading.md` | 22 | 800 | cards / Game Over |
| `body.lg` | 18 | 600 | instructions |
| `body.md` | 16 | 500 | body text |
| `body.sm` | 14 | 500 | metadata |
| `caption` | 12 | 600 | hints |
| `score` | 48–64 | 900 | gameplay score |

Scale down with device width if clipping occurs. Do not truncate required academic text.

---

## 6. Layout tokens

### 6.1 Spacing
Use a 4-point scale.

```text
space.1 = 4
space.2 = 8
space.3 = 12
space.4 = 16
space.5 = 20
space.6 = 24
space.8 = 32
space.10 = 40
space.12 = 48
```

### 6.2 Radius

```text
radius.sm = 10
radius.md = 16
radius.lg = 24
radius.xl = 32
radius.pill = 999
```

### 6.3 Touch target
Minimum interactive target: **44 × 44 dp**.

### 6.4 Screen gutters
- Narrow mobile: 16 px.
- Regular mobile: 20–24 px.
- Do not place critical text under safe-area insets.

### 6.5 Elevation/shadow
Use shadows sparingly. Preferred visual is a low-offset warm/deep-cherry shadow, not gray Material-style cards everywhere.

---

## 7. Shape language

Three primary shapes define the interface:

1. **Cherry circle** — player, score counters, icon chips.
2. **Blossom pill** — primary/secondary buttons.
3. **Petal card** — rounded panels for instructions, Game Over and credits.

Avoid sharp 90° cards unless they are part of the gameplay obstacle silhouette.

---

## 8. Cherry — character system

### 8.1 Required silhouette
- one cherry body during gameplay;
- glossy red rounded body;
- one curved stem;
- one green leaf;
- two simple eyes;
- tiny mouth;
- no limbs required in gameplay;
- readable between roughly 32–56 dp visual size.

### 8.2 Required states

| State | Visual | Motion |
|---|---|---|
| Idle | neutral happy face | ±4–6 px bob |
| Jump | excited/open mouth | squash → stretch → rise |
| Fall | focused face / tilt | rotate downward |
| Score | happy micro-bounce | scale 1 → 1.08 → 1 |
| Collision | squeezed face | squash + shake/rotation |
| Dizzy | optional | stars / spiral eyes |
| Celebrate | optional | petals / smile |

### 8.3 Bundled generated character references
- original sprite sheet (not included in this checkout)
- individual PNG crops in `assets/characters/`
- `assets/vector/cherry_mark.svg`

Generated PNGs are suitable as concept/prototype assets. For the most predictable Snack build, the final runtime Cherry may be recreated using `react-native-svg` primitives and animated with Reanimated/Animated.

### 8.4 Character animation values

```text
Idle bob:          1600 ms, -5 px to +5 px, ease-in-out, loop
Jump squash:         80 ms, scaleX 1.08 / scaleY 0.90
Jump stretch:       120 ms, scaleX 0.94 / scaleY 1.10
Jump settle:        120 ms to 1.0
Fall rotation:      180 ms toward +18° to +28°
Collision squash:    90 ms to scaleY .78 / scaleX 1.16
Collision shake:    220 ms, ±5 px, 3–4 oscillations
Score bounce:       180–220 ms, peak scale 1.12
```

Do not make character animation delay the physics response.

---

## 9. Environment system

### 9.1 World phases by score

| Score | Phase | Mood |
|---:|---|---|
| 0–9 | First Bloom | dawn / beginning |
| 10–19 | Sakura Garden | bright spring |
| 20–29 | Golden Bloom | warm sunset |
| 30+ | Yozakura | moonlit night |

The thresholds are defaults and may be tuned without changing the concept.

### 9.2 Bundled background concepts
- `assets/backgrounds/01_first_bloom.jpg`
- `assets/backgrounds/02_sakura_garden.jpg`
- `assets/backgrounds/03_golden_bloom.jpg`
- `assets/backgrounds/04_yozakura.jpg`
- original combined phase sheet is not included in this checkout

These can be used directly for prototyping but should not make the obstacle corridor visually ambiguous.

### 9.3 Background layer model

```text
Layer 1 — sky / gradient
Layer 2 — sun or moon
Layer 3 — distant mountains
Layer 4 — distant tree silhouettes
Layer 5 — middle-ground blossom shapes
Layer 6 — gameplay obstacles
Layer 7 — particles/petals
Layer 8 — Cherry
Layer 9 — HUD
```

### 9.4 Parallax speed model
Relative to obstacle velocity:

```text
mountains:     0.08–0.12x
far trees:     0.18–0.25x
mid trees:     0.35–0.45x
obstacles:     1.00x
foreground:    1.10–1.25x (optional)
```

Parallax is visual polish, not an MVP blocker.

---

## 10. Obstacle system — Bloom Branches

### 10.1 Replacement for pipes
The game uses **top and bottom flowering branches/trunks**, preserving the Flappy-style collision geometry while creating an original visual identity.

### 10.2 Geometry rule
The visual blossom decoration must **never obscure the true collision edge**. The corridor remains clearly readable.

### 10.3 Variants
Create 3–4 decorative variants that share the same collision model:
- light blossom;
- leafy branch;
- old bark;
- night branch.

Do not create unique physics per visual variant.

### 10.4 Bundled vector prototypes
- `assets/vector/branch_top.svg`
- `assets/vector/branch_bottom.svg`

---

## 11. Blossom / particle system

### 11.1 Petals
Use small, slow, low-opacity particles outside the immediate collision corridor.

Recommended ranges:

```text
count:          5–12 visible
size:           5–14 px
drift duration: 4–9 s
rotation:       90–360° per drift
opacity:        .35–.85
```

### 11.2 Score spark
On point:
- 2–5 micro petals or sparkles;
- 200–450 ms;
- never block the player.

### 11.3 Reduced motion
If reduced motion is implemented, disable continuous decorative drift and keep only essential score/collision feedback.

---

## 12. UI component library

### 12.1 `CherryButton`
Variants:
- `primary`
- `secondary`
- `ghost`
- `icon`

Primary:
- fill `cherry.500`;
- text `cream.50`;
- radius `pill`;
- min height 52;
- pressed scale 0.96.

Secondary:
- cream fill;
- cherry border 2 px;
- cherry text.

### 12.2 `PetalCard`
- radius 24–32;
- cream/white surface;
- optional blossom border;
- max content width 420 on wider screens.

### 12.3 `ScoreHUD`
- score centered near top safe area;
- 48–64 weight 900;
- optional best score chip on pause/Game Over only;
- avoid permanent oversized chrome during play.

### 12.4 `PhaseBadge`
Optional 1-second transition label when phase changes:

```text
SAKURA GARDEN
```

Fade in/out; do not interrupt gameplay.

### 12.5 `GameOverCard`
Contains:
- title;
- score;
- best score if implemented;
- Play Again;
- Home.

### 12.6 `AcademicCreditsCard`
High-readability card for required academic information. The mandatory sentence must remain exact.

---

## 13. Screen design specifications

### 13.1 Tela 1 — Welcome / `tela1.js`

**Purpose:** identify the game and offer navigation.

Required hierarchy:
1. logo;
2. Cherry idle visual;
3. optional tagline;
4. primary `PLAY`;
5. `HOW TO PLAY`;
6. `CREDITS`.

Motion:
- logo reveal 350–500 ms;
- Cherry idle loop;
- 3–6 background petals;
- buttons stagger max 60 ms each.

Acceptance:
- no clipping at 320 px width;
- all three navigation actions work;
- title readable over background.

### 13.2 Tela 2 — Instructions / `tela2.js`

**Purpose:** explain controls in under 10 seconds.

Content:
- `Tap to make Cherry jump`;
- `Avoid the branches`;
- `Every gap = +1 point`;
- optional micro-demo animation;
- primary `PLAY` button;
- back/home action.

Keep text short; use iconography and a miniature gameplay diagram.

### 13.3 Tela 3 — Game / `tela3.js`

**Purpose:** core gameplay.

Required states:
- READY;
- PLAYING;
- GAME_OVER.

Required layers:
- background phase;
- obstacle pairs;
- Cherry;
- score;
- optional pause button;
- Game Over overlay/card.

Input:
- tap anywhere in active game field triggers jump while PLAYING;
- READY first tap starts and jumps;
- GAME_OVER tap must not accidentally restart unless on explicit button.

### 13.4 Tela 4 — Credits / `tela4.js`

Required content:
- game title;
- student name;
- FATEC;
- course;
- mandatory academic disclaimer;
- Home/back action.

Recommended visual mood: soft sunset/cream card, reduced decoration for readability.

---

## 14. Motion system

### 14.1 Motion personality
- **UI:** elastic, soft, friendly.
- **Gameplay:** immediate, crisp, deterministic.
- **Background:** slow and atmospheric.

### 14.2 Durations

```text
instant      80 ms
fast        140 ms
standard    220 ms
emphasis    340 ms
screen      420 ms
ambient    1200+ ms
```

### 14.3 Easing
Recommended:
- UI entry: ease-out / cubic-bezier equivalent.
- UI exit: ease-in.
- bounce: spring only for decorative UI/character, never physics position.
- score pulse: timing or controlled spring.

### 14.4 Navigation transitions
Keep navigation subtle:
- Welcome → Instructions: fade/slide.
- Welcome/Instructions → Game: fast fade or native push.
- Game → Credits/Home: native stack behavior.

Avoid cinematic transitions that delay replay.

### 14.5 Motion implementation priority
1. React Native `Animated` for simplest Snack-safe effects.
2. `react-native-reanimated` for reusable smooth motion if installed/validated.
3. Do not make Skia mandatory.

Expo SDK 54 officially provides Reanimated v4 compatibility; install through `npx expo install`.

---

## 15. Audio & haptics

### 15.1 Audio events

| Event | Sound |
|---|---|
| UI tap | soft pop |
| Jump | short rising pop |
| Point | bright two-note chime |
| Collision | low thump |
| Menu ambient | optional soft loop |

Bundled original prototype WAVs are under `assets/audio/`.

### 15.2 Audio rules
- audio is an enhancement, not a dependency of collision/scoring;
- user must be able to play if audio fails;
- do not autoplay loud music;
- background loop optional for final academic delivery.

### 15.3 Haptics
Optional:
- light impact on point;
- medium/error impact on collision.

Use `expo-haptics` only after Snack validation.

---

## 16. Iconography

Icon style:
- rounded;
- filled or thick outlined;
- minimal detail;
- 2 px equivalent outline at 24 px reference size.

Required concepts:
- Home
- Play
- Back
- Pause (optional)
- Sound on/off (optional)
- Crown/best (optional)
- Blossom
- Cherry

Prefer simple local SVG/react-native-svg icons to introducing a large icon dependency solely for five icons.

---

## 17. Asset implementation policy

### 17.1 Runtime authority hierarchy
1. programmatic/View/SVG assets;
2. lightweight local PNG/JPG;
3. generated high-detail concept imagery;
4. remote assets — avoid for delivery.

### 17.2 Do not depend on network
All delivery-critical art must be local or programmatic.

### 17.3 No third-party media bundled
This package intentionally bundles original generated/prototype assets and the user's academic references. It does not bundle external stock photos, third-party fonts, or copyrighted game assets.

---

## 18. Accessibility & usability

- Minimum tap target 44 dp.
- Avoid text over complex image without scrim.
- Do not convey phase or game state by color alone.
- Credits text must scroll if necessary on small devices.
- Respect safe areas.
- Keep gameplay input simple and single-tap.
- Avoid fast flashing effects.

---

## 19. Performance budget

Target: smooth mobile play with simple physics.

Rules:
- no state update that rerenders the full tree every frame if avoidable;
- physics values may live in refs/shared values;
- only commit React state for visible semantic changes (score, status, phase);
- recycle obstacle pairs rather than unbounded creation;
- cap particles;
- do not decode multiple high-resolution backgrounds simultaneously on low-memory devices;
- generated backgrounds are optional/prototype; a programmatic layered background is the safest baseline.

---

## 20. Design QA checklist

- [ ] Game is recognizable as Cherry Bloom without reading its title.
- [ ] No Flappy Bird pipe or bird artwork remains.
- [ ] Cherry is readable at gameplay size.
- [ ] Gap edges are unambiguous.
- [ ] HUD is readable in all four phases.
- [ ] UI uses palette tokens rather than random hardcoded colors.
- [ ] Buttons share variants and interaction states.
- [ ] Credits prioritize readability over decoration.
- [ ] Animation never changes collision truth.
- [ ] Visual polish degrades gracefully if optional assets are disabled.
- [ ] 320 px width has no horizontal clipping.

---

## 21. Authority statement

When implementing:

```text
Academic requirements > Functional correctness > Snack SDK 54 compatibility
> Gameplay readability > This design system > Optional polish
```

Never sacrifice a required criterion or Snack compatibility to preserve a decorative effect.
