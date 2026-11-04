![ubiquitous-octo-giggle](/public/ubiquitous-octo-giggle.jpg)

# ubiquitous-octo-giggle

Start application with:

```bash
pnpm dev
```


## Challange

Create a NextJS application with tRPC

## Stack

#### dependencies

- @tanstack/react-query
    - to data fetch
- @trpc/client
    - to consume apis
- @trpc/server
    - to create apis
- @trpc/tanstack-react-query
    - connects tRPC
- next
    - the fullstack framework
- react
    - create frontend components
- react-dom
    - render frontend components
- server-only
    - build fail if file is imported to client
- zod
    - check data against schema

#### dev dependencies

- typescript
    - strongly typed programming language 
- @types/node
    - type definitions
- @types/react
    - type definitions
- @types/react-dom
    - type definitions
- eslint
    - automated tool for code analysis
- eslint-config-next
    - next lint rules

- @tailwindcss/turbopack
    - how turbopack process tailwindcss
- tailwindcss
    - css framework

## Application

### Folders

- `app`: Next.js Router
- `components`: Reusable UI pieces
- `lib`: Shared stuff
- `server`: Backend logic, tRCP apis and a store where data lives
- `public`: Static files

### How it runs

- The application is started
- `next.config.ts` is loaded
- NodeJS starts a `localhost:3000` server
- when browser hits `/`, Next.js Router open `app/page.tsx`
- when user clicks on `Nova Tarefa` button
    - a Link redirect to `/tasks/new` and
    - open `/app/tasks/new/page.tsx`
- when user clicks on `Criar Tarefa` button
    - page calls client tRPC `create` mutation
    - that calls server tRPC `create` task
- when user clicks on `Editar`
    - ...
- when user clicks on `Excluir`
    - ...
- when user clicks on `...`
    - ...

### What runs in Frontend?

- app/providers.tsx 
    - (tanstack/react-query) + (tRPC/client)
- components/*
- lib/trpc/client.ts

### What runs in Backend?

- lib/trpc/server.ts
- server/*
- app/api/trpc/[trpc]/route.ts

- Server Components:
    - app/layout.tsx
    - app/page.tsx
    - app/tasks/new/page.tsx
    - app/tasks/[id]/edit/page.tsx