/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly TURSO_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly BETTER_AUTH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: import('better-auth').User | null;
    session: import('better-auth').Session | null;
  }
}
