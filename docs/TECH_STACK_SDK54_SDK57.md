# Cherry Bloom — Technical Stack & Dependency Strategy

## 1. Two-track rule

**SDK 54 is the delivery contract. SDK 57 is a separate local mirror.**

Official Expo mapping used for this handoff:

| Expo SDK | React Native | React | Minimum Node |
|---|---|---|---|
| 54 | 0.81 | 19.1.0 | 20.19.x |
| 57 | 0.86 | 19.2.3 | 22.13.x |

Sources:
- https://docs.expo.dev/versions/latest/
- https://expo.dev/sdk/54
- https://expo.dev/sdk/57

At package creation time, npm Expo tags surfaced:
- `sdk-54`: `54.0.38`
- `sdk-57`: `57.0.31`

Source: https://www.npmjs.com/package/expo?activeTab=versions

## 2. Navigation

The professor explicitly requires React Navigation, so **do not replace it with Expo Router**.

Use React Navigation 7.x:

```bash
npm install @react-navigation/native@7 @react-navigation/native-stack@7
npx expo install react-native-screens react-native-safe-area-context
```

React Navigation 7 documentation lists minimum RN 0.72 / Expo 52 for Expo Go, so it covers SDK54.

Source: https://reactnavigation.org/docs/7.x/getting-started/

## 3. Visual stack

### Required/safe

```bash
npx expo install react-native-svg
```

SDK54 Expo docs list `react-native-svg` 15.12.1 as the recommended version and included in Expo Go.

Source: https://docs.expo.dev/versions/v54.0.0/sdk/svg/

### Optional animation

```bash
npx expo install react-native-reanimated react-native-worklets
```

SDK54 recommends Reanimated ~4.1.1; SDK57 recommends 4.5.x. Do not pin one native version across both branches; let `expo install` resolve per SDK.

Sources:
- https://docs.expo.dev/versions/v54.0.0/sdk/reanimated/
- https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/

### Optional gradient

```bash
npx expo install expo-linear-gradient
```

Useful for atmospheric screens, but flat/solid fallbacks must exist.

### Optional audio

```bash
npx expo install expo-audio
```

Audio must never be required for gameplay state progression.

### Optional haptics

```bash
npx expo install expo-haptics
```

### Optional persistence

```bash
npx expo install @react-native-async-storage/async-storage
```

Use only for best score/settings after core functionality is stable.

## 4. Deliberately rejected baseline libraries

### `react-native-game-engine`
Not selected. npm shows version 1.2.0 published roughly six years ago. A simple game loop is easier to own and review than adding an old engine abstraction.

### Matter.js
Not selected for core. Gravity and rectangular collision are trivial enough to implement with a few pure functions. A physics engine adds complexity without academic benefit.

### React Native Skia
Not selected for baseline. It is capable and supports modern RN, but it adds native/binary weight. Cherry Bloom can be built with Views, SVG and Reanimated. Skia can be explored only after the SDK54 Snack delivery is already PASS.

## 5. Recommended implementation primitives

- `requestAnimationFrame` or a controlled frame loop.
- refs/shared values for high-frequency position/velocity data.
- React state for semantic UI state only: game status, score, phase.
- pure collision helpers.
- recycled obstacle pairs.
- `react-native-svg` for scalable character/ornament drawing.
- Reanimated only where it reduces complexity, not as a requirement for physics.

## 6. Install discipline

For each branch:

```bash
node -v
npm -v
npm list expo react react-native
npx expo install --check
npx expo-doctor@latest
```

Never run `npm audit fix --force` automatically.

## 7. SDK57 note
Expo SDK 57 had early Hermes/Reanimated regressions fixed by later patches; use a current 57 patch (the handoff references 57.0.31) rather than the initial 57.0.0 release.

Source: https://expo.dev/changelog/sdk-57
