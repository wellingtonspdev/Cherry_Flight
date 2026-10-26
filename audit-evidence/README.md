# Evidências de revisão e correção horizontal

As fontes originais foram preservadas em sdk54-source.zip e sdk57-source.zip. As cópias extraídas, seus node_modules e builds são material temporário local: não adicionar esta pasta inteira ao Git.

## Baseline anterior à correção

- PRE_CORRECTION_BASELINE.md: estado observado antes de alterar produto.
- browser-results.json / browser-run.log: reprodução de input curto, física com input longo, cinco restarts, resize congelado e teclado na Home.
- input-duration-results.txt: 0/10/30ms descartados;70ms inicia.
- controlled-runtime-results.txt: colisões e score com estado dirigido, sem pretensão de input físico.
- natural-runtime-results.txt: partida instrumentada, callback de salto sem alterar score/posição, que chegou a3 pontos.
- snack-results.json / snack-run.log: projeto público SDK54, quatro rotas, clique curto descartado, pressão longa, Game Over/replay. Nenhum Save remoto.
- browser-audit.cjs e snack-audit.cjs confirmam defeitos esperados. Exit0 desses harnesses não aprova o produto.

## Correção horizontal

- landscape-results.json / landscape-browser.log: seis cenários SDK54/58 em568×320,844×390,1366×768; resize960×420; portrait390×844; taps10ms, queda, Game Over e replay. Última execução sem harness-error, com campo reposicionado em x0/y0 após estabilização.
- landscape-playthrough.json / landscape-playthrough.log: SDK54 em844×390, input real via protocolo Chromium, sem mudar refs, score ou obstáculos. Score30, quatro fases e cinco restarts consecutivos. Não é dispositivo físico nem jogador humano.
- landscape-playthrough-attempt1.*: primeira estratégia do jogador automatizado perdeu com1 ponto; limiar de reação do teste foi antecipado. Nenhuma física de produto foi alterada para obter30 pontos.
- landscape-browser-layout-probe.log: amostragem anterior capturou deslocamento após replay. Verificação final aguarda campo estabilizado e exige x0/y0. Probe separado de quatro ciclos também retornou scrollX0, scale1 e nenhuma largura excedente.
- landscape-sdk54-tests.log e landscape-unit.log: sete testes unitários, incluindo bounds de gaps em alturas menores.
- landscape-sdk54-check.log / landscape-sdk54-doctor.log / landscape-sdk54-build.log: dependências atuais, Doctor18/18 e buildWeb.
- landscape-sdk58-check.log / landscape-sdk58-build.log: dependências atuais e buildWeb do checkout ativo.
- LANDSCAPE_FIX.patch: diff de produto/documentação, sem alteração de package.json/lock. Não foi aplicado por commit às outras branches.

Para repetir o reteste local, iniciar a cópia SDK54 corrigida na porta8099 e o checkout SDK58 na8098. Executar `node audit-evidence/landscape-audit.cjs` e `node audit-evidence/landscape-playthrough.cjs` na raiz. Os harnesses usam o Playwright e Chrome instalados no ambiente Windows auditado; os caminhos são específicos deste host e não adicionam dependências ao produto.

O servidor8094 foi usado para o baseline, não para aprovar a correção. A configuração de cada SDK foi preservada: copiar cegamente o app.json SDK58 para54 introduz plugin incompatível. O app.json da cópia54 contém sua configuração original mais landscape/requireFullScreen.

Screenshots com `phase-*-injected` são dirigidos; screenshots `landscape-natural-score-*` vêm da partida por input real. Não intercambiar esses dois tipos de prova.

## Limites

Sem aparelho Android/iOS conectado; sem publicação Snack/Vercel, commit, push ou merge. Bundles nativos anteriores não comprovam orientação/safe areas em aparelho. O Snack público continua anterior à correção.
