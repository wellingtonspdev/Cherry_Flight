# Cherry Bloom — Fly Through the Blossom

Projeto acadêmico mobile e Web/PWA desenvolvido em **React Native + Expo + React Navigation** para a disciplina de **Programação para Dispositivos Móveis II** (5º Semestre — Desenvolvimento de Software Multiplataforma — FATEC Itaquera "Prof. Miguel Reale").

---

## 1. Identificação Acadêmica

- **Jogo:** Cherry Bloom
- **Autor / Aluno:** Wellington Siqueira Porto
- **Instituição:** FATEC Itaquera — Prof. Miguel Reale
- **Curso:** Desenvolvimento de Software Multiplataforma (DSM — 5º Semestre)
- **Disciplina:** Programação para Dispositivos Móveis II
- **Professor:** Prof. Jeferson de Souza Dias
- **Aviso Acadêmico Obrigatório (exibido integralmente na Tela 4):**
  > `Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.`

---

## 2. Demonstração e Entrega no Expo Snack (SDK 54)

- **Link Público do Expo Snack (SDK 54):** [Cherry Flight](https://snack.expo.dev/@wellingtonsp.de/cherry-flight).
- Compatível com execução direta no navegador (Web Preview do Snack) e no aplicativo **Expo Go (SDK 54)** em Android e iOS.

---

## 3. Controles Mobile & Desktop (Web / PWA)

O jogo detecta automaticamente o ambiente e oferece suporte híbrido completo:

- **Mobile (Touch):**
  - Toque em qualquer lugar da área do jogo para iniciar o voo e fazer a Cherry saltar.
- **Desktop / Web (Mouse + Teclado):**
  - `Espaço` (`Space`), `Seta para Cima` (`↑`), `W` ou **Clique do Mouse**: inicia a partida e faz a Cherry saltar.
  - `R` ou `Enter` (no Game Over): reinicia a partida imediatamente (`PLAY AGAIN`).
  - `Esc` ou `H`: retorna para a tela inicial (`HOME`).
  - O jogo funciona em **paisagem (horizontal)**, usando toda a área disponível, sem gabinete vertical de 460 px.
  - No navegador em retrato, aparece a instrução para girar o dispositivo. A configuração nativa e o manifesto PWA solicitam paisagem.
  - Alterar o tamanho da área de jogo reinicia a rodada em READY, com limites e obstáculos recalculados.

---

## 4. Suporte PWA Instalável & Deploy na Vercel

O projeto está configurado para hospedagem estática na **Vercel** com instalação como **PWA (Progressive Web App)** no celular (Android/iOS) e no Desktop (Chrome/Edge):

- [`vercel.json`](file:///d:/Cherry_Flight/vercel.json): Configura `buildCommand: "npm run build:web"`, `outputDirectory: "dist"`, cabeçalhos de cache para Service Worker/Manifest e rewrites de SPA.
- [`public/manifest.json`](file:///d:/Cherry_Flight/public/manifest.json): Web App Manifest com `display: "standalone"`, `orientation: "portrait"`, cores oficiais (`#D91E36` / `#FFF8F2`) e ícones `192x192` e `512x512` (`any maskable`).
- [`public/sw.js`](file:///d:/Cherry_Flight/public/sw.js) & [`public/offline.html`](file:///d:/Cherry_Flight/public/offline.html): Service Worker com cache de App Shell e página de fallback offline.
- [`scripts/prepare-pwa.mjs`](file:///d:/Cherry_Flight/scripts/prepare-pwa.mjs): Injetor pós-build que vincula automaticamente `manifest.json`, meta tags iOS (`apple-mobile-web-app-capable`, `apple-touch-icon`) e registro do `sw.js` no `dist/index.html`.
- [`src/game/pwa.js`](file:///d:/Cherry_Flight/src/game/pwa.js): Captura o evento `beforeinstallprompt` e exibe o botão **"INSTALAR APP (PWA)"** na Tela 1 quando disponível no navegador, além de instrução nativa para Safari no iOS.

---

## 5. Estratégia de Baselines Expo (SDK 54, SDK 57 e SDK 58)

O repositório mantém três branches isoladas, cada uma com seu próprio `package.json` e `package-lock.json` sincronizados e sem contaminação cruzada:

1. **Branch `main` — Baseline A (Autoridade de Entrega Acadêmica — Expo SDK 54):**
   - `expo`: `~54.0.38` | `react`: `19.1.0` | `react-native`: `0.81.5`
   - Compatível com **Expo Snack** e **Vercel Web/PWA**.
2. **Branch `sdk-57-local` — Baseline B (Variante Local SDK 57):**
   - `expo`: `~57.0.31` | `react`: `19.2.3` | `react-native`: `~0.86.3`
3. **Branch `sdk-58-local` — Baseline C (Execução Local Mais Recente — Expo SDK 58 + Web/PWA):**
   - `expo`: `~58.0.19`
   - Ideal para rodar localmente com a versão mais recente do **Expo Go (SDK 58)** no celular e para gerar o build Web/PWA para a **Vercel**.

---

## 6. Como Executar Localmente e Publicar na Vercel

### A) Rodar Localmente no Expo SDK 58 (Celular com Expo Go atual ou Web Desktop)
```powershell
git checkout sdk-58-local
npm ci
npx expo start
```
- Pressione `w` no terminal para abrir no navegador Desktop (com controles de teclado `Espaço` / `↑` / `W`).
- Ou escaneie o QR Code com o app **Expo Go (SDK 58)** no celular.

### B) Rodar a Versão Principal de Entrega (Expo SDK 54 — `main`)
```powershell
git checkout main
npm ci
npx expo start
```

### C) Gerar Build Web/PWA Localmente ou Fazer Deploy na Vercel
```powershell
# Gerar a pasta estática dist/ pronta para PWA
npm run build:web

# Ou publicar diretamente na Vercel (via Vercel CLI ou integração Git)
npx vercel --prod
```

### D) Comandos de Validação Técnica
```powershell
npm test
npx expo install --check
npx expo-doctor@latest
```
