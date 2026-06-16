import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Search, User, ShoppingCart } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/plans', label: t('nav.plans') },
    { to: '/library', label: t('nav.library') },
    { to: '/community', label: t('nav.community') },
    { to: '/careers', label: t('nav.careers') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold text-dark hidden sm:block">Zamakan</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-50 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/cart"
              className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-50 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link
              to="/signin"
              className="hidden sm:flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
              {t('nav.signIn')}
            </Link>
            <LanguageSwitcher />

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.to)
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/signin"
              onClick={() => setMobileOpen(false)}
              className="block sm:hidden px-3 py-2 text-sm font-medium text-primary"
            >
              {t('nav.signIn')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
