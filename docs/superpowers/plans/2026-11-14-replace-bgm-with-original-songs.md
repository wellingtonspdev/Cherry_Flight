# Replace Synthesized BGM with Original Songs & Add Volume Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 
1. Substituir as 12 faixas de áudio sintetizadas/inspiradas pelas músicas originais completas/estúdio baixadas do YouTube (`22050 Hz, 16-bit Mono PCM WAV` com crossfade suave de loop).
2. Adicionar controle de volume independente (0% a 100%) para Música (BGM) e Efeitos Sonoros (SFX) com persistência em `progressionV2.js`, aplicação em tempo real em `audioServiceV2.js` e interface interativa em `SettingsV2.js`.

**Architecture:** 
- Áudio: Script automatizado (`scripts/download-all-original-bgm.py`) faz download e conversão em lote dos 12 vídeos oficiais do YouTube com `yt-dlp` e `imageio-ffmpeg`. Formato `pcm_s16le 22050Hz mono` com crossfade de 1024 amostras nas pontas para loop perfeito, substituindo `assets/v2/audio/*.wav`.
- Volume & Estado: `settings.musicVolume` (0–100) e `settings.sfxVolume` (0–100) integrados a `progressionV2.js` e `ProgressProviderV2.js`. `audioServiceV2.js` escala os volumes dinamicamente em tempo real tanto para a faixa de música ativa quanto para o pool de SFX (`jump`, `bobux`, `ui`, etc.).
- UI Ajustes: `SettingsV2.js` ganha controles de volume com seletores escalonados (0% a 100% em passos de 10%), exibindo porcentagem clara e tocando feedback sonoro ao calibrar o SFX.

**Tech Stack:** Python 3.13 (`yt-dlp`, `imageio-ffmpeg`, `wave`, `struct`), React Native, Node.js Test Runner (`node:test`), Expo CLI (`expo export --platform web`).

**Spec:** `docs/AUDIO_V2.md` & `CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md`

## Global Constraints

- Manter compatibilidade com testes existentes (`npm test`), onde cada BGM deve ser um WAV válido com tamanho `> 1.5 MB`.
- Formato acústico: `22050 Hz, 1 channel (mono), 16-bit PCM (.wav)`.
- Volumes padrão: `musicVolume = 100`, `sfxVolume = 100` (escala percentual inteira 0–100, escalando o ganho base `0.35` para música e `VOLUMES[sfx]` para efeitos).
- Nomenclatura neutra em git e commits (`feat/original-bgm-and-volume-controls`).

---

### Mapeamento das 12 Músicas Originais

| Nível / Bioma | Nome do Arquivo | Música Original | Artista | Link YouTube Verificado |
|---|---|---|---|---|
| L1 (First Bloom) | `first_bloom.wav` | Show Me How | Men I Trust | `https://www.youtube.com/watch?v=OZRYzH0Q0pU` |
| L2 (First Bloom) | `ye_flashing_lights.wav` | Flashing Lights | Kanye West | `https://www.youtube.com/watch?v=ZAz3rnLGthg` |
| L3 (First Bloom) | `ye_ghost_town.wav` | Ghost Town | Kanye West | `https://www.youtube.com/watch?v=qAsHVwl-MU4` |
| L4 (Sakura Garden) | `sakura_garden.wav` | Walking On A Dream | Empire of the Sun | `https://www.youtube.com/watch?v=kNCMxxYVYYY` |
| L5 (Sakura Garden) | `ye_stronger.wav` | Stronger | Kanye West | `https://www.youtube.com/watch?v=3mwiO5st-us` |
| L6 (Sakura Garden) | `eots_we_are_the_people.wav` | We Are The People | Empire of the Sun | `https://www.youtube.com/watch?v=HevFHRuLeTw` |
| L7 (Golden Bloom) | `golden_bloom.wav` | Inner Light | Elderbrook & Bob Moses | `https://www.youtube.com/watch?v=xZiSW0rI_9Y` |
| L8 (Golden Bloom) | `ye_father_stretch.wav` | Father Stretch My Hands Pt. 1 | Kanye West | `https://www.youtube.com/watch?v=wuO4_P_8p-Q` |
| L9 (Golden Bloom) | `ye_heartless.wav` | Heartless | Kanye West | `https://www.youtube.com/watch?v=xheuZhFEuDA` |
| L10 (Yozakura) | `yozakura.wav` | No Pole | Don Toliver | `https://www.youtube.com/watch?v=fCeiUX59_FM` |
| L11 (Yozakura) | `lofi_garden.wav` | Affection | Jinsang | `https://www.youtube.com/watch?v=NAkZ8gUXcIE` |
| L12 (Yozakura) | `ye_runaway.wav` | Runaway | Kanye West | `https://www.youtube.com/watch?v=cv1naUa3_3g` |

---

### Task 1: Script de Extração e Conversão em Lote das 12 Músicas

**Files:**
- Create: `scripts/download-all-original-bgm.py`
- Modify: `assets/v2/audio/*.wav` (12 arquivos substituídos)

- [x] **Step 1: Criar o script `scripts/download-all-original-bgm.py` com fila de download e conversão**
- [x] **Step 2: Executar o script de download e conversão em lote**
- [x] **Step 3: Verificar que os 12 arquivos WAV possuem tamanho > 1.5MB e formato 22050Hz 16-bit mono**

---

### Task 2: Implementar Suporte a Volume em Progressão e Áudio (TDD)

**Files:**
- Modify: `src/game/progressionV2.js`
- Modify: `src/game/ProgressProviderV2.js`
- Modify: `src/game/audioServiceV2.js`
- Modify: `tests/progression-v2.test.mjs`
- Modify: `tests/audio-v2.test.mjs`

- [x] **Step 1: Escrever testes unitários para persistência e sanitização de `musicVolume` e `sfxVolume`**
- [x] **Step 2: Atualizar `progressionV2.js` e `ProgressProviderV2.js` para suportar `musicVolume` e `sfxVolume` (0–100)**
- [x] **Step 3: Escrever testes unitários em `tests/audio-v2.test.mjs` para controle de volume dinâmico da música e dos efeitos sonoros**
- [x] **Step 4: Atualizar `audioServiceV2.js` para aplicar as taxas de volume a `music.volume` e `effects.values().volume`**

---

### Task 3: Controles de Volume na Interface de Ajustes (`SettingsV2.js`)

**Files:**
- Modify: `src/components/SettingsV2.js`

- [x] **Step 1: Adicionar controles táteis com botões step `[-] [Volume %] [+]` e barra visual para Música e SFX**
- [x] **Step 2: Emitir feedback sonoro (`audioManager.effect('ui')`) ao alterar o volume dos efeitos sonoros**
- [x] **Step 3: Assegurar acessibilidade (labels e roles) e visual kawaii coerente**

---

### Task 4: Validação da Suíte Completa e Build Web

**Files:**
- Test: `tests/*.test.mjs`

- [x] **Step 1: Executar suíte completa de testes (`npm test`)**
- [x] **Step 2: Executar build web (`npm run build:web`)**


