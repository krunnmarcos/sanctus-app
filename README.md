# Acutis

Acutis é um app web em React para leitura da Bíblia (tradução Ave Maria), prática guiada de Lectio Divina e diário espiritual, com foco em uso local (dados em `public`) e persistência via `localStorage`.

Aplicação React/Vite para leitura bíblica, Lectio Divina guiada e diário espiritual. O projeto usa apenas front-end (sem backend), com persistência local via `localStorage` e dados estáticos (Bíblia Ave Maria) embarcados na pasta `public`.

## Sumário
- [Visão Geral](#visão-geral)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Arquitetura e Estado](#arquitetura-e-estado)
- [Fluxos de Uso](#fluxos-de-uso)
- [Persistência e Dados](#persistência-e-dados)
- [Execução Local](#execução-local)
- [Scripts NPM](#scripts-npm)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como publicar no GitHub](#como-publicar-no-github)
- [Ideias de Evolução](#ideias-de-evolução)

## Visão Geral
Acutis oferece uma experiência devocional completa:
- Leitura bíblica com destaques, comentários patrísticos e navegação por capítulos/livros.
- Modo Lectio Divina com etapas clássicas (Lectio, Meditatio, Oratio, Contemplatio, Actio) e histórico local das sessões anteriores.
- Diário de oração simples (com placeholders para evolução futura).
- Dashboard com atalho para leitura, santo do dia e sugestões rápidas.

## Principais Funcionalidades
- **Leitura bíblica**: seleção de livro/capítulo, avanço/retrocesso, fonte estática (Bíblia Ave Maria). Destaques por cor, marcação de versículo e indicação de comentários patrísticos.
- **Buscas**: filtro por livro e busca por texto de versículos (mínimo 3 caracteres) com resultado limitado para manter performance.
- **Lectio Divina guiada**: timers para lectio/contemplatio, perguntas sugeridas em Meditatio, campo de oração (Oratio), compromisso prático (Actio) e salvamento em histórico local.
- **Histórico de Lectio**: últimas sessões listadas; clicar abre modal detalhado com tempos, oratio, respostas e actio.
- **Tema claro/escuro**: alternância persistida no estado global.
- **Santo do dia (fallback)**: tentativa de buscar via API externa; em caso de erro, usa mocks predefinidos.

## Arquitetura e Estado
- **Stack**: React 19 + Vite 6 + TypeScript. Ícones: lucide-react.
- **Estado global**: `AppContext` em App.tsx centraliza tema, livro/capítulo atuais, destaques, orações, progresso e view atual.
- **Componentes principais**:
  - components/Reader.tsx: experiência de leitura, navegação de capítulos, destaques e comentários patrísticos.
  - components/LectioDivina.tsx: fluxo completo da Lectio, timers e histórico em `localStorage` (`lectio-draft-v1`, `lectio-history-v1`).
  - components/Dashboard.tsx: landing com santo do dia, call-to-action de leitura e seções rápidas.
  - components/Journal.tsx: diário (estrutura base, pronto para evoluir).
- **Dados bíblicos**: carregamento prioritário da Bíblia Ave Maria em public/data/ave-maria/ave-maria.json; fallback para mock em constants.ts.

## Fluxos de Uso
1) **Leitura diária**
   - Abra o app (dashboard), clique em Continuar Leitura ou escolha um livro/capítulo na barra lateral.
   - Use setas ou grid de capítulos para navegar. Clique no versículo para destacar ou abrir comentários patrísticos.

2) **Lectio Divina**
   - Acesse Lectio Divina na barra lateral.
   - Escolha livro/capítulo (ou deixe o atual). Siga as etapas; timers guiam Lectio e Contemplatio.
   - Ao concluir, salve para registrar no histórico local. Históricos podem ser reabertos em modal detalhado.

3) **Buscas**
   - Filtro de livros por nome/abreviação na sidebar.
   - Busca de versículos no topo do modo leitura (mínimo 3 caracteres, mostra até 12 resultados).

## Persistência e Dados
- **localStorage**:
  - `lectio-draft-v1`: rascunho da sessão atual de Lectio.
  - `lectio-history-v1`: histórico das últimas sessões (limitado a 50).
- **Dados estáticos**:
  - public/data/ave-maria/ave-maria.json (tradução Ave Maria, offline).
- **Mocks**: `MOCK_BIBLE` e `PATRISTIC_COMMENTS` em constants.ts para funcionamento offline.

## Execução Local
**Pré-requisitos:** Node.js 18+.

```bash
npm install
npm run dev
# Vite inicia em http://localhost:5173
```

Não há variáveis de ambiente obrigatórias no fluxo atual. O app é totalmente front-end.

## Scripts NPM
- npm run dev: inicia o Vite em modo desenvolvimento.
- npm run build: build de produção.
- npm run preview: serve o build para teste local.

## Estrutura de Pastas
```
.
 App.tsx                 # Contexto global e layout principal
 components/             # Páginas/áreas principais (Dashboard, Reader, LectioDivina, Journal)
 public/data/            # Bíblia estática (Ave Maria)
 constants.ts            # Dados mock, comentários patrísticos, utilitários
 types.ts                # Tipagens globais
 scripts/convert-porblivre.js # Utilitário de conversão (legado/PorBLivre)
 vite.config.ts          # Configuração Vite
```

## Como publicar no GitHub
Repositório alvo: https://github.com/krunnmarcos/acutis-app.git.

1. Inicialize (caso ainda não exista `.git`):
```bash
git init
```
2. Commit inicial:
```bash
git add .
git commit -m "chore: initial import"
```
3. Configure a branch principal e o remoto:
```bash
git branch -M main
git remote add origin https://github.com/krunnmarcos/acutis-app.git
```
4. Envie o código:
```bash
git push -u origin main
```

Se já houver um repositório Git, apenas ajuste o remoto (`git remote set-url origin ...`) e faça o push.

## Ideias de Evolução
- Sincronizar histórico e destaques via backend ou Supabase/Firebase (mantendo cache local).
- Autenticação leve para guardar progresso e diário em nuvem.
- Áudio dos textos bíblicos e modo leitura focada (auto-scroll, narrador).
- Melhorias de acessibilidade (ARIA, foco, contraste) e testes E2E.
- Exportar/compartilhar sessões de Lectio (PDF/Markdown) e diário.
