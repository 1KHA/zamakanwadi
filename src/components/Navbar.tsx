'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold text-dark hidden sm:block">Zamakan</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
