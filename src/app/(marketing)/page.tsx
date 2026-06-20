'use client';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  Play,
  ArrowRight,
  Search,
  Mail,
  MapPin,
  Briefcase,
  Users,
  Coffee,
  Wifi,
  Monitor,
  Clock,
  Star,
  Zap,
  Shield,
  Headphones,
  Check,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helper components                                                   */
/* ------------------------------------------------------------------ */

function GradientPlaceholder({
  className = '',
  from = '#9D1942',
  to = '#F2B704',
  label,
}: {
  className?: string;
  from?: string;
  to?: string;
  label?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {label && (
        <span className="absolute inset-0 flex items-center justify-center text-white/80 text-sm font-medium">
          {label}
        </span>
      )}
    </div>
  );
}

function SectionTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-dark ${className}`}
    >
      {children}
    </h2>
  );
}

function SectionSubtitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-base sm:text-lg text-gray-custom max-w-2xl leading-relaxed ${className}`}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const newsletterRef = useRef<HTMLDivElement>(null);

  const scrollToNewsletter = () => {
    newsletterRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Subscribe email:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  /* ----- Feature data ----- */
  const features = [
    {
      icon: <MapPin className="w-7 h-7" />,
      title: isRTL ? 'موقع متميز' : 'Prime Location',
      desc: isRTL
        ? 'موقع استراتيجي يسهل الوصول إليه من جميع أنحاء المدينة'
        : 'Strategically located and easily accessible from all parts of the city.',
    },
    {
      icon: <Wifi className="w-7 h-7" />,
      title: isRTL ? 'إنترنت فائق السرعة' : 'High-Speed Internet',
      desc: isRTL
        ? 'اتصال إنترنت سريع وموثوق لجميع أعضائنا'
        : 'Fast and reliable internet connection for all our members.',
    },
    {
      icon: <Monitor className="w-7 h-7" />,
      title: isRTL ? 'تقنيات حديثة' : 'Modern Technology',
      desc: isRTL
        ? 'معدات وتقنيات متطورة لتعزيز إنتاجيتك'
        : 'Cutting-edge equipment and technology to boost your productivity.',
    },
    {
      icon: <Coffee className="w-7 h-7" />,
      title: isRTL ? 'منطقة استراحة' : 'Lounge Area',
      desc: isRTL
        ? 'مساحات مريحة للاسترخاء والتفاعل الاجتماعي'
        : 'Comfortable spaces to relax and socialize.',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: isRTL ? 'مجتمع نابض' : 'Vibrant Community',
      desc: isRTL
        ? 'تواصل مع محترفين ومبدعين من مختلف المجالات'
        : 'Connect with professionals and creatives from various fields.',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: isRTL ? 'وصول على مدار الساعة' : '24/7 Access',
      desc: isRTL
        ? 'ادخل مساحتك في أي وقت يناسب جدولك'
        : 'Access your workspace anytime that fits your schedule.',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: isRTL ? 'أمان على مدار الساعة' : 'Round-the-Clock Security',
      desc: isRTL
        ? 'أنظمة أمان متقدمة لحماية ممتلكاتك'
        : 'Advanced security systems to protect your belongings.',
    },
    {
      icon: <Headphones className="w-7 h-7" />,
      title: isRTL ? 'دعم فني' : 'Technical Support',
      desc: isRTL
        ? 'فريق دعم متاح لمساعدتك في أي وقت'
        : 'Support team available to assist you at any time.',
    },
  ];

  /* ----- Plans ----- */
  const plans = [
    {
      name: isRTL ? 'اليومي' : 'Daily',
      price: '49',
      period: isRTL ? 'ريال / يوم' : 'SAR / day',
      perks: [
        isRTL ? 'مكتب مشترك' : 'Hot desk',
        isRTL ? 'واي فاي مجاني' : 'Free Wi-Fi',
        isRTL ? 'قهوة ومشروبات' : 'Coffee & beverages',
        isRTL ? 'وصول 9ص - 6م' : 'Access 9AM - 6PM',
      ],
    },
    {
      name: isRTL ? 'الشهري' : 'Monthly',
      price: '899',
      period: isRTL ? 'ريال / شهر' : 'SAR / month',
      popular: true,
      perks: [
        isRTL ? 'مكتب مخصص' : 'Dedicated desk',
        isRTL ? 'واي فاي مجاني' : 'Free Wi-Fi',
        isRTL ? 'قهوة ومشروبات' : 'Coffee & beverages',
        isRTL ? 'وصول على مدار الساعة' : '24/7 Access',
        isRTL ? 'غرفة اجتماعات 4 ساعات' : 'Meeting room 4 hrs',
      ],
    },
    {
      name: isRTL ? 'السنوي' : 'Yearly',
      price: '8,999',
      period: isRTL ? 'ريال / سنة' : 'SAR / year',
      perks: [
        isRTL ? 'مكتب خاص' : 'Private office',
        isRTL ? 'واي فاي مجاني' : 'Free Wi-Fi',
        isRTL ? 'قهوة ومشروبات' : 'Coffee & beverages',
        isRTL ? 'وصول على مدار الساعة' : '24/7 Access',
        isRTL ? 'غرف اجتماعات غير محدودة' : 'Unlimited meeting rooms',
        isRTL ? 'عنوان بريدي' : 'Mail handling',
      ],
    },
  ];

  return (
    <div className="scroll-smooth">
      {/* ============================================================= */}
      {/*  HERO                                                         */}
      {/* ============================================================= */}
      <section className="relative w-full overflow-hidden bg-dark">
        {/* Background images collage */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-dark/90" />
          <img
            src="/src/assets/hero.png"
            alt="Zamakan workspace"
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text content */}
            <div className="text-white space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <Star className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">
                  {isRTL ? 'مساحة عمل مبتكرة' : 'Innovative Workspace'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {isRTL ? (
                  <>
                    زمكان
                    <br />
                    <span className="text-secondary">مساحتك</span> للإبداع
                  </>
                ) : (
                  <>
                    Zamakan
                    <br />
                    Your Space for{' '}
                    <span className="text-secondary">Creativity</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-lg leading-relaxed">
                {isRTL
                  ? 'اكتشف بيئة عمل مصممة لتلهمك وتدعم نموك المهني مع أفضل المرافق والخدمات.'
                  : 'Discover a work environment designed to inspire you and support your professional growth with the best facilities and services.'}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/plans"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-secondary text-dark font-semibold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg shadow-secondary/20"
                >
                  {isRTL ? 'احجز الآن' : 'Book Now'}
                  <ArrowRight
                    className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                  />
                </Link>

                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center gap-3 group"
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-white/30 flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ms-0.5" />
                  </span>
                  <span className="text-sm sm:text-base font-medium text-white/90 group-hover:text-white transition-colors">
                    {isRTL ? 'شاهد الفيديو' : 'Watch Video'}
                  </span>
                </button>
              </div>
            </div>

            {/* White overlay card */}
            <div className="relative">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-dark">
                      {isRTL ? 'مكاتب عمل حديثة' : 'Modern Work Offices'}
                    </h3>
                    <p className="text-sm text-gray-custom mt-1">
                      {isRTL
                        ? 'مساحات مريحة مجهزة بأحدث التقنيات'
                        : 'Comfortable spaces equipped with the latest technology.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-secondary-dark" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-dark">
                      {isRTL ? 'قاعات اجتماعات' : 'Meeting Rooms'}
                    </h3>
                    <p className="text-sm text-gray-custom mt-1">
                      {isRTL
                        ? 'قاعات متنوعة الأحجام لجميع أنواع الاجتماعات'
                        : 'Various sizes for all types of meetings and events.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-dark">
                      {isRTL ? 'خدمات استشارية' : 'Consulting Services'}
                    </h3>
                    <p className="text-sm text-gray-custom mt-1">
                      {isRTL
                        ? 'استشارات مهنية لتنمية أعمالك'
                        : 'Professional consulting to grow your business.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-custom">
                        {isRTL ? 'انضم لمجتمعنا' : 'Join our community'}
                      </p>
                      <p className="text-2xl font-bold text-primary">500+</p>
                    </div>
                    <div className="flex -space-x-3 rtl:space-x-reverse">
                      {[1, 2, 3, 4].map((i) => (
                        <GradientPlaceholder
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white"
                          from={`hsl(${340 + i * 15}, 60%, ${40 + i * 5}%)`}
                          to={`hsl(${20 + i * 10}, 70%, ${50 + i * 5}%)`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative gradient blocks */}
              <GradientPlaceholder
                className="absolute -top-6 -end-6 w-24 h-24 rounded-2xl opacity-60 hidden lg:block"
                from="#ffbf19"
                to="#F2B704"
              />
              <GradientPlaceholder
                className="absolute -bottom-8 -start-8 w-32 h-32 rounded-2xl opacity-40 hidden lg:block"
                from="#9D1942"
                to="#2B2422"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  PACKAGES INTRO                                                  */}
      {/* ============================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
              <Star className="w-4 h-4 text-secondary-dark" />
              <span className="text-sm font-semibold text-secondary-dark">
                {isRTL ? 'خطط مرنة' : 'Flexible Plans'}
              </span>
            </div>

            <SectionTitle>
              {isRTL
                ? 'لنختر الباقة الأنسب لك ونستكشفها بسعادة وبهجة'
                : "Let's choose the package that is best for you and explore it happily and cheerfully."}
            </SectionTitle>

            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'نوفر باقات متنوعة تناسب الأفراد والفرق والشركات بأسعار تنافسية'
                : 'We offer various packages suitable for individuals, teams, and companies at competitive prices.'}
            </SectionSubtitle>
          </div>

          {/* Decorative image row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <GradientPlaceholder
              className="h-48 sm:h-64 rounded-2xl"
              from="#9D1942"
              to="#7A1333"
              label={isRTL ? 'صورة زمكان 01' : 'Zamakan Image 01'}
            />
            <GradientPlaceholder
              className="h-48 sm:h-64 rounded-2xl md:mt-8"
              from="#F2B704"
              to="#ffbf19"
              label={isRTL ? 'صورة زمكان 02' : 'Zamakan Image 02'}
            />
            <GradientPlaceholder
              className="h-48 sm:h-64 rounded-2xl"
              from="#2B2422"
              to="#979493"
              label={isRTL ? 'صورة موقع زمكان' : 'Zamakan Site Image'}
            />
            <GradientPlaceholder
              className="h-48 sm:h-64 rounded-2xl md:mt-8"
              from="#0d0f25"
              to="#2B2422"
              label={isRTL ? 'صورة زمكان 03' : 'Zamakan Image 03'}
            />
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  WORK OFFICES                                                    */}
      {/* ============================================================= */}
      <section className="py-20 sm:py-28 lg:py-36 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Images */}
            <div className="relative">
              <GradientPlaceholder
                className="w-full h-80 sm:h-96 rounded-3xl shadow-xl"
                from="#9D1942"
                to="#2B2422"
                label={isRTL ? 'مكاتب العمل' : 'Work Offices'}
              />
              <GradientPlaceholder
                className="absolute -bottom-6 -end-6 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl shadow-lg border-4 border-white"
                from="#F2B704"
                to="#ffbf19"
                label={isRTL ? 'تفاصيل' : 'Details'}
              />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {isRTL ? 'مكاتب عمل' : 'Work Offices'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight">
                {isRTL
                  ? 'بيئة عمل مصممة لنجاحك'
                  : 'A Work Environment Designed for Your Success'}
              </h2>

              <p className="text-base sm:text-lg text-gray-custom leading-relaxed">
                {isRTL
                  ? 'استمتع بمكاتب عمل عصرية مجهزة بأحدث التقنيات، إنترنت فائق السرعة، وأماكن مريحة تساعدك على التركيز وتحقيق أهدافك بكفاءة.'
                  : 'Enjoy modern offices equipped with the latest technology, high-speed internet, and comfortable spaces that help you focus and achieve your goals efficiently.'}
              </p>

              <ul className="space-y-3">
                {[
                  isRTL ? 'مكاتب خاصة و مشتركة' : 'Private & shared desks',
                  isRTL ? 'إنترنت عالي السرعة' : 'High-speed internet',
                  isRTL ? 'طابعات ومعدات مكتبية' : 'Printers & office equipment',
                  isRTL ? 'خدمات الاستقبال' : 'Reception services',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-dark"
                  >
                    <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-secondary-dark" />
                    </span>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/work-offices"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
              >
                {isRTL ? 'استكشف المكاتب' : 'Explore Offices'}
                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  MEETING ROOMS                                                   */}
      {/* ============================================================= */}
      <section className="py-20 sm:py-28 lg:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text — order changes on RTL/LTR via logical flow not needed because grid auto flows; we use order class */}
            <div
              className={`space-y-6 ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                <Users className="w-4 h-4 text-secondary-dark" />
                <span className="text-sm font-semibold text-secondary-dark">
                  {isRTL ? 'قاعات الاجتماعات' : 'Meeting Rooms'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight">
                {isRTL
                  ? 'قاعات اجتماعات لكل المناسبات'
                  : 'Meeting Rooms for Every Occasion'}
              </h2>

              <p className="text-base sm:text-lg text-gray-custom leading-relaxed">
                {isRTL
                  ? 'سواء كنت تخطط لاجتماع صغير أو ورشة عمل كبيرة، نوفر قاعات مجهزة بالكامل بأحدث تقنيات العرض والصوت.'
                  : 'Whether you are planning a small meeting or a large workshop, we provide fully equipped rooms with the latest display and audio technologies.'}
              </p>

              <ul className="space-y-3">
                {[
                  isRTL ? 'شاشات عرض ذكية' : 'Smart display screens',
                  isRTL ? 'أنظمة صوت واضحة' : 'Clear audio systems',
                  isRTL ? 'تكييف مريح' : 'Comfortable AC',
                  isRTL ? 'خدمات ضيافة' : 'Catering services',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-dark"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </span>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-dark font-medium rounded-xl hover:bg-secondary-dark transition-colors"
              >
                {isRTL ? 'احجز قاعة' : 'Book a Room'}
                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                />
              </Link>
            </div>

            {/* Images */}
            <div
              className={`relative ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
            >
              <GradientPlaceholder
                className="w-full h-80 sm:h-96 rounded-3xl shadow-xl"
                from="#0d0f25"
                to="#2B2422"
                label={isRTL ? 'قاعات الاجتماعات' : 'Meeting Rooms'}
              />
              <GradientPlaceholder
                className="absolute -bottom-6 -start-6 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl shadow-lg border-4 border-white"
                from="#ffbf19"
                to="#F2B704"
                label={isRTL ? 'تفاصيل' : 'Details'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  CHOOSE YOUR PLAN  (CTA)                                         */}
      {/* ============================================================= */}
      <section className="py-20 sm:py-28 lg:py-36 bg-primary relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 start-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 end-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            {isRTL ? (
              <>
                اختر <span className="text-secondary">خطتك</span> المثالية
              </>
            ) : (
              <>
                Choose Your{' '}
                <span className="text-secondary">Perfect Plan</span>
              </>
            )}
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {isRTL
              ? 'باقات مرنة تناسب جميع الاحتياجات، من العمل اليومي إلى الاشتراكات السنوية الشاملة'
              : 'Flexible packages to suit all needs, from daily work to comprehensive yearly subscriptions.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg shadow-black/10"
            >
              {isRTL ? 'عرض الباقات' : 'View Plans'}
              <ArrowRight
                className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
              />
            </Link>

            <button
              onClick={scrollToNewsletter}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              {isRTL ? 'ابقَ على اطلاع' : 'Stay Updated'}
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  PRICING CARDS                                                   */}
      {/* ============================================================= */}
      <section className="py-20 sm:py-28 lg:py-36 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <SectionTitle>
              {isRTL ? 'باقاتنا' : 'Our Plans'}
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'اختر الباقة التي تناسب احتياجاتك وتبدأ رحلتك مع زمكان'
                : 'Choose the plan that fits your needs and start your journey with Zamakan.'}
            </SectionSubtitle>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? 'bg-dark text-white shadow-2xl scale-100 lg:scale-105 z-10'
                    : 'bg-white text-dark shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 start-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-dark text-xs font-bold rounded-full">
                    {isRTL ? 'الأكثر شيوعاً' : 'Most Popular'}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        plan.popular ? 'text-white' : 'text-dark'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span
                        className={`text-4xl font-extrabold ${
                          plan.popular ? 'text-secondary' : 'text-primary'
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`text-sm ${
                          plan.popular ? 'text-white/60' : 'text-gray-custom'
                        }`}
                      >
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.perks.map((perk) => (
                      <li
                        key={perk}
                        className={`flex items-center gap-3 text-sm ${
                          plan.popular ? 'text-white/80' : 'text-gray-custom'
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 shrink-0 ${
                            plan.popular ? 'text-secondary' : 'text-primary'
                          }`}
                        />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/plans"
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-secondary text-dark hover:bg-secondary-dark'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FEATURES                                                        */}
      {/* ============================================================= */}
      <section className="py-20 sm:py-28 lg:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffbf19]/10 border border-[#ffbf19]/20">
              <Zap className="w-4 h-4 text-[#d4a103]" />
              <span className="text-sm font-semibold text-[#d4a103]">
                {isRTL ? 'لماذا زمكان؟' : 'Why Zamakan?'}
              </span>
            </div>

            <SectionTitle>
              {isRTL ? 'مميزاتنا' : 'Our Features'}
            </SectionTitle>

            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'نوفر لك كل ما تحتاجه لتحقيق أقصى إنتاجية في بيئة عمل ملهمة'
                : 'We provide everything you need to achieve maximum productivity in an inspiring work environment.'}
            </SectionSubtitle>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-xl bg-[#ffbf19] text-dark"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center mb-5 group-hover:bg-white/50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed opacity-80">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  SEARCH                                                          */}
      {/* ============================================================= */}
      <section className="py-20 sm:py-28 lg:py-36 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 lg:p-16 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {isRTL ? 'بحث' : 'Search'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark">
                {isRTL
                  ? 'ابحث عن ما تحتاجه'
                  : 'Find What You Need'}
              </h2>
              <p className="text-gray-custom">
                {isRTL
                  ? 'ابحث في خدماتنا، الباقات، والمساحات المتاحة'
                  : 'Search through our services, plans, and available spaces.'}
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isRTL
                    ? 'اكتب كلمة البحث...'
                    : 'Type your search keyword...'
                }
                className="w-full ps-12 pe-4 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-custom focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
              />
              <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-gray-custom" />
              <button
                type="submit"
                className="absolute top-1/2 -translate-y-1/2 end-2 sm:end-3 px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-white font-medium rounded-lg sm:rounded-xl hover:bg-primary-dark transition-colors"
              >
                {isRTL ? 'بحث' : 'Search'}
              </button>
            </form>

            {/* Quick tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                isRTL ? 'مكاتب' : 'Offices',
                isRTL ? 'اجتماعات' : 'Meetings',
                isRTL ? 'مسرح' : 'Theater',
                isRTL ? 'مختبر' : 'Lab',
                isRTL ? 'استشارات' : 'Consulting',
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    console.log('Quick search:', tag);
                  }}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-custom text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  NEWSLETTER                                                      */}
      {/* ============================================================= */}
      <section
        ref={newsletterRef}
        className="py-20 sm:py-28 lg:py-36 bg-[#0d0f25] relative overflow-hidden"
      >
        {/* Decorative gradients */}
        <GradientPlaceholder
          className="absolute -top-20 -end-20 w-80 h-80 rounded-full opacity-10 blur-3xl"
          from="#9D1942"
          to="#F2B704"
        />
        <GradientPlaceholder
          className="absolute -bottom-20 -start-20 w-80 h-80 rounded-full opacity-10 blur-3xl"
          from="#F2B704"
          to="#9D1942"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Mail className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">
                {isRTL ? 'النشرة البريدية' : 'Newsletter'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {isRTL ? (
                <>
                  انضم إلى <span className="text-secondary">قائمتنا البريدية</span>
                </>
              ) : (
                <>
                  Join Our <span className="text-secondary">Mail List</span>
                </>
              )}
            </h2>

            <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
              {isRTL
                ? 'اشترك الآن لتصلك آخر الأخبار، العروض الخاصة، والفعاليات القادمة مباشرة إلى بريدك.'
                : 'Subscribe now to receive the latest news, special offers, and upcoming events directly to your inbox.'}
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto"
          >
            <div className="relative w-full">
              <Mail className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'
                }
                className="w-full ps-12 pe-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-8 py-4 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg shadow-secondary/20"
            >
              {subscribed
                ? isRTL
                  ? 'تم الاشتراك!'
                  : 'Subscribed!'
                : isRTL
                ? 'اشترك الآن'
                : 'Subscribe Now'}
            </button>
          </form>

          <p className="text-xs text-white/30">
            {isRTL
              ? 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.'
              : 'We respect your privacy. You can unsubscribe at any time.'}
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  DECORATIVE IMAGE GRID                                           */}
      {/* ============================================================= */}
      <section className="py-20 sm:py-28 lg:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <SectionTitle>
              {isRTL ? 'استكشف زمكان' : 'Explore Zamakan'}
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'لمحات من مساحاتنا المميزة التي تنتظرك'
                : 'Glimpses of our distinctive spaces waiting for you.'}
            </SectionSubtitle>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { h: 'h-48 sm:h-64', from: '#9D1942', to: '#7A1333' },
              { h: 'h-48 sm:h-64 md:mt-12', from: '#F2B704', to: '#ffbf19' },
              { h: 'h-48 sm:h-64', from: '#2B2422', to: '#979493' },
              { h: 'h-48 sm:h-64 md:mt-12', from: '#0d0f25', to: '#2B2422' },
              { h: 'h-48 sm:h-64 md:mt-8', from: '#ffbf19', to: '#F2B704' },
              { h: 'h-48 sm:h-64', from: '#7A1333', to: '#9D1942' },
              { h: 'h-48 sm:h-64 md:mt-8', from: '#979493', to: '#2B2422' },
              { h: 'h-48 sm:h-64', from: '#2B2422', to: '#0d0f25' },
            ].map((item, idx) => (
              <GradientPlaceholder
                key={idx}
                className={`${item.h} rounded-2xl`}
                from={item.from}
                to={item.to}
                label={`${isRTL ? 'صورة' : 'Image'} ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  VIDEO MODAL                                                     */}
      {/* ============================================================= */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-dark rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 end-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video flex items-center justify-center">
              <GradientPlaceholder
                className="absolute inset-0 w-full h-full rounded-none"
                from="#2B2422"
                to="#0d0f25"
              />
              <div className="relative text-center space-y-4">
                <Play className="w-16 h-16 text-white/50 mx-auto" />
                <p className="text-white/60 text-sm">
                  {isRTL
                    ? 'سيتم إضافة الفيديو قريباً'
                    : 'Video will be added soon'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
