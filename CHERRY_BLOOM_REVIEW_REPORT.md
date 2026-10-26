# Cherry Bloom — Review Report

Data: 26/10/2026 — America/Sao_Paulo.

## Executive Summary

**STATUS: NÃO APROVADO. FINAL AUDIT: FAIL. READY FOR DELIVERY: NO.**

A auditoria começou sem alterações de produto. Depois da coleta do baseline, o usuário determinou que o jogo deve funcionar **na horizontal** e autorizou a correção. O registro anterior às alterações está em [PRE_CORRECTION_BASELINE.md](audit-evidence/PRE_CORRECTION_BASELINE.md).

O produto anterior falhava com input rápido no Web local e no Snack SDK54. O comando chegava ao elemento correto, mas não acionava o salto. A personagem se movia quando acionada por pressão longa ou teclado: não foi encontrado um segundo defeito universal de física que explicasse sua imobilidade inicial. Foram confirmados, separadamente, reativação do jogo oculto por teclado e congelamento após resize.

A correção horizontal foi aplicada ao checkout ativo SDK58 e validada também em uma cópia isolada SDK54 com dependências próprias. Inclui configuração Expo/PWA em landscape, remoção do gabinete vertical, Home em duas colunas, Game Over compacto, limites pela área real, gaps compatíveis com alturas menores, input imediato e correções dos dois defeitos de lifecycle que comprometiam essa execução.

**A correção local não atualizou branches, Snack ou publicação remota.** O Snack público continua representando o baseline anterior. Não houve commit, push, merge, deploy ou salvamento no editor do Snack.

| Severidade | Findings registrados | Situação |
|---|---:|---|
| BLOCKER | 2 | Dois sintomas da mesma causa de input; corrigidos/retestados localmente, ainda reproduzidos no Snack publicado |
| CRITICAL | 0 | Nenhum defeito independente confirmado nessa classe |
| MAJOR | 6 | Identidade, fidelidade visual, teclado oculto, resize, Web SDK57 e orientação horizontal |
| MINOR | 5 | Manifesto, motion, performance, dependências e contraste |
| COSMETIC | 0 | Não foram inventados findings de preferência estética |

São 13 registros, não 13 causas independentes: REV-001 e REV-002 compartilham causa. REV-013 incorpora a determinação de orientação recebida durante a auditoria.

## Skills utilizadas

Necessidades definidas após leitura das referências e implementação: React Native/Expo, input e lifecycle, gameplay, fidelidade visual, acessibilidade, dependências e evidência de execução.

Discovery obrigatório executado com `npx --yes skills find` para `react native`, `expo`, `visual audit` e `game debugging`. Não foram instaladas skills globais nem dependências de produto por causa do discovery.

| Skill | Motivo | Uso previsto e contribuição efetiva |
|---|---|---|
| `ecc:react-native-patterns` — instalada | Comportamento e limites RN | Revisão de estado/ref, efeitos, armazenamento, safe area e trabalho no JS thread. A sugestão de Expo Router não foi aplicada: o contrato exige React Navigation. |
| `superpowers:systematic-debugging` — instalada | Não confundir sintoma com causa | Reprodução com eventos, comparação toque curto/longo, investigação independente de input e movimento, testes de resize e foco antes de corrigir. |
| `vibe-code-auditor` — instalada | Revisão estrutural adversarial | Dependências, código morto/ignorado, fragilidade de testes, estado por frame, lifecycle e limites de evidência. Formato/severidades seguem o pedido do usuário. |
| `web-design-guidelines` — instalada | QA da superfície Web | Revisão de contraste, foco, motion, layout e interação. Regras de formulários, SEO e sincronização de filtros na URL não se aplicam a este jogo. |
| `pdf:pdf` — instalada | Enunciado acadêmico original | Extração integral do PDF e inspeção de sua página renderizada. |
| `vercel-labs/agent-skills@vercel-react-native-skills` — descoberta | Alternativa RN | Descoberta; não ativada, pois havia guia local suficiente. |
| `callstackincubator/agent-skills@react-native-best-practices` — descoberta | Performance mobile | Descoberta; não ativada nem apresentada como profiling realizado. |
| `expo/skills@building-native-ui`, `expo/skills@expo-dev-client` — descobertas | Ecossistema Expo | Não ativadas: não se está migrando navegação nem criando dev client. |
| `affaan-m/ecc@browser-qa`, `playableintelligence/game-creator@game-qa`, `mattpocock/skills@diagnosing-bugs` — descobertas | QA/game/debug | Descobertas; execução coberta pelo workflow local e harnesses, sem instalar outro toolkit. |

Context7 foi consultado para validação imutável de dependências Expo SDK54 e configuração de orientação. Fontes primárias: [Expo CLI SDK54](https://github.com/expo/expo/blob/sdk-54/docs/pages/more/expo-cli.mdx), [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) e [W3C — contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## Environment

| Item | Evidência |
|---|---|
| Raiz | `D:\Cherry_Flight` |
| Plataforma de auditoria | Windows, PowerShell, Chromium/Chrome real, browser mobile emulado; sem aparelho conectado no `adb devices -l` |
| Node / npm | v24.22.0 / 11.19.1 |
| Branch ativa inicial e final | `sdk-58-local` |
| HEAD inicial | `057128577b637ebb812e5d21436b5c1c2dbb3f99` |
| Autoridade SDK54 | `main`, `5cce0b124ad22f73e6aab8b67a804d29a08c328e`, quatro commits à frente de origin/main no início |
| SDK57 | `sdk-57-local`, `77fd142f07d2d7df3f95f4d711837e5de6a8e527` |
| SDK54 instalado isoladamente | Expo 54.0.38, React 19.1.0, RN 0.81.5 |
| SDK57 instalado isoladamente | Expo 57.0.31, React 19.2.3, RN 0.86.3 |
| SDK58 ativo | Linha Expo 58 / React 19.3.0 / RN 0.88.0; validação horizontal independente do SDK54 |
| Git inicial | Limpo |
| Git final | Alterações locais de orientação e correções associadas, relatório e evidências; nenhum commit criado |

As cópias de auditoria foram extraídas de revisões Git em `audit-evidence/sdk54` e `audit-evidence/sdk57`, com instalações próprias. Não foi trocado o SDK do checkout ativo. Houve uma reinstalação incidental com `npm ci` no checkout SDK58 durante a preparação: manifestos e lockfile permaneceram sem alteração. Os logs correspondentes foram preservados; isso não é evidência de runtime SDK54.

Os arquivos ZIP preservam as fontes anteriores à correção. `audit-evidence/` contém também dependências e builds temporários das cópias; não deve ser adicionado integralmente a um commit de produto.

### Referências integralmente lidas

Design System, Specification and Acceptance, README, TECH_STACK_SDK54_SDK57, IMPLEMENTATION_HANDOFF, ASSET_MANIFEST, ASSET_GENERATION_PROMPTS, RESEARCH_SOURCES, LICOES_APRENDIDAS_PDM2 e PDF Atividade Prática 09. Foram lidos App, quatro telas, sete componentes, helpers de jogo, theme, PWA, script de build, testes, configurações e cabeçalhos/resolução dos lockfiles.

Não foram localizados um relatório independente completo do implementador nem relatórios históricos de testes versionados. Existe um commit anterior cujo título menciona correções de revisão; o título não foi aceito como comprovação.

## Known Findings

| Conhecido | Reprodução e conclusão |
|---|---|
| Tap não funciona | FAIL no baseline Web e Snack com clique/toque rápido. Evento chega ao campo; `onPressIn` não ativa antes do release. REV-001. PASS no reteste local com atraso removido. |
| Personagem não se move | FAIL após tap rápido, posição e velocidade permanecem constantes. Pressão longa inicia RAF, impulso e renderização. REV-002 é consequência confirmada de REV-001 nesse cenário. |
| Nome incorreto | FAIL: Home, Instructions, label do Game, README, manifesto PWA e referências usam a grafia antiga. Nome oficial é **Cherry**. REV-003 permanece pendente. |
| Assets divergentes | PARTIAL em aderência aos tokens/silhueta; FAIL em fidelidade ao material rico produzido. REV-004. Não se confundiu uso permitido de SVG com obrigação de importar todos os PNGs. |

## Gameplay Audit

| Teste | Baseline | Revalidação horizontal |
|---|---|---|
| Abre / READY | PASS Web SDK54 e Snack | PASS Web SDK54/58 |
| Tap curto inicia | FAIL | PASS: eventos touch de 10 ms pelo protocolo de entrada Chromium |
| Impulso / gravidade | PASS com input longo/teclado | PASS: y diminui após tap e depois alcança o chão sem novo input |
| Obstáculos se movem | PASS em partida instrumentada | PASS nas seis combinações SDK/viewport |
| Reciclagem / gaps | PASS helpers e partida instrumentada com score 3 | PASS unitário para alturas horizontais menores; endurance físico NOT EXECUTED |
| Score único | PASS teste dirigido e partida instrumentada | PASS SDK54 horizontal: partida com touch real chegou a30; outros tamanhos/SDK58 têm helpers e testes curtos, sem endurance equivalente |
| Colisão topo/chão/galhos | PASS teste dirigido de componente e helpers; chão natural | PASS helpers; chão natural horizontal. Galhos/topo dirigidos após correção: NOT EXECUTED |
| Game Over | PASS | PASS, ações visíveis em paisagem |
| Replay | PASS em cinco ciclos com pressão longa | PASS nas seis combinações e cinco ciclos consecutivos SDK54 horizontal; reset de posição, velocidade, score e pool |
| Home interrompe loop | PARTIAL: cancela, mas atalho o reativa oculto | PASS: Home + Espaço mantém READY e RAF nulo |
| Resize | FAIL: PLAYING sem RAF | PASS: retorna a READY, ajusta limites e pode iniciar outra rodada |

O harness anterior usa assertions que confirmam defeitos esperados. Seu exit 0 não representa produto aprovado. A revalidação de correções usa assertions de comportamento correto em `landscape-audit.cjs`.

## Input Audit

Campo interativo: Pressable em `src/tela3.js`, originalmente linha 479. Árvores de fundo, personagem e HUD usam `pointerEvents="none"`; barra superior usa `box-none`. O centro do campo retorna o próprio botão em `elementFromPoint`. O overlay READY não captura eventos. Não foi constatado overlay invisível como causa.

No baseline local, eventos pointerdown, mousedown e click foram registrados no campo, mas READY, y=356, velocity=0 e RAF=null permaneceram. Pressões controladas de 0, 10 e 30 ms falharam; 70 ms iniciou PLAYING. Outro teste usou eventos **touch reais do protocolo Chromium**, não apenas `dispatchEvent`: 10 ms falhou; 100 ms iniciou PLAYING, y=319.2918215 e velocidade=-266.52.

A dependência instalada `react-native-web/dist/modules/usePressEvents/PressResponder.js` declara `DEFAULT_PRESS_DELAY_MS = 50`. Release antes da ativação só força a ativação quando `onPress` existe. O produto ligava exclusivamente `onPressIn`. A correção `delayPressIn={0}` preserva a intenção de impulso imediato sem adicionar dois handlers que duplicariam saltos.

No Snack anônimo, clique de 10 ms deixou TAP TO FLY; clique de 100 ms removeu o prompt, iniciou o voo, chegou ao Game Over e permitiu replay. O editor mostrou SDK v54.0.0. Não foi salvo qualquer arquivo remoto.

## Game Loop Audit

READY altera estado e ref para PLAYING, aplica impulso e agenda RAF. `stepFrame` calcula dt, integra gravidade/posição, move obstáculos, testa colisão antes do score, atualiza refs e renderiza. GAME_OVER cancela RAF e timer de pose. Replay restaura refs, pool, score, tempo e estado. Os helpers são separados da UI; não há necessidade de engine externa.

O loop não está universalmente quebrado: há evidência independente de mudança de posição lógica, transformação visual e deslocamento de obstáculos. Não foi confirmada stale closure como causa do tap. O uso simultâneo de transform estático e animações com driver nativo exige teste Android/iOS; o fallback JS do Web não comprova o comportamento do driver nativo.

Dois problemas reais de lifecycle foram encontrados: listener de teclado sem condição de foco e cleanup de efeito dependente de dimensões que cancelava RAF sem sair de PLAYING. Ambos foram corrigidos e revalidados no escopo horizontal local.

Pause é opcional. A constante PAUSED existe, mas não há fluxo de pausa completo; isso não foi convertido em quebra obrigatória. App em background/suspensão física: NOT EXECUTED.

## Physics Audit

Constantes: gravity=1050 dp/s², jumpVelocity=-390 dp/s, maxFallVelocity=580 dp/s, obstacleSpeed=155 dp/s, gap=168 dp, personagem=48 dp, inset=6 dp. Movimento usa dt limitado a 0.05 s e não presume 60 FPS. O clamp evita saltos gigantes, mas desacelera tempo simulado sob travamento prolongado; não equivale a medição de fluidez.

Na correção horizontal, dimensões vêm de `onLayout` do campo, com fallback de janela apenas até a primeira medição. Foram removidos largura máxima 460, altura mínima 580/480 e limite de área que extrapolavam celulares em paisagem. A geração de gaps reduz as folgas superior/inferior quando a altura é pequena, mantendo a abertura dentro do campo.

Novo teste cobre alturas jogáveis 284, 324, 354 e 444, extremos e ponto médio de aleatoriedade, geração, reciclagem e passagem central sem colisão. Não foi alterada a constante global de impulso para esconder bugs de input.

## Collision Audit

AABB com hitbox 36×36 dentro de visual 48×48. Galhos possuem inset horizontal de 4 px; flores e folhas não ampliam hitbox. Testes puros cobrem ceiling, ground, topBranch, bottomBranch e corredor seguro. Teste dirigido no componente produziu GAME_OVER/RAF=null para os quatro casos.

O personagem é rotacionado/deformado visualmente sem alterar o AABB. Essa tolerância deve continuar explícita; não há prova física de percepção de justiça nos extremos. Troncos retangulares têm bordas claras, mas aparência ainda é tubular comparada aos galhos orgânicos da referência.

## Score Audit

`checkPairScored` verifica a borda direita do par e flag scored. A colisão antecede pontuação no frame. Teste dirigido: primeiro cruzamento elevou score para 1 e marcou flag; frame seguinte permaneceu 1. Partida automatizada que aplicou o callback de salto, sem alterar posição/obstáculos, chegou a score 3 e reciclou pares antes de colidir. Isso é execução instrumentada, não jogo manual nem teste mobile físico.

Best score usa AsyncStorage e erros não interrompem a partida. Persistência entre reinstalações/dispositivos e corrida de leitura inicial: NOT EXECUTED. Áudio não é necessário para score/collision.

## Navigation Audit

React Navigation 7 + native stack estão instalados e usados. Welcome, Instructions, Game e Credits foram abertos no runtime local e no Snack. Foram exercitados Home, entrada a partir de Instructions/Credits e navegação repetida.

O stack pode conservar Game montado após navegar a Welcome. Por isso cleanup de unmount era insuficiente. A correção limita atalhos à tela focada; o teste confirmou que Espaço na Home não cria RAF. Back físico Android, gesto iOS e hardware nativo: NOT EXECUTED. Não se declara PASS dessas plataformas por navegação Web.

## Screen-by-Screen Review

| Tela | Planejado / resultado |
|---|---|
| `src/tela1.js` | Marca em duas linhas, personagem e três ações presentes. Motion de entrada/bob observado. Nome incorreto permanece. Após correção, identidade fica à esquerda e ações à direita em paisagem, inclusive 568×320. |
| `src/tela2.js` | Explica tap, galhos e ponto; Play/Home funcionam. Diagrama é estático e simplificado. Textos usam grafia antiga. Scroll comprovado em altura curta; compreensão por usuário real não foi cronometrada. |
| `src/tela3.js` | READY, PLAYING, GAME_OVER existem. Baseline falha em tap curto, foco e resize; reteste local passou. HUD com scrim e botão Home. Gameplay ocupa largura e altura reais em paisagem. |
| `src/tela4.js` | Aluno, FATEC, curso, disciplina, professor e aviso exato renderizam; scroll funciona. Não há truncamento deliberado do texto obrigatório. Safe area nativa ainda requer aparelho. |
| Game Over | Título, score, best, replay/Home funcionam. Em paisagem, card fica compacto, sem mascote redundante, com ações lado a lado; scroll permanece como fallback para alturas extremas. |

## Visual Design Review

**BRAND:** Cherry Bloom está correto. Cherry como personagem não está consolidado nos textos existentes. O desenho SVG conserva corpo vermelho único, haste, folha verde, rosto, highlight e leitura reduzida. A ilustração rica do material produzido tem volume, recortes e expressões mais elaborados; equivalência de silhueta não significa fidelidade completa.

**PALETA:** theme replica os tokens Cherry, Blossom, Cream, Leaf, Bark, Sky, Sunset, Dusk, Night. Componentes adicionam cores literais para variações de madeira/atmosfera. Há desvio entre vermelho do PWA (#D91E36) e principal (#E63750), além de rosa da moldura anterior. Não se atribuiu erro a toda cor de variação, pois o DS admite atmosfera e variantes.

**SHAPES:** botões pill, cards arredondados e sombras quentes estão presentes. Os obstáculos usam tampas arredondadas/retangulares com pequenos ornamentos, distantes das pontas orgânicas dos vetores. O céu, montanhas e copas formam um cenário muito mais simples que os JPGs, sem ponte/água/profundidade equivalente.

**TIPOGRAFIA:** fallback de sistema é autorizado; não foi exigida importação de Fredoka/Nunito. Hierarquia e score são legíveis no Web testado. Não há validação de fontes nativas ou Dynamic Type extremo. Logo raster/concept board não foi tratado como fonte de textos ou medidas.

### Fases

| Score | Fase | Estado | Evidência e limite |
|---|---|---|---|
| 0–9 | First Bloom | PASS | Render observado, céu claro e sol; baseline e partida local |
| 10–19 | Sakura Garden | PASS | Threshold, render dirigido e progressão posterior por input real no SDK54 horizontal |
| 20–29 | Golden Bloom | PASS | Threshold, render dirigido e progressão posterior por input real no SDK54 horizontal |
| 30+ | Yozakura | PASS | Partida horizontal SDK54 chegou a30 sem injetar score, posição ou obstáculos; lua/estrelas e score inspecionados |

Screenshots das quatro apresentações dirigidas: [phases-contact-sheet.jpg](audit-evidence/phases-contact-sheet.jpg). A execução posterior por input real está em [landscape-playthrough.json](audit-evidence/landscape-playthrough.json), com screenshots naturais de10,20,30 pontos. A primeira tentativa de automação perdeu após1 ponto; o limiar de reação do jogador automatizado foi antecipado, sem modificar física ou estado do produto. O `phaseVariant` é fallback posterior a `pair.variant`, que sempre é preenchido: mudança de fase não garante substituição automática de toda madeira por variante noturna. Isso integra a fidelidade parcial, sem inventar dificuldade diferente por fase.

## Asset Audit

Inventário: [asset-inventory.json](audit-evidence/asset-inventory.json). Todos os 13 raster de personagem/fundo foram inspecionados em contato visual; os oito PNGs RGBA também sobre cream para distinguir transparência de fundo preto. Os seis SVGs foram renderizados, assim como os quatro ícones PWA. WAVs foram abertos para inspeção de formato/duração, mas não foram ouvidos.

| Asset planejado | Existe | Está usado | Fidelidade | Problema |
|---|---|---|---|---|
| Concept board | Não | Não | NOT EXECUTED | Referência citada ausente |
| Sprite sheet | Não | Não | NOT EXECUTED | Origem dos crops não está incluída |
| Phase sheet | Não | Não | NOT EXECUTED | Comparação original ausente |
| `cherri_idle.png` | Sim, 395×415 RGBA | Não no Game | PARTIAL | Substituído por SVG simples; nome de arquivo legado |
| `cherri_happy.png` | Sim, 438×439 RGBA | Não | PARTIAL | Expressão recriada; sem volume equivalente |
| `cherri_fall.png` | Sim, 443×425 RGBA | Não | PARTIAL | Tilt/rosto programáticos; não anima o crop |
| `cherri_hit.png` | Sim, 419×372 RGBA | Não | PARTIAL | Squash programático; proporções diferentes |
| `cherri_dizzy.png` | Sim, 443×429 RGBA | Não | NOT EXECUTED | Estado dizzy opcional não implementado |
| `cherri_celebrate.png` | Sim, 443×443 RGBA | Não | PARTIAL | Crop possui fragmento lateral estranho; precisa limpeza/anchor antes de runtime |
| `cherri_wink.png` | Sim, 440×433 RGBA | Não | NOT EXECUTED | Estado opcional não usado |
| `cherri_neutral.png` | Sim, 428×421 RGBA | Não | PARTIAL | Referência alternativa; não é sprite runtime |
| `app_icon_candidate.jpg` | Sim, 1024×1024 RGB | Ícones PWA visualmente derivados | PARTIAL | Tem fundo cream; não serve como sprite transparente. Processo de derivação não está documentado |
| `01_first_bloom.jpg` | Sim, 470×836 | Não | PARTIAL | Fundo rico substituído por primitivas |
| `02_sakura_garden.jpg` | Sim, 470×836 | Não | PARTIAL | Mesmo desvio de profundidade/ambiente |
| `03_golden_bloom.jpg` | Sim, 471×836 | Não | PARTIAL | Mesmo desvio de atmosfera |
| `04_yozakura.jpg` | Sim, 470×836 | Não | PARTIAL | Mesmo desvio de riqueza visual |
| `cherry_mark.svg` | Sim | Equivalente em componente | PARTIAL | Não importado como arquivo; geometria/fill diferem |
| `logo_lockup.svg` | Sim | Equivalente em componente | PARTIAL | Sistema de duas linhas preservado; composição/fonte dependem do runtime |
| `branch_top.svg`, `branch_bottom.svg` | Sim | Não diretamente | PARTIAL | Galhos pontudos substituídos por troncos com tampas |
| `blossom.svg`, `leaf.svg` | Sim | Equivalentes simplificados | PARTIAL | Flores/folhas internas menores e mais simples |
| `ui_tap.wav`, `jump_pop.wav`, `score_chime.wav`, `collision_thump.wav` | Sim | Não | NOT EXECUTED | Áudio opcional não ligado; nenhuma alegação de reprodução |
| `ambient_bloom_prototype.wav` | Sim, 8 s | Não | NOT EXECUTED | Ambiente opcional; não é falha do core |
| Ícones 192/512, apple-touch, favicon | Sim | PWA/config | PARTIAL | Presentes/renderizados; instalação real não executada |

Os JPGs verticais **não devem ser esticados** para preencher paisagem. A nova orientação exige recorte consciente, camadas adaptáveis ou exportação horizontal da arte. Importar todos os arquivos cegamente produziria deformação/obstáculos falsos. Não há evidência de modificação dos raster nesta auditoria.

Manifesto ainda aponta `assets/generated/...`, enquanto arquivos reais estão em `assets/characters` e `assets/backgrounds`. Os assets não usados são referências/órfãos de runtime, não automaticamente lixo a excluir. Não foi encontrada necessidade de transformer SVG: os componentes usam react-native-svg.

## Motion Review

| Item | Estado | Evidência |
|---|---|---|
| Cherry idle float | PASS | Animated bob observado no menu/READY |
| Jump squash/stretch | PASS | Sequência e transformação durante salto no Web |
| Fall tilt | PASS | Rotação visual com velocidade positiva |
| Collision squash | PASS | Pose hit e deformação no Game Over |
| Collision shake | FAIL | Não há translação oscilatória equivalente |
| Score/celebration da personagem | PARTIAL | Estado celebrate existe, mas incremento não aciona bounce da personagem |
| Press de botão | PASS | Scale .96 e retorno |
| Logo entrance / stagger | PASS | Entrada e delays observados no Web |
| Cards | PARTIAL | Game Over anima; cards comuns são estáticos |
| Score HUD pulse | PASS | Trigger por mudança de score e render dirigido |
| Petals | PASS | Seis partículas com loops e limite fixo |
| Parallax | FAIL | Camadas são estáticas; polish opcional, não blocker |
| Transição de background | PARTIAL | Paleta muda; sem continuidade rica de cenários |
| Reduced motion | NOT EXECUTED | Não há implementação específica; melhoria opcional conforme escopo do DS |
| Áudio/haptics físicos | NOT EXECUTED | Haptics declarados/protegidos; sem dispositivo para sentir feedback |

## SDK 54 Review

Prioridade respeitada: instalação e runtime SDK54 foram feitos antes de aceitar qualquer evidência SDK58. Logs do baseline: `sdk54-versions.txt`, `sdk54-tests.log`, `sdk54-check.log`, `sdk54-doctor.log` e exports Web/Android/iOS.

Seis testes anteriores PASS, install check PASS e Doctor 18/18 PASS coexistiam com input FAIL. Isso falsifica a inferência de que testes verdes aprovavam gameplay. Web real foi executado; bundles Android/iOS foram exportados com sucesso. **Bundle nativo não é execução nativa.**

Após a correção, os mesmos arquivos de produto foram aplicados à cópia SDK54, conservando seu app.json e dependências específicos. Foram acrescentados apenas landscape e requireFullScreen à configuração dessa cópia. Não se copiou o plugin de status bar específico da configuração SDK58: uma tentativa inicial produziu erro de configuração, foi descartada e o servidor SDK54 foi reiniciado com a configuração correta. Os primeiros resultados do servidor antigo não foram usados para aprovar a correção.

Sete testes unitários PASS. Reteste Web SDK54: 568×320, 844×390, 1366×768; campo com dimensões exatas; tap touch de 10 ms; impulso; queda; Game Over; replay; resize para 960×420; atalhos inativos na Home; aviso em retrato; Instructions/Credits com scroll. Evidência final em [landscape-results.json](audit-evidence/landscape-results.json).

O branch `main` não recebeu commit de correção. Portanto, o gate de entrega do artefato público permanece **FAIL**, mesmo com reteste positivo da cópia local corrigida.

## SDK 57 Review

Manifesto e lock próprios confirmados; diff contra main altera app.json/package.json/lock, sem diferença em App/src no baseline. Instalação resolve Expo57.0.31, React19.2.3 e RN0.86.3. Seis testes PASS; check PASS; Doctor21/21 PASS.

Export Web: **FAIL**, `Unable to resolve module react-native-web/dist/exports/AppRegistry`. A linha oferece script web, mas não declara react-native-web/react-dom/metro-runtime como a linha SDK54. Isso não prova falha no runtime nativo. Android/iOS SDK57: NOT EXECUTED. Não se adicionaram dependências nessa linha durante a correção de paisagem.

A correção ainda precisa ser transportada para a branch SDK57 com sua configuração própria; equivalência funcional corrigida dessa linha não foi declarada PASS.

## Snack Review

Projeto real: [Cherry Bloom — Snack SDK54](https://snack.expo.dev/7kDnJz_p3s3TVT4VDIrPE).

PASS para abertura pública sem login em contexto novo, bundle/render Web e navegação das quatro rotas. PASS para Game Over e replay depois de pressão longa. **FAIL para clique rápido**. Score/collision/replay completos por toque normal: PARTIAL; não houve partida longa no Snack. Android/iOS dentro do Snack: NOT EXECUTED.

A árvore de projeto exposta no editor contém App, package e src; os desenhos vistos são programáticos. Não se confirmou paridade byte a byte com o commit main. Requisições do Snack resolveram Navigation7.1.8/native-stack7.3.10, diferentes das versões atuais do manifesto main. Isso reforça que testes locais não substituem o gate público.

Correção horizontal publicada no Snack: **NOT EXECUTED**. O projeto remoto não foi editado. A classificação da publicação atual continua FAIL. O Snack precisará ser reimportado/atualizado e testado em paisagem; app.json local sozinho não comprova orientação do cliente Snack.

## Performance Review

PARTIAL. Pool de três obstáculos e seis partículas é limitado. Gameplay usa refs e helpers curtos, sem engine/pacotes gráficos pesados. Assets ricos não são decodificados no jogo atual.

Porém, `setRenderTick` renderiza Tela3 e descendentes a cada frame; `createInitialObstacles(...)` também é avaliado como argumento de useRef em cada render, embora o valor inicial seja descartado depois. O DS pede evitar render da árvore inteira por frame. Isso é dívida técnica comprovada, não benchmark de travamento. O Web usa fallback JS para Animated; não se afirmou 60 FPS, estabilidade de memória, temperatura ou autonomia no aparelho.

Loops decorativos de telas conservadas no stack não usam foco como condição. Medição de heap/CPU sustentada, release build físico e jogo prolongado: NOT EXECUTED. Recomenda-se isolar a atualização visual do campo antes de adicionar mais decoração; não criar arquitetura empresarial.

## Dependency Review

| Grupo | Necessidade e compatibilidade |
|---|---|
| Expo / React / RN | Necessários; versões verificadas por linha, sem upgrade implícito |
| React Navigation / native-stack | Obrigatórios pelo enunciado; rotas executadas no SDK54 Web e Snack |
| screens / safe-area-context | Companheiros nativos; check/Doctor passaram, safe area física não executada |
| react-native-svg | Necessário à arte atual; já instalado, sem transformer adicional |
| expo-linear-gradient | Usado nos fundos; aprovado no plano |
| AsyncStorage | Best score opcional; armazenamento local não sensível |
| expo-haptics | Enhancement protegido; não substitui validação física/Snack nativo |
| expo-status-bar | Usado no App; respeitar diferenças de configuração entre SDK54 e SDK58 |
| react-dom / react-native-web / metro-runtime | Necessários à superfície Web; ausentes na linha SDK57 |
| expo-constants SDK57 | Declarado sem consumidor de produto localizado; cleanup opcional após gates |
| Skia / matter-js / game-engine / gesture-handler | Não foram adicionados; não são necessários à física/AABB/input atual |

Metadados npm consultados indicam atividade recente de Expo, React Navigation e react-native-svg; isso não autoriza atualizar tudo. SDK54: audit registrou 7 entradas, 6 high/1 moderate; SDK57: 5 high. Cadeias incluem node-forge, PostCSS, image-size e ferramentas Expo. Não foram demonstrados exploits no jogo nem equivalência entre advisory do build e vulnerabilidade de runtime. Triagem deve manter a matriz Expo e separar tooling de código embarcado. Não foi executado `npm audit fix`, especialmente `--force`.

## Acceptance Criteria Matrix

Estado abaixo refere-se à autoridade **SDK54 baseline/main/Snack**, com reteste local indicado quando existe. PASS Web não significa PASS Android/iOS. Todos os 53 IDs da seção 12 da especificação foram incluídos.

| ID | Critério | Estado | Evidência | Finding |
|---|---|---|---|---|
| AC-001 | Entrega usa SDK54 | PASS | main manifest/lock + npm list54.0.38 + Snack v54 | — |
| AC-002 | Projeto RN executa | PARTIAL | Web executado; nativo físico não executado | — |
| AC-003 | Importa/executa Snack | PASS | Projeto público e Web Preview reais, sem login | — |
| AC-004 | React Navigation usado | PASS | App + quatro rotas no Web/Snack | REV-005 lifecycle separado |
| AC-005 | tela1 existe e renderiza | PASS | Arquivo e Welcome local/Snack | REV-003/004 |
| AC-006 | tela2 existe e renderiza | PASS | Arquivo e Instructions local/Snack | REV-003 |
| AC-007 | tela3 existe e renderiza | PASS | Game renderizado; não implica gameplay aprovado | REV-001/002 |
| AC-008 | tela4 existe e renderiza | PASS | Credits local/Snack | — |
| AC-009 | Nome do aluno | PASS | Wellington Siqueira Porto em DOM e screenshot | — |
| AC-010 | FATEC nos créditos | PASS | FATEC Itaquera visível | — |
| AC-011 | Curso DSM | PASS | Texto completo no runtime | — |
| AC-012 | Aviso exato | PASS | Comparação literal e screenshot | — |
| AC-013 | Identidade diferente do Flappy clássico | PASS | Cereja e troncos floridos; não usa bird/pipes verdes | REV-004 fidelidade parcial |
| AC-014 | Sem clipping/overflow | PARTIAL | Web estreito e paisagem revistos; nativo não executado | REV-013 corrigido local |
| AC-101 | Entra READY | PASS | Runtime local/Snack | — |
| AC-102 | Primeiro input inicia | FAIL | Tap10ms não inicia no público; PASS local corrigido | REV-001 |
| AC-103 | Tap aplica impulso imediato | FAIL | Baseline velocity0; PASS local corrigido | REV-001 |
| AC-104 | Gravidade puxa personagem | PASS | Após input longo, queda natural; reteste horizontal | REV-002 não é falha universal de gravidade |
| AC-105 | Obstáculos movem | PASS | Refs/transform em partida Web instrumentada | — |
| AC-106 | Obstáculos reciclam | PASS | Helper + partida instrumentada antes da correção | — |
| AC-107 | Gaps variam em limites válidos | PASS | Geração repetida + novo teste de alturas curtas | — |
| AC-108 | Colisão galho superior | PASS | Helper + estado dirigido de componente Web | — |
| AC-109 | Colisão galho inferior | PASS | Helper + estado dirigido de componente Web | — |
| AC-110 | Colisão chão | PASS | Colisão natural Web/Preview + helpers | — |
| AC-111 | Colisão gera GAME_OVER | PASS | Natural e dirigido | — |
| AC-112 | Score uma vez por par | PASS | Teste dirigido 0→1→1; helper | — |
| AC-113 | Não pontua em colisão anterior à passagem | PARTIAL | Ordem do loop e helpers; cenário integrado completo não repetido após mudança | — |
| AC-114 | Replay reseta jogador/score/obstáculos | PASS | Cinco ciclos baseline + seis configurações horizontais | — |
| AC-115 | Sair de Game interrompe loops/timers ativos | FAIL | Home cancela, Espaço reativa oculto; PASS local corrigido | REV-005 |
| AC-116 | Jogável após cinco restarts | PARTIAL | Cinco ciclos com pressão longa; tap normal público falha | REV-001 |
| AC-201 | Personagem legível no tamanho de jogo | PASS | Screenshot48dp e silhueta clara | REV-004 não equivale a fidelidade integral |
| AC-202 | Corredor óbvio | PASS | Bordas dos troncos legíveis; ornamentos contidos | — |
| AC-203 | Score legível em todas as fases | PASS | Quatro renders injetados e screenshots | Não comprova progressão longa |
| AC-204 | Ações Welcome alcançáveis | PASS | Três ações executadas; paisagem568 também | — |
| AC-205 | Instruções compreensíveis rapidamente | PARTIAL | Três regras claras; sem estudo de usuário/cronômetro | REV-003 |
| AC-206 | Créditos legíveis em tela pequena | PASS | Scroll320 e reteste horizontal | — |
| AC-207 | Safe area respeitada | NOT EXECUTED | Sem iOS/Android físico/simulador conectado | — |
| AC-208 | Layout estreito sem clipping horizontal | PASS | Web320 sem overflow no baseline; após correção retrato mostra aviso e568×320 é suportado | REV-013 atualização do contrato |
| AC-209 | Motion não altera verdade da colisão | PARTIAL | Helpers independentes/transform visual; percepção e driver nativo não executados | — |
| AC-301 | Doctor SDK54 aceitável | PASS | Baseline18/18; log de reteste separado | — |
| AC-302 | Expo install check | PASS | Baseline e reteste local | — |
| AC-303 | Sem audit fix force automático | PASS | Processo desta revisão; não afirma histórico externo completo | — |
| AC-304 | Dependências intencionais/mínimas | PARTIAL | Stack aprovada; optional constants órfão na linha57 e advisories | REV-011 |
| AC-305 | SDK57 tem manifest/lock próprios | PASS | Git diff e instalação isolada | — |
| AC-306 | SDK57 não muda grafo da entrega | PASS | main e57 separados; nenhuma troca de SDK no checkout | — |
| AC-401 | Projeto real criado/importado no Snack | PASS | Link público real; não criado nesta auditoria | — |
| AC-402 | Bundle Snack funciona | PASS | Preview Web abriu quatro telas | — |
| AC-403 | Quatro rotas operam no Snack | PASS | Navegação executada em contexto anônimo | — |
| AC-404 | Loop opera no Snack | PARTIAL | Opera com pressão longa; tap rápido falha | REV-001/002 |
| AC-405 | Score/collision/replay no Snack | PARTIAL | Ground/Game Over/replay executados; score em partida longa não executado | REV-001 |
| AC-406 | Assets locais carregam no Snack | PARTIAL | Arte programática renderiza; raster/audio não usados/carregados | REV-004/007 |
| AC-407 | Link público em outra sessão | PASS | Contexto novo, sem login | — |
| AC-408 | Link entregue corresponde ao SDK54 | PARTIAL | Link README é SDK54; envio Teams e versão horizontal atualizada não verificados | REV-013 |

### Gates G0–G11 e Definition of Done

| Gate | Estado | Limite |
|---|---|---|
| G0 Enunciado | PASS | PDF e ambiguidades confrontados com especificação |
| G1 Baseline54 | PASS | Instalação/check/Doctor |
| G2 Navegação | PASS | Quatro telas no Web/Snack |
| G3 Física | PARTIAL | Core opera; input público falha |
| G4 Obstáculos/collision | PARTIAL | Web/dirigidos; físico não executado |
| G5 Score/restart | PARTIAL | Local/instrumentado; Snack score incompleto |
| G6 Skin | PARTIAL | Tokens/silhueta, fidelidade visual incompleta |
| G7 Visual QA | PARTIAL | Browser e paisagem testados; safe area física pendente |
| G8 Polish | PARTIAL | Motion parcial, áudio/haptics não executados |
| G9 Revisão independente | PASS | Esta revisão falsificou PASS anteriores; não usa relatório do executor como prova |
| G10 Snack | FAIL | Input curto falha; paisagem corrigida não publicada |
| G11 Freeze | FAIL | Definition of Done ainda não satisfeita |

## Planned vs Implemented Matrix

| Área | Planejado | Implementado | Estado | Finding |
|---|---|---|---|---|
| Branding | Cherry Bloom / Cherry | Marca certa; personagem com nome antigo | FAIL | REV-003 |
| Personagem | Cereja legível, estados, gloss | SVG simples e expressões básicas | PARTIAL | REV-002/004/008 |
| Home | Logo/personagem/3 ações | Presente; paisagem agora em duas colunas | PARTIAL | REV-003/004/013 |
| Instructions | Tap/galhos/score | Conteúdo presente com nome incorreto | PARTIAL | REV-003 |
| Gameplay | Partida completa por tap | Input público falha; local horizontal revalidado | FAIL | REV-001/002 |
| Credits | Identificação + aviso exato | Conteúdo correto e scroll | PASS | — |
| Navigation | Quatro arquivos/rotas; sem loop oculto | Rotas funcionam; foco corrigido local | PARTIAL | REV-005 |
| Physics | Impulso/gravidade/dt/área real | Integração funciona; área corrigida local | PARTIAL | REV-006/013 |
| Input | Tap imediato | Delay50ms no baseline; zero no local corrigido | FAIL | REV-001 |
| Collision | AABB coerente com galhos/chão | Helpers e runtime dirigido funcionam | PASS | — |
| Score | +1 único por passagem | Flag scored e ordem collision-first | PASS | Escopo de evidência local |
| Backgrounds | Atmosfera blossom com profundidade | Gradiente, polígonos/copas simples | PARTIAL | REV-004 |
| Phases | 0/10/20/30 | Thresholds/renders presentes | PARTIAL | Progressão longa não executada |
| Obstacles | Galhos orgânicos/floridos | Troncos com tampas/ornamentos | PARTIAL | REV-004 |
| Motion | Bob/jump/fall/collision/score/petals | Parte implementada; parallax/shake ausentes | PARTIAL | REV-008 |
| Assets | Manifesto fiel, arquivos adequados | Caminhos divergentes; sheets ausentes | FAIL | REV-007 |
| SDK54 | Autoridade funcional e Snack | Baseline técnica passa; público não aprovado | FAIL | REV-001/013 |
| SDK57 | Mirror equivalente e isolado | Isolado; script Web falha | PARTIAL | REV-010 |
| Snack | Público jogável SDK54 | Abre; input curto quebra; horizontal desatualizado | FAIL | REV-001/013 |
| Orientação | Horizontal, conforme instrução atual | Local Expo/PWA/Web corrigido; remoto antigo | PARTIAL | REV-013 |

## Findings

### REV-001 — Tap rápido descartado

- Severidade: **BLOCKER**. Categoria: **BUG CONFIRMADO**.
- Arquivo: `src/tela3.js`, Pressable/onPressIn; dependência PressResponder instalada.
- Sintoma: toque/clique curto chega ao campo e nada inicia.
- Esperado: primeiro input inicia e aplica impulso imediatamente.
- Reprodução: abrir Game; tocar por10ms; observar TAP TO FLY, velocity0, y constante e RAFnull. Reproduzido local SDK54 e Snack público.
- Evidência: browser-results.json, input-duration-results.txt, snack-results.json e screenshot snack-quick-click-fails.png.
- Causa-raiz: atraso padrão50ms do responder Web e ausência de onPress para ativação no release precoce.
- Correção recomendada/aplicada localmente: `delayPressIn={0}` no campo; evitar duplicar salto com onPress+onPressIn sem deduplicação.
- Risco: baixo. Revalidação: tap touch10ms, um impulso por contato, READY→PLAYING e y diminuindo.
- Status: **PASS no reteste local SDK54/58; FAIL no Snack anterior**. Nativo: NOT EXECUTED.

### REV-002 — Cherry permanece parada após tap

- Severidade: **BLOCKER**. Categoria: **BUG CONFIRMADO**.
- Arquivo: `src/tela3.js`, handleFieldPress/applyJump/startGameLoop/stepFrame/renderização.
- Sintoma/esperado: posição estática após tap; deveria receber impulso, integrar e renderizar movimento.
- Reprodução: mesma entrada curta de REV-001, mas observar separadamente velocity, y, agendamento e transform.
- Evidência: pressão longa muda velocity e y; queda natural muda transform e chega a Game Over. Partida instrumentada move obstáculos e pontua.
- Causa-raiz confirmada neste cenário: applyJump/startGameLoop não são chamados porque input não ativa. Não foi demonstrado segundo bug universal no integrador. Resize é um defeito independente, REV-006.
- Correção: eliminar perda de input; não reescrever física sem evidência.
- Risco: baixo. Revalidação: observar ref e pixels após input curto, salto e queda.
- Status: **PASS local após correção do input; FAIL público com toque curto**.

### REV-003 — Nome da personagem diverge da identidade oficial

- Severidade: **MAJOR**. Categoria: **DIVERGÊNCIA DE ESPECIFICAÇÃO**.
- Arquivos: `src/tela1.js:133`, `src/tela2.js:69`, label do Game, `public/manifest.json:4`, README, referências e nomes de crops.
- Sintoma: grafia antiga é visível e anunciada por acessibilidade.
- Esperado: Cherry em todo conteúdo de produto/conceitual atual.
- Reprodução/evidência: abrir Home/Instructions; buscar globalmente Cherri/CHERRI/cherri. naming-and-assets.txt.
- Causa-raiz: handoff histórico usa a grafia antiga e implementação a propagou; não existe identidade central atualizada para esses textos.
- Correção: atualizar UI/labels/manifesto/README e anotar atualização das referências. Renomear arquivos técnicos somente com consumidores verificados; não fazer substituição cega.
- Risco: baixo para strings, médio para renomear paths/imports.
- Revalidação: busca global + quatro telas + accessibility tree + manifesto; exceções históricas claramente identificadas.
- Status: **FAIL**, não incluído na correção específica de orientação.

### REV-004 — Fidelidade visual inferior ao material produzido

- Severidade: **MAJOR**. Categoria: **DIVERGÊNCIA VISUAL**.
- Arquivos: CherryPlayer, PhaseBackground, BloomBranchPair, LogoLockup; raster em assets.
- Sintoma: personagem flat, montanhas poligonais/copas circulares, galhos com aparência de tubos marrons; ícones PWA usam outra renderização da personagem.
- Esperado: linguagem Cherry/Sakura com consistência entre ilustração, marca, cenários e obstáculos; respeitar legibilidade e Snack.
- Reprodução: comparar assets-contact-sheet/characters-alpha/vector-and-icons com screenshots de runtime e fases.
- Causa-raiz: reconstrução simplificada preservou tokens/silhueta, mas não volume, acabamento, composição e profundidade das referências. O DS autoriza SVG/Views: arquivo PNG ignorado, isoladamente, não é violação.
- Correção: adaptar arte aprovada à paisagem, manter anchors/hitboxes e limite de peso; melhorar SVG onde necessário. Não esticar JPGvertical nem importar concept board como UI.
- Risco: médio. Revalidar lado a lado quatro fases, personagem48dp, obstáculos, Home/Game Over e fluidez SDK54.
- Status: **PARTIAL na aderência estrutural; FAIL na fidelidade integral**.

### REV-005 — Atalho na Home reativa Game oculto

- Severidade: **MAJOR**. Categoria: **BUG CONFIRMADO**.
- Arquivo: `src/tela3.js`, efeito window.keydown, originalmente linha450; navigate Welcome linha385.
- Sintoma: estando na Home, Espaço altera Game oculto para PLAYING e cria RAF.
- Esperado: comandos de Game só operam quando Game está focado.
- Reprodução: iniciar, Home, Espaço. Baseline: RAFnull→RAFativo e y356→304.747; UI visível permanece Home.
- Causa-raiz: stack conserva instância e listener global só sai no unmount; blur cancela o frame mas mantém listener.
- Correção aplicada: condição `navigation.isFocused()` antes de processar teclado.
- Risco: baixo. Revalidar Space/W/Up/R/Enter/H/Escape na tela apropriada e inatividade fora dela.
- Status: **PASS local SDK54/58 para Home+Espaço**; todos os atalhos/plataformas remotos: PARTIAL.

### REV-006 — Resize congela PLAYING sem RAF

- Severidade: **MAJOR**. Categoria: **BUG CONFIRMADO**.
- Arquivo: `src/tela3.js`, dimensões, handleRestart e efeito de navegação/cleanup.
- Sintoma: estado permanece PLAYING, mas frames cessam.
- Esperado: reset/continuidade explícitos ao mudar limites.
- Reprodução: teste controlado sem obstáculos para isolar colisão; redimensionar390×844→320×568. Baseline: y318.416825, velocity-266.52 e RAFnull ficam constantes.
- Causa-raiz: handleRestart depende de dimensões; mudança recria efeito de navegação, cujo cleanup cancela RAF. Nova execução do efeito só registra listeners, não reinicia/resetta partida já focada.
- Correção aplicada: reset explícito quando limites mudam; medir campo por onLayout.
- Risco: médio: mudança de tamanho passa a reiniciar rodada, decisão documentada.
- Revalidação: resize horizontal844×390→960×420 resulta READY/RAFnull e novo input volta a PLAYING; sem congelamento silencioso.
- Status: **PASS local SDK54/58**.

### REV-007 — Manifesto não corresponde ao pacote de assets

- Severidade: **MINOR**. Categoria: **DIVERGÊNCIA DE ESPECIFICAÇÃO**.
- Arquivo: docs/ASSET_MANIFEST.md e referências generated nos MDs.
- Evidência/causa: diretórios reais foram reorganizados sem atualizar o handoff; concept board, sprite sheet e phase sheet não existem.
- Correção: mapear paths reais, recuperar referências faltantes se disponíveis e declarar equivalentes programáticos. Não fabricar boards ausentes como se fossem originais.
- Revalidação: cada caminho documentado resolve ou está explicitamente marcado como referência ausente.
- Status: **FAIL**.

### REV-008 — Motion obrigatório/planejado parcialmente realizado

- Severidade: **MINOR**. Categoria: **DIVERGÊNCIA VISUAL**.
- Arquivos: tela3.js, ScoreHUD.js, PhaseBackground.js.
- Evidência/causa: score aciona HUD mas não bounce da personagem; collision tem squash sem shake; camadas do cenário não deslocam.
- Correção: implementar feedback de personagem sem alterar posição física; parallax permanece polish opcional e deve esperar o core.
- Revalidação: captura temporal por evento, coerência de hitbox e desempenho.
- Status: **PARTIAL**.

### REV-009 — Árvore de gameplay renderiza por frame

- Severidade: **MINOR**. Categoria: **DÍVIDA TÉCNICA**.
- Arquivo: tela3.js, renderTick e chamada de createInitialObstacles no argumento de useRef.
- Evidência/causa: todo frame faz setRenderTick, tornando refs insuficientes para isolar render; não há memoização dos componentes quentes. Contraria orçamento do DS.
- Correção: separar atualização visual frequente da árvore decorativa e inicialização descartável; escolher menor alteração medida, sem engine.
- Revalidação: profiling em aparelho modesto, contagem de commits, frame time e partida sustentada.
- Status: **PARTIAL**; gargalo estrutural confirmado, degradação física NOT EXECUTED.

### REV-010 — Linha SDK57 oferece Web sem dependências Web

- Severidade: **MAJOR**. Categoria: **BUG CONFIRMADO**.
- Arquivo: package.json/lock da branch sdk-57-local.
- Sintoma: expo export --platform web não resolve AppRegistry do react-native-web.
- Esperado: script web executável ou limitação explicitamente documentada.
- Reprodução: instalar lock57 isolado e exportar Web. sdk57-web.log contém stack.
- Causa-raiz: sincronização de fontes/controles Web não levou suas dependências e build script para a linha57.
- Correção: declarar companheiros Web compatíveis com SDK57 e validar nessa linha, sem tocar a baseline54; alternativamente remover alegação/script não suportado se escopo57 for explicitamente só nativo.
- Risco: médio. Revalidar check/Doctor/build/runtime57, sem usar sucesso54 como substituto.
- Status: **FAIL Web; nativo NOT EXECUTED**.

### REV-011 — Advisories precisam de triagem por cadeia

- Severidade: **MINOR**. Categoria: **RISCO**.
- Arquivo: lockfiles54/57 e npm audit JSON.
- Evidência: SDK54 7 entradas, SDK57 5; cadeia de tooling/transitivas, sem exploração demonstrada.
- Causa-raiz: resoluções transitivas com advisories publicados; não se assume que tudo esteja embarcado no cliente ou que Expo Doctor faça auditoria de segurança.
- Correção: avaliar alcance e patches compatíveis por SDK, sem force/migração ampla.
- Revalidação: audit atualizado e build/runtime por linha, com justificativa do risco residual.
- Status: **PARTIAL**.

### REV-012 — Contraste insuficiente nos botões primários

- Severidade: **MINOR**. Categoria: **BUG CONFIRMADO** de acessibilidade.
- Arquivos: CherryButton.js, theme.js.
- Evidência: cream#FFF8F2 sobre cherry#E63750 =3.971:1; texto16px, mesmo bold, abaixo do tamanho de texto grande. Requisito de contraste normal4.5:1 da WCAG referenciada acima.
- Causa-raiz: combinação de tokens escolhida sem validação do tamanho real do texto.
- Correção: usar combinação aprovada de maior contraste, preservando marca; cherry700 sobre cream foi medido em7.028:1. Não redesenhar toda a paleta.
- Revalidação: foreground/background computados, variantes pressed/disabled e inspeção visual.
- Status: **FAIL**. Foco do modal/leitor de tela requer validação adicional; warnings aria-hidden observados não foram promovidos a auditoria completa de acessibilidade.

### REV-013 — Produto vertical contraria a orientação solicitada

- Severidade: **MAJOR**. Categoria: **DIVERGÊNCIA DE ESPECIFICAÇÃO** após instrução explícita durante a revisão.
- Arquivos: App.js, app.json, manifesto PWA, tela1/tela3, GameOverCard e geração de gaps.
- Sintoma: configuration portrait, gabinete460px e altura mínima580px; landscape de celular mantém composição vertical recortada.
- Esperado: partida horizontal, UI e física compatíveis com área baixa/larga.
- Reprodução: viewport568×320 no baseline; Home/botões extrapolam altura e campo mantém gabinete vertical.
- Causa-raiz: arquitetura visual e dimensões assumiam retrato; mudar somente orientation não corrigiria campo, gaps e Game Over.
- Correção aplicada: landscape em Expo/PWA; sem gabinete; Home em duas colunas; campo medido; gaps adaptativos; Game Over compacto/scroll fallback; aviso de rotação Web; reset ao resize. Cache PWA versionado para distribuir manifesto novo quando publicado.
- Risco: médio: referências raster verticais precisam adaptação futura, e aparelhos devem confirmar lock/safe area.
- Revalidação: seis combinações SDK54/58×viewport, input10ms, Game Over/replay, retrato com aviso e retomada em landscape.
- Status: **PASS local Web SDK54/58; nativo, SDK57 corrigido e publicação Snack NOT EXECUTED**.

## Correction Plan

| Prioridade | Correção | Situação / prova necessária |
|---|---|---|
| P0 | Input imediato e movimento | PASS local. Atualizar artefato de entrega/retetar Snack; manter regressão de tap curto |
| P0 | Loop após resize / foco | PASS local. Repetir em aparelhos e navegação/back nativos |
| P0 | Collision/score/restart completos | SDK54 horizontal chegou a30 com touch real, quatro fases e cinco restarts consecutivos. Repetir no Snack atualizado e em aparelho |
| P1 | Horizontal na entrega54 | Código local e cópia54 validados. Transportar alteração para branch de entrega com config54 própria |
| P1 | Snack | Atualizar projeto público somente em fluxo de publicação autorizado; testar landscape, controles e link em outra sessão |
| P1 | Native QA / safe areas | Android/iOS e/ou simulador real, incluindo botões e orientação iPad |
| P1 | SDK57 Web | Resolver escopo/dependências próprios; sem contaminar54 |
| P2 | Nome oficial Cherry | Atualizar strings e documentação atual; preservar rastreabilidade histórica dos assets |
| P2 | Arte e manifesto | Recuperar referências, adaptar composição à paisagem e comparar lado a lado |
| P2 | Contraste / motion | Corrigir CTA, feedback da personagem e foco; retestar sem piorar gameplay |
| P3 | Performance medida / partículas / áudio | Medir antes de adicionar decoração; haptics/som somente após core e Snack |

### Alterações e reteste autorizados durante esta auditoria

Fluxo registrado: **FAIL → FIX → RETEST → PASS local** para input curto, imobilidade consequente, listener na Home, resize e orientação. Não se usa PASS local para encerrar a publicação anterior.

Arquivos alterados: App, configuração Expo/PWA/cache, tela1/tela3, GameOverCard, geração de gaps, um teste unitário e notas de orientação no README/Design System/Specification. Nenhuma dependência nova. Fontes de arte não foram redesenhadas. Patch local: [LANDSCAPE_FIX.patch](audit-evidence/LANDSCAPE_FIX.patch).

Harness de reteste: [landscape-audit.cjs](audit-evidence/landscape-audit.cjs). Testa SDK54 e SDK58 em568×320,844×390,1366×768, além de resize960×420 e retrato390×844. Evidência estruturada em landscape-results.json e screenshots com prefixo landscape. Doctor/check/build posteriores possuem logs separados dos anteriores.

## Final Verdict

**A orientação horizontal está corrigida e funcional no Web local testado, em SDK54 e SDK58.** Configuração nativa solicita paisagem, mas não há comprovação em dispositivo. Não houve atualização da branch SDK54 por commit nem do Snack público.

O produto ainda tem identidade/nome divergente, fidelidade visual incompleta, motion parcial, dívida de render e contraste insuficiente. A publicação Snack retém o bug de input. Portanto:

```text
LOCAL LANDSCAPE WEB: PASS
DELIVERY GATE: FAIL
FINAL AUDIT: FAIL
READY FOR DELIVERY: NO
```

Não foram executados deploy, instalação PWA real, teste físico Android/iOS, submissão Teams, partida manual prolongada nem atualização remota. A avaliação de referência visual é limitada pelos boards/sheets originais ausentes; esses limites não foram transformados em bugs inventados.
