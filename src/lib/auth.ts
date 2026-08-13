import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';
import { Role } from '@prisma/client';
import {
  ROLE_RECHECK_MS,
  SESSION_MAX_AGE_SECONDS,
  SESSION_UPDATE_AGE_SECONDS,
} from './sessionPolicy';

// Constant-time-ish fallback: a real bcrypt hash we compare against when the
// account does not exist, so response timing can't be used to enumerate emails.
// Real cost-12 hash of an unused passphrase; comparing against it costs the
// same ~230ms as a genuine check.
const DUMMY_HASH = '$2b$12$dTiEyyAWhB6CnO0fJbsbRexjUWdtkEFfb6451Gf2BO9T4E65x31ky';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') return null;

        const email = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: 'insensitive' } },
        });

        if (!user || !user.password) {
          // Burn the same bcrypt time as a real check so timing doesn't leak
          // whether the account exists.
          await compare(credentials.password, DUMMY_HASH);
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
        token.checkedAt = Date.now();
        return token;
      }

      // Re-read the role periodically so a demotion or deletion takes effect
      // without waiting for the token to expire.
      const checkedAt = typeof token.checkedAt === 'number' ? token.checkedAt : 0;
      if (token.sub && Date.now() - checkedAt >= ROLE_RECHECK_MS) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, phone: true },
        });
        if (!fresh) {
          // Account is gone: strip identity so every downstream check fails.
          delete token.role;
          delete token.sub;
          return token;
        }
        token.role = fresh.role;
        token.phone = fresh.phone;
        token.checkedAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.phone = token.phone as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    newUser: '/signup',
  },
};
