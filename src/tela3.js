// Cherry Bloom — Tela 3: Core Gameplay
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 7.3, 8, 9, 10.3)
// Mandatory file name: src/tela3.js
// V2 delegates the academic Game screen to the optimized field; V1 source is preserved in audit-evidence/v2/tela3-v1-baseline.js.
import React from 'react';
import GameFieldV2 from './components/GameFieldV2';
export default function Tela3(props) { return <GameFieldV2 {...props} />; }
