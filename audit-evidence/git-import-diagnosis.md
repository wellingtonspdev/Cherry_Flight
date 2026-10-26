# Importação Git do Snack — diagnóstico e revalidação

Data: 26/10/2026. O endpoint usado pelo próprio formulário de importação é `https://snackager.eascdn.net/git`, com parâmetros repo, branch e subpath.

## Falha reproduzida

Importar a raiz da main retorna HTTP500 com a mesma cadeia relatada: `Failed to create snack ... Error parsing files ... Failed to upload file asset ... "$": Required.` O App ainda não é executado nessa etapa. Esse resultado está em git-import-root-failure.json.

O código público do importador classifica apenas js/jsx/ts/tsx/json/md como CODE. Os demais arquivos passam por upload de assets, incluindo PNG/JPG/SVG/WAV/PDF e também scripts mjs/cjs e logs. A mensagem não identifica qual arquivo original falhou: `asset` é o nome usado pela rotina de upload. Não foi atribuída corrupção a um PNG específico nem presumido um SDK inválido.

Fontes primárias consultadas:

- https://github.com/expo/snack/blob/main/website/src/client/components/Import/ImportRepoModal.tsx
- https://github.com/expo/snack/blob/main/snackager/src/utils/convertRepoToSnack.ts

Essas fontes explicam o fluxo; não comprovam a versão exata do backend implantado nem sua causa interna de validação. O estágio de falha foi confirmado pelo endpoint real. A publicação anterior pela API oficial, que funcionou, é um gate diferente da importação Git.

## Correção de empacotamento

A pasta snack/ contém o jogo SDK54 completo de runtime, sem acionar o caminho defeituoso de upload. A arte do jogo atual é desenhada em SVG/Views e não depende dos raster, áudios e PDFs de referência. Esses materiais e a auditoria completa foram preservados na raiz.

O script scripts/prepare-snack.mjs gera22 arquivos e verifica imports locais. npm test compara as cópias com o runtime canônico, valida que a versão é SDK54 e impede arquivos inesperados no pacote. Nenhum arquivo App/src do runtime original foi alterado nesta correção.

## Revalidação

- Importador real com branch=main e subpath=snack: PASS, HTTP200.
- SDK do resultado: PASS,54.0.0.
- Mapa importado:21 arquivos CODE, zero ASSET; package.json é reconstruído pelo serviço.
-19 arquivos App/src: PASS, iguais à entrega após normalizar CRLF/LF.
- Editor/preview: PASS, sem erros, quatro telas presentes no projeto.
- Gameplay smoke: PASS, click inicia; personagem sobe de y160.865 para85.991 e depois cai até310.170; Game Over aparece e replay retorna a READY.
- Testes locais: PASS,8/8.
- Partida prolongada e aparelho físico nesta importação: NOT EXECUTED. Não reutilizar como prova física os testes de outras superfícies.

A raiz completa continua sujeita à falha de upload do importador. O Git URL correto para esse fluxo é https://github.com/wellingtonspdev/Cherry_Flight/tree/main/snack. O Snack da conta do usuário e a Vercel não foram substituídos durante o teste de importação.
