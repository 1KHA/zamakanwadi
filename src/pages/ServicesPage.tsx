import { useTranslation } from 'react-i18next';
import {
  Shield,
  Briefcase,
  FileSearch,
  FlaskConical,
  Film,
  Globe,
  Users,
  Headphones,
  Calendar,
  Mail,
  Phone,
  Zap,
  Award,
  Clock,
  Lock,
  Star,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  MonitorPlay,
  Handshake,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

interface ExtraServiceItem {
  icon: LucideIcon;
  titleKey: string;
}

interface FeatureItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

const mainServices: ServiceItem[] = [
  { icon: Shield, titleKey: 'servicesPage.services.legal.title', descKey: 'servicesPage.services.legal.desc' },
  { icon: Briefcase, titleKey: 'servicesPage.services.consulting.title', descKey: 'servicesPage.services.consulting.desc' },
  { icon: FileSearch, titleKey: 'servicesPage.services.feasibility.title', descKey: 'servicesPage.services.feasibility.desc' },
  { icon: FlaskConical, titleKey: 'servicesPage.services.innovation.title', descKey: 'servicesPage.services.innovation.desc' },
  { icon: Film, titleKey: 'servicesPage.services.audiovisual.title', descKey: 'servicesPage.services.audiovisual.desc' },
  { icon: Globe, titleKey: 'servicesPage.services.companies.title', descKey: 'servicesPage.services.companies.desc' },
];

const extraServices: ExtraServiceItem[] = [
  { icon: Users, titleKey: 'servicesPage.extraServices.networking' },
  { icon: Headphones, titleKey: 'servicesPage.extraServices.support' },
  { icon: Calendar, titleKey: 'servicesPage.extraServices.events' },
  { icon: Mail, titleKey: 'servicesPage.extraServices.mail' },
  { icon: Phone, titleKey: 'servicesPage.extraServices.call' },
  { icon: Sparkles, titleKey: 'servicesPage.extraServices.custom' },
];

const features: FeatureItem[] = [
  { icon: Zap, titleKey: 'servicesPage.features.fast.title', descKey: 'servicesPage.features.fast.desc' },
  { icon: Award, titleKey: 'servicesPage.features.quality.title', descKey: 'servicesPage.features.quality.desc' },
  { icon: Clock, titleKey: 'servicesPage.features.time.title', descKey: 'servicesPage.features.time.desc' },
  { icon: Lock, titleKey: 'servicesPage.features.secure.title', descKey: 'servicesPage.features.secure.desc' },
  { icon: Star, titleKey: 'servicesPage.features.expert.title', descKey: 'servicesPage.features.expert.desc' },
  { icon: Lightbulb, titleKey: 'servicesPage.features.innovation.title', descKey: 'servicesPage.features.innovation.desc' },
];

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[520px] md:min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Background image placeholders */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/90 via-primary/80 to-primary-dark/95" />
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[80px]" />
          {/* Decorative rectangles */}
          <div className="absolute top-[15%] left-[8%] w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 opacity-60" />
          <div className="absolute bottom-[20%] right-[10%] w-24 h-24 md:w-40 md:h-40 rounded-xl bg-gradient-to-br from-white/20 to-white/5 opacity-50" />
          <div className="absolute top-[40%] right-[25%] w-16 h-16 md:w-24 md:h-24 rounded-lg bg-gradient-to-br from-secondary/40 to-secondary/10 opacity-40 rotate-12" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-white/90">{t('servicesPage.hero.badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-galvji mb-6 leading-tight">
            {t('servicesPage.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('servicesPage.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-dark font-semibold text-base hover:bg-secondary-light transition-colors duration-300">
              {t('servicesPage.hero.ctaPrimary')}
              <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors duration-300">
              {t('servicesPage.hero.ctaSecondary')}
            </button>
          </div>
        </div>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path
              d="M0 80V40C240 80 480 0 720 0C960 0 1200 80 1440 40V80H0Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              {t('servicesPage.services.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark font-galvji mb-4">
              {t('servicesPage.services.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-custom max-w-2xl mx-auto">
              {t('servicesPage.services.subtitle')}
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 md:p-8 overflow-hidden"
                  style={{ minHeight: 230 }}
                >
                  {/* Decorative top accent */}
                  <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-dark mb-3 font-galvji group-hover:text-primary transition-colors duration-300">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-sm md:text-base text-gray-custom leading-relaxed">
                    {t(service.descKey)}
                  </p>

                  {/* Hover arrow */}
                  <div className="mt-5 flex items-center gap-1 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>{t('servicesPage.services.learnMore')}</span>
                    <ChevronIcon className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative side images */}
        <div className="hidden lg:block absolute top-[10%] left-0 w-24 h-40 rounded-r-2xl bg-gradient-to-br from-primary/20 to-primary/5" />
        <div className="hidden lg:block absolute bottom-[15%] right-0 w-20 h-32 rounded-l-2xl bg-gradient-to-bl from-secondary/20 to-secondary/5" />
      </section>

      {/* Divider */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      </div>

      {/* Extra Services Section */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary-dark text-sm font-semibold mb-4">
                {t('servicesPage.extraServices.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark font-galvji mb-6">
                {t('servicesPage.extraServices.title')}
              </h2>
              <p className="text-base md:text-lg text-gray-custom mb-10 leading-relaxed">
                {t('servicesPage.extraServices.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extraServices.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-primary hover:shadow-md transition-all duration-300 cursor-default"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:bg-secondary transition-colors duration-300 shrink-0">
                        <Icon className="w-5 h-5 text-primary group-hover:text-dark transition-colors duration-300" />
                      </div>
                      <span className="text-sm font-semibold text-dark group-hover:text-white transition-colors duration-300">
                        {t(item.titleKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Decorative images placeholder */}
            <div className="relative h-[400px] md:h-[500px]">
              {/* Main large rectangle */}
              <div className="absolute top-0 end-0 w-[85%] h-[75%] rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 shadow-lg" />
              {/* Secondary rectangle */}
              <div className="absolute bottom-0 start-0 w-[60%] h-[55%] rounded-2xl bg-gradient-to-tr from-secondary/30 via-secondary/10 to-white shadow-lg border border-white/50" />
              {/* Small accent rectangle */}
              <div className="absolute top-[20%] start-[10%] w-20 h-20 md:w-28 md:h-28 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-xl flex items-center justify-center">
                <MonitorPlay className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              {/* Tiny decorative square */}
              <div className="absolute bottom-[15%] end-[15%] w-12 h-12 rounded-lg bg-secondary/60 rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>
      </div>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              {t('servicesPage.features.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark font-galvji mb-4">
              {t('servicesPage.features.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-custom max-w-2xl mx-auto">
              {t('servicesPage.features.subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  {/* Number badge */}
                  <div className="absolute top-4 end-4 text-5xl font-bold text-gray-100 group-hover:text-primary/10 transition-colors duration-300 font-galvji">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-secondary-dark" />
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2 font-galvji">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-gray-custom leading-relaxed">
                      {t(feature.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-secondary/10 blur-[100px]" />
      </section>

      {/* CTA / Bottom Banner Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        {/* Decorative rectangles */}
        <div className="absolute top-[10%] right-[5%] w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-white/5 rotate-12" />
        <div className="absolute bottom-[10%] left-[8%] w-24 h-24 md:w-36 md:h-36 rounded-xl bg-secondary/20 -rotate-12" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Handshake className="w-12 h-12 text-secondary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-galvji mb-6">
            {t('servicesPage.cta.title')}
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('servicesPage.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-dark font-semibold text-base hover:bg-secondary-light transition-colors duration-300">
              {t('servicesPage.cta.button')}
              <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
