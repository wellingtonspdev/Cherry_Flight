# Cherry Bloom V2 — Obstacle Rendering & Performance Fix

## Known symptom
Future trunks may appear late/pop in on PC/web preview.

## Required fix
1. preload current chapter imagery;
2. mount a fixed obstacle pool;
3. prewarm at least 3 future pairs offscreen;
4. recycle pairs rather than creating/destroying at viewport entry;
5. move with transforms/shared values;
6. avoid React state updates for per-frame X position when possible;
7. keep decoration and collision geometry separate.

## Instrumentation
During development log or profile:
- asset preload start/end;
- obstacle pair prepare timestamp;
- pair enters viewport timestamp;
- component mount count;
- avoid new image decode immediately before visibility.

## Pass condition
No obstacle becomes visible before its visual modules are prepared; no recurring mount/decode hitch as pairs recycle.
