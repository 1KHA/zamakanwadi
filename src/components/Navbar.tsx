'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, LayoutDashboard, LampDesk, ShieldCheck } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

export default function Navbar() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const isLoading = status === 'loading';
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="shrink-0">
            <Logo width={120} height={54} />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/#packages"
              className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {isRTL ? 'مساحات الأعمال' : 'Spaces'}
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Link>

            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <LampDesk className="w-4 h-4" />
              <span className="hidden sm:inline">{isRTL ? 'الحجوزات' : 'Bookings'}</span>
            </Link>

            {/* While the session resolves, render a placeholder so signed-in
                users don't get a "Sign In" flash on every page load. */}
            {isLoading ? (
              <div className="w-28 h-9 rounded-lg bg-gray-100 animate-pulse" aria-hidden />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-secondary-dark bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {isRTL ? 'الملف الشخصي' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title={isRTL ? 'تسجيل الخروج' : 'Sign out'}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <User className="w-4 h-4" />
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            )}

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
