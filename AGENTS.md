# 📘 Code-Connect — Diretrizes, Regras e Contexto do Projeto

Este documento serve como a **fonte única da verdade (Single Source of Truth)** para desenvolvedores e assistentes de Inteligência Artificial que trabalham no repositório **Code-Connect**.

---

## 1. 📌 Visão Geral do Projeto

O **Code-Connect** é uma aplicação monorepo moderna configurada com `pnpm workspaces`, composta por duas aplicações principais:

*   **`apps/api`**: Backend RESTful construído com **NestJS 11**, TypeScript, Express e Jest.
*   **`apps/web`**: Frontend construído com **React 19**, **Vite 8**, **Tailwind CSS**, **Atomic Design** e TypeScript.

---

## 2. 🗂️ Estrutura de Diretórios

```plaintext
Code-Connect/
├── apps/
│   ├── api/                          # Aplicação Backend (NestJS REST API)
│   │   ├── src/                      # Código-fonte da API
│   │   │   ├── common/               # Filtros, interceptors, decorators e pipes globais
│   │   │   │   ├── filters/          # Global Exception Filters (padronização de erros REST)
│   │   │   │   ├── interceptors/     # Interceptors (ex.: response transform)
│   │   │   │   └── pipes/            # Validation & Transformation Pipes
│   │   │   ├── modules/              # Módulos de domínio RESTful
│   │   │   │   └── <recurso>/        # Ex.: users/, posts/, auth/
│   │   │   │       ├── dto/          # Data Transfer Objects (Create, Update, Query)
│   │   │   │       ├── entities/     # Modelos de domínio / schemas de banco
│   │   │   │       ├── <recurso>.controller.ts
│   │   │   │       ├── <recurso>.service.ts
│   │   │   │       ├── <recurso>.module.ts
│   │   │   │       └── <recurso>.service.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts               # Ponto de entrada (Bootstrap com prefixo /api/v1)
│   │   ├── test/                     # Testes E2E (End-to-End com Supertest)
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Aplicação Frontend (React + Vite + Tailwind)
│       ├── public/                   # Arquivos estáticos e ícones
│       ├── src/                      # Código-fonte da interface
│       │   ├── assets/               # Imagens e assets estáticos
│       │   ├── components/           # Componentes organizados por Atomic Design
│       │   │   ├── atoms/            # Elementos indivisíveis (Button, Input, Badge, Icon)
│       │   │   ├── molecules/        # Combinações simples (FormField, SearchBar, StatCard)
│       │   │   ├── organisms/        # Seções complexas (Header, Sidebar, PostCard, Feed)
│       │   │   └── templates/        # Estruturas de layout (AuthLayout, DashboardLayout)
│       │   ├── pages/                # Páginas da aplicação (conectam dados aos templates)
│       │   ├── hooks/                # Custom React Hooks
│       │   ├── services/             # Clientes HTTP e integração com a API
│       │   ├── types/                # Interfaces e tipos TypeScript compartilhados
│       │   ├── utils/                # Funções utilitárias puras
│       │   ├── App.tsx               # Componente raiz da aplicação
│       │   ├── App.css
│       │   ├── index.css             # Diretivas do Tailwind CSS e estilos base globais
│       │   └── main.tsx              # Ponto de entrada (Bootstrap do React)
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts            # Configuração do Vite
│
├── package.json                      # Scripts raiz e orquestração do monorepo
├── pnpm-lock.yaml                    # Lockfile do pnpm
├── pnpm-workspace.yaml               # Definição dos workspaces do pnpm (apps/*)
├── .gitignore                        # Arquivos e pastas ignorados pelo Git
└── AGENTS.md                         # Este arquivo de contexto e regras
```

---

## 3. 🛠️ Stack Tecnológica & Padrões

### 3.1 Backend (`apps/api`)
*   **Framework**: [NestJS](https://nestjs.com/) v11+
*   **Linguagem**: TypeScript 5.7+
*   **Arquitetura**: Modular RESTful (Controller → Service → Repository / Data Layer)
*   **Linter & Formatter**: ESLint + Prettier
*   **Testes**: Jest (Unitários) + Supertest (E2E)
*   **Porta padrão**: `3000` (ou variável `PORT`)

### 3.2 Frontend (`apps/web`)
*   **Framework/Biblioteca**: [React](https://react.dev/) v19+
*   **Build Tool**: [Vite](https://vite.dev/) v8+
*   **Arquitetura de UI**: **Atomic Design** (`atoms`, `molecules`, `organisms`, `templates`, `pages`)
*   **Estilização**: **Tailwind CSS** (utilitários de classe modernos e consistentes)
*   **Testes**: **Vitest** + **React Testing Library** (obrigatório para todos os componentes)
*   **Linguagem**: TypeScript 6+
*   **Linter**: [Oxlint](https://oxc.rs/)
*   **Porta padrão**: `5173` (padrão Vite)

---

## 4. ⚡ Scripts e Comandos de Execução

> **Atenção**: Sempre utilize o **`pnpm`** como gerenciador de pacotes. Não utilize `npm` ou `yarn`.

### Na Raiz do Repositório:
*   **Instalar dependências**: `pnpm install`
*   **Executar ambos em paralelo (API + Web)**: `pnpm dev`
*   **Build de todos os projetos**: `pnpm build`
*   **Lint em todos os projetos**: `pnpm lint`

### Comandos Específicos por Aplicação:
| Aplicação | Desenvolvimento | Build | Lint | Testes |
| :--- | :--- | :--- | :--- | :--- |
| **API** | `pnpm api:dev` | `pnpm api:build` | `pnpm api:lint` | `pnpm api:test` |
| **Web** | `pnpm web:dev` | `pnpm web:build` | `pnpm web:lint` | `pnpm --filter web test` |

---

## 5. 🌐 Diretrizes do Backend (`apps/api`): Princípios REST

O backend deve seguir rigorosamente as boas práticas e restrições da arquitetura **REST**:

### 5.1 Nomenclatura e Design de Recursos (URIs)
1.  **Substantivos no Plural**: Use substantivos no plural para representar coleções e recursos. Nunca use verbos na URI.
    *   ✅ `/api/v1/users`, `/api/v1/posts`, `/api/v1/posts/:id/comments`
    *   ❌ `/api/v1/getUsers`, `/api/v1/createPost`, `/api/v1/delete-user`
2.  **Hierarquia e Relacionamentos**: Represente relações aninhadas de forma lógica:
    *   Exemplo: `/api/v1/users/:userId/posts` (posts de um usuário específico).
3.  **Kebab-case em URLs**: Use `kebab-case` para nomes compostos em endpoints (ex.: `/api/v1/user-profiles`).
4.  **Versionamento**: Todas as rotas públicas devem ser versionadas no path (ex.: `/api/v1/...`).

### 5.2 Uso Semântico dos Métodos HTTP & Idempotência
| Método | Descrição | Idempotente? | Status de Sucesso Típico |
| :--- | :--- | :--- | :--- |
| **`GET`** | Recupera dados de um recurso ou coleção. Não altera estado no servidor. | Sim | `200 OK` |
| **`POST`** | Cria um novo recurso subordinado ou executa operação de processamento. | Não | `201 Created` |
| **`PUT`** | Substitui completamente o recurso existente pelo payload enviado. | Sim | `200 OK` ou `204 No Content` |
| **`PATCH`**| Aplica modificações parciais no recurso existente. | Não (ou Sim) | `200 OK` |
| **`DELETE`**| Remove o recurso especificado. | Sim | `204 No Content` ou `200 OK` |
| **`HEAD` / `OPTIONS`**| Metadados de cabeçalhos e pre-flight CORS. | Sim | `200 OK` / `204 No Content` |

### 5.3 Códigos de Status HTTP Semânticos
*   **`200 OK`**: Sucesso em consultas (`GET`), atualizações completas (`PUT`) ou parciais (`PATCH`).
*   **`201 Created`**: Recurso criado com sucesso (`POST`). Opcionalmente acompanhado do header `Location`.
*   **`204 No Content`**: Sucesso sem corpo de retorno (comum em `DELETE` ou `PUT`/`PATCH` sem body de resposta).
*   **`400 Bad Request`**: Dados de entrada inválidos (erro de validação do DTO via `ValidationPipe`).
*   **`401 Unauthorized`**: Falha de autenticação (credenciais inválidas ou ausência de token JWT).
*   **`403 Forbidden`**: Usuário autenticado, mas sem permissão de acesso ao recurso (RBAC/ACL).
*   **`404 Not Found`**: Recurso ou endpoint inexistente.
*   **`409 Conflict`**: Conflito de estado (ex.: tentativa de cadastrar e-mail já existente).
*   **`422 Unprocessable Entity`**: Erro de regra de negócio que impede o processamento do payload sintaticamente válido.
*   **`500 Internal Server Error`**: Erro inesperado do servidor. Nunca expor stack traces ou dados sensíveis em produção.

### 5.4 Statelessness (Comunicação Sem Estado)
*   Toda requisição deve conter todas as informações necessárias para sua autenticação e autorização (ex.: cabeçalho `Authorization: Bearer <token>`).
*   Nenhuma sessão de usuário deve ser mantida na memória do servidor da API.

### 5.5 Padronização de Erros e Respostas
Todas as respostas de erro devem seguir uma estrutura JSON previsível e consistente:
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password is too short"],
  "error": "Bad Request",
  "timestamp": "2026-08-21T13:45:00.000Z",
  "path": "/api/v1/users"
}
```

### 5.6 Paginação, Filtros e Ordenação
*   Coleções grandes devem sempre ser paginadas via Query Parameters: `?page=1&limit=20&sort=createdAt:desc&status=active`.
*   Respostas de listagem paginada devem encapsular dados e metadados:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 6. 🎨 Diretrizes do Frontend (`apps/web`): Atomic Design, Tailwind & Testes

### 6.1 Atomic Design
A interface deve ser estruturada seguindo rigorosamente a metodologia **Atomic Design**:

1.  **Átomos (`src/components/atoms/`)**:
    *   Componentes base e indivisíveis da UI (ex.: `Button`, `Input`, `Badge`, `Icon`, `Typography`, `Avatar`).
    *   Devem ser altamente reutilizáveis, sem dependência de regras de negócio ou serviços de API.
2.  **Moléculas (`src/components/molecules/`)**:
    *   Combinações simples de átomos funcionando como uma unidade (ex.: `FormField` = Label + Input + ErrorMessage, `SearchBar` = Input + IconButton, `UserBadge` = Avatar + Text).
3.  **Organismos (`src/components/organisms/`)**:
    *   Seções completas e mais complexas da UI compostas por moléculas e átomos (ex.: `Header`, `Sidebar`, `PostCard`, `FeedList`, `LoginForm`). Podem gerenciar estado local da seção.
4.  **Templates (`src/components/templates/`)**:
    *   Layouts e wireframes visuais de páginas definindo o grid e posicionamento das seções, recebendo slots/children (ex.: `MainLayout`, `AuthLayout`, `DashboardLayout`).
5.  **Páginas (`src/pages/`)**:
    *   Instâncias finais de páginas onde os dados reais, queries de API e estados globais são injetados nos templates e organismos.

### 6.2 Estilização com Tailwind CSS & Design Tokens (Cores e Tipografia)
*   Utilize **Tailwind CSS** como ferramenta principal de estilização através de classes utilitárias.
*   Evite CSS customizado solto (`.css` inline/separado) a menos que estritamente necessário para animações complexas ou resets globais.
*   Mantenha classes organizadas e reutilize composições de classes ou componentes atômicos para evitar duplicação.
*   Utilize suporte a variantes responsivas (`sm:`, `md:`, `lg:`) e de estado (`hover:`, `focus:`, `disabled:`).

#### 6.2.1 Paleta de Cores e Tokens Semânticos (`@theme`)
> **Regra Mandatória**: **É proibido o uso de valores hexadecimais arbitrários direto nas classes do Tailwind** (ex.: `bg-[#81FE88]`, `text-[#BCBFC2]`, `border-[#4E5558]`). Utilize sempre as classes utilitárias mapeadas no `@theme` em `apps/web/src/index.css`.

| Token / Variável | Hex / Valor | Classes Tailwind Geradas | Aplicação Principal |
| :--- | :--- | :--- | :--- |
| `--color-brand-green` | `#81FE88` | `bg-brand-green`, `text-brand-green`, `border-brand-green`, `ring-brand-green` | Cor primária de destaque, botões principais, links ativos e bordas em foco |
| `--color-brand-green-hover` | `#6DE775` | `hover:bg-brand-green-hover`, `hover:text-brand-green-hover` | Estado hover de botões e links primários |
| `--color-brand-green-active` | `#5CD464` | `active:bg-brand-green-active` | Estado active/pressed de botões primários |
| `--color-brand-petroleum` | `#132E35` | `bg-brand-petroleum`, `text-brand-petroleum` | Verde petróleo escuro |
| `--color-brand-dark` | `#171D1F` | `bg-brand-dark`, `ring-offset-brand-dark` | Fundo principal de cards, modais e containers |
| `--color-brand-dark-text` | `#131819` | `text-brand-dark-text` | Texto escuro sobre fundos claros/verdes de destaque |
| `--color-brand-black` | `#01080E` | `bg-brand-black` | Fundo geral da aplicação (body/background) |
| `--color-brand-grafite` | `#00090E` | `bg-brand-grafite` | Fundo grafite escuro |
| `--color-brand-input` | `#3E4446` | `bg-brand-input` | Fundo padrão de inputs e botões secundários |
| `--color-brand-input-hover` | `#4E5558` | `hover:bg-brand-input-hover` | Hover de botões secundários |
| `--color-brand-input-active` | `#353A3C` | `active:bg-brand-input-active` | Active de botões secundários |
| `--color-brand-border` | `#4E5558` | `border-brand-border` | Linhas divisórias e bordas sutis |
| `--color-brand-border-card` | `#22292B` | `border-brand-border-card` | Bordas de cards e containers |
| `--color-brand-placeholder` | `#8D9599` | `placeholder-brand-placeholder` | Placeholders de campos de formulário |
| `--color-brand-hover-dark` | `#252C2E` | `hover:bg-brand-hover-dark` | Hover de botões sociais e botões ghost |
| `--color-brand-active-dark` | `#1E2426` | `active:bg-brand-active-dark` | Active de botões sociais e botões ghost |
| `--color-brand-muted` | `#BCBFC2` | `text-brand-muted` | Labels de formulários, textos secundários e legendas |
| `--color-brand-gray` | `#888888` | `text-brand-gray`, `border-brand-gray` | Cinza neutro |
| `--color-brand-offwhite` | `#E1E1E1` | `text-brand-offwhite` | Texto off-white claro |

#### 6.2.2 Tipografia & Tamanhos de Fonte
> **Regra Mandatória**: **Utilize os tokens de tamanho de fonte nativos do Tailwind mais próximos** em vez de tamanhos arbitrários com colchetes (ex.: `text-[15px]` ou `text-[18px]`).

| Token Tailwind | Tamanho | Aplicação Típica |
| :--- | :--- | :--- |
| **`text-xs`** | 12px (0.75rem) | Labels de campos, mensagens de ajuda/erro, textos auxiliares e rodapés |
| **`text-sm`** | 14px (0.875rem) | Textos de inputs, subtítulos de cabeçalho, links destacados |
| **`text-base`** | 16px (1rem) | Corpo de texto padrão, botões de tamanho médio |
| **`text-lg`** | 18px (1.125rem) | Parágrafos com ênfase, botões grandes |
| **`text-xl`** | 20px (1.25rem) | Títulos de seções intermediárias |
| **`text-2xl`** / **`text-3xl`** | 24px - 30px | Títulos de páginas e cards principais (`h1`, `h2`) |

### 6.3 🧪 Testes Obrigatórios para Componentes
> **Regra Mandatória**: **Todo componente criado deve possuir um teste cobrindo o seu uso essencial.**

1.  **Localização**: O arquivo de teste deve ficar junto ao componente:
    *   `src/components/atoms/Button/Button.tsx`
    *   `src/components/atoms/Button/Button.test.tsx` (ou `.spec.tsx`)
2.  **O que testar (Uso Essencial)**:
    *   **Renderização inicial**: O componente renderiza corretamente com as props padrão.
    *   **Variações de Props**: Renderização correta com diferentes variantes (ex.: `variant="primary" | "secondary"`, `disabled`, `isLoading`).
    *   **Interações do Usuário**: Disparo correto de eventos essenciais (ex.: `onClick`, `onChange`, submissão de formulário).
    *   **Acessibilidade básica**: Presença de roles, labels acessíveis ou estados ARIA esperados.
3.  **Stack de Testes**: **Vitest** + **@testing-library/react** + **@testing-library/user-event** + **@testing-library/jest-dom**.

---

## 7. 🌿 Git & Padrão de Conventional Commits

Ambos os projetos (`apps/api` e `apps/web`) e a raiz do monorepo devem utilizar rigorosamente a convenção **Conventional Commits**.

### 7.1 Formato da Mensagem de Commit
```plaintext
<tipo>(<escopo opcional>): <descrição no imperativo e em minúsculas>

[corpo opcional explicando o porquê da mudança]

[rodapé opcional para referenciar issues ou BREAKING CHANGE]
```

### 7.2 Tipos de Commit Permitidos
*   **`feat`**: Nova funcionalidade ou recurso para o usuário/sistema.
*   **`fix`**: Correção de bug ou comportamento indesejado.
*   **`refactor`**: Refatoração de código sem alterar comportamento externo nem corrigir bug.
*   **`test`**: Adição, correção ou atualização de testes (unitários, integração, E2E).
*   **`style`**: Mudanças puramente visuais/formatação que não afetam a lógica (espaçamento, linter fixes, Tailwind classes refactor).
*   **`perf`**: Alteração de código com foco exclusivo em melhoria de desempenho.
*   **`docs`**: Adição ou alteração de documentação (README, JSDoc, AGENTS.md, etc.).
*   **`chore`**: Tarefas de manutenção, atualização de dependências, scripts do repositório, build configs.
*   **`ci`**: Alterações em scripts de integração contínua (GitHub Actions, pipelines).

### 7.3 Escopos Recomendados
*   **API**: `api`, `api/auth`, `api/users`, `api/posts`, `api/common`
*   **Web**: `web`, `web/atoms`, `web/molecules`, `web/organisms`, `web/templates`, `web/pages`, `web/hooks`
*   **Raiz / Monorepo**: `repo`, `deps`, `config`

### 7.4 Exemplos Práticos
*   `feat(api/users): add endpoint to retrieve user profile by id`
*   `fix(web/atoms): fix button disabled state styling in tailwind`
*   `test(web/molecules): add unit test for SearchBar input and submit events`
*   `docs(repo): update AGENTS.md with REST and atomic design guidelines`
*   `feat(api/auth)!: change jwt payload structure to include user roles` *(Breaking Change)*

---

## 8. 📝 Padrões de Código & Nomenclatura

*   **Convenção de Arquivos**:
    *   Backend (NestJS): `kebab-case.tipo.ts` (ex.: `auth.service.ts`, `create-post.dto.ts`).
    *   Frontend (React Componentes): `PascalCase.tsx` (ex.: `Button.tsx`, `PostCard.tsx`, `Button.test.tsx`).
    *   Frontend (Hooks/Utils/Types): `camelCase.ts` (ex.: `useAuth.ts`, `formatDate.ts`).
*   **TypeScript**:
    *   **Proibido uso arbitrário de `any`**: Tipar explicitamente retornos de funções públicas, DTOs, interfaces de props e entidades.
    *   Preferir `interface` para estruturas de dados/contratos e `type` para uniões/tipos utilitários.

---

## 9. 🤖 Instruções para Agentes de IA

Ao implementar código ou refatorações neste projeto:
1.  **Atomic Design & Testes**: Ao criar qualquer componente em `apps/web`, posicione-o na pasta atômica correta (`atoms`, `molecules`, etc.) e **crie imediatamente o arquivo de teste correspondente (`*.test.tsx`) cobrindo seu uso essencial**.
2.  **Design Tokens & Tailwind `@theme`**: Nunca utilize valores hexadecimais arbitrários (ex.: `bg-[#...]`, `text-[#...]`) ou fontes arbitrárias (ex.: `text-[15px]`). Utilize estritamente os tokens de cores definidos no `@theme` (`bg-brand-green`, `text-brand-muted`, etc.) e os tokens de tamanho padrão do Tailwind (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-2xl`, etc.).
3.  **Aderência REST**: Ao criar ou modificar endpoints em `apps/api`, garanta nomes no plural, verbos HTTP semânticos, status codes corretos e validação via DTOs.
4.  **Isolamento no Monorepo**: Instale dependências com `--filter api` ou `--filter web`.
5.  **Conventional Commits**: Sugira mensagens de commit seguindo rigorosamente a convenção especificada.
6.  **Validação Final**: Execute testes e linter antes de considerar a tarefa finalizada.
