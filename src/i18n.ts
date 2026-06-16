import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
      servicesPage: {
        hero: {
          badge: 'What We Offer',
          title: 'Our Services',
          subtitle: 'Comprehensive solutions designed to empower entrepreneurs and businesses from ideation to success.',
          ctaPrimary: 'Get Started',
          ctaSecondary: 'Learn More',
        },
        services: {
          badge: 'Core Services',
          title: 'Services We Provide',
          subtitle: 'We offer a wide range of professional services tailored to meet your business needs and accelerate your growth.',
          learnMore: 'Learn more',
          legal: {
            title: 'Legal Registration',
            desc: 'Complete legal support for company formation, trademark registration, and compliance with local regulations.',
          },
          consulting: {
            title: 'Entrepreneurial Consulting',
            desc: 'Expert guidance to transform your ideas into viable business models with strategic planning and market insights.',
          },
          feasibility: {
            title: 'Feasibility Study',
            desc: 'In-depth market analysis and financial projections to evaluate the viability and profitability of your projects.',
          },
          innovation: {
            title: 'Innovation Lab 3D',
            desc: 'State-of-the-art 3D prototyping and design lab to bring your innovative concepts to life rapidly.',
          },
          audiovisual: {
            title: 'Audiovisual Production',
            desc: 'Professional video production, photography, and multimedia content creation for your brand storytelling.',
          },
          companies: {
            title: 'Local & Foreign Companies',
            desc: 'Specialized services for both local startups and foreign companies looking to establish presence in the region.',
          },
        },
        extraServices: {
          badge: 'Additional Benefits',
          title: 'Extra Services',
          description: 'Beyond our core offerings, we provide additional value-added services to ensure your business thrives in every aspect.',
          networking: 'Business Networking',
          support: 'Dedicated Support',
          events: 'Workshops & Events',
          mail: 'Mail Handling',
          call: 'Call Answering',
          custom: 'Custom Solutions',
        },
        features: {
          badge: 'Why Choose Us',
          title: 'Our Features',
          subtitle: 'Discover the advantages that set our services apart and make us the preferred partner for your business journey.',
          fast: {
            title: 'Fast Execution',
            desc: 'Rapid turnaround times without compromising on quality or attention to detail.',
          },
          quality: {
            title: 'Premium Quality',
            desc: 'Top-tier standards maintained across all our services and deliverables.',
          },
          time: {
            title: '24/7 Availability',
            desc: 'Round-the-clock support and services to keep your business running smoothly.',
          },
          secure: {
            title: 'Secure & Trusted',
            desc: 'Your data and business information are protected with enterprise-grade security.',
          },
          expert: {
            title: 'Expert Team',
            desc: 'Access to industry veterans and specialists with years of hands-on experience.',
          },
          innovation: {
            title: 'Innovation First',
            desc: 'Cutting-edge tools and methodologies to keep you ahead of the competition.',
          },
        },
        cta: {
          title: 'Ready to Grow Your Business?',
          subtitle: 'Join hundreds of successful entrepreneurs and companies who have partnered with Zamakan to achieve their goals.',
          button: 'Start Your Journey',
        },
      },
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
      servicesPage: {
        hero: {
          badge: 'ما نقدمه',
          title: 'خدماتنا',
          subtitle: 'حلول شاملة مصممة لتمكين رياديي الأعمال والشركات من الفكرة حتى النجاح.',
          ctaPrimary: 'ابدأ الآن',
          ctaSecondary: 'اعرف المزيد',
        },
        services: {
          badge: 'الخدمات الأساسية',
          title: 'الخدمات التي نقدمها',
          subtitle: 'نقدم مجموعة واسعة من الخدمات المهنية المصممة لتلبية احتياجات عملك وتسريع نموه.',
          learnMore: 'اعرف المزيد',
          legal: {
            title: 'التسجيل القانوني',
            desc: 'دعم قانوني كامل لتأسيس الشركات وتسجيل العلامات التجارية والامتثال للأنظمة المحلية.',
          },
          consulting: {
            title: 'الاستشارات الريادية',
            desc: 'إرشاد خبير لتحويل أفكارك إلى نماذج عمل قابلة للتطبيق مع التخطيط الاستراتيجي ورؤى السوق.',
          },
          feasibility: {
            title: 'دراسة الجدوى',
            desc: 'تحليل سوق معمق وتوقعات مالية لتقييم جدوى وربحية مشاريعك.',
          },
          innovation: {
            title: 'معمل الابتكار ثلاثي الأبعاد',
            desc: 'مختبر تصميم ونماذج أولية ثلاثية الأبعاد متطور لإحياء مفاهيمك المبتكرة بسرعة.',
          },
          audiovisual: {
            title: 'الإنتاج السمعي البصري',
            desc: 'إنتاج فيديوهات و تصوير فوتوغرافي وإنشاء محتوى متعدد الوسائط احترافي لسرد قصة علامتك التجارية.',
          },
          companies: {
            title: 'الشركات المحلية والأجنبية',
            desc: 'خدمات متخصصة للشركات الناشئة المحلية والشركات الأجنبية التي تسعى لإنشاء حضور في المنطقة.',
          },
        },
        extraServices: {
          badge: 'مزايا إضافية',
          title: 'خدمات إضافية',
          description: 'بالإضافة إلى عروضنا الأساسية، نقدم خدمات إضافية ذات قيمة مضافة لضمان ازدهار عملك في كل جانب.',
          networking: 'التواصل التجاري',
          support: 'دعم مخصص',
          events: 'ورش عمل وفعاليات',
          mail: 'إدارة البريد',
          call: 'الرد على المكالمات',
          custom: 'حلول مخصصة',
        },
        features: {
          badge: 'لماذا تختارنا',
          title: 'مميزاتنا',
          subtitle: 'اكتشف المزايا التي تميز خدماتنا وتجعلنا الشريك المفضل لرحلة عملك.',
          fast: {
            title: 'تنفيذ سريع',
            desc: 'مواعيد تسليم سريعة دون المساس بالجودة أو الاهتمام بالتفاصيل.',
          },
          quality: {
            title: 'جودة ممتازة',
            desc: 'معايير عالية تُحافظ عليها في جميع خدماتنا ومخرجاتنا.',
          },
          time: {
            title: 'متاحون على مدار الساعة',
            desc: 'دعم وخدمات على مدار الساعة طوال أيام الأسبوع لإبقاء عملك يعمل بسلاسة.',
          },
          secure: {
            title: 'آمن وموثوق',
            desc: 'بياناتك ومعلومات عملك محمية بأمان على مستوى المؤسسات.',
          },
          expert: {
            title: 'فريق خبير',
            desc: 'الوصول إلى خبراء ومختصين ذوي خبرة عملية لسنوات عديدة.',
          },
          innovation: {
            title: 'الابتكار أولاً',
            desc: 'أدوات ومنهجيات متطورة لإبقائك في صدارة المنافسة.',
          },
        },
        cta: {
          title: 'مستعد لتنمية عملك؟',
          subtitle: 'انضم إلى مئات رياديي الأعمال والشركات الناجحة الذين تعاونوا مع زمكان لتحقيق أهدافهم.',
          button: 'ابدأ رحلتك',
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
