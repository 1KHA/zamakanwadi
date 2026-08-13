import { Role } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: Role;
    phone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      phone?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role;
    phone?: string | null;
    /** Timestamp of the last DB role re-check. */
    checkedAt?: number;
  }
}
