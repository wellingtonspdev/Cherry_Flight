# Cherry Bloom — Baseline anterior à correção de orientação

Data: 26/10/2026. Fonte de entrega: main 5cce0b124ad22f73e6aab8b67a804d29a08c328e. Checkout inicial: sdk-58-local 057128577b637ebb812e5d21436b5c1c2dbb3f99, Git limpo.

STATUS: NÃO APROVADO. FINAL AUDIT: FAIL. READY FOR DELIVERY: NO.

Nenhum código de produto havia sido alterado nesta auditoria. Em seguida, o usuário autorizou expressamente corrigir a orientação: o jogo deve funcionar na horizontal, não na vertical. Essa autorização não é tratada como autorização genérica para corrigir todos os findings.

## Evidência já coletada

- SDK54: Expo 54.0.38, React 19.1.0, RN 0.81.5; seis testes unitários; install --check; Doctor 18/18; export Web, Android e iOS. Export não comprova execução nativa.
- SDK57: Expo 57.0.31, React 19.2.3, RN 0.86.3; seis testes; check; Doctor 21/21. Export Web falha por ausência de react-native-web.
- Snack público SDK54 abriu sem login em contexto isolado. Quatro rotas, Game Over e replay executados. Clique de 10 ms mantém READY; pressão de 100 ms inicia voo. Ver snack-results.json.
- Toque real do protocolo de entrada Chromium, com viewport touch emulado: 10 ms mantém READY, velocity=0, raf=null; 100 ms inicia PLAYING e desloca y de 356 para 319.29. Ver browser-results.json.
- Causa do input Web: tela3.js usa apenas onPressIn. react-native-web PressResponder tem atraso padrão de 50 ms; release precoce só força activate quando onPress existe. Nenhum overlay interceptou o evento.
- Movimento tem comprovação independente: pressão longa/teclado integram gravidade, posição e obstáculos. Imobilidade no tap curto decorre do input, não de um loop universalmente inoperante.
- Cinco ciclos de replay, pressão longa e colisão natural com chão funcionaram no navegador. Colisões topo/baixo/galhos e score único foram exercitados também por estado controlado; não representam jogo manual nem dispositivo físico.
- Sair para Home cancela RAF. Pressionar Espaço na Home reinicia Game oculto: listener global sem condição de foco.
- Resize controlado de 390x844 para 320x568 mantém PLAYING, cancela RAF e congela y=318.416825. Dependências do efeito de navegação mudam com dimensões; cleanup cancela loop sem reset/restart.
- Cherri aparece na Home, Instructions, label do Game, README e manifesto PWA. Nome oficial definido pelo usuário: Cherry.
- Assets raster e SVG inspecionados visualmente; personagens/fundos ricos foram substituídos por primitivas. Essa alternativa é permitida pelo design system, mas a fidelidade ao material produzido é inferior. Concept board, sprite sheet e phase sheet citados no manifesto não existem no checkout.
- Fases 0,10,20,30 renderizadas com score injetado, não atingido em partida real. Screenshots em phases-contact-sheet.jpg.
- Créditos exatos e scroll em 320x568 comprovados. Não houve overflow horizontal nas instruções/créditos. Safe area nativa não executada; adb sem dispositivos.
- npm audit SDK54: 7 vulnerabilidades (6 high, 1 moderate), SDK57: 5 high. Não foi executado audit fix.
- Contraste do texto cream #FFF8F2 sobre CTA cherry #E63750: 3.971:1; texto de 16px não atinge 4.5:1.
- Orçamento de performance violado estruturalmente: setRenderTick em todo frame renderiza Tela3 e descendentes; profiling físico não executado.
- Motion parcial: bob/jump/fall/collision e HUD pulse existem; score bounce da personagem, collision shake e parallax não estão completos.

## Baseline de orientação

app.json: orientation=portrait. App.js limita Web amplo a gabinete de 460px de largura. Tela3 limita game amplo a 460px e altura mínima 580px. manifest.json: orientation=portrait. Telas de menu usam coluna com dimensões da janela inteira. A solicitação atual substitui esse contrato vertical por horizontal.

O relatório final deve distinguir esse baseline das alterações e retestes de paisagem. Os dois harnesses nesta pasta confirmam defeitos esperados; sua execução bem-sucedida não significa aprovação do produto.
