# Cherry Bloom — Official V2 Specification, Progression, Checkpoints & Acceptance

**Version:** 2.0  
**Delivery authority:** Expo SDK 54 / Snack  
**Local mirror:** Expo SDK 57  
**Official character name:** **Cherry**

## 1. Non-negotiable academic requirements
The V2 expansion must preserve all mandatory AP9 requirements: React Native, Expo SDK 54 delivery, React Navigation, `tela1.js`, `tela2.js`, `tela3.js`, credits, FATEC/course/student identification, exact mandatory academic disclaimer and Snack delivery validation.

## 2. V2 game structure
Campaign:
- First Bloom — Levels 1–3
- Sakura Garden — Levels 4–6
- Golden Bloom — Levels 7–9
- Yozakura — Levels 10–12
- Endless Bloom — unlocked after Level 12

Each campaign level starts from a deterministic level configuration. See `docs/LEVEL_CONFIG_V2.json`.

## 3. Level completion
A level completes when its target score is reached. Completion must:
1. enter `LEVEL_COMPLETE` once;
2. stop collision/game advancement safely;
3. persist completion;
4. unlock next level;
5. update checkpoint;
6. display Next Level/Home actions;
7. trigger completion FX/audio if enabled.

## 4. State machine
`LOADING → READY → PLAYING → GAME_OVER | LEVEL_COMPLETE`.
Optional `PAUSED` may branch from PLAYING.

No game loop may survive unmount/navigation.

## 5. Checkpoint model
Checkpoint is **level-based**.

Persist:
```json
{
  "schemaVersion": 2,
  "highestUnlockedLevel": 1,
  "lastPlayedLevel": 1,
  "lastCompletedLevel": 0,
  "levelResults": {},
  "endlessUnlocked": false,
  "settings": {"music": true, "sfx": true, "haptics": true}
}
```

Never persist exact player Y, velocity, obstacle X, animation frame or partial collision state.

### Continue behavior
- if a valid `lastPlayedLevel` is unlocked, Continue opens that level at READY;
- otherwise use `highestUnlockedLevel`;
- corrupt/unknown save data falls back safely to Level 1.

## 6. Level select
- completed: selectable;
- unlocked/current: selectable and visibly marked;
- locked: not startable;
- Endless: locked until Level 12 completion.

## 7. Difficulty engine
Difficulty comes from level config, not conditional magic numbers inside `tela3.js`.

Required config dimensions:
- `gapRatio`;
- `speedWidthPerSecond`;
- `spacingWidthRatio`;
- `maxGapCenterDeltaRatio`;
- safe top/bottom margins;
- target score;
- obstacle kit;
- audio theme.

Cherry's baseline jump/gravity feel should remain stable across campaign levels unless a later explicit design revision says otherwise.

## 8. Safe obstacle generation
For every new pair:
1. determine valid vertical playable range;
2. clamp next gap center relative to previous center using `maxGapCenterDeltaRatio`;
3. enforce top/bottom safe margins;
4. select visual variant from current biome kit;
5. set `scored=false`;
6. place behind furthest future pair.

Random generation must not create physically impossible consecutive gaps.

## 9. Obstacle pooling/rendering
### Required
- pool 4 pairs minimum; levels 7–12 may use 5;
- 3 future pairs prewarmed before viewport entry;
- chapter assets preloaded before READY/PLAYING;
- pair recycling instead of mount/destroy churn;
- image/SVG decoding must not occur at viewport entry;
- no visible pop-in.

### Performance evidence
Instrument development builds with timestamps for:
- chapter preload start/end;
- pair prepared;
- pair visible;
- frame drops where measurable.

## 10. Background system
Each chapter provides layered background assets and a composite fallback.
- base;
- midground;
- foreground frame;
- overlay FX.

Overlays must not intercept touch.

## 11. Audio subsystem
Implement a centralized AudioManager/AudioService.

Capabilities:
- preload current chapter music/SFX;
- loop background music;
- one-shot SFX;
- mute music;
- mute SFX;
- pause/resume with game lifecycle;
- stop/release on screen unmount;
- fail open: gameplay still works if audio cannot initialize.

### Required event map
| Event | Audio |
|---|---|
| UI press | button tap |
| Cherry jump | jump pop |
| score | score chime |
| collision | impact |
| checkpoint/level complete | bloom checkpoint |
| next level unlock | unlock sparkle |
| chapter gameplay | chapter music loop |

## 12. Visual asset rule
V2 runtime assets are under `assets/v2/`.
SVG is source-of-truth; PNG export exists for simple runtime fallback and quick Snack integration.

## 13. SDK 54 / 57 rule
SDK 54 remains delivery authority. V2 features cannot be accepted if they work only on SDK 57.

## 14. Acceptance criteria V2

### Academic / navigation
- **V2-AC01** SDK 54 project boots.
- **V2-AC02** React Navigation works across required screens.
- **V2-AC03** `tela1.js`–`tela4.js` remain present/functional.
- **V2-AC04** Credits content and mandatory disclaimer are exact.
- **V2-AC05** Snack import/runtime validated.

### Core gameplay
- **V2-AC06** tap starts/impulses Cherry reliably.
- **V2-AC07** Cherry visibly moves every frame while playing.
- **V2-AC08** gravity/jump use dt-safe logic.
- **V2-AC09** collisions work top/bottom/obstacles.
- **V2-AC10** score increments once per passed pair.
- **V2-AC11** retry fully resets level state.

### Obstacle renderer/performance
- **V2-AC12** no future trunk pop-in on PC/web preview.
- **V2-AC13** at least 4 pooled pairs exist.
- **V2-AC14** at least 3 future pairs are prepared offscreen.
- **V2-AC15** biome assets are preloaded before PLAYING.
- **V2-AC16** obstacles recycle rather than recreate per pass.
- **V2-AC17** decorations do not create misleading collision bounds.

### Campaign/progression
- **V2-AC18** 12 level configs load from centralized data.
- **V2-AC19** Levels 1–12 use increasing difficulty values.
- **V2-AC20** safe generator never violates configured margins/delta.
- **V2-AC21** target score completes each level exactly once.
- **V2-AC22** completing a level unlocks next.
- **V2-AC23** locked levels cannot start.
- **V2-AC24** Level 12 unlocks Endless Bloom.

### Checkpoints/persistence
- **V2-AC25** checkpoint persists at level granularity.
- **V2-AC26** Continue returns to valid last/unlocked level at READY.
- **V2-AC27** app restart preserves unlocks/results/settings.
- **V2-AC28** corrupt save falls back safely to Level 1.
- **V2-AC29** retry never resumes mid-frame/mid-obstacle.

### Visual fidelity
- **V2-AC30** protagonist is named Cherry everywhere user-facing.
- **V2-AC31** First Bloom uses its V2 asset kit.
- **V2-AC32** Sakura Garden uses its V2 asset kit.
- **V2-AC33** Golden Bloom uses its V2 asset kit.
- **V2-AC34** Yozakura uses its V2 asset kit.
- **V2-AC35** backgrounds/overlays do not obstruct gameplay readability.
- **V2-AC36** obstacles use branch/trunk identity, never green pipe visuals.

### Motion/FX
- **V2-AC37** Cherry idle/jump/fall/hit states are visible and performant.
- **V2-AC38** score feedback exists.
- **V2-AC39** checkpoint/level-complete FX exists.
- **V2-AC40** decorative overlays have `pointerEvents="none"` or equivalent.

### Audio
- **V2-AC41** chapter music can loop.
- **V2-AC42** jump/score/collision/checkpoint/UI SFX work.
- **V2-AC43** music and SFX can be disabled independently.
- **V2-AC44** navigating away stops/releases gameplay audio.
- **V2-AC45** audio initialization failure does not break gameplay.

### Quality gates
- **V2-AC46** Expo Doctor is clean or every warning is documented.
- **V2-AC47** `expo install --check` passes for SDK 54.
- **V2-AC48** visual inspection passes on small and regular mobile widths.
- **V2-AC49** PC/web preview has no trunk decode/render stall.
- **V2-AC50** independent adversarial review finds no open BLOCKER/CRITICAL.

## 15. Acceptance evidence states
Every criterion: `PASS`, `FAIL`, `PARTIAL`, or `NOT EXECUTED`. Code presence is not runtime evidence.

## 16. Definition of Done V2
Only declare V2 delivery-ready after core gameplay, obstacle pool/preload, campaign/checkpoint, V2 visuals, required audio, SDK54 checks, Snack and adversarial QA all pass.
