# Database

Turso (SQLite edge database) with Drizzle ORM for type-safe queries in Astro SSR pages.

## Overview

The database layer uses three packages:

| Package | Role | Env |
|---|---|---|
| `@libsql/client` | Turso HTTP client | runtime |
| `drizzle-orm` | Query builder + schema types | runtime |
| `drizzle-kit` | Migrations CLI + Studio GUI | dev only |

Turso provides a globally-replicated SQLite database accessible over HTTP. Drizzle generates typed queries from the schema and handles migration files.

## Setup

### Environment variables

Two variables are required. Add them to `.env` (gitignored):

```env
TURSO_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=eyJhb...
```

These are typed in `src/env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly TURSO_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
}
```

- In Astro server code, access via `import.meta.env.TURSO_URL`.
- In `drizzle.config.ts`, access via `process.env.TURSO_URL` (runs in Node, not Vite).
- On Vercel, set both variables in the project's environment settings.

## Schema

Defined in `src/db/schema.ts`. Current tables:

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

### Adding a table

1. Add the table definition to `src/db/schema.ts`.
2. Run `npm run db:generate` to create a migration SQL file in `drizzle/`.
3. Run `npm run db:migrate` to apply it to Turso.

## Client

Defined in `src/db/client.ts`. Exports a single `db` instance:

```ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: import.meta.env.TURSO_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
```

The `{ schema }` argument enables Drizzle's relational query API (`db.query.users...`).

## Migrations

Drizzle Kit config lives in `drizzle.config.ts`. Migration SQL files are output to `drizzle/`.

### npm scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run db:generate` | `drizzle-kit generate` | Diff schema.ts against the last snapshot, write a new SQL migration file |
| `npm run db:migrate` | `drizzle-kit migrate` | Apply pending migrations to the Turso database |
| `npm run db:studio` | `drizzle-kit studio` | Open Drizzle Studio (browser GUI) to inspect and edit data |

### Drizzle config

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

## Usage in Pages

Import `db` in the Astro frontmatter (server-only). Never import it inside a `<script>` tag -- that runs on the client and has no access to server env vars or the database.

```astro
---
// src/pages/example.astro
import { db } from '../db/client';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

// Select all users
const allUsers = await db.select().from(users);

// Select by email
const [user] = await db.select().from(users).where(eq(users.email, 'kim@example.com'));

// Insert
await db.insert(users).values({
  id: crypto.randomUUID(),
  email: 'new@example.com',
  name: 'New User',
});

// Relational query (uses the schema passed to drizzle())
const result = await db.query.users.findFirst({
  where: eq(users.email, 'kim@example.com'),
});
---

<p>{user?.name}</p>
```

### Rules

- **Server-only** -- `db` uses `import.meta.env` which is only available in Astro frontmatter and API routes, never in client `<script>` blocks.
- **Await everything** -- all Drizzle queries return promises.
- **Use the schema exports** -- import table references from `../db/schema` for type-safe `where`, `select`, and `insert` calls.

## Key Files

| File | Purpose |
|---|---|
| `src/db/schema.ts` | Table definitions (single source of truth) |
| `src/db/client.ts` | Drizzle client instance (`db`) |
| `src/env.d.ts` | TypeScript types for env vars |
| `drizzle.config.ts` | Drizzle Kit config (dialect, credentials, paths) |
| `drizzle/` | Generated migration SQL files and snapshots |

## See Also

- SSR.md -- server-side rendering, middleware, and Vercel deployment context
