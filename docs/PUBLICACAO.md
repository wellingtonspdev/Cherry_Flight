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

O projeto será vinculado à conta Vercel autenticada e validado na URL de produção fornecida pela plataforma. A URL final e o resultado dos testes serão registrados após o deploy.

## Domínio posterior

1. Escolher o subdomínio desejado.
2. Adicioná-lo ao projeto Vercel publicado.
3. Consultar os valores DNS específicos apresentados pela Vercel para esse projeto.
4. Criar somente o registro correspondente no Cloudflare, preservando os demais registros.
5. Verificar HTTPS, redirecionamento, PWA e gameplay na URL personalizada.

Não copiar um CNAME de outro projeto nem antecipar alteração no domínio principal. Esta publicação não depende de configurar o domínio agora.

## Evidência de publicação

Estado inicial: PARTIAL — autenticação GitHub/Vercel/Expo confirmada; envio e validação remota ainda em execução.
