'use client';

import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold">Zamakan</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {isRTL
                ? 'مساحات عمل مبتكرة وخدمات مجتمعية مصممة لدعم نموك.'
                : 'Innovative workspace solutions and community-driven services designed to support your growth.'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                info@zamakan.com
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                +966 12 345 6789
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                {isRTL ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Zamakan. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
}
