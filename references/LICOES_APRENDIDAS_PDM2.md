# Lições Aprendidas — PDM II / Atividade Prática 3

## Objetivo

Registrar, de forma breve e objetiva, os principais problemas encontrados durante a Atividade Prática 3 — Convite Virtual, para evitar retrabalho e acelerar futuras atividades de Programação para Dispositivos Móveis II.

---

## 1. Confirmar a versão do Expo antes de iniciar

### Problema
O projeto foi implementado inicialmente com **Expo SDK 52**, mas a versão exigida era **Expo SDK 54**.

### Impacto
- retrabalho de migração;
- atualização de React e React Native;
- nova validação de dependências;
- necessidade de repetir testes e bundles.

### Regra para próximas atividades
Antes de escrever código, confirmar:

```bash
node -v
npx expo --version
npm list expo
npm list react
npm list react-native
```

Depois validar a baseline com:

```bash
npx expo-doctor@latest
npx expo install --check
```

---

## 2. Não atualizar apenas o pacote `expo`

### Problema
Migrar SDK envolve todo o ecossistema, não somente trocar `expo@52` por `expo@54`.

### Regra
Usar o fluxo oficial do Expo e alinhar conjuntamente:

- Expo;
- React;
- React Native;
- `expo-status-bar`;
- Babel;
- demais pacotes Expo.

Preferir:

```bash
npx expo install expo@^54.0.0 --fix
npx expo install --fix
npx expo-doctor@latest
```

---

## 3. Não usar `npm audit fix --force` automaticamente

### Problema
A instalação inicial apresentou:

- 23 vulnerabilidades;
- 10 moderadas;
- 12 altas;
- 1 crítica.

Executar `npm audit fix --force` antes da migração poderia quebrar a matriz de dependências do Expo.

### Regra
Fluxo correto:

1. corrigir a versão do Expo;
2. alinhar dependências;
3. executar `expo-doctor`;
4. executar testes;
5. executar novamente:

```bash
npm audit
npm audit --json
```

6. analisar apenas os findings restantes.

**Nunca usar `npm audit fix --force` sem entender o breaking change.**

---

## 4. Metro iniciado não significa aplicativo validado

### Problema
`npx expo start --tunnel` iniciou Metro e gerou QR Code, mas isso não provava que o aplicativo realmente renderizava corretamente.

### Regra
Separar os gates:

```text
Metro iniciou
≠
Bundle passou
≠
Aplicativo abriu
≠
UI está correta
≠
Snack foi validado
```

Sempre validar, quando possível:

- Metro;
- bundle Android;
- bundle iOS;
- Expo Go/dispositivo;
- Snack;
- UI visual.

---

## 5. Interpretar cuidadosamente requisitos aparentemente contraditórios

### Problema
O enunciado exigia:

```text
tela1.js
tela2.js
tela3.js
```

mas também penalizava o uso de mais de uma tela.

### Solução adotada
Os três arquivos foram tratados como **componentes de uma única interface**:

```text
App.js
  └── ScrollView
      ├── tela1.js
      ├── tela2.js
      └── tela3.js
```

### Regra
Antes de implementar, transformar o enunciado em:

- requisitos;
- invariantes;
- decisões técnicas;
- critérios de aceitação.

Não assumir que o nome do arquivo define a arquitetura.

---

## 6. Definir data, horário e timezone antes de fechar o countdown

### Problema
O countdown foi inicialmente configurado para:

```javascript
new Date(2027, 4, 21, 0, 0, 0)
```

mas depois o horário real do evento foi definido como **19:30**.

### Impacto
O contador terminaria antes do horário exibido no convite.

### Correção
Target final:

```javascript
new Date(2027, 4, 21, 19, 30, 0)
```

### Regra
A informação exibida na UI e a usada pela lógica devem ser a mesma:

```text
Data mostrada = data do target
Horário mostrado = horário do target
```

Para atividades locais simples, horário local do dispositivo pode ser aceitável; em projetos reais, considerar timezone explícito.

---

## 7. Encerrar corretamente timers

### Problema
A primeira versão limpava o `setInterval` no unmount, mas o timer continuaria sendo executado depois de chegar a zero.

### Correção
O timer passou a:

- não iniciar se o evento já terminou;
- parar quando `isComplete === true`;
- executar `clearInterval` no unmount.

### Regra
Todo `setInterval` ou `setTimeout` deve ter ciclo de vida completo:

```text
criar
→ atualizar
→ parar quando não for mais necessário
→ cleanup
```

---

## 8. Não declarar PASS sem a evidência correta

### Problema
Alguns gates foram inicialmente classificados como PASS com evidências insuficientes.

Exemplos:

- `expo-doctor` não prova renderização;
- código responsivo não prova que 320 px foi testado;
- existência de `clearInterval` no arquivo não prova lifecycle real;
- configuração para Snack não prova que o Snack foi importado.

### Regra
Usar quatro estados:

```text
PASS
FAIL
PARTIAL
NOT EXECUTED
```

E diferenciar:

```text
BUG
```

de:

```text
FALTA DE EVIDÊNCIA
```

---

## 9. Validar visualmente a versão final

### Problema
O código estava correto, mas alguns gates de layout e responsividade não poderiam ser comprovados apenas lendo estilos.

### Regra
Sempre obter ao menos uma validação visual real:

- Expo Go;
- emulador;
- Snack;
- screenshot.

Conferir:

- clipping;
- overflow;
- safe area;
- cards;
- textos longos;
- espaçamentos;
- hierarquia.

---

## 10. Snack é um gate separado

### Problema
O projeto funcionava localmente, mas a entrega exigia especificamente **Expo Snack**.

### Regra
Não considerar a atividade pronta até validar:

```text
GitHub/arquivos
↓
Importação no Snack
↓
Bundle
↓
Preview
↓
Contagem funcionando
↓
Layout correto
↓
Link público salvo
```

Antes de entregar, abrir o link em janela anônima ou outro dispositivo.

---

## 11. Não documentar capacidades que não estão configuradas

### Problema
O README dizia que o projeto podia rodar em **Web**, mas faltavam:

- `react-dom`;
- `react-native-web`.

### Decisão
Como Web não era requisito da atividade, o README foi corrigido para mencionar somente execução mobile validada.

### Regra
README deve descrever o estado real, não o estado desejado.

---

## 12. README não deve referenciar artefatos ausentes

### Problema
O README instruía:

```bash
npm test
```

mas `test/` era mantido apenas localmente e estava ignorado pelo Git.

### Correção
A instrução foi removida do README público.

### Regra
Todo comando documentado deve funcionar em um **clone limpo do repositório**.

---

## 13. Reprodutibilidade de dependências

### Problema
`package-lock.json` foi removido do remoto para simplificar a importação no Snack.

Isso fez diferentes instalações resolverem árvores transitivas diferentes, o que também alterou os resultados do `npm audit`.

### Regra
Em projetos normais, preferir versionar o lockfile.

Em atividades específicas onde o Snack exigir uma estrutura mínima, tratar isso como decisão consciente e documentada.

---

## 14. Dependências desnecessárias devem ser evitadas

### Problema
`expo-asset` permaneceu instalado apesar de não haver assets utilizados no estado final.

Não causou falha, mas foi identificado como cleanup possível.

### Regra
Antes de adicionar uma dependência, perguntar:

```text
É realmente necessária?
O Expo já oferece isso?
Existe alternativa nativa?
Isso afeta Snack?
```

Evitar adicionar bibliotecas somente para pequenos efeitos visuais.

---

## 15. Cuidado com APIs depreciadas

### Observação
`SafeAreaView` do React Native permaneceu funcionando, mas possui ressalvas em versões modernas do RN.

### Regra
Não trocar uma API perto da entrega apenas por estar deprecated se não houver bug real.

Porém, em novos projetos, preferir a abordagem recomendada para a versão atual, por exemplo `react-native-safe-area-context`, quando aplicável.

---

## 16. Evitar mudanças depois da validação final

### Problema potencial
Após Snack, revisão e auditoria final, qualquer “melhoria pequena” poderia introduzir regressão.

### Regra
Depois do gate final:

```text
FINAL AUDIT: PASS
READY FOR DELIVERY: YES
```

congelar o projeto:

```text
FROZEN FOR DELIVERY
```

Não executar:

- `npm update`;
- `npm audit fix`;
- refactor;
- cleanup;
- redesign;
- atualização de versões;
- novos commits sem necessidade.

---

# Fluxo recomendado para próximas atividades

## Fase 0 — Leitura do enunciado

Definir:

- requisitos obrigatórios;
- restrições;
- versão Expo;
- arquivos obrigatórios;
- forma de entrega;
- critérios de nota.

## Fase 1 — Baseline

Executar:

```bash
node -v
npm -v
npx expo --version
npm list expo react react-native
npx expo-doctor@latest
```

## Fase 2 — Planejamento

Definir:

- arquitetura;
- componentes;
- data/horário;
- design;
- critérios de aceitação;
- gates;
- escopo fora do projeto.

## Fase 3 — Implementação

Implementar somente o necessário.

## Fase 4 — Validação técnica

```bash
npx expo install --check
npx expo-doctor@latest
npm audit --json
```

Além de testes disponíveis.

## Fase 5 — Runtime

Validar:

- Metro;
- Android;
- iOS;
- Expo Go.

## Fase 6 — Revisão independente

Outro agente/modelo deve tentar encontrar problemas e falsificar os PASS anteriores.

## Fase 7 — Correções

Corrigir apenas findings ratificados.

## Fase 8 — Snack

Importar, executar e validar o projeto real.

## Fase 9 — Auditoria final

Confirmar:

```text
Git limpo
Expo correto
Requisitos completos
Countdown correto
UI validada
Snack validado
README correto
Link público funcionando
```

## Fase 10 — Congelamento e entrega

```text
FROZEN FOR DELIVERY
```

Enviar o link solicitado e não alterar mais o projeto.

---

# Checklist rápido para futuras atividades PDM II

- [ ] Li o enunciado inteiro antes de programar.
- [ ] Confirmei a versão obrigatória do Expo.
- [ ] Confirmei Node, React e React Native compatíveis.
- [ ] Transformei o enunciado em requisitos claros.
- [ ] Resolvi ambiguidades antes da implementação.
- [ ] Defini data, horário e demais valores reais antes da lógica.
- [ ] Evitei dependências desnecessárias.
- [ ] Não usei `npm audit fix --force` automaticamente.
- [ ] Expo Doctor passou.
- [ ] Expo install check passou.
- [ ] Audit foi executado após a versão final das dependências.
- [ ] App abriu em dispositivo/Expo Go.
- [ ] Layout foi inspecionado visualmente.
- [ ] Testei responsividade.
- [ ] Snack foi realmente importado e executado.
- [ ] README descreve somente capacidades reais.
- [ ] Comandos do README funcionam em clone limpo.
- [ ] Revisão independente foi feita.
- [ ] Apenas findings confirmados foram corrigidos.
- [ ] Auditoria final passou.
- [ ] Link público foi testado.
- [ ] Projeto foi congelado antes da entrega.

---

## Princípio principal

> **Validar cedo a baseline, separar implementação de revisão e nunca considerar “funciona localmente” como equivalente a “está pronto para entrega”.**
