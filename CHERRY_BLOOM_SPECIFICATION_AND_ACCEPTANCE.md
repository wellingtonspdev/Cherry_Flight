# Cherry Bloom — Functional Specification, Academic Compliance & Acceptance Criteria

**Version:** 1.0  
**Activity:** Atividade Prática 9 — Flappy Bird  
**Course:** Desenvolvimento de Software Multiplataforma  
**Discipline:** Programação para Dispositivos Móveis II  
**Primary delivery:** Expo Snack, Expo SDK 54  
**Parallel development copy:** Expo SDK 57  

**Atualização de aceite — 26/10/2026:** o jogo deve funcionar em paisagem (horizontal), conforme determinação do usuário. Validar 568×320, 844×390 e desktop horizontal; confirmar instrução de rotação no navegador em retrato, geometria baseada na área real e reinício seguro ao redimensionar. A configuração nativa solicita landscape; execução física continua sendo um gate independente.

---

## 1. Purpose

This document converts the academic brief into implementation rules, acceptance criteria and evidence gates. It is the implementation/review source of truth.

The goal is to deliver **100% of mandatory academic requirements** first, then optional polish.

---

## 2. Source requirements extracted from the activity

The activity requires a React Native project, saved in SnackExpoDev/Expo Snack and submitted by link through Teams. It requests a Flappy Bird clone, allows changing the visual identity, explicitly requires React Navigation and describes four screens:

- Tela 1: welcome;
- Tela 2: game instructions;
- Tela 3: game;
- Tela 4: credits including student name, FATEC, course and the mandatory academic sentence.

The observation section also says there must be at least three screens/files (`tela1.js`, `tela2.js`, `tela3.js`) and warns that the layout will be evaluated.

### 2.1 Ambiguous sentence resolution
The brief also contains the sentence equivalent to “Não usar telas de navegação e nem arquivos, 5 pontos a menos.” This conflicts with the explicit React Navigation and screen/file requirements if interpreted as a prohibition. The project will follow the only internally consistent interpretation:

> **Not using navigation screens and separate files loses points.**

Therefore the implementation must have real navigation and separate screen files.

---

## 3. Mandatory academic scope

### 3.1 Mandatory
- React Native.
- Expo SDK **54** for the submitted/Snack version.
- Expo Snack validation.
- React Navigation.
- `tela1.js` — welcome.
- `tela2.js` — instructions.
- `tela3.js` — game.
- `tela4.js` — credits.
- Full playable Flappy-style mechanics.
- Original Cherry Bloom visual identity is allowed and selected.
- Credits must contain student name, FATEC, course and the exact mandatory sentence.
- Layout quality is evaluated.

### 3.2 Optional/bonus from brief
- two-player mode;
- sound;
- score;
- game time.

### 3.3 Project decision
Score is treated as **core** because it is a standard game loop requirement and explicitly suggested by the brief. Sound is P2 polish. Two-player mode is out of MVP scope unless everything else is already PASS.

---

## 4. Mandatory disclaimer

Render this sentence **exactly** in the credits screen:

> Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.

Do not silently change “site” to “aplicativo”.

---

## 5. Identity decision

The game is named **Cherry Bloom**.

Core replacements:

| Flappy-style concept | Cherry Bloom |
|---|---|
| bird | Cherry, a cherry character |
| green pipes | flowering Bloom Branches |
| sky background | Bloom Garden phases |
| flap | jump/wind impulse |
| point | one successfully crossed obstacle gap |

Mechanics remain recognizable while presentation is original.

---

## 6. Dual Expo baseline policy

### 6.1 Authority
The **SDK 54 branch/version is the delivery authority**.

### 6.2 Baselines

| Track | Expo | React Native | React | Node minimum | Purpose |
|---|---:|---:|---:|---:|---|
| `delivery-sdk54` | 54.x | 0.81.x | 19.1.x | 20.19.x | Snack / professor delivery |
| `local-sdk57` | 57.x | 0.86.x | 19.2.3 | 22.13.x | local modern development/testing |

Current reference package tags at handoff time:
- Expo SDK 54 tag: `54.0.38`;
- Expo SDK 57 tag: `57.0.31`.

### 6.3 Non-negotiable rule
Do **not** switch the same working tree between SDK 54 and 57 by editing only the `expo` dependency.

Each track must keep its own:
- `package.json`;
- lockfile;
- dependency resolution;
- Expo doctor evidence.

### 6.4 Source-code parity
Game logic and visual components should remain as shared/equivalent as practical. If a code feature works only on SDK 57, it must have an SDK 54-compatible fallback or stay out of the delivery branch.

### 6.5 Recommended branch model

```text
main                 -> delivery authority / SDK 54
sdk-57-local          -> local modern mirror
feature/*             -> short-lived work branches
```

Alternative branch names are acceptable, but there must be no ambiguity about which branch is submitted.

---

## 7. Runtime architecture

### 7.1 Required files

```text
App.js
src/
  tela1.js
  tela2.js
  tela3.js
  tela4.js
  components/
  game/
  theme/
```

Screen filenames must be preserved literally unless the professor explicitly approves otherwise.

### 7.2 Navigation
Use React Navigation 7.x + native stack.

Routes:

```text
Welcome      -> tela1.js
Instructions -> tela2.js
Game         -> tela3.js
Credits      -> tela4.js
```

### 7.3 Core game state machine

```text
READY
  └─ tap -> PLAYING
PLAYING
  ├─ collision -> GAME_OVER
  └─ optional pause -> PAUSED
GAME_OVER
  ├─ Play Again -> READY/PLAYING reset
  └─ Home -> Welcome
```

No zombie timer/game loop may keep running after leaving the game screen.

---

## 8. Gameplay specification

### 8.1 Coordinate model
Use logical screen coordinates based on actual game area dimensions.

### 8.2 Default tuning values
These are initial defaults, not immutable requirements:

```text
playerWidth        42–50 dp
playerHeight       42–50 dp
gravity            ~900–1250 dp/s² equivalent
jumpVelocity       ~-330 to -430 dp/s
obstacleSpeed      ~120–180 dp/s
gapSize            ~150–190 dp, responsive
gapMinY            safe top + HUD clearance
gapMaxY            safe bottom - floor clearance
obstacleSpacing    ~220–300 dp
```

Tune by device feel, not arbitrary hardcoding.

### 8.3 Core physics
While PLAYING:
1. gravity increases vertical velocity over time;
2. tap applies a negative/upward vertical impulse;
3. player position integrates velocity using frame delta;
4. obstacles move horizontally toward the player;
5. off-screen obstacle pairs are recycled;
6. collision is tested every frame/update;
7. score increments only once per obstacle pair crossed.

### 8.4 Delta time
Movement must account for elapsed time (`dt`) rather than assuming exactly 60 FPS.

### 8.5 Collision
Required collision cases:
- Cherry intersects top branch;
- Cherry intersects bottom branch;
- Cherry exits top boundary, if top boundary is treated as lethal;
- Cherry reaches ground/bottom boundary.

Use simple AABB or circle-vs-rect math. Do not add a physics engine solely for this.

### 8.6 Collision visual vs logical geometry
Decorative petals/leaves on obstacles must not silently enlarge collision bounds. Collision boxes must correspond to the readable trunk/branch shape.

### 8.7 Score
Increment by 1 exactly when Cherry fully passes the obstacle pair and that pair has not already scored.

### 8.8 Restart
Restart must reset:
- position;
- velocity;
- score;
- obstacle positions;
- obstacle scored flags;
- phase;
- collision state;
- frame/timer references as needed.

### 8.9 Best score
Optional but recommended. Persist via AsyncStorage only after core Snack runtime is stable.

### 8.10 Game time
Optional. If implemented, it must stop at Game Over and reset on replay.

---

## 9. Visual phase progression

Default score thresholds:

```text
0–9   First Bloom
10–19 Sakura Garden
20–29 Golden Bloom
30+   Yozakura
```

Phase changes are presentation-only. They must not introduce hidden difficulty changes unless separately specified.

---

## 10. Screen functional requirements

### 10.1 `tela1.js` — Welcome
Must:
- show Cherry Bloom identity;
- provide Play;
- provide Instructions;
- provide Credits;
- navigate correctly;
- respect safe area and narrow screens.

### 10.2 `tela2.js` — Instructions
Must explain:
- tap to jump;
- avoid branches;
- passing a gap scores a point.

Must provide Play and back/home navigation.

### 10.3 `tela3.js` — Game
Must provide:
- READY state;
- responsive tap/jump;
- gravity;
- moving obstacles;
- randomized/recycled gaps;
- collision;
- score;
- Game Over;
- replay;
- path back Home.

### 10.4 `tela4.js` — Credits
Must provide:
- Cherry Bloom title;
- **Wellington Siqueira Porto**;
- FATEC Itaquera / FATEC reference;
- Desenvolvimento de Software Multiplataforma;
- mandatory disclaimer verbatim;
- back/home action.

If the professor expects a different exact institutional naming convention, update only the institution string; do not remove required fields.

---

## 11. Dependency policy

### 11.1 Core approved
- `@react-navigation/native` 7.x
- `@react-navigation/native-stack` 7.x
- `react-native-screens` via `npx expo install`
- `react-native-safe-area-context` via `npx expo install`
- `react-native-svg` via `npx expo install`

### 11.2 Approved optional polish
- `react-native-reanimated` via `npx expo install`
- `react-native-worklets` when required by the Expo/Reanimated version
- `expo-audio`
- `expo-haptics`
- `expo-linear-gradient`
- `@react-native-async-storage/async-storage`

### 11.3 Not baseline
- `@shopify/react-native-skia` — capable but adds native/bundle complexity and is unnecessary for this game.
- `matter-js` — physics engine is unnecessary for simple gravity/AABB.
- `react-native-game-engine` — old release and unnecessary dependency risk.

### 11.4 Rule
Always use `npx expo install <package>` for Expo/native companion libraries, so each SDK receives the compatible version.

---

## 12. Acceptance criteria

Status vocabulary:

```text
PASS
FAIL
PARTIAL
NOT EXECUTED
```

Never label PASS without direct evidence.

### 12.1 Academic compliance

| ID | Criterion | Evidence required |
|---|---|---|
| AC-001 | Delivery project uses Expo SDK 54 | `npm list expo` / package manifest |
| AC-002 | React Native project runs | runtime evidence |
| AC-003 | Project imports/runs in Expo Snack | real Snack preview |
| AC-004 | React Navigation is used | code + runtime navigation |
| AC-005 | `tela1.js` exists and renders Welcome | file + runtime |
| AC-006 | `tela2.js` exists and renders Instructions | file + runtime |
| AC-007 | `tela3.js` exists and renders Game | file + runtime |
| AC-008 | `tela4.js` exists and renders Credits | file + runtime |
| AC-009 | Credits show student name | visual inspection |
| AC-010 | Credits show FATEC | visual inspection |
| AC-011 | Credits show DSM course | visual inspection |
| AC-012 | Mandatory disclaimer is exact | string comparison / visual |
| AC-013 | Visual identity differs from classic Flappy Bird | screenshot review |
| AC-014 | Layout has no obvious clipping/overflow | device/Snack screenshots |

### 12.2 Gameplay

| ID | Criterion | Evidence required |
|---|---|---|
| AC-101 | Game can enter READY | runtime |
| AC-102 | First input starts gameplay | runtime |
| AC-103 | Tap applies immediate upward impulse | runtime |
| AC-104 | Gravity pulls Cherry downward | runtime |
| AC-105 | Obstacles move continuously | runtime |
| AC-106 | Obstacles recycle after leaving screen | runtime/log/inspection |
| AC-107 | Gap position varies within valid bounds | repeated runtime |
| AC-108 | Top branch collision works | targeted test |
| AC-109 | Bottom branch collision works | targeted test |
| AC-110 | Ground/bottom collision works | targeted test |
| AC-111 | Collision changes state to GAME_OVER | runtime |
| AC-112 | Score increments once per crossed pair | targeted test |
| AC-113 | Score does not increment on collision before crossing | targeted test |
| AC-114 | Replay resets player, score and obstacles | runtime |
| AC-115 | Leaving Game stops active loop/timers | instrumentation/review |
| AC-116 | Game remains playable after 5 consecutive restarts | stress test |

### 12.3 Visual / UX

| ID | Criterion | Evidence required |
|---|---|---|
| AC-201 | Cherry is readable at gameplay scale | screenshot |
| AC-202 | Obstacle corridor is obvious | screenshot |
| AC-203 | Score readable in all world phases | screenshots |
| AC-204 | Welcome actions are all reachable | runtime |
| AC-205 | Instructions can be understood quickly | review |
| AC-206 | Credits remain readable on small device | screenshot |
| AC-207 | Safe areas respected | iOS/Android or simulator evidence |
| AC-208 | 320 px-ish narrow layout does not horizontally clip | responsive test |
| AC-209 | Motion does not change collision truth | code/runtime review |

### 12.4 Technical baseline

| ID | Criterion | Evidence required |
|---|---|---|
| AC-301 | `npx expo-doctor@latest` acceptable on SDK54 branch | command output |
| AC-302 | `npx expo install --check` passes or findings documented | command output |
| AC-303 | no automatic `npm audit fix --force` was used | process review |
| AC-304 | package dependencies are intentionally minimal | manifest review |
| AC-305 | local SDK57 branch has its own manifest/lock | repo review |
| AC-306 | SDK57 does not change delivery branch dependency graph | diff/repo review |

### 12.5 Snack delivery

| ID | Criterion | Evidence required |
|---|---|---|
| AC-401 | Real project imported/created in Snack | Snack project |
| AC-402 | Snack bundle succeeds | Snack preview/log |
| AC-403 | All four routes operate in Snack | manual test |
| AC-404 | Game loop operates in Snack | manual play |
| AC-405 | Score/collision/replay operate in Snack | manual play |
| AC-406 | Local assets load in Snack | visual/audio where enabled |
| AC-407 | Public Snack link opens in incognito/other session | external test |
| AC-408 | Submitted link corresponds to SDK54 version | final verification |

---

## 13. Quality gates

### Gate G0 — Brief parsed
All mandatory, optional and ambiguous requirements documented.

### Gate G1 — SDK 54 baseline
Project manifest, dependencies and doctor are validated before feature work.

### Gate G2 — Navigation skeleton
All four screens navigate before game complexity begins.

### Gate G3 — Core physics
Jump, gravity and update loop work with placeholder rectangles.

### Gate G4 — Obstacles/collision
Gap generation, movement, collision and recycling work.

### Gate G5 — Score/restart
Scoring and complete reset work repeatedly.

### Gate G6 — Cherry Bloom skin
Identity replaces placeholders without breaking mechanics.

### Gate G7 — Visual QA
Small/mobile layouts, safe areas and all states visually inspected.

### Gate G8 — Optional polish
Audio, haptics, best score, parallax only after G0–G7 PASS.

### Gate G9 — Independent review
A second review pass attempts to falsify earlier PASS results.

### Gate G10 — Snack
Real SDK54 Snack link is fully played and tested.

### Gate G11 — Freeze

```text
FINAL AUDIT: PASS
READY FOR DELIVERY: YES
FROZEN FOR DELIVERY
```

After freeze: no dependency upgrades, redesign, refactor or “small improvement” without reopening validation.

---

## 14. Definition of Done

The activity is complete only when:

```text
Mandatory brief satisfied
AND SDK54 verified
AND 4-screen React Navigation works
AND game is playable
AND collision + scoring + replay work
AND layout reviewed
AND credits exact
AND Snack actually runs
AND public link verified
AND final audit passes
```

“Works locally” is not equivalent to “ready for delivery”.

---

## 15. Out of scope until core PASS

- two-player mode;
- complex inventory;
- online leaderboard;
- authentication;
- backend;
- procedural level editor;
- Skia-only visuals;
- advanced physics engine;
- ads/monetization;
- network-required assets.
