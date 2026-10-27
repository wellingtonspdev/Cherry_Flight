// Read-only model controller: returns input decisions, never changes runtime physics or score.
export function shouldJump(round, dt = 1 / 60) {
  const speed = round.params.speed;
  let beam = [{ y: round.player.y, v: round.player.velocity, first: false, cost: 0 }];
  const pairs = [...round.pairs, ...round.future.map(p => ({ ...p, x: p.worldX - round.distance }))];
  for (let depth = 1; depth <= Math.ceil(1.4 / dt); depth++) {
    const time = depth * dt;
    const target = pairs.filter(p => p.x + p.width - speed * time > round.player.x + 6).sort((a, b) => a.x - b.x)[0];
    const center = target ? target.gapY + target.gapSize / 2 - 24 : round.height / 2 - 24;
    const candidates = new Map();
    for (const state of beam) for (const jump of [false, true]) {
      if (jump && state.v < -150) continue;
      const old = jump ? -390 : state.v, v = Math.min(580, old + 1050 * dt), y = state.y + (old + v) * dt / 2;
      if (y + 6 <= 0 || y + 42 >= round.height) continue;
      if (pairs.some(p => p.x - speed * time < round.player.x + 42 && p.x + p.width - speed * time > round.player.x + 6 && (y + 6 < p.gapY || y + 42 > p.gapY + p.gapSize))) continue;
      const node = { y, v, first: depth === 1 ? jump : state.first, cost: state.cost + (y - center) ** 2 + v * v * 0.004 + (jump ? 25 : 0) };
      const key = `${Math.round(y / 2)}:${Math.round(v / 20)}`;
      if (!candidates.has(key) || candidates.get(key).cost > node.cost) candidates.set(key, node);
    }
    if (!candidates.size) return beam.sort((a, b) => a.cost - b.cost)[0]?.first || false;
    beam = [...candidates.values()].sort((a, b) => a.cost - b.cost).slice(0, 350);
  }
  return beam[0].first;
}
