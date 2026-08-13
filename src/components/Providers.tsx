'use client';

import { SessionProvider } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import SessionGuard from '@/components/SessionGuard';

export default function Providers({ children }: { children: React.ReactNode }) {
  // No refetchInterval on purpose — polling would keep an idle tab's session
  // alive and defeat the inactivity timeout in SessionGuard.
  return (
    <SessionProvider>
      <SessionGuard />
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </SessionProvider>
  );
}
