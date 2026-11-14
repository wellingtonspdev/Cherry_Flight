# Chorus Extraction & Stage Duration Synchronization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:**
1. Identificar e extrair o refrão / clímax / hook principal de cada uma das 12 músicas originais (e da faixa customizada `luolei_yuexinmiao`), exatamente como o Instagram Reels / Stories faz ao destacar o trecho mais famoso e marcante.
2. Sincronizar perfeitamente a duração de cada fase da campanha com a duração desse trecho musical por completo, de forma que o jogador ouça o refrão do início ao fim e vença a fase exatamente na conclusão do refrão.

**Architecture:**
- **Áudio:** Script `scripts/slice-all-chorus-bgm.py` corta os áudios a partir do timestamp exato do refrão (`start_sec`) com a duração exata da fase (`duration_sec`), aplicando micro-fade in (512 amostras) e crossfade suave nas bordas (1024 amostras) para loop limpo em modo Endless e Jukebox.
- **Configuração de Níveis:** Em `docs/LEVEL_CONFIG_V2.json`, cada nível recebe `targetDuration` calibrada em sincronia milimétrica com a velocidade e espaçamento de obstáculos (`targetScore`), compilada para `src/game/levelConfigV2.js` via `node scripts/prepare-v2.mjs`.
- **Motor do Jogo (`engineV2.js`):** `resolveDifficulty` expõe `targetDuration`. `stepRound` conclui a fase quando o jogador atinge a pontuação meta ou sobrevive à duração total do refrão (`round.elapsed >= round.params.targetDuration`), emitindo evento de vitória.
- **Suíte de Testes:** Atualização em `tests/audio-v2.test.mjs` e `tests/engine-v2.test.mjs` para validar tamanhos de arquivo (>600KB), duração das faixas e conclusão sincronizada da fase.

---

### Mapeamento dos Refrões & Duração das Fases

| Nível | Faixa | Música / Artista | Início no Áudio | Trecho / Refrão Marcante | Duração da Fase | Meta Obstáculos |
|---|---|---|---|---|---|---|
| L1 | `first_bloom.wav` | Men I Trust - *Show Me How* | 0:41.0 | "Show me how you care... Tell me, baby, what's on your mind..." | 15.34s | 8 pts |
| L2 | `ye_flashing_lights.wav` | Kanye West - *Flashing Lights* | 0:28.0 | "Flashing... lights... lights... She don't believe in shooting stars..." | 18.00s | 10 pts |
| L3 | `ye_ghost_town.wav` | Kanye West - *Ghost Town* | 2:14.0 (134s) | 070 Shake Clímax: "Some day I will wear a starry crown... nothing hurts anymore..." | 19.80s | 12 pts |
| L4 | `sakura_garden.wav` | Empire of the Sun - *Walking On A Dream* | 0:38.0 | "We are always running for the thrill of it, thrill of it..." | 18.70s | 12 pts |
| L5 | `ye_stronger.wav` | Kanye West - *Stronger* | 0:45.0 | "N-now th-that don't kill me can only make me stronger..." | 20.40s | 14 pts |
| L6 | `eots_we_are_the_people.wav` | Empire of the Sun - *We Are The People* | 0:38.0 | "We are the people that rule the world, a force running in every boy and girl..." | 21.00s | 15 pts |
| L7 | `golden_bloom.wav` | Elderbrook & Bob Moses - *Inner Light* | 0:48.0 | Drop & Refrão: "I feel your inner light, I see you in the night..." | 20.10s | 15 pts |
| L8 | `ye_father_stretch.wav` | Kanye West - *Father Stretch My Hands Pt. 1* | 0:29.0 | Metro Boomin Drop + Kid Cudi: "Beautiful morning, you're the sun in my morning babe..." | 21.40s | 17 pts |
| L9 | `ye_heartless.wav` | Kanye West - *Heartless* | 0:11.0 | "In the night I hear 'em talk, the coldest story ever told..." | 21.70s | 18 pts |
| L10 | `yozakura.wav` | Don Toliver - *No Pole* | 0:18.0 | "I came in with a pole, I left out with a... Had to cut the lights, she was shining bright..." | 20.90s | 18 pts |
| L11 | `lofi_garden.wav` | Jinsang - *Affection* | 0:05.0 | Tema melódico principal de flauta e Rhodes lo-fi | 22.30s | 20 pts |
| L12 | `ye_runaway.wav` | Kanye West - *Runaway* | 0:38.0 | Piano drop into "Look at ya" & Toast chorus ("Let's have a toast for the douchebags...") | 73.60s | 60 pts |
| Extra | `luolei_yuexinmiao.wav` | 月薪喵 - *落泪 (我真的特别爱你)* | 0:00.0 | Drop viral do refrão ("我真的特别爱你...") | 36.00s | Jukebox / Custom |

---

### Task 1: Script de Corte dos Refrões (`scripts/slice-all-chorus-bgm.py`)

**Files:**
- Create: `scripts/slice-all-chorus-bgm.py`
- Modify: `assets/v2/audio/*.wav`

- [x] **Step 1: Criar `scripts/slice-all-chorus-bgm.py` com mapa de início e duração exata de cada refrão**
- [x] **Step 2: Executar o script para recortar os 13 arquivos WAV a partir dos áudios originais**
- [x] **Step 3: Validar que todos os arquivos WAV foram criados com tamanho (>600KB) e duração exata**

---

### Task 2: Atualização de Configuração e Motor do Jogo (`engineV2.js` & `levelConfigV2.js`)

**Files:**
- Modify: `docs/LEVEL_CONFIG_V2.json`
- Modify: `src/game/levelConfigV2.js` (gerado via `node scripts/prepare-v2.mjs`)
- Modify: `src/game/engineV2.js`

- [x] **Step 1: Adicionar `targetDuration` em cada nível em `docs/LEVEL_CONFIG_V2.json`**
- [x] **Step 2: Rodar `node scripts/prepare-v2.mjs` para propagar para `src/game/levelConfigV2.js`**
- [x] **Step 3: Atualizar `resolveDifficulty` e `stepRound` em `src/game/engineV2.js` para suportar `targetDuration`**

---

### Task 3: Atualização e Adição de Testes Unitários

**Files:**
- Modify: `tests/audio-v2.test.mjs`
- Modify: `tests/engine-v2.test.mjs`

- [x] **Step 1: Atualizar validação de tamanho de BGM em `tests/audio-v2.test.mjs` para refletir os snippets de refrão (>600KB)**
- [x] **Step 2: Adicionar teste em `tests/audio-v2.test.mjs` verificando que cada áudio possui a duração do refrão da fase**
- [x] **Step 3: Adicionar teste em `tests/engine-v2.test.mjs` validando conclusão de fase por tempo de música/refrão**
- [x] **Step 4: Executar suíte completa (`npm test`)**

---

### Task 4: Validação de Build Web e Entrega

**Files:**
- Test: `dist/`

- [x] **Step 1: Executar `npm run build:web`**
- [x] **Step 2: Commit, push e PR**

