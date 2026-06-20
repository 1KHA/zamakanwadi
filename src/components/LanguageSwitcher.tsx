'use client';

import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{i18n.language === 'ar' ? t('arabic') : t('english')}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          <button
            onClick={() => changeLang('en')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
              i18n.language === 'en' ? 'text-primary font-medium' : 'text-gray-700'
            }`}
          >
            {t('english')}
          </button>
          <button
            onClick={() => changeLang('ar')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
              i18n.language === 'ar' ? 'text-primary font-medium' : 'text-gray-700'
            }`}
          >
            {t('arabic')}
          </button>
        </div>
      )}
    </div>
  );
}
