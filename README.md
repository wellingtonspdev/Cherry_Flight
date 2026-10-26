# Cherry Bloom — Fly Through the Blossom

Projeto acadêmico mobile desenvolvido em **React Native + Expo + React Navigation** para a disciplina de **Programação para Dispositivos Móveis II** (5º Semestre — Desenvolvimento de Software Multiplataforma — FATEC Itaquera "Prof. Miguel Reale").

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

- **Link Público do Expo Snack (SDK 54):** `https://snack.expo.dev/XfDHNKv2NsZ7QEpAYhHiX`
- Compatível com execução direta no navegador (Web Preview do Snack) e no aplicativo **Expo Go (SDK 54)** em Android e iOS.

---

## 3. Arquitetura e Arquivos Obrigatórios

A estrutura respeita integralmente os requisitos da Atividade Prática 09 (Flappy Bird) e da especificação oficial:

```text
Cherry_Flight/
├── App.js                           # Entry point + NavigationContainer + Native Stack
├── app.json                         # Configuração Expo
├── package.json                     # Dependências alinhadas ao SDK da branch
├── src/
│   ├── tela1.js                     # Tela 1: Boas-vindas (Welcome / Home)
│   ├── tela2.js                     # Tela 2: Instruções (How to Play)
│   ├── tela3.js                     # Tela 3: Gameplay Principal (Cherry Bloom)
│   ├── tela4.js                     # Tela 4: Créditos Acadêmicos e Disclaimer
│   ├── components/
│   │   ├── BloomBranchPair.js       # Par de obstáculos (galhos floridos superior/inferior)
│   │   ├── CherryButton.js          # Botão reutilizável com feedback tátil e escala 0.96
│   │   ├── CherryPlayer.js          # Protagonista Cherri em SVG leve (idle/jump/fall/hit/celebrate)
│   │   ├── GameOverCard.js          # Card modal de Game Over com Score, Best Score e ações
│   │   ├── LogoLockup.js            # Identidade tipográfica Cherry Bloom
│   │   ├── PhaseBackground.js       # Cenário evolutivo em camadas + pétalas animadas
│   │   └── ScoreHUD.js              # Placar em tempo real + badge de fase
│   ├── game/
│   │   ├── collision.js             # Funções puras AABB de colisão e pontuação por par
│   │   ├── constants.js             # Constantes físicas, estados do jogo e dados acadêmicos
│   │   ├── createObstacle.js        # Geração e reciclagem determinística de obstáculos
│   │   ├── feedback.js              # Feedback háptico opcional seguro (com fallback no Snack/Web)
│   │   └── phase.js                 # Progressão visual por pontuação (4 fases)
│   └── theme/
│       └── theme.js                 # Design tokens do Cherry Bloom Design System
├── tests/
│   └── game.test.mjs                # Testes automatizados (colisão, score, obstáculos, fases e disclaimer)
├── assets/                          # Assets vetoriais, visuais de referência e ícones do pacote
├── docs/                            # Documentação técnica e manifestos de handoff
└── references/                      # Enunciado acadêmico e lições aprendidas de PDM II
```

---

## 4. Estratégia de Duas Baselines Expo (SDK 54 & SDK 57)

Conforme documentado em `docs/TECH_STACK_SDK54_SDK57.md`, o repositório mantém duas linhas isoladas por branch, sem misturar versões de SDK no mesmo `package.json`/`package-lock.json`:

1. **Branch `main` — Baseline A (Autoridade de Entrega — Expo SDK 54):**
   - `expo`: `~54.0.38`
   - `react`: `19.1.0`
   - `react-native`: `0.81.5`
   - Validada com `npx expo install --check`, `npx expo-doctor` (18/18 checks) e **Expo Snack**.

2. **Branch `sdk-57-local` — Baseline B (Execução Moderna Local — Expo SDK 57):**
   - `expo`: `~57.0.31`
   - `react`: `19.2.3`
   - `react-native`: `~0.86.3`
   - Configurada em branch separada com seu próprio `package.json` e `package-lock.json` para desenvolvimento/execução local moderna, mantendo paridade total de código-fonte (`App.js` e `src/`), gameplay e design.

---

## 5. Como Executar e Validar Localmente

### Pré-requisitos
- Node.js `>= 20.19.4` (testado em Node `v24.22.0`)
- npm `>= 10`

### Instalação e Execução
```bash
npm install
npm start
```

### Comandos de Validação Técnica
```bash
# Executar a suíte de testes unitários (colisões AABB, pontuação, reciclagem e textos acadêmicos)
npm test

# Verificar alinhamento de dependências com o Expo SDK
npx expo install --check

# Executar diagnóstico completo do projeto Expo
npx expo-doctor@latest
```
