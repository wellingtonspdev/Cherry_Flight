# Cherry Bloom — Agent Implementation Handoff

## Read order (mandatory)
1. `CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md`
2. `CHERRY_BLOOM_DESIGN_SYSTEM.md`
3. `docs/TECH_STACK_SDK54_SDK57.md`
4. `docs/ASSET_MANIFEST.md`
5. `references/LICOES_APRENDIDAS_PDM2.md`
6. academic PDF in `references/`

## Agent operating rule
Do not start with polish. Build in gates:

```text
G0 brief
→ G1 SDK54 baseline
→ G2 navigation
→ G3 physics
→ G4 collision/obstacles
→ G5 score/restart
→ G6 Cherry Bloom skin
→ G7 visual QA
→ G8 optional polish
→ G9 independent review
→ G10 Snack
→ G11 freeze
```

## Minimal architecture

```text
App.js
src/
  tela1.js
  tela2.js
  tela3.js
  tela4.js
  components/
    CherryPlayer.js
    BloomBranchPair.js
    CherryButton.js
    ScoreHUD.js
    GameOverCard.js
  game/
    constants.js
    collision.js
    createObstacle.js
    phase.js
  theme/
    colors.js
    spacing.js
    motion.js
```

Do not create a deep enterprise architecture for this academic game.

## Token-efficient implementation strategy
- Reuse one `CherryButton` component.
- Reuse one obstacle-pair component with variant props.
- Keep constants centralized.
- Keep collision helpers pure and short.
- Use one theme object; do not repeat color literals.
- Avoid generating multiple alternative implementations.
- Prefer existing bundled assets and documented tokens.
- Do not re-research design unless a requirement is blocked.

## Mandatory first evidence
Before feature code, capture:

```bash
node -v
npm -v
npm list expo react react-native
npx expo-doctor@latest
npx expo install --check
```

## Delivery authority
If SDK57 looks better but SDK54 Snack differs, **fix SDK54 first**. The submitted version is SDK54.
