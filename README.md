# STG Catalog Challenge

## Introdução

O **STG Catalog Challenge** é uma aplicação web de e-commerce construída com o novo App Router do **Next.js 15** e **React 19**, integrando **Supabase** para autenticação e persistência de dados. O objetivo é demonstrar, de forma enxuta porém realista, um fluxo completo de navegação e compra: descoberta de produtos, visualização detalhada, gerenciamento de carrinho, exibição de cupons promocionais, checkout e histórico de compras autenticado.

O projeto prioriza:

- Arquitetura moderna com componentes desacoplados (hooks para dados, context para sessão)
- Experiência responsiva e acessível (Tailwind CSS 4 + boas práticas de semântica)
- Estado de autenticação centralizado via `AuthContext` + hook `useAuth`
- Listagem e grid de produtos com carregamento dinâmico via Supabase (`useProducts`)
- Carrinho e utilidades encapsuladas em helpers reutilizáveis
- Páginas de ciclo de usuário: login, registro, recuperação e redefinição de senha
- Histórico protegido e rotas sensíveis condicionadas ao usuário logado
- Exibição de cupons em destaque (Hero) com mensagens promocionais customizadas
- Base preparada para evolução (testes com Jest + Testing Library, scripts utilitários e organização escalável)

Em essência, o STG Catalog Challenge serve como base sólida para evoluir para uma loja completa: já entrega a espinha dorsal (produtos, usuários, carrinho, fluxo de compra) e um design system inicial baseado em tokens de tema, pronto para receber funcionalidades como cálculo de frete, meios de pagamento e cupons dinâmicos.

## Getting Started

Para rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos
- Node.js (versão recomendada >= 18)
- NPM ou PNPM/Yarn (exemplos abaixo usam NPM)
- Conta no Supabase (para criar o projeto e obter as chaves)

### Variáveis de Ambiente
Crie um arquivo `.env.local` (ou `.env`) na raiz com, no mínimo:

```bash
NEXT_PUBLIC_SUPABASE_URL= sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY= sua_chave_anon
# Opcional / usados em recursos específicos
SUPABASE_SERVICE_ROLE_KEY= chave_de_service_role_apenas_para_scripts
UNSPLASH_ACCESS_KEY= chave_para_popular_imagens
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

#### Exemplo completo (.env.local)
> Use valores fictícios abaixo apenas como referência de formato.
```bash
# URL base do seu projeto Supabase (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234efghijklmnop.supabase.co

# Public anon key (NUNCA use a service role no frontend)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.PUBLIC-ANON-KEY-EXEMPLO

# Service Role key (somente para scripts server-side; não commit e não expor)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SERVICE-ROLE-KEY-EXEMPLO

# Chave da API do Unsplash (se for usar script de popular imagens)
UNSPLASH_ACCESS_KEY=UNSPLASH_ACCESS_KEY_EXEMPLO

# Número do WhatsApp (E.164 sem +) usado em redirecionamentos
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

Checklist rápido:
- Conferir se a URL termina com `.supabase.co`
- Nunca expor `SUPABASE_SERVICE_ROLE_KEY` no código cliente
- Manter `.env.local` fora do versionamento (gitignore)
- Regenerar chaves comprometidas imediatamente no painel Supabase

### Passo a Passo
```bash
# 1. Clonar
git clone https://github.com/seuusuario/stg-catalog-challenge.git
cd stg-catalog-challenge

# 2. Instalar dependências
npm install

# 3. Ajustar variáveis de ambiente (.env.local)
# (Veja bloco acima)

# 4. Rodar em desenvolvimento
npm run dev

# 5. Acessar
http://localhost:3000
```

### Scripts Úteis
```bash
npm run dev        # Ambiente de desenvolvimento (Turbopack)
npm run build      # Build de produção
npm start          # Servir build gerado
npm run lint       # Lint (ESLint)
npm run populate:images  # Script para popular imagens via Unsplash + Supabase
```

### Testes
(Caso queira ativar testes agora)
```bash
npx jest --passWithNoTests
```
Adapte conforme adicionar suites.

## Tecnologias e Ferramentas

### Linguagem & Runtime

- **TypeScript** (tipagem estática sobre JavaScript)
- **Node.js** (execução e toolchain)

### Framework / UI

- **Next.js 15** (App Router, Route Handlers, `middleware.ts`, otimizações de build e rotas dinâmicas)
- **React 19** (Concurrent Features, Server/Client Components)

### Estilização & Design System

- **Tailwind CSS 4** (utilitários de estilo)
- **PostCSS** + `@tailwindcss/postcss`
- **CSS Variables / Theme Tokens** (cores dinâmicas e suporte a modo escuro)

### Backend-as-a-Service / Dados

- **Supabase** (`@supabase/supabase-js`) para:
  - Autenticação de usuários
  - Postgres (tabelas de produtos, cupons, etc.)
  - (Preparado para Realtime e Storage se necessário)

### Estado & Data Fetching

- **React Context** (`AuthContext`) para sessão/autenticação
- **Custom Hooks** (`useAuth`, `useProducts`, `useRecentViews`) para encapsular lógica de dados
- **Local Storage** (persistência de itens vistos / carrinho auxiliares via utils)

### UI / Experiência do Usuário

- **react-toastify** (notificações e feedback de ações)
- **HeroCarousel** customizado (exibição de cupons promocionais)

### Testes

- **Jest 30** (runner)
- **@testing-library/react** (testes de componentes focados em comportamento do usuário)
- **@testing-library/jest-dom** (matchers estendidos)
- **@testing-library/react-hooks** (testes de hooks isolados)
- **babel-jest** / **ts-jest** (transform de código TS/JSX nos testes)

### Qualidade & Lint

- **ESLint 9** + `eslint-config-next`
- Regras de acessibilidade e boas práticas (derivadas do config Next.js)

### Build, Scripts & Tooling

- Scripts NPM: `dev`, `build`, `start`, `lint`, `populate:images`
- **tsx** (execução de scripts TypeScript sem build prévio – ex.: `scripts/populateUnsplash.ts`)
- **Babel** (presets: env, react, typescript) para compatibilidade de testes
- **TypeScript Compiler** (`tsconfig.json`) para checagem de tipos
- **dotenv** (carregamento de variáveis de ambiente)
- **@netlify/plugin-nextjs** (integração/otimizações de deploy em Netlify – preparado)

### Arquitetura & Organização

- **App Router** (`src/app`) com rotas segmentadas (`/catalog`, `/cart`, `/checkout`, `/produto/[id]`, etc.)
- **Route Handlers** (ex.: `src/app/api/check-email/route.ts`)
- **Middleware** (arquivo `middleware.ts`) para lógica transversal futura (ex.: auth, rewrites)
- **Componentes reutilizáveis** (Navbar, ProductCard, ProductGrid, Carousels)
- **Utils** (`cart.ts`, `toastManager.ts`) centralizando comportamentos de domínio
- **Services** (`supabaseClient.ts`, `couponService.ts`) isolando integração externa

### Outras Dependências Relevantes

- **React DOM** (renderização)
- **@types/** pacotes para tipagem (Node, React, Jest, React Toastify)

### Potenciais Extensões Futuras (já facilitadas pela base)

- Integração de gateway de pagamento
- Cálculo de frete em tempo real
- Cupons dinâmicos com regras condicionais
- Observabilidade (logs estruturados / métricas)

## Estrutura do Projeto (atualizada)

```
src/
  app/                # App Router (páginas e layouts)
    api/              # Route handlers (ex.: /api/check-email)
    cart/             # Página do carrinho
    catalog/          # Catálogo de produtos
    checkout/         # Fluxo de finalização
    historico/        # Histórico de compras (protegido)
    login/            # Autenticação
    produto/[id]/     # Página de produto dinâmico
    recovery/         # Recuperação de acesso
    register/         # Registro de usuário
    reset-password/   # Redefinição de senha
  components/         # Componentes de UI reutilizáveis
  contexts/           # Contextos (ex.: AuthContext)
  hooks/              # Hooks customizados (auth, produtos, etc.)
  services/           # Integrações externas (Supabase, cupons)
  types/              # Tipos TypeScript compartilhados
  utils/              # Funções utilitárias (carrinho, toast)
public/               # Assets estáticos
scripts/              # Scripts auxiliares (ex.: populateUnsplash)
.eslint.config.mjs    # Config ESLint
jest.config.js        # Config de testes
middleware.ts         # Middleware Next.js
next.config.ts        # Configurações Next
postcss.config.mjs    # Config PostCSS
package.json          # Dependências e scripts
README.md             # Documentação
```

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests. Para mais detalhes, veja (ou crie) um arquivo CONTRIBUTING.md.

## Licença

Este projeto está licenciado sob a licença MIT. Caso necessário, adicione um arquivo LICENSE com os termos.

## IA Utilizada

Usei **ChatGPT**, **Copilot** e o **GitHub Copilot**.

- **ChatGPT**: auxiliou na criação de recursos e na resolução de dúvidas.
- **Copilot**: ajudou na explicação e documentação do código.
- **GitHub Copilot (VS Code)**: atuou como assistente de codificação sugerindo trechos; eu implementei/adaptei e desenvolvi a estrutura para acomodar o código gerado.

## Banco de Dados (Supabase)

### Visão Geral
O projeto utiliza o Postgres do Supabase. Abaixo estão as tabelas mínimas recomendadas, colunas, tipos e políticas RLS (Row Level Security). Ative RLS em todas as tabelas que contenham dados de usuário e crie políticas explícitas.

### 1. Tabela: `products`
| Coluna        | Tipo                | Notas |
|---------------|--------------------|-------|
| id            | uuid (PK, default gen_random_uuid()) | Chave primária interna (se preferir usar `uuid` separado) |
| uuid          | uuid (único)       | Campo utilizado no frontend (`product.uuid`) |
| name          | text NOT NULL      | Nome do produto |
| description   | text               | Descrição opcional |
| category      | text               | Categoria (ex.: electronics) |
| price         | numeric(12,2) NOT NULL | Preço |
| quantity      | integer NOT NULL default 0 | Estoque |
| image_url     | text               | URL da imagem |
| created_at    | timestamptz default now() | Carimbo de criação |

RLS: normalmente leitura pública é aceitável. Políticas:
```sql
-- Habilitar RLS
aLTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Products are selectable by anyone" ON products
  FOR SELECT USING (true);

-- Escrita apenas por usuários autenticados com role específica (ex.: claim custom) – ajuste conforme necessidade
-- Exemplo simples (qualquer usuário logado pode inserir/atualizar - refine para produção):
CREATE POLICY "Insert products authenticated" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Update products authenticated" ON products
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
```
> Para ambiente real, restrinja via grupos/roles ou `auth.jwt()` claims customizadas.

### 2. Tabela: `coupons`
| Coluna   | Tipo                 | Notas |
|----------|----------------------|-------|
| id       | uuid PK default gen_random_uuid() | Identificador |
| code     | text UNIQUE NOT NULL | Código exibido no frontend |
| type     | text CHECK (type IN ('compra','frete')) | Tipo de desconto |
| value    | numeric(6,2) NOT NULL | Percentual / valor (interpretação no código) |
| ativo    | boolean default true | Se o cupom está ativo |
| created_at | timestamptz default now() | Criação |

RLS:
```sql
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coupons readable by anyone active" ON coupons
  FOR SELECT USING (ativo = true);

CREATE POLICY "Manage coupons authenticated" ON coupons
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
```
> Opcional: separar SELECT público apenas para `ativo = true` e restringir INSERT/UPDATE/DELETE a um grupo admin.

### 3. Tabela: `orders` (sugerida para evolução)
| Coluna        | Tipo                | Notas |
|---------------|--------------------|-------|
| id            | uuid PK default gen_random_uuid() | |
| user_id       | uuid NOT NULL references auth.users(id) | Dono do pedido |
| total_amount  | numeric(12,2) NOT NULL | Valor total |
| status        | text default 'pending' | pending/paid/canceled |
| created_at    | timestamptz default now() | |
| updated_at    | timestamptz default now() | Atualizar via trigger |

RLS:
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User selects own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "User inserts own orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());
```
> Adicione política de UPDATE restrita ao próprio dono ou a processos server-side.

### 4. Tabela: `order_items` (sugerida)
| Coluna    | Tipo | Notas |
|-----------|------|-------|
| id        | uuid PK default gen_random_uuid() | |
| order_id  | uuid references orders(id) ON DELETE CASCADE | Pedido |
| product_id| uuid references products(id) | Produto |
| quantity  | integer NOT NULL | Quantidade |
| unit_price| numeric(12,2) NOT NULL | Valor unitário no momento |

RLS:
```sql
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User sees own order items" ON order_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  ));
```
> Inserts devem validar que o `order_id` pertence ao usuário.

### 5. (Opcional) `recent_views`
Para suportar histórico local no backend futuramente:
| Coluna     | Tipo | Notas |
|------------|------|-------|
| id         | uuid PK default gen_random_uuid() | |
| user_id    | uuid references auth.users(id) | Usuário |
| product_id | uuid references products(id) | Produto |
| viewed_at  | timestamptz default now() | |

Política SELECT/INSERT limitada a `user_id = auth.uid()`.

### Índices Recomendados
```sql
CREATE INDEX ON products (category);
CREATE INDEX ON products (created_at DESC);
CREATE INDEX ON coupons (code);
CREATE INDEX ON orders (user_id, created_at DESC);
```

### Segurança
- Nunca usar a Service Role key no frontend.
- Definir expiração curta para tokens públicos se customizar JWT.
- Auditar logs de acessos sensíveis (Supabase > Logs).

### Migrações
Para controle versionado, considere usar `supabase migration new <nome>` e manter a pasta `supabase/migrations` no repositório.

## Acesso ao Projeto (Deploy)

Ambiente de produção: https://stg-catalog-challenge.netlify.app/

> Caso o link esteja fora do ar, verifique se o último build no Netlify concluiu sem erros.

## Checklist de Funcionalidades

### Implementadas
- [x] Catálogo de produtos (grid responsiva, carregamento via Supabase)
- [x] Página de produto dinâmica (`/produto/[id]`)
- [x] Carrinho (adicionar/remover itens, persistência local)
- [x] Autenticação (login, registro, recuperação e redefinição de senha)
- [x] Histórico de compras (rota protegida)
- [x] Barra de busca / navegação para resultados
- [x] Navbar responsiva (menus, conta, links principais)
- [x] Exibição de cupons promocionais (Hero manual + base para validação de códigos)
- [x] Toasts de feedback (react-toastify)
- [x] Script `populate:images` (Unsplash + atualização de produtos)
- [x] Testes iniciais (ex.: ProductCard, login form, hook de auth)
- [x] Organização modular (contexts, hooks, services, utils)

### Em Progresso / Planejadas
- [ ] Aplicação real de cupons no cálculo do carrinho
- [ ] Checkout completo com integração de pagamento
- [ ] Gestão de estoque avançada (baixa automática / reservas)
- [ ] Painel admin (CRUD de produtos e cupons)
- [ ] Tema dark finalizado em todas as páginas/componentes
- [ ] Internacionalização (i18n)
- [ ] Observabilidade (logs estruturados / métricas)
- [ ] Relatórios de vendas / dashboard
- [ ] Acessibilidade WCAG AA auditada
- [ ] Otimização de imagens dinâmica (loader / blur placeholders)

> Marque novas entregas mantendo este checklist atualizado para dar visibilidade do roadmap.

