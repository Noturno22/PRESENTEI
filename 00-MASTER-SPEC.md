# Presentei — Spec Mestre de Arquitetura & Execução

> Documento de referência para Claude Code + subagentes. Lembra, Escolhe e Surpreende.
> Mercado: Angola 🇦🇴 · Moeda: Kwanza (Kz)

---

## 1. Visão do Produto

**Presentei** é um app de recomendação de presentes e surpresas para o mercado angolano.
- Lembra datas importantes (aniversários, datas especiais)
- Sugere presentes/kits personalizados
- Permite comprar e agendar entrega/surpresa
- Cartões digitais personalizados
- Planos de subscrição (recorrência de lembretes + benefícios)

### Identidade Visual (já definida — ver moodboard)
```
Gradiente principal: #FF4D8D (rosa) → #FF8A00 (laranja)
Roxo escuro (fundo/contraste): #2D1140
Roxo médio (acentos): #5A1E6C
Quase-branco (fundo claro): #F9F7FB

Logo: caixa de presente com coração recortado, gradiente rosa→laranja
Tagline: "Lembra, Escolhe e Surpreende."
Tom: caloroso, afetivo, vibrante — não corporativo
```

Este documento **não** repete specs de design pixel-a-pixel — isso fica no `01-DESIGN-SYSTEM.md`, que o Subagente de Design Web e o Subagente de Design Mobile devem ler antes de tocar em qualquer componente visual.

---

## 2. Decisões de Arquitetura (fechadas)

| Área | Decisão | Motivo |
|---|---|---|
| Monorepo | **Turborepo + pnpm workspaces** | Cache de build, paralelização, gratuito, padrão de mercado para Next.js+Expo |
| Web | **Next.js 15 (App Router)** | App completo, não landing — mesmas features do mobile |
| Mobile | **Expo (Dev Client, não Expo Go)** | Precisa de módulos nativos (push notifications, possivelmente SDK de pagamento) |
| Backend/DB | **Supabase** (Postgres + Auth + Storage + Realtime + Edge Functions) | Free tier generoso, Auth pronto, Realtime útil para notificações de aniversário |
| Acesso a dados | **Supabase client direto + RLS** (sem ORM) | Decisão do usuário — mais simples, menos camadas |
| Pagamentos | **Multicaixa Express / EMIS** | Único método relevante para Angola |
| Linguagem | **TypeScript estrito** em tudo | Compartilhar tipos entre web/mobile via `packages/shared` |
| Gerenciador de pacotes | **pnpm** | Mais rápido, melhor suporte a monorepo que npm/yarn clássico |
| Estilo Web | Tailwind CSS + shadcn/ui | Rapidez + acessibilidade de base |
| Estilo Mobile | NativeWind (Tailwind para RN) | Mesma linguagem mental do Tailwind, sem duplicar conhecimento |
| Validação | Zod (compartilhado) | Mesmo schema valida formulário web, mobile e payload de API/Edge Function |
| Estado servidor | TanStack Query (React Query) em ambos | Cache, refetch, paridade de padrão web/mobile |
| Notificações | Expo Notifications (push) + Supabase Edge Function agendada (cron) para lembretes de aniversário | Calendário inteligente é a feature-chave do app |

### Por que não Prisma/Drizzle
Você escolheu Supabase client + RLS direto. Isso significa:
- Toda a lógica de segurança vive em **políticas RLS no Postgres**, não no código da aplicação
- O subagente de banco de dados é responsável por escrever e testar essas políticas com cuidado redobrado — é o único "guarda" de segurança de dados
- Tipos TypeScript do banco são gerados automaticamente via `supabase gen types typescript`, não escritos à mão

---

## 3. Estrutura do Monorepo

```
presentei/
├── apps/
│   ├── web/                    # Next.js 15 App Router
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── registo/
│   │   │   ├── (app)/
│   │   │   │   ├── inicio/
│   │   │   │   ├── calendario/
│   │   │   │   ├── presentes/
│   │   │   │   ├── pedidos/
│   │   │   │   └── perfil/
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   ├── lib/
│   │   ├── middleware.ts       # proteção de rotas via Supabase Auth
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   └── mobile/                  # Expo Dev Client
│       ├── app/                 # expo-router
│       │   ├── (auth)/
│       │   ├── (tabs)/
│       │   │   ├── inicio.tsx
│       │   │   ├── calendario.tsx
│       │   │   ├── presentes.tsx
│       │   │   ├── pedidos.tsx
│       │   │   └── perfil.tsx
│       │   └── _layout.tsx
│       ├── components/
│       ├── app.json
│       ├── eas.json
│       └── package.json
│
├── packages/
│   ├── shared/                  # tipos, validação, constantes, lógica pura
│   │   ├── src/
│   │   │   ├── types/           # gerado do Supabase + tipos de domínio
│   │   │   ├── schemas/         # Zod schemas
│   │   │   ├── constants/       # cores, textos, categorias
│   │   │   └── utils/           # formatação de Kz, datas, etc
│   │   └── package.json
│   │
│   └── api-client/               # camada de acesso a dados
│       ├── src/
│       │   ├── supabase/        # client factory (web + mobile variantes)
│       │   ├── hooks/           # hooks React Query compartilhados
│       │   └── queries/         # funções puras de query/mutation
│       └── package.json
│
├── supabase/
│   ├── migrations/               # SQL versionado
│   ├── functions/                # Edge Functions (Deno)
│   │   ├── lembrete-aniversario/
│   │   └── webhook-emis/
│   └── config.toml
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── .env.example
```

---

## 4. Modelo de Dados (resumo — schema completo em `02-DATABASE-SCHEMA.md`)

Entidades principais:
- `profiles` (estende `auth.users`)
- `contacts` (pessoas que o usuário quer lembrar — nome, foto, data de nascimento, relação)
- `products` (catálogo de presentes/kits)
- `categories`
- `orders` + `order_items`
- `payments` (referência à transação EMIS/Multicaixa)
- `digital_cards` (cartões personalizados)
- `subscriptions` (planos)
- `notifications_log`

Todas com RLS: usuário só lê/escreve seus próprios `contacts`, `orders`, etc. `products` e `categories` são públicos para leitura.

---

## 5. Plano de Execução por Subagentes (Claude Code)

> Ordem importa. Cada subagente deve receber **apenas** o contexto do seu domínio + os arquivos de spec relevantes, não o repositório inteiro, para evitar diluição de foco.

### Subagente 0 — `setup-monorepo`
**Objetivo:** Criar o esqueleto do monorepo, sem nenhuma feature.
- Inicializar pnpm workspace + Turborepo
- Criar `apps/web` (Next.js 15, TS, App Router, Tailwind, ESLint)
- Criar `apps/mobile` (Expo, TS, expo-router, dev client configurado)
- Criar `packages/shared` e `packages/api-client` vazios mas linkados via workspace
- Configurar `turbo.json` com pipelines de `dev`, `build`, `lint`, `typecheck`
- Configurar `.env.example` na raiz com todas as variáveis necessárias (ver seção 7)
- **Critério de aceite:** `pnpm install` na raiz funciona, `pnpm dev --filter=web` e `pnpm dev --filter=mobile` sobem sem erro, ambos importam algo de `packages/shared` com sucesso.

### Subagente 1 — `database-schema`
**Objetivo:** Implementar o schema completo no Supabase via migrations SQL.
- Ler `02-DATABASE-SCHEMA.md`
- Criar todas as tabelas, enums, triggers (ex: `updated_at` automático)
- Escrever todas as políticas RLS — **toda tabela sem RLS habilitada é considerado bug crítico**
- Criar seeds de exemplo para `categories` e alguns `products`
- Gerar `packages/shared/src/types/database.ts` via `supabase gen types typescript`
- **Critério de aceite:** `supabase db reset` aplica tudo sem erro; testar manualmente que um usuário não pode ler `contacts` de outro usuário.

### Subagente 2 — `shared-package`
**Objetivo:** Construir `packages/shared` com lógica 100% independente de plataforma.
- Schemas Zod para: cadastro, login, criar contato, criar pedido, criar cartão digital
- Constantes de design (cores do moodboard, espaçamentos) como tokens TS — consumidos depois por Tailwind config (web) e NativeWind config (mobile), nunca duplicados
- Utilitário de formatação de moeda: `formatKz(valor: number): string` → `"25.000 Kz"`
- Utilitário de datas: cálculo de "faltam X dias" para aniversários
- **Critério de aceite:** 100% dos tipos exportados sem `any`; pacote buildável isoladamente.

### Subagente 3 — `api-client-package`
**Objetivo:** Construir `packages/api-client`.
- Factory de cliente Supabase com duas variantes de storage de sessão: cookies (Next.js, via `@supabase/ssr`) e `expo-secure-store` (mobile)
- Hooks React Query: `useContacts`, `useUpcomingBirthdays`, `useProducts`, `useOrders`, `useCreateOrder`, etc.
- Toda query/mutation tipada com os tipos gerados pelo Subagente 1
- **Critério de aceite:** hooks funcionam isoladamente em um teste simples (mock ou contra Supabase local).

### Subagente 4 — `web-auth-shell`
**Objetivo:** App Next.js — autenticação e shell de navegação.
- Páginas de login/registo (email+senha, depois espaço para social login)
- Middleware de proteção de rotas
- Layout autenticado com sidebar/topbar seguindo `01-DESIGN-SYSTEM.md`
- **Critério de aceite:** fluxo completo de registo → login → acesso a área protegida → logout funciona.

### Subagente 5 — `web-features`
**Objetivo:** Implementar as telas principais no web, replicando o moodboard:
- Início (saudação, próximos aniversários, sugestões, categorias)
- Calendário (lista/visão de calendário de contatos)
- Presentes (catálogo, filtro por categoria)
- Pedidos (histórico, status)
- Perfil
- **Critério de aceite:** todas as telas renderizam com dados reais do Supabase (via api-client), responsivas, sem usar mock data hardcoded.

### Subagente 6 — `mobile-auth-shell`
**Objetivo:** Espelha o Subagente 4, mas em Expo.
- Telas de login/registo com expo-router
- Tab navigation: Início, Calendário, Presentes, Pedidos, Perfil (igual ao moodboard)
- Sessão persistida com `expo-secure-store`
- **Critério de aceite:** mesmo fluxo de auth funcional no dev client (iOS e Android).

### Subagente 7 — `mobile-features`
**Objetivo:** Espelha o Subagente 5, em Expo, reaproveitando hooks de `api-client`.
- Mesmas 5 telas, adaptadas a padrões mobile (scroll, pull-to-refresh, cards touch-friendly)
- Push notifications (Expo Notifications) para lembretes de aniversário
- **Critério de aceite:** paridade funcional com o web; notificação de teste chega no dispositivo/emulador.

### Subagente 8 — `payments-emis`
**Objetivo:** Integração de pagamento Multicaixa Express / EMIS.
- Edge Function `webhook-emis` para receber confirmação de pagamento
- Fluxo de checkout no web e no mobile chamando a Edge Function que inicia a transação
- Atualização de status de `orders`/`payments` via webhook
- **Critério de aceite:** transação de sandbox/teste completa o ciclo: pedido criado → pagamento iniciado → webhook confirma → pedido atualizado.
- ⚠️ Este subagente deve rodar **depois** que a conta de comerciante EMIS estiver criada e as credenciais de sandbox estiverem disponíveis — caso contrário, construir contra um mock e marcar claramente como pendente de credenciais reais.

### Subagente 9 — `notifications-cron`
**Objetivo:** Lembretes automáticos de aniversário.
- Edge Function `lembrete-aniversario` agendada via `pg_cron` (extensão do Supabase) — roda diariamente
- Verifica `contacts` com aniversário em N dias (configurável: 11, 5, 1 dia — como no moodboard)
- Dispara push notification (mobile) + registra em `notifications_log`
- **Critério de aceite:** função roda manualmente e gera notificação de teste corretamente.

### Subagente 10 — `qa-polish`
**Objetivo:** Revisão final cross-stack.
- Typecheck e lint em 100% do monorepo (`turbo run typecheck lint`)
- Verificar que nenhuma tabela ficou sem RLS
- Verificar paridade visual web/mobile contra `01-DESIGN-SYSTEM.md`
- Testar fluxo end-to-end: registo → adicionar contato → ver sugestão → comprar → receber notificação

---

## 6. Convenções de Código

- Nomes de rotas, campos visíveis ao usuário e textos de UI: **português (PT-AO)**
- Nomes de variáveis, funções, tabelas, colunas: **inglês** (padrão de mercado, evita ambiguidade com acentuação)
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`)
- Cada subagente deve abrir seu trabalho em uma branch própria nomeada `subagent/<nome>` quando possível

---

## 7. Variáveis de Ambiente (`.env.example`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # apenas Edge Functions / server-side, nunca no client

# Expo (mobile usa o mesmo Supabase, prefixo EXPO_PUBLIC_)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# EMIS / Multicaixa Express
EMIS_API_BASE_URL=
EMIS_MERCHANT_ID=
EMIS_API_KEY=
EMIS_WEBHOOK_SECRET=

# Push Notifications
EXPO_ACCESS_TOKEN=
```

---

## 8. Pendências / Decisões em Aberto

Estas não bloqueiam o início da execução (subagentes 0-3 podem rodar sem isso), mas precisam ser resolvidas antes dos subagentes 8 e seguintes:

1. **Credenciais EMIS/Multicaixa Express** — precisa de conta de comerciante ativa para sandbox
2. **Conteúdo real do catálogo** — fotos e preços reais dos produtos (moodboard usa exemplos: Kit Festa na Caixa 25.000 Kz, Flores & Chocolate 18.000 Kz, Perfume Feminino 30.000 Kz)
3. **Política de planos/subscrição** — preços e benefícios ainda não definidos
4. **Domínio e hospedagem do web** (Vercel é a escolha natural para Next.js, mas não confirmado)
5. **Conta Expo/EAS** para build do dev client e push notifications

---

## 9. Próximo Passo Imediato

Para o Sama: leve este documento + `01-DESIGN-SYSTEM.md` + `02-DATABASE-SCHEMA.md` para o Claude Code e peça para ele:
1. Ler os 3 documentos
2. Criar os subagentes conforme a seção 5
3. Rodar o Subagente 0 primeiro, validar, e só então prosseguir sequencialmente

```
claude-code "Leia os documentos em /presentei-spec/ e execute o Subagente 0 (setup-monorepo) primeiro. Pare e me mostre o resultado antes de continuar."
```
