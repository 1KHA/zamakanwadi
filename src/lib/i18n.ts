import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        plans: 'Plans',
        library: 'Library',
        community: 'Community',
        careers: 'Careers',
        contact: 'Contact',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        profile: 'Profile',
      },
      footer: {
        rights: 'All rights reserved',
      },
      language: 'Language',
      arabic: 'العربية',
      english: 'English',
    },
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        about: 'من نحن',
        services: 'خدماتنا',
        plans: 'خططنا',
        library: 'المكتبة',
        community: 'مجتمعنا',
        careers: 'الوظائف',
        contact: 'تواصل معنا',
        signIn: 'تسجيل الدخول',
        signUp: 'التسجيل',
        profile: 'الملف الشخصي',
      },
      footer: {
        rights: 'جميع الحقوق محفوظة',
      },
      language: 'اللغة',
      arabic: 'العربية',
      english: 'English',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
