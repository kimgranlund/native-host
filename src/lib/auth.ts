import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/client';

const googleId = import.meta.env.GOOGLE_CLIENT_ID;
const googleSecret = import.meta.env.GOOGLE_CLIENT_SECRET;

const baseURL = import.meta.env.DEV ? 'http://localhost:4321' : import.meta.env.BETTER_AUTH_URL;

export const auth = betterAuth({
  baseURL,
  secret: import.meta.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL.replace(/\/$/, '')],
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  socialProviders: googleId && googleSecret
    ? { google: { clientId: googleId, clientSecret: googleSecret } }
    : {},
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      updateUserInfoOnLink: true,
    },
  },
  session: {
    cookieCache: { enabled: true, maxAge: 300 },
  },
});
