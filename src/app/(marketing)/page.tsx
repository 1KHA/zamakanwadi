'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';
import Image from 'next/image';
import {
  ArrowRight,
  Mail,
  MapPin,
  Briefcase,
  Coffee,
  Wifi,
  Monitor,
  Users,
  Clock,
  Zap,
  Shield,
  Headphones,
  Check,
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
            src="/images/wmk01.png"
            alt="Zamakan workspace"
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text content */}
            <div className="text-white space-y-6 sm:space-y-8">
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
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-secondary text-dark font-semibold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg shadow-secondary/20"
                >
                  {isRTL ? 'احجز الآن' : 'Book Now'}
                  <ArrowRight
                    className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                  />
                </Link>

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
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute top-6 right-6 w-36 h-36 border-[3px] border-primary/10 rounded-2xl rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute top-20 right-24 w-14 h-14 border-2 border-secondary/20 rounded-xl rotate-45" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-6 left-6 w-44 h-44 border-[3px] border-secondary/10 rounded-3xl -rotate-6" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-24 left-20 w-8 h-8 bg-primary/5 rounded-lg rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(157,25,66,0.025) 80px, rgba(157,25,66,0.025) 81px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <SectionTitle>
              {isRTL
                ? 'بيئة عمل مصممة لنجاحك'
                : 'A Work Environment Designed for Your Success'}
            </SectionTitle>

            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'استمتع بمكاتب عمل عصرية مجهزة بأحدث التقنيات، إنترنت فائق السرعة، وأماكن مريحة تساعدك على التركيز وتحقيق أهدافك بكفاءة.'
                : 'Enjoy modern offices equipped with the latest technology, high-speed internet, and comfortable spaces that help you focus and achieve your goals efficiently.'}
            </SectionSubtitle>
          </div>

          {/* Decorative image row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden">
              <Image
                src="/images/decoimage/3.jpg"
                alt={isRTL ? 'صورة زمكان 01' : 'Zamakan Image 01'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden md:mt-8">
              <Image
                src="/images/decoimage/6.jpg"
                alt={isRTL ? 'صورة زمكان 02' : 'Zamakan Image 02'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden">
              <Image
                src="/images/decoimage/7.jpg"
                alt={isRTL ? 'صورة موقع زمكان' : 'Zamakan Site Image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden md:mt-8">
              <Image
                src="/images/decoimage/10.jpg"
                alt={isRTL ? 'صورة زمكان 03' : 'Zamakan Image 03'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================= */}
      {/*  MEETING ROOMS                                                   */}
      {/* ============================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute top-8 left-6 w-28 h-28 border-2 border-secondary/20 rounded-xl rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute top-28 left-16 w-10 h-10 bg-secondary/10 rounded-lg -rotate-6" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-6 w-36 h-36 border-[3px] border-primary/10 rounded-2xl -rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-24 right-20 w-12 h-12 border-2 border-primary/10 rounded-lg rotate-6" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 100px, rgba(242,183,4,0.035) 100px, rgba(242,183,4,0.035) 101px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text — order changes on RTL/LTR via logical flow not needed because grid auto flows; we use order class */}
            <div
              className={`space-y-6 ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}
            >
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
                href="#contact"
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
              <div className="relative w-full h-80 sm:h-96 rounded-3xl shadow-xl overflow-hidden">
                <Image
                  src="/images/decoimage/7.jpg"
                  alt={isRTL ? 'قاعات الاجتماعات' : 'Meeting Rooms'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -start-6 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl shadow-lg border-4 border-white overflow-hidden">
                <Image
                  src="/images/decoimage/10.jpg"
                  alt={isRTL ? 'تفاصيل' : 'Details'}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ============================================================= */}
      {/*  FEATURES                                                        */}
      {/* ============================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute top-6 left-6 w-44 h-44 border-[3px] border-primary/10 rounded-3xl rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute top-24 left-28 w-10 h-10 border-2 border-secondary/25 rounded-lg rotate-45" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-6 w-44 h-44 border-[3px] border-secondary/15 rounded-3xl -rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-28 right-28 w-8 h-8 bg-primary/5 rounded-lg rotate-6" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
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
      {/*  DECORATIVE IMAGE GRID                                           */}
      {/* ============================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute top-6 right-6 w-40 h-40 border-[3px] border-secondary/15 rounded-2xl rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute top-24 right-24 w-12 h-12 border-2 border-primary/10 rounded-xl -rotate-6" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-6 left-6 w-36 h-36 border-2 border-primary/10 rounded-2xl -rotate-6" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-20 left-16 w-10 h-10 bg-secondary/10 rounded-lg rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(-30deg, transparent, transparent 60px, rgba(157,25,66,0.025) 60px, rgba(157,25,66,0.025) 61px)' }} />
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
              { h: 'h-48 sm:h-64', src: '/images/disimage/IMG_0219.jpg' },
              { h: 'h-48 sm:h-64 md:mt-12', src: '/images/disimage/NSPACE%20FULL-10.jpg' },
              { h: 'h-48 sm:h-64', src: '/images/disimage/IMG_0368.jpg' },
              { h: 'h-48 sm:h-64 md:mt-12', src: '/images/disimage/%D8%B5%D9%88%D8%B1%D8%A92.jpg' },
              { h: 'h-48 sm:h-64 md:mt-8', src: '/images/disimage/IMG_7903-HDR.jpg' },
              { h: 'h-48 sm:h-64', src: '/images/disimage/GNR_1879%20copy.jpg' },
              { h: 'h-48 sm:h-64 md:mt-8', src: '/images/disimage/space%26cafe-7.jpg' },
              { h: 'h-48 sm:h-64', src: '/images/disimage/NBL_9534.JPG' },
            ].map((item, idx) => (
              <div key={idx} className={`relative ${item.h} rounded-2xl overflow-hidden`}>
                <Image
                  src={item.src}
                  alt={`${isRTL ? 'صورة' : 'Image'} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

    </div>
  );
}
