# Cherry Bloom V2 — Fly Through the Blossom

Projeto acadêmico em React Native, Expo e React Navigation. Jogo **horizontal**, com a personagem **Cherry**.

## Identificação acadêmica

- Aluno: Wellington Siqueira Porto.
- Instituição: FATEC Itaquera — Prof. Miguel Reale.
- Curso: Desenvolvimento de Software Multiplataforma, 5º Semestre.
- Disciplina: Programação para Dispositivos Móveis II.
- Professor: Prof. Jeferson de Souza Dias.
- Atividade Prática 9 — Flappy Bird.

> Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.

## Jogar

- [Snack oficial, SDK54](https://snack.expo.dev/@wellingtonsp.de/cherry-flight).
- [Web/PWA](https://cherry-flight.vercel.app).
- [Relatório V2 e evidências](CHERRY_BLOOM_V2_IMPLEMENTATION_REPORT.md).

Validação:28 testes, Expo Doctor54(18/18) e57(21/21), runtime Web/Snack e smoke Android em nuvem com toque/salto/Game Over/Retry. O relatório identifica a revisão efetivamente publicada e separa validação Web, Snack, exportação nativa e dispositivo físico. Não presume que exportar um bundle comprova execução nativa.

Toque/clique para iniciar e saltar. Teclado: Espaço, ↑ ou W. P pausa/retoma; R/Enter reinicia no Game Over; Esc/H volta para Home. Retrato no navegador mostra orientação para girar. Resize reinicia a rodada em READY.

## Campanha, checkpoints e Endless

| Capítulo | Níveis |
|---|---|
| First Bloom | 1–3 |
| Sakura Garden | 4–6 |
| Golden Bloom | 7–9 |
| Yozakura | 10–12 |

Cada nível tem meta, abertura, velocidade, espaçamento e limite de variação definidos em `docs/LEVEL_CONFIG_V2.json`. Gravidade e impulso permanecem constantes. A primeira abertura fica centralizada e começa fora da viewport para permitir preparar o voo.

Atingir a meta completa o nível uma vez e desbloqueia o seguinte. **Continue** retorna ao início do checkpoint; **Level Select** mostra concluídos, disponíveis, checkpoint e bloqueados. **Retry** reinicia posição, velocidade, obstáculos, score e timers. Checkpoint não guarda física parcial.

Completar o Level12 desbloqueia **Endless Bloom**: dificuldade cresce a cada10 pontos, com limites de velocidade/gap, alternância de biomas e recorde separado.

AsyncStorage guarda schema2, resultados, desbloqueios, último nível e preferências. Dados inválidos voltam ao Level1. O recorde V1 é preservado. Falha de gravação aparece na interface; progresso continua somente na sessão.

## Arte, renderer e áudio

`assets/v2/` conserva os SVGs autoritativos e PNGs de referência recebidos. O runtime utiliza sua geometria SVG, com AST previamente interpretada, quatro estados de Cherry, quatro kits de13 peças e cenários em camadas. PNG presente na pasta não é apresentado como imagem efetivamente renderizada.

A simulação usa refs e atualização imperativa de Animated, sem redesenhar a árvore completa a cada frame. Há4 pares montados nos níveis1–6,5 nos demais e3 descritores futuros preparados fora da tela. Slots reciclam identidade e composição modular. Fundos têm parallax, overlays não capturam toque e transições de bioma usam crossfade.

Quatro músicas e nove SFX originais foram compostos localmente por `scripts/compose-audio-v2.py`, pois o handoff não continha áudio. Nenhum serviço pago ou mídia de terceiros foi utilizado. Expo Audio atende o runtime nativo; Web usa HTMLAudio para capturar a Promise de autoplay que o adaptador Web do SDK54 descarta. Music, SFX e vibração têm preferências independentes e persistentes. Áudio falha sem bloquear a física.

## Executar e verificar SDK54

```powershell
npm ci
npx expo start
npm test
npx expo install --check
npx expo-doctor@latest
npm run build:web
```

Baseline oficial: Expo54, React19.1.0, React Native0.81.5. As quatro telas acadêmicas permanecem em `src/tela1.js`–`src/tela4.js`. Novos serviços/componentes não substituem React Navigation.

```powershell
node scripts/prepare-v2.mjs --check
npm run prepare:snack
node audit-evidence/v2/progression-runtime.cjs
node audit-evidence/v2/visual-audio-runtime.cjs
```

Os scripts de navegador exigem o Playwright/Chrome dos caminhos registrados neles e Metro na porta8105. Não são uma dependência do jogo. Os bots de navegador usam entradas reais e podem perder uma partida; consulte as tentativas/evidências em vez de confundir derrota do bot com falha de input. A suíte de lógica é determinística.

## Importar no Snack

Use no campo Git URL:

```text
https://github.com/wellingtonspdev/Cherry_Flight/tree/main/snack
```

O importador Git do Snack retorna erro ao reenviar arquivos binários da raiz. `snack/` é gerado com todo o código de runtime, arte SVG em JavaScript e **o mesmo PCM de áudio em data URI**, sem upload binário. Não depende de um servidor de assets externo. `npm test` verifica sincronismo com a entrega SDK54. Não edite essas cópias manualmente.

Expanda o Web Preview para uma janela horizontal. O relatório informa quais plataformas foram executadas; não confunda Web Preview com teste físico de Expo Go.

## SDK57 e SDK58

`sdk-57-local` mantém manifest/lock próprios e recebe espelho V2 após SDK54/Snack. Dependências nativas devem ser instaladas com o Expo dessa branch. `sdk-58-local` preserva o trabalho anterior; não é autoridade da entrega V2. Nunca reutilize `node_modules` entre essas linhas.

## Vercel/PWA e domínio

`vercel.json` exporta a Web para `dist/`, preserva assets, configura SPA e cache de manifest/Service Worker. O manifesto solicita paisagem. A aplicação pode ser instalada quando o navegador oferecer PWA.

Publicação utiliza Vercel CLI no projeto `cherry-flight`. Domínio/subdomínio personalizado continua configurável em Vercel e Cloudflare; nenhum registro DNS é alterado por esta entrega. Funcionamento offline depende dos recursos já visitados/cacheados; áudio opcional nunca impede a partida.

## Fontes e limites

V2 prevalece sobre V1. Consulte a especificação V2, Design System V2, configuração de níveis, progressão, renderer, áudio e manifesto em `docs/`. Relatórios antigos são históricos, não prova de aceite V2. Evidências sanitizadas ficam em `audit-evidence/v2/`; nenhuma credencial é versionada.
