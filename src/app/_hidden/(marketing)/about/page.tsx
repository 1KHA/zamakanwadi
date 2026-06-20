'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  Shield,
  MessageCircle,
  Mic,
  Activity,
  CheckSquare,
  Briefcase,
  FileText,
  Bookmark,
  Play,
  Video,
  MapPin,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  Eye,
  Target,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Phone,
} from 'lucide-react';

/* ─── Reusable helpers ─── */

function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight ${className}`}>
      {children}
    </h2>
  );
}

function SectionSubtitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-base sm:text-lg text-gray-custom max-w-2xl leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

function GoldBar({ className = '' }: { className?: string }) {
  return <div className={`h-1.5 w-16 sm:w-24 bg-secondary rounded-full ${className}`} />;
}

function GradientPlaceholder({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-2xl flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

/* ─── Main component ─── */

export default function AboutPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [activeService, setActiveService] = useState<number | null>(null);
  const [activeExtra, setActiveExtra] = useState<number | null>(null);

  const values = [
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: isRTL ? 'إثراء تجربة المستخدم' : 'Enriching user experience',
      desc: isRTL
        ? 'نصمم كل تفصيل لضمان تجربة سلسة وممتعة لكل زائر'
        : 'We design every detail to ensure a smooth and enjoyable experience for every visitor.',
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: isRTL ? 'التأثير في المجتمع' : 'Impact in society',
      desc: isRTL
        ? 'نسعى لخلق فرص حقيقية تسهم في تنمية المجتمع ودعم الابتكار'
        : 'We strive to create real opportunities that contribute to community development and support innovation.',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: isRTL ? 'النزاهة في التعامل' : 'Integrity in dealing',
      desc: isRTL
        ? 'نلتزم بأعلى معايير الأمانة والشفافية في كل علاقة نبنيها'
        : 'We adhere to the highest standards of honesty and transparency in every relationship we build.',
    },
  ];

  const services = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: isRTL ? 'التسجيل القانوني' : 'Legal registration',
      desc: isRTL
        ? 'إنهاء جميع الإجراءات القانونية والتراخيص اللازمة لبدء عملك'
        : 'Complete all legal procedures and licenses required to start your business.',
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: isRTL ? 'الاستشارات الريادية' : 'Entrepreneurial Consulting',
      desc: isRTL
        ? 'استشارات متخصصة لمساعدتك على بناء ونمو مشروعك من الصفر'
        : 'Specialized consulting to help you build and grow your project from scratch.',
    },
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: isRTL ? 'دراسة الجدوى' : 'Feasibility study',
      desc: isRTL
        ? 'تحليل دقيق لجدوى مشروعك مع توقعات مالية وتسويقية شاملة'
        : 'Accurate analysis of your project feasibility with comprehensive financial and marketing forecasts.',
    },
    {
      icon: <Bookmark className="w-8 h-8" />,
      title: isRTL ? 'معمل الابتكار 3D' : 'Innovation Lab 3D',
      desc: isRTL
        ? 'تصميم وطباعة نماذج ثلاثية الأبعاد لدعم مراحل تطوير منتجاتك'
        : 'Design and print 3D models to support your product development stages.',
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: isRTL ? 'خدمات الإنتاج السمعي والبصري' : 'Audiovisual production services',
      desc: isRTL
        ? 'إنتاج محتوى مرئي واحترافي يرفع من قيمة علامتك التجارية'
        : 'Professional visual content production that enhances your brand value.',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: isRTL ? 'خدمات الشركات المحلية والأجنبية' : 'Service for local and foreign companies',
      desc: isRTL
        ? 'حلول متكاملة للشركات المحلية والدولية للانطلاق في السوق السعودي'
        : 'Integrated solutions for local and international companies to launch in the Saudi market.',
    },
  ];

  const extraServices = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: isRTL ? 'الدعم والتواصل' : 'Support & Communication',
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: isRTL ? 'تسجيل الصوت' : 'Voice Recording',
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: isRTL ? 'البث المباشر' : 'Live Streaming',
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: isRTL ? 'متجر إلكتروني' : 'E-Commerce Store',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark/90" />
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <GradientPlaceholder className="h-full rounded-none opacity-40 hidden lg:flex" />
            <GradientPlaceholder className="h-full rounded-none opacity-30 bg-gradient-to-bl from-secondary/30 via-primary/20 to-dark/50" />
          </div>
        </div>

        {/* Decorative yellow bar */}
        <div className="absolute top-0 start-0 end-0 h-1.5 bg-[#ffbf19] z-10" />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                {isRTL ? 'تعرف علينا' : 'Get to know us'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {isRTL ? 'نحن زمكان' : 'We are Zamakan'}
            </h1>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
              {isRTL
                ? 'وجهتك الأولى للعمل المشترك والابتكار في المملكة العربية السعودية. نؤمن بقوة الفضاءات الملهمة في تحويل الأفكار إلى واقع ملموس.'
                : 'Your premier destination for coworking and innovation in the Kingdom of Saudi Arabia. We believe in the power of inspiring spaces to turn ideas into tangible reality.'}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-dark font-semibold rounded-xl hover:bg-secondary-dark transition-colors"
              >
                {isRTL ? 'اكتشف خدماتنا' : 'Explore our services'}
                {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                {isRTL ? 'تواصل معنا' : 'Contact us'}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom decorative curve */}
        <div className="absolute bottom-0 start-0 end-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
      </section>

      {/* ═══════════════════════════════════════
          OUR VALUES
      ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <GoldBar className="mx-auto mb-6" />
            <SectionTitle className="mb-4">
              {isRTL ? 'قيمنا' : 'Our Values'}
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'المبادئ التي توجهنا في بناء علاقاتنا وخدماتنا'
                : 'The principles that guide us in building our relationships and services.'}
            </SectionSubtitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="group relative bg-gray-50 rounded-2xl p-8 sm:p-10 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{v.title}</h3>
                <p className="text-gray-custom leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHO WE ARE
      ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image side */}
            <div className="relative order-2 lg:order-1">
              <GradientPlaceholder className="w-full aspect-[4/3] rounded-3xl shadow-2xl shadow-primary/10">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary text-3xl font-bold">Z</span>
                  </div>
                  <p className="text-dark font-semibold">
                    {isRTL ? 'صورة فريق زمكان' : 'Zamakan Team Image'}
                  </p>
                </div>
              </GradientPlaceholder>
              {/* Decorative floating card */}
              <div className="absolute -bottom-6 -end-6 sm:-end-10 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-secondary-dark" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">+500</p>
                    <p className="text-xs text-gray-custom">
                      {isRTL ? 'عميل سعيد' : 'Happy Clients'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative line */}
              <div className="absolute -top-4 -start-4 w-24 h-24 border-t-4 border-s-4 border-secondary rounded-tl-3xl -z-10 hidden lg:block" />
            </div>

            {/* Text side */}
            <div className="order-1 lg:order-2">
              <GoldBar className="mb-6" />
              <SectionTitle className="mb-6">
                {isRTL ? 'من نحن' : 'Who we are'}
              </SectionTitle>
              <div className="space-y-4 text-gray-custom leading-relaxed">
                <p>
                  {isRTL
                    ? 'زمكان هي شركة سعودية رائدة في مجال العمل المشترك والحلول الريادية. تأسست بهدف إحداث نقلة نوعية في بيئة العمل وتوفير فضاءات ملهمة تجمع بين الاحترافية والإبداع.'
                    : 'Zamakan is a leading Saudi company in the field of coworking and entrepreneurial solutions. It was founded with the aim of making a qualitative leap in the work environment and providing inspiring spaces that combine professionalism and creativity.'}
                </p>
                <p>
                  {isRTL
                    ? 'نقدم مجموعة متكاملة من الخدمات تشمل المكاتب المشتركة، قاعات الاجتماعات، المسارح، ومعامل الابتكار، إلى جانب خدمات استشارية متخصصة للشركات الناشئة والمؤسسات الكبرى على حد سواء.'
                    : 'We offer a comprehensive suite of services including shared offices, meeting rooms, theaters, and innovation labs, in addition to specialized consulting services for both startups and large institutions alike.'}
                </p>
                <p>
                  {isRTL
                    ? 'فريقنا يضم نخبة من الخبراء والمختصين في مجالات متعددة، يعملون بتفانٍ لضمان تقديم أفضل تجربة ممكنة لكل عميل يثق بنا.'
                    : 'Our team includes a select group of experts and specialists in various fields, working diligently to ensure the best possible experience for every client who trusts us.'}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors group"
                >
                  {isRTL ? 'انضم إلى فريقنا' : 'Join our team'}
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VISION & MISSION
      ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white relative">
        {/* Decorative divider */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-secondary to-transparent hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Vision */}
            <div className="relative bg-dark rounded-3xl p-8 sm:p-12 overflow-hidden">
              <div className="absolute top-0 end-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-8">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {isRTL ? 'رؤيتنا' : 'Our Vision'}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {isRTL
                    ? 'أن نكون المنصة الأولى والوجهة المفضلة للمبتكرين ورواد الأعمال في المملكة والمنطقة، من خلال بناء بيئة عمل متكاملة تحفز الإبداع وتدعم النمو المستدام.'
                    : 'To be the premier platform and preferred destination for innovators and entrepreneurs in the Kingdom and the region, by building a comprehensive work environment that stimulates creativity and supports sustainable growth.'}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="relative bg-primary rounded-3xl p-8 sm:p-12 overflow-hidden">
              <div className="absolute bottom-0 start-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/20 text-white flex items-center justify-center mb-8">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {isRTL ? 'مهمتنا' : 'Our Mission'}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {isRTL
                    ? 'تمكين الأفراد والمؤسسات من تحقيق أهدافهم عبر توفير بيئات عمل مرنة، وخدمات احترافية، ومجتمع داعم يشارك المعرفة والخبرات ويفتح آفاقًا جديدة للتعاون.'
                    : 'Empowering individuals and institutions to achieve their goals by providing flexible work environments, professional services, and a supportive community that shares knowledge and experiences and opens new horizons for collaboration.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OUR SERVICES
      ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <GoldBar className="mx-auto mb-6" />
            <SectionTitle className="mb-4">
              {isRTL ? 'خدماتنا' : 'Our Services'}
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'حلول متكاملة مصممة لتلبية احتياجات عملك وتسريع نموك'
                : 'Integrated solutions designed to meet your business needs and accelerate your growth.'}
            </SectionSubtitle>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveService(activeService === idx ? null : idx)}
                className={`text-start relative bg-white rounded-2xl p-6 sm:p-8 border transition-all duration-300 text-start ${
                  activeService === idx
                    ? 'border-primary shadow-xl shadow-primary/10 -translate-y-1'
                    : 'border-gray-100 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                    activeService === idx
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{s.title}</h3>
                <p
                  className={`text-sm text-gray-custom leading-relaxed transition-all duration-300 overflow-hidden ${
                    activeService === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 sm:max-h-40 sm:opacity-100'
                  }`}
                >
                  {s.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  <span>{isRTL ? 'المزيد' : 'Learn more'}</span>
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          EXTRA SERVICES
      ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <GoldBar className="mb-6" />
              <SectionTitle>
                {isRTL ? 'خدمات إضافية' : 'Extra Services'}
              </SectionTitle>
            </div>
            <SectionSubtitle>
              {isRTL
                ? 'خدمات متميزة نقدمها لإثراء تجربتك في زمكان'
                : 'Premium services we offer to enrich your Zamakan experience.'}
            </SectionSubtitle>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {extraServices.map((es, idx) => (
              <button
                key={idx}
                onClick={() => setActiveExtra(activeExtra === idx ? null : idx)}
                className={`group relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 text-start ${
                  activeExtra === idx
                    ? 'bg-dark border-dark text-white'
                    : 'bg-gray-50 border-gray-100 hover:bg-dark hover:border-dark hover:text-white'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                    activeExtra === idx
                      ? 'bg-secondary text-dark'
                      : 'bg-secondary/20 text-secondary-dark group-hover:bg-secondary group-hover:text-dark'
                  }`}
                >
                  {es.icon}
                </div>
                <h4 className="font-semibold text-sm sm:text-base">{es.title}</h4>
              </button>
            ))}
          </div>

          {/* Decorative divider line */}
          <div className="mt-16 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MEET US HERE
      ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text side */}
            <div>
              <GoldBar className="mb-6" />
              <SectionTitle className="mb-6">
                {isRTL ? 'قابلنا هنا' : 'Meet us here'}
              </SectionTitle>
              <SectionSubtitle className="mb-10">
                {isRTL
                  ? 'نحن هنا لمساعدتك في كل خطوة. زورنا في موقعنا أو تواصل معنا عبر القنوات المتاحة.'
                  : 'We are here to help you every step of the way. Visit us at our location or reach out through available channels.'}
              </SectionSubtitle>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">
                      {isRTL ? 'الموقع' : 'Location'}
                    </h4>
                    <p className="text-gray-custom text-sm">
                      {isRTL
                        ? 'المملكة العربية السعودية، الرياض، حي العليا'
                        : 'Kingdom of Saudi Arabia, Riyadh, Al Olaya District'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">
                      {isRTL ? 'البريد الإلكتروني' : 'Email'}
                    </h4>
                    <p className="text-gray-custom text-sm">info@zamakan.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">
                      {isRTL ? 'الهاتف' : 'Phone'}
                    </h4>
                    <p className="text-gray-custom text-sm">+966 12 345 6789</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                >
                  {isRTL ? 'احجز زيارة' : 'Book a visit'}
                  {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </Link>
              </div>
            </div>

            {/* Map / Image side */}
            <div className="relative">
              <GradientPlaceholder className="w-full aspect-square sm:aspect-[4/3] rounded-3xl shadow-2xl shadow-primary/10">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-dark font-semibold text-lg">
                    {isRTL ? 'خريطة الموقع' : 'Location Map'}
                  </p>
                  <p className="text-gray-custom text-sm mt-2">
                    {isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}
                  </p>
                </div>
              </GradientPlaceholder>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -start-6 sm:-start-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10" />
              <div className="absolute -top-6 -end-6 sm:-end-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#0d0f25] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 start-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 end-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {isRTL ? 'ابدأ رحلتك مع زمكان اليوم' : 'Start your journey with Zamakan today'}
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            {isRTL
              ? 'انضم إلى مجتمعنا المتنامي من المبتكرين ورواد الأعمال واستفد من بيئة عمل مصممة خصيصًا لنجاحك.'
              : 'Join our growing community of innovators and entrepreneurs and benefit from a work environment designed specifically for your success.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary-dark transition-colors"
            >
              {isRTL ? 'اطلع على خططنا' : 'View our plans'}
              {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              {isRTL ? 'سجّل الآن' : 'Sign up now'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

