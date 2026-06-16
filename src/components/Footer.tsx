import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const links = [
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/plans', label: t('nav.plans') },
    { to: '/library', label: t('nav.library') },
    { to: '/community', label: t('nav.community') },
    { to: '/careers', label: t('nav.careers') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold">Zamakan</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering businesses and individuals with innovative workspace solutions and community-driven services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{isRTL ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-secondary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{isRTL ? 'خدماتنا' : 'Our Services'}</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">Work Offices</span></li>
              <li><span className="text-gray-400 text-sm">Meeting Rooms</span></li>
              <li><span className="text-gray-400 text-sm">Theaters</span></li>
              <li><span className="text-gray-400 text-sm">Innovation Lab</span></li>
              <li><span className="text-gray-400 text-sm">Consulting</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{isRTL ? 'تواصل معنا' : 'Contact Us'}</h3>
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
                Saudi Arabia
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
