# Cherry Bloom V2 — Asset Manifest

## Authority
`assets/v2/` supersedes V1 game-art assets for new implementation.

## Characters
Four transparent vector/runtime states under `assets/v2/characters/`.

## Obstacles
Four complete modular kits under `assets/v2/obstacles/`:
- `first_bloom`
- `sakura_garden`
- `golden_bloom`
- `yozakura`

Each contains SVG source + transparent PNG export for 12 modules:
`trunk_body`, `trunk_edge_overlay`, four caps, three side branches, leaves cluster, two blossom clusters, accent particles.

## Backgrounds
Each chapter under `assets/v2/backgrounds/<chapter>/` includes source SVG + PNG:
- `background_base`
- `midground`
- `foreground_frame`
- `overlay_fx`
- `background_composite`

The first four can be layered. Composite is the quick/fallback path.

## Runtime recommendation
For fastest SDK54/Snack integration, use PNG exports first, with SVG retained as design/source assets. If SVG is rendered in-app, use `react-native-svg` without adding a heavy graphics engine.

## Naming
Official character naming is **Cherry**. V1 `cherri_*` filenames are deprecated.
