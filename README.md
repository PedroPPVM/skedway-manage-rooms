# Skedway — Gerenciamento de Salas

[![CI](https://github.com/PedroPPVM/skedway-manage-rooms/actions/workflows/ci.yml/badge.svg)](https://github.com/PedroPPVM/skedway-manage-rooms/actions/workflows/ci.yml)

Aplicação para gerenciamento de salas de reunião: encontre a sala certa, consulte a agenda do dia e reserve em poucos cliques — com dark mode, três idiomas e acessibilidade de ponta a ponta.

**Demo:** [skedway-manage-rooms.vercel.app](https://skedway-manage-rooms.vercel.app/)

## Funcionalidades

- **Identificação** por nome e email (a posse das reservas é rastreada pelo email)
- **Listagem de salas** com capacidade, localização, recursos e status de ocupação em tempo real
- **Pesquisa** por nome (ignora acentos) e **filtros** por capacidade mínima, recursos e disponibilidade — tudo sincronizado na URL: links filtrados são compartilháveis
- **Detalhes da sala** em modal com URL própria (`/rooms/:id`), com agenda do dia em slots de 30 minutos e seletor de data localizado
- **Nova reserva** com responsável, data, hora de início e duração — as regras de negócio (sem conflito, horário comercial 08h–18h, máximo 4h) são impossíveis de violar pela interface, e o servidor as revalida
- **Cancelamento** com confirmação, permitido apenas a quem criou a reserva
- **Dark mode** (segue o sistema, com escolha persistida), **PT-BR / EN / ES** e navegação completa por teclado

## Como executar

Requisitos: Node.js 20+.

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Não há backend para configurar: a API é simulada na camada de rede pelo [MSW](https://mswjs.io/) — entre com qualquer nome e email válidos. As reservas criadas persistem no `localStorage`; os dados de demonstração (salas e algumas reservas) são gerados para o dia corrente.

### Scripts

| Script                  | O que faz                                 |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento               |
| `npm run build`         | Type-check (`tsc -b`) + build de produção |
| `npm run preview`       | Serve o build localmente                  |
| `npm test`              | Roda a suíte de testes (122 testes)       |
| `npm run test:watch`    | Testes em modo watch                      |
| `npm run test:coverage` | Testes com relatório de cobertura         |
| `npm run lint`          | ESLint                                    |
| `npm run format:check`  | Verifica a formatação (Prettier)          |

## Stack e bibliotecas

| Biblioteca                       | Por quê                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| **React 19 + TypeScript + Vite** | Base do projeto; `ref` como prop comum (sem `forwardRef`), tipagem estrita de domínio |
| **Tailwind CSS v4**              | Design system próprio via tokens em CSS variables (config CSS-first com `@theme`)     |
| **TanStack Query**               | Estado de servidor: cache, invalidação e estados de loading/erro sem boilerplate      |
| **React Router**                 | Rotas com guard de autenticação e modal por rota                                      |
| **React Hook Form + Zod**        | Formulários performáticos com validação tipada e mensagens traduzidas                 |
| **i18next / react-i18next**      | Três idiomas com chaves **tipadas** — chave inexistente é erro de compilação          |
| **MSW**                          | API simulada na camada de rede — os mesmos handlers servem dev, produção e testes     |
| **Headless UI**                  | `Listbox multiple` acessível (pattern ARIA completo) vestido com os tokens do projeto |
| **react-day-picker**             | Calendário com pattern ARIA grid para o DatePicker próprio                            |
| **lucide-react**                 | Ícones tree-shakeable (~1kB por ícone usado)                                          |
| **clsx + tailwind-merge**        | Utilitário `cn()` — composição de classes com override seguro                         |
| **@fontsource-variable/inter**   | Fonte self-hosted, sem request externo                                                |
| **Vitest + Testing Library**     | Testes de comportamento e acessibilidade, com servidor MSW real                       |

**Rejeições conscientes**: Material UI (traria o runtime do Emotion e um segundo design system a sobrescrever); bibliotecas de data como date-fns/dayjs (a `Intl` nativa cobre formatação, ordem de campos e parsing por locale); Redux/Zustand (Context + React Query bastam para o escopo).

## Estrutura do projeto

```
src/
├── components/
│   ├── layout/      # AppLayout — apresentação pura, sem lógica de rota
│   └── ui/          # design system: componentes reutilizáveis + testes co-locados
├── contexts/        # theme, toast e user (estado global leve via Context)
├── hooks/           # hooks de dados (React Query) e utilitários
├── i18n/            # configuração, locales (pt-BR/en/es) e mapa de erros da API
├── mocks/           # API simulada: handlers, seeds e persistência (localStorage)
├── pages/           # uma pasta por rota, com componentes específicos co-locados
├── routes/          # router, guards (ProtectedLayout) e lazy pages
├── services/        # cliente HTTP e endpoints tipados
├── styles/          # tokens, integração com o Tailwind e estilos base
├── test/            # helpers de teste (providers + servidor MSW)
├── types/           # tipos de domínio
└── utils/           # funções puras: regras de negócio, datas, filtros, agenda
```

Convenções: o design system segue os **princípios de composição do Atomic Design sem a taxonomia de pastas** — `ui/` plano com teste ao lado, promovendo a pasta apenas quando o módulo tem múltiplos arquivos (padrão aplicado em `pages/`); `routes/` concentra o que orquestra navegação, `components/` só apresenta; se o projeto tivesse imagens estáticas, seriam estruturadas em `src/assets/`.

## Decisões técnicas

### Design system e temas

- **Tokens semânticos em CSS variables** (`surface`, `foreground`, `primary`, `success`...) expostos ao Tailwind via `@theme inline` — nenhuma cor literal em componente; o dark mode redefine os valores sob `.dark`.
- **`color-scheme` acompanha o tema**: scrollbars, pickers nativos e autofill renderizam corretamente no escuro; um script inline no `index.html` aplica o tema antes do primeiro paint (anti-FOUC).
- **Nativo primeiro**: Modal e Drawer sobre `<dialog>` (top layer, focus trap e Esc do browser), Select nativo estilizado (pickers do sistema no mobile), Toast próprio com `aria-live`. Bibliotecas headless entram apenas onde o nativo não alcança: multiselect e calendário.

### Dados e domínio

- **MSW como backend simulado** validando as regras de negócio no "servidor" — a UI as torna inviolável por construção (hora de início é um select só de horários livres; a duração é limitada pelo expediente e pela próxima reserva), e erros 409/422 chegam como mensagens claras traduzidas por código.
- **Status da sala é derivado por request** das reservas ativas (estado temporal), nunca armazenado — card, filtro e agenda leem da mesma fonte; a seed é tipada `Omit<Room, 'status'>`, explicitando a diferença entre modelo de persistência e contrato da API.
- **Posse da reserva por email**: o email é a identidade estável (o nome de exibição pode mudar entre sessões sem perder a posse); o header `X-User-Email` simula o que um backend real leria do token de sessão.

### Estado e navegação

- **URL como fonte da verdade dos filtros** (`?q=&capacity=&resources=&available=`): compartilhável, sobrevive a refresh e back/forward, com parse tolerante a valores inválidos.
- **Detalhes como modal por rota** (`/rooms/:id`, rota filha da listagem): deep link funciona, o botão voltar fecha o modal e os filtros ativos são preservados ao abrir/fechar.
- **Code-splitting por rota**: Login e RoomDetails carregam sob demanda.

### Internacionalização e datas

- **Chaves de tradução tipadas** a partir do `pt-BR.json`; nomes de idioma em endônimo com bandeiras SVG (emoji de bandeira não renderiza no Chrome/Windows).
- **Datas 100% via `Intl`**: formatação, ordem dia/mês/ano e até o parsing do campo digitável derivam de `Intl.DateTimeFormat.formatToParts` do idioma ativo. O `<input type="date">` nativo foi substituído por um DatePicker próprio porque o nativo formata pelo locale do sistema operacional e ignora o idioma da página.

### Testes

- **122 testes** co-locados, exercitando a API simulada de verdade (servidor MSW nos testes com os handlers reais) e testando **comportamento e acessibilidade** — nunca classes CSS.
- **Relógio determinístico**: `vi.useFakeTimers({ toFake: ['Date'] })` congela apenas o `Date` (o status derivado depende da hora), mantendo timers reais para os delays da API.

## Retrospectiva

### O que eu faria diferente com mais tempo?

- **"Minhas reservas"**: uma visão única com todas as reservas do usuário logado, sem precisar navegar sala a sala.
- **CRUD completo de salas**: a análise já está mapeada — armazenamento com overlay sobre os dados de demonstração, política de exclusão (bloquear quando houver reservas futuras × cascata) e os papéis de administrador que essa feature exigiria.
- **Animações**: micro-interações de entrada/saída dos modais (o caminho CSS com `@starting-style` está descrito nas limitações) e, se a interação crescesse, uma biblioteca como Motion para animações de layout.
- **Backend real**: substituir o MSW por uma API de verdade — o contrato já está definido pelos handlers e a troca seria transparente para o front.

### Qual foi a parte mais desafiadora?

A internacionalização de verdade, que eu ainda não tinha enfrentado em um projeto real de mercado. Ela vai muito além de traduzir strings: envolveu chaves tipadas (chave inexistente vira erro de compilação), pluralização, mensagens de erro da API mapeadas por código e — a parte mais dura — **datas**: formatação, ordem dos campos e parsing derivados do `Intl` conforme o idioma ativo, o que acabou exigindo construir um DatePicker próprio quando o input nativo se mostrou preso ao locale do sistema operacional.

### Que melhorias eu faria pensando em milhares de usuários?

- **Dashboard** com gráficos e indicadores sobre salas e reservas (ocupação, horários de pico, salas mais disputadas).
- **Autenticação completa** e um sistema de **permissões** com papéis (administrador × usuário).
- **CRUD também para os recursos** das salas, hoje fixos.
- **Integração com calendários** — Google Calendar e equivalentes de outras empresas — para a reserva aparecer automaticamente na agenda do usuário.
- **Notificações por email/WhatsApp** sobre as reservas (confirmação, lembrete, cancelamento).
- **Novos status de sala guiados por pesquisa com potenciais usuários** — por exemplo "em manutenção", que se encaixa no modelo atual como estado administrativo separado da ocupação temporal (que é calculada, nunca armazenada).

## Limitações conhecidas

- Horários trabalham na **hora local do navegador** — um backend real armazenaria UTC com o timezone de cada sala.
- A identificação **não é autenticação**: não há senha nem sessão; a verificação de posse é ilustrativa.
- O mock (MSW) roda também em produção — é o "backend" da demonstração.
- Modais e drawer fecham sem animação de saída (a entrada é animada); o caminho mapeado é CSS `@starting-style` + `transition-behavior: allow-discrete`.
