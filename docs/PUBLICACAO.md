# Publicação — Cherry Bloom / Cherry Flight

## Escopo autorizado

O usuário autorizou commit e push para GitHub, publicação do projeto completo no Snack `@wellingtonsp.de/cherry-flight` em Expo SDK54 e deploy pela CLI da Vercel. Configuração de domínio/subdomínio no Cloudflare será feita depois; nenhum DNS deve ser alterado nesta etapa.

## Autoridade de entrega

- GitHub: branch `main`, Expo SDK54, com manifesto e lock próprios.
- Snack: https://snack.expo.dev/@wellingtonsp.de/cherry-flight — Expo SDK54.
- SDK58: cópia local paralela, com dependências separadas.
- Arte e nome do produto: Cherry Bloom; personagem: Cherry.

O relatório de auditoria registra o baseline anterior às correções. As evidências históricas não devem ser reescritas para apagar falhas reproduzidas. Nome oficial, caminhos do manifesto e contraste do CTA foram corrigidos na preparação da publicação. A fidelidade à arte rica e o profiling em aparelho continuam sujeitos às limitações documentadas.

## Vercel

Projeto estático Expo Web. Build: `npm run build:web`. Saída: `dist`. A configuração inclui manifesto PWA em landscape, service worker versionado e fallback SPA. Não há backend ou segredo de runtime a configurar.

Projeto vinculado à conta `wellington-siqueira-portos-projects`, nome `cherry-flight`. URL pública de produção: https://cherry-flight.vercel.app.

## Domínio posterior

1. Escolher o subdomínio desejado.
2. Adicioná-lo ao projeto Vercel publicado.
3. Consultar os valores DNS específicos apresentados pela Vercel para esse projeto.
4. Criar somente o registro correspondente no Cloudflare, preservando os demais registros.
5. Verificar HTTPS, redirecionamento, PWA e gameplay na URL personalizada.

Não copiar um CNAME de outro projeto nem antecipar alteração no domínio principal. Esta publicação não depende de configurar o domínio agora.

## Evidência de publicação

| Gate | Estado | Evidência |
|---|---|---|
| GitHub | PASS | `main` publicada em SDK54; branch `sdk-58-local` preserva a linha moderna. Nenhum force push. |
| SDK54 | PASS | Expo54.0.38, React19.1.0, RN0.81.5; oito testes após adicionar a verificação do pacote importável, install check e Doctor18/18. |
| Snack solicitado | PASS | O mesmo alias `@wellingtonsp.de/cherry-flight` foi atualizado, sem criar fork; SDK54.0.0;67 arquivos,38 de código/documentação e29 assets. |
| Fontes do Snack | PASS | Os19 arquivos de runtime App/src coincidem com a cópia de entrega;29 assets respondem sem falha. |
| Runtime Snack Web | PASS | Quatro telas, créditos exatos, salto, gravidade, obstáculos/reciclagem,30 pontos, quatro fases, colisão/Game Over e cinco restarts consecutivos. |
| Vercel CLI | PASS | CLI65.2.0; deploy de produção Ready em `cherry-flight.vercel.app`. |
| Runtime Vercel | PASS | Mesma sequência funcional até30 pontos e cinco restarts; Home não reinicia jogo oculto ao pressionar Espaço. |
| PWA offline | PASS | Service worker ativado; reload e partida funcionaram com a rede do contexto de teste desligada. Instalação física em aparelho não executada. |
| Rotas/estáticos | PASS | `/`, `/index.html`, `/offline.html`, manifesto, SW, ícones e rota de fallback respondem200. Foi removido cleanUrls, que conflitava com o destino index.html do rewrite. |
| Nativo físico | NOT EXECUTED | Sem aparelho conectado. Expo e native-stack solicitam paisagem; propriedade native-stack é executada também dentro do Snack/Expo Go. |
| Domínio/Cloudflare | NOT EXECUTED | Adiado conforme solicitado; nenhum DNS foi alterado. |

Código de aplicação publicado na Vercel e usado no teste remoto: commit `6784ccdda31e0816f227e2c17f2c8629fd0e1f09`. Deployment: `dpl_5Z348nGgngfxk3YpnyBQDkPiRMhG`. Commits posteriores de relatório/evidência não alteram esse runtime.

O teste remoto começou partidas e restarts com eventos touch de10ms pelo protocolo Chromium. Para a partida automatizada prolongada, os taps seguintes foram TouchEvents DOM, executados no próprio navegador para evitar atraso do controlador externo. Nenhuma posição, velocidade, obstáculo ou pontuação foi escrita pelo teste. Isso prova o runtime Web, não um teste manual ou um aparelho físico.

Tentativas anteriores do jogador automatizado perderam ou excederam o orçamento de tempo antes de30 pontos. Esses resultados foram preservados em arquivos `published-runtime-first-run.json` e `published-runtime-before-inpage-controller.json`; não foram reclassificados como bugs de produto nem apagados. A execução final chegou a30 no primeiro attempt em cada serviço.

Evidências finais: `audit-evidence/published-runtime-results.json`, screenshots `published-snack-*`/`published-vercel-*`, `snack-source-verification.json` e logs de publicação. O Snack inclui o projeto de aplicação, assets e referências; o repositório GitHub também preserva lockfile e evidência de auditoria, que não são enviados como dependências ou builds temporários ao Snack/Vercel.

No editor do Snack, usar o botão de expandir a prévia Web para uma janela horizontal. A prévia estreita em retrato apresenta a instrução para girar o dispositivo; não é erro de bundle.

### Importação Git independente da publicação pela API

O erro `Failed to upload file asset` com validação `"$": Required` foi reproduzido no endpoint real do importador Git para a raiz da branch main. Ele acontece durante preparação/upload dos arquivos, antes de executar o App. A publicação direta pela API e esse importador são gates distintos.

O importador classifica como código apenas `.js`, `.jsx`, `.ts`, `.tsx`, `.json` e `.md`. Outros arquivos, incluindo arte, áudio, PDF, `.mjs`, `.cjs` e logs, passam pelo upload de assets. A raiz completa preserva esses materiais; não foram removidos para contornar o serviço.

Para importar o jogo, usar `https://github.com/wellingtonspdev/Cherry_Flight/tree/main/snack`. Essa pasta contém22 arquivos de texto reconhecidos pelo importador, gerados da entrega SDK54, sem alterar o runtime publicado. A validação local passou em oito testes. O endpoint real de importação retornou HTTP200 e o projeto gerado abriu em SDK54 sem erros. Início, salto, queda, Game Over e replay foram executados no preview horizontal.

O serviço omite package.json do mapa de código e reconstrói as dependências no editor: o resultado tem21 arquivos de código, zero assets de upload e os19 arquivos de runtime idênticos à entrega, após normalizar finais de linha. Evidências em `audit-evidence/git-import-*.json` e `git-import-tests.log`. A raiz completa continua preservada; o endereço de importação é o da pasta `snack/`.

### Limites mantidos

Fidelidade à arte rica, motion opcional, profiling em aparelho e advisories transitivos continuam documentados no relatório. A linha SDK57 não é a autoridade desta publicação e seu Web não foi promovido a PASS. Publicação funcional Web/Snack não significa aprovação integral de plataformas não executadas.
