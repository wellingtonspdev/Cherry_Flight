# Cherry Bloom V2 — Audio Implementation Specification

## Required architecture
Centralize playback in an `AudioService`/`AudioManager`; screens emit semantic events.

## Required tracks/events
Music themes: First Bloom, Sakura Garden, Golden Bloom, Yozakura.  
SFX: UI tap, jump, score, collision, checkpoint, level complete, unlock, pause/resume.

## SDK54-first rule
Use the Expo audio API supported by the actual SDK54 branch. Install with `npx expo install`; do not hard-pin SDK57 native versions into SDK54.

## Lifecycle
- preload after chapter selection and before READY when feasible;
- music loops while chapter gameplay is active;
- pause with pause/app state;
- stop/release on Game screen unmount;
- one-shot SFX reuse/preload rather than allocating per frame;
- audio failure must not change game state.

## Mix starting point
- music 0.35
- jump 0.45
- score 0.55
- collision 0.70
- checkpoint 0.70
- UI 0.45

Adjust by device testing.
