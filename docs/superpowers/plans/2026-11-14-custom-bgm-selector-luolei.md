# Custom BGM Selector & "落泪 (月薪喵)" Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Baixar do YouTube a faixa `落泪(我真的特别爱你) (片段版) - 月薪喵`, integrá-la aos assets de áudio do Cherry Bloom e adicionar um seletor de música de fundo (Jukebox/BGM) para o jogador escolher entre o modo automático por fase ou qualquer uma das 13 músicas disponíveis.

**Architecture:** O áudio será extraído do YouTube (`_SfPg54yj7M`) e convertido via `ffmpeg` para o padrão acústico do motor (`assets/v2/audio/luolei_yuexinmiao.wav`, 22050 Hz, 16-bit Mono PCM com crossfade de loop). O catálogo `MUSIC_TRACKS` em `src/game/audioSourcesV2.js` exporá metadados legíveis das 13 faixas + modo `'auto'`. `progressionV2.js` e `audioServiceV2.js` persistirão e aplicarão `selectedMusic` sem interromper a faixa escolhida em trocas de bioma, enquanto `SettingsV2.js` oferecerá seleção responsiva em landscape com preview sonoro.

**Tech Stack:** React Native (Expo SDK 58), `expo-audio` / Web Audio API, `@react-native-async-storage/async-storage`, Python (`yt-dlp` + `imageio-ffmpeg`), Node.js Test Runner (`node:test`).

**Spec:** `docs/AUDIO_V2.md` & `CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md`

## Global Constraints

- Manter compatibilidade com testes existentes (`npm test`) e build web/PWA (`npm run build:web`).
- Preservar `schemaVersion: 2` em `src/game/progressionV2.js` com fallback seguro para `'auto'` quando `selectedMusic` for omitido ou inválido.
- Garantir layout responsivo em modo paisagem (`568x320` e `844x390`) na tela `SettingsV2.js` usando `ScrollView` e controles compactos.
- Formato de áudio compatível com o pipeline V2: `.wav` PCM 16-bit 22050 Hz Mono (> 1.5 MB) em `assets/v2/audio/luolei_yuexinmiao.wav`.

## Review Focus

- `selectedMusic` inválido ou corrompido no `AsyncStorage` deve reverter silenciosamente para `'auto'` em `sanitizeProgress`.
- Troca de bioma no modo Endless (`event.type === 'biome'`) não deve reiniciar nem trocar a música quando o jogador tiver selecionado uma faixa fixa (`selectedMusic !== 'auto'`).
- Desativar o switch `music: false` deve pausar imediatamente qualquer faixa selecionada (inclusive durante o preview na tela de Ajustes).
- Em viewports mobile landscape estreitos (`height: 320px`), a adição do seletor de música em `SettingsV2` não pode causar clipping do botão `HOME`.
- Falha de carregamento do novo asset de áudio deve falhar aberta (`fail open`) sem travar a transição para `READY`.

---

### Task 1: Download e Conversão da Faixa "落泪(我真的特别爱你) (片段版) - 月薪喵"

**Files:**
- Create: `scripts/download-luolei-bgm.py`
- Create: `assets/v2/audio/luolei_yuexinmiao.wav`

**Interfaces:**
- Produces: `assets/v2/audio/luolei_yuexinmiao.wav` (22050 Hz, 16-bit PCM mono WAV, loop-ready, > 1.5 MB)

- [ ] **Step 1: Instalar dependências de extração no ambiente Python (`yt-dlp` e `imageio-ffmpeg`)**

Run: `python -m pip install --quiet yt-dlp imageio-ffmpeg`
Expected: Instalação concluída com código 0.

- [ ] **Step 2: Criar `scripts/download-luolei-bgm.py` e gerar `assets/v2/audio/luolei_yuexinmiao.wav`**

Baixar o áudio da faixa oficial `https://www.youtube.com/watch?v=_SfPg54yj7M` (`落泪(我真的特别爱你） (片段版) · 月薪喵`), converter via binário `ffmpeg` do `imageio_ffmpeg` para `22050 Hz`, 1 canal (mono), `pcm_s16le`, normalizar volume e aplicar crossfade suave nas bordas para loop contínuo.

- [ ] **Step 3: Verificar integridade do arquivo WAV gerado**

Run: `node -e "const fs = require('fs'); const s = fs.statSync('assets/v2/audio/luolei_yuexinmiao.wav'); console.log('Size:', s.size); if (s.size < 1500000) process.exit(1);"`
Expected: `Size: ~4580000` (maior que 1.5 MB, cabeçalho RIFF/WAVE válido).

---

### Task 2: Catálogo de Músicas (`MUSIC_TRACKS`) e Registro em `audioSourcesV2.js`

**Files:**
- Modify: `src/game/audioSourcesV2.js`
- Test: `tests/audio-v2.test.mjs`

**Interfaces:**
- Produces:
  - `AUDIO_SOURCES.music.luolei_yuexinmiao`
  - `MUSIC_TRACKS`: Array de objetos `{ id, title, artist }` começando por `{ id: 'auto', title: 'Automático (Fase)', artist: 'Trilha dinâmica por capítulo' }`, seguido de `{ id: 'luolei_yuexinmiao', title: '落泪 (我真的特别爱你)', artist: '月薪喵 (Yue Xin Miao)' }` e das 12 faixas existentes do jogo.
  - `VALID_MUSIC_IDS`: `Set` ou validação baseada em `MUSIC_TRACKS`.

- [ ] **Step 1: Escrever teste em `tests/audio-v2.test.mjs` validando a nova faixa e o catálogo `MUSIC_TRACKS`**

Adicionar asserções verificando que `luolei_yuexinmiao.wav` existe em `assets/v2/audio/`, está registrada em `AUDIO_SOURCES.music`, e que `MUSIC_TRACKS` contém `'auto'` + todas as 13 chaves de `AUDIO_SOURCES.music`.

- [ ] **Step 2: Executar teste para verificar falha inicial**

Run: `node --test tests/audio-v2.test.mjs`
Expected: FAIL (`luolei_yuexinmiao` / `MUSIC_TRACKS` ainda não definidos).

- [ ] **Step 3: Implementar `luolei_yuexinmiao` e `MUSIC_TRACKS` em `src/game/audioSourcesV2.js`**

Registrar `luolei_yuexinmiao: require('../../assets/v2/audio/luolei_yuexinmiao.wav')` em `AUDIO_SOURCES.music` e exportar `MUSIC_TRACKS` com títulos e artistas de todas as 13 músicas + opção `'auto'`.

- [ ] **Step 4: Executar teste para verificar aprovação**

Run: `node --test tests/audio-v2.test.mjs`
Expected: PASS

---

### Task 3: Suporte a `selectedMusic` no `audioServiceV2.js` e Persistência em `progressionV2.js`

**Files:**
- Modify: `src/game/audioServiceV2.js`
- Modify: `src/game/progressionV2.js`
- Modify: `src/game/ProgressProviderV2.js`
- Modify: `src/components/GameFieldV2.js`
- Test: `tests/audio-v2.test.mjs`
- Test: `tests/progression-v2.test.mjs`

**Interfaces:**
- Consumes: `MUSIC_TRACKS` de `src/game/audioSourcesV2.js`
- Produces:
  - `data.selectedMusic` em `createProgress()` e `sanitizeProgress(raw)` (padrão `'auto'`, validado contra IDs válidos de música).
  - `setSelectedMusic(data, trackId)` em `src/game/progressionV2.js`.
  - `selectMusic(trackId)` exposto por `useProgress()` em `src/game/ProgressProviderV2.js`.
  - Resolução de faixa em `audioServiceV2.js`: `prepare(biome)` resolve `targetTrack = (preferences.selectedMusic && preferences.selectedMusic !== 'auto' && sources.music[preferences.selectedMusic]) ? preferences.selectedMusic : biome`. Se a mesma `targetTrack` já estiver carregada no player `music`, não recria nem reinicia o player durante mudanças de bioma no modo Endless.

- [ ] **Step 1: Adicionar testes unitários em `tests/audio-v2.test.mjs` e `tests/progression-v2.test.mjs`**

Testar:
1. `sanitizeProgress` preserva `selectedMusic: 'luolei_yuexinmiao'` quando válido e reverte valores inválidos (ex.: `'hacked_track'`, `123`) para `'auto'`.
2. `setSelectedMusic` atualiza a música selecionada.
3. `audioService.settings({ selectedMusic: 'luolei_yuexinmiao' })` seguido de `prepare('first_bloom')` carrega a fonte `luolei_yuexinmiao` em vez de `first_bloom` e mantém a reprodução contínua quando `prepare('sakura_garden')` é chamado na transição de bioma.

- [ ] **Step 2: Executar testes para confirmar falha**

Run: `node --test tests/audio-v2.test.mjs tests/progression-v2.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implementar persistência em `progressionV2.js`, contexto em `ProgressProviderV2.js` e resolução em `audioServiceV2.js` / `GameFieldV2.js`**

- Em `progressionV2.js`: incluir `selectedMusic: 'auto'` no estado inicial, sanitizar contra a lista de IDs válidos e exportar `setSelectedMusic(data, trackId)`.
- Em `ProgressProviderV2.js`: sincronizar `audioManager.settings({ ...data.settings, selectedMusic: data.selectedMusic })` e expor `selectMusic`.
- Em `audioServiceV2.js`: resolver a faixa efetiva (`effectiveTrack`) em `prepare(biome)` e permitir troca dinâmica quando `settings({ selectedMusic })` alterar a faixa ativa.
- Em `GameFieldV2.js`: garantir que `audioManager.settings({ ...progress.data.settings, selectedMusic: progress.data.selectedMusic })` esteja sincronizado antes de `prepare`.

- [ ] **Step 4: Executar testes para confirmar aprovação**

Run: `node --test tests/audio-v2.test.mjs tests/progression-v2.test.mjs`
Expected: PASS

---

### Task 4: Seletor de Música (Jukebox) na Tela de Ajustes (`SettingsV2.js`)

**Files:**
- Modify: `src/components/SettingsV2.js`

**Interfaces:**
- Consumes: `MUSIC_TRACKS` de `src/game/audioSourcesV2.js`, `data.selectedMusic` e `selectMusic` de `useProgress()`, `audioManager` de `src/game/AudioManagerV2.js`.
- Produces: Seletor visual de Trilha Sonora (BGM) na tela `SettingsV2` com botões `< Anterior` / `Próxima >` e lista rápida em chips horizontais, com preview de áudio ao trocar de faixa quando `data.settings.music` estiver ativo.

- [ ] **Step 1: Atualizar `src/components/SettingsV2.js` com o seletor de música e layout `ScrollView` seguro para landscape**

Adicionar na seção de configurações o controle **"Trilha Sonora (BGM)"** exibindo o título e artista da faixa atual (`Auto`, `落泪 (我真的特别爱你) - 月薪喵`, ou qualquer uma das 12 faixas do jogo), botões de navegação rápida (`◀` / `▶`) e chips selecionáveis, tocando um preview via `audioManager` ao selecionar uma faixa e liberando no unmount.

- [ ] **Step 2: Executar a suíte completa de testes e build web**

Run: `npm test && npm run build:web`
Expected: Todos os testes passando (0 falhas) e bundle `dist/` gerado com o novo asset de áudio.
