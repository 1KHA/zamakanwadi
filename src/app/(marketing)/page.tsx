'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import ContactSection from '@/components/ContactSection';
import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import FlipImage from '@/components/FlipImage';
import HeroVideoBackground from '@/components/HeroVideoBackground';
import PackagesSection from '@/components/PackagesSection';
import {
  ArrowRight,
  Coffee,
  Wifi,
  Clock,
  Check,
  BookOpen,
  Tv,
  Moon,
  Car,
  ShieldCheck,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helper components                                                   */
/* ------------------------------------------------------------------ */

function SectionTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#9e1c45] ${className}`}
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
      icon: <Coffee className="w-7 h-7" />,
      title: isRTL ? 'منطقة قهوة' : 'Coffee Area',
      desc: isRTL ? '-' : 'Comfortable coffee area to recharge and connect.',
    },
    {
      icon: <Wifi className="w-7 h-7" />,
      title: isRTL ? 'إنترنت' : 'High-Speed Internet',
      desc: isRTL ? '-' : 'Fast and reliable internet for all members.',
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: isRTL ? 'مكتبة' : 'Library',
      desc: isRTL ? '-' : 'A curated library to support learning and growth.',
    },
    {
      icon: <Tv className="w-7 h-7" />,
      title: isRTL ? 'منطقة ترفيه' : 'Entertainment Area',
      desc: isRTL ? '-' : 'Spaces to relax and socialize between work sessions.',
    },
    {
      icon: <Moon className="w-7 h-7" />,
      title: isRTL ? 'مصلى' : 'Prayer Room',
      desc: isRTL ? '-' : 'A quiet dedicated space for prayer.',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: isRTL ? 'وصول على مدار الساعة' : '24/7 Access',
      desc: isRTL ? '-' : 'Access your workspace anytime that fits your schedule.',
    },
    {
      icon: <Car className="w-7 h-7" />,
      title: isRTL ? 'مواقف سيارات' : 'Parking',
      desc: isRTL ? '-' : 'Convenient parking available for all members.',
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: isRTL ? 'نظام أمني ٢٤ ساعة' : '24/7 Security',
      desc: isRTL ? '-' : 'Advanced security systems to protect your belongings.',
    },
  ];


  return (
    <div className="scroll-smooth">
      {/* ============================================================= */}
      {/*  HERO                                                         */}
      {/* ============================================================= */}
      {/* Height = viewport minus the sticky navbar above it (h-20 = 5rem, plus
          its 1px bottom border), so the hero fits the screen exactly instead of
          overflowing. dvh keeps that true on mobile as browser chrome collapses. */}
      <section className="relative w-full h-[calc(100dvh-5rem-1px)] overflow-hidden bg-dark flex flex-col">
        {/* Looping, silent video background */}
        <div className="absolute inset-0">
          <HeroVideoBackground videoId="54r-UGo2h-o" />
          {/* Light scrim, only enough to keep the white text readable. */}
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/40 via-primary/20 to-dark/50" />
        </div>

        <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full">
            {/* Text content */}
            <AnimateOnScroll direction="right" className="text-white space-y-6 sm:space-y-8 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {isRTL ? (
                  <>
                    زمـــــــــــــــــكـان
                    <br />
                    <span className="text-secondary">مجتمعك</span> الريادي
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

              {/* <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-lg leading-relaxed">
                {isRTL
                  ? 'اكتشف بيئة عمل مصممة لتلهمك وتدعم نموك المهني مع أفضل المرافق والخدمات.'
                  : 'Discover a work environment designed to inspire you and support your professional growth with the best facilities and services.'}
              </p> */}

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/?tab=meeting#packages"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-secondary text-white text-xl sm:text-2xl font-semibold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg shadow-secondary/20"
                >
                  {isRTL ? 'حجز فعالية' : 'Book Now'}
                  <ArrowRight
                    className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`}
                  />
                </Link>

              </div>
            </AnimateOnScroll>

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
          <AnimateOnScroll direction="up">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <SectionTitle>
              {isRTL
                ? 'بيئة عمل ملهمة'
                : 'A Work Environment Designed for Your Success'}
            </SectionTitle>

            <SectionSubtitle className="mx-auto">
              {isRTL
                ? 'رسالتنا تكمن في خلق بيئة محفزة للإبداع والإبتكار لإثراء تجربة ريادي الأعمال وربطهم بالمجتمع الريادي.'
                : 'Enjoy modern offices equipped with the latest technology, high-speed internet, and comfortable spaces that help you focus and achieve your goals efficiently.'}
            </SectionSubtitle>
          </div>
          </AnimateOnScroll>

          {/* Decorative image row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <FlipImage
              src="/images/office/01.jpg"
              alt={isRTL ? 'صورة زمكان 01' : 'Zamakan Image 01'}
              delay={0}
              className="relative h-48 sm:h-64 rounded-2xl"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <FlipImage
              src="/images/office/02.jpg"
              alt={isRTL ? 'صورة زمكان 02' : 'Zamakan Image 02'}
              delay={300}
              className="relative h-48 sm:h-64 rounded-2xl md:mt-8"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <FlipImage
              src="/images/office/03.png"
              alt={isRTL ? 'صورة موقع زمكان' : 'Zamakan Site Image'}
              delay={600}
              className="relative h-48 sm:h-64 rounded-2xl"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <FlipImage
              src="/images/office/04.png"
              alt={isRTL ? 'صورة زمكان 03' : 'Zamakan Image 03'}
              delay={900}
              className="relative h-48 sm:h-64 rounded-2xl md:mt-8"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      </section>


      <PackagesSection />

      {/* ============================================================= */}
      {/*  MEETING ROOMS — hidden                                           */}
      {/* ============================================================= */}
      {/* <section className="relative py-20 sm:py-28 lg:py-36 bg-[#9e1c45] overflow-hidden"> */}
      {false && <section className="relative py-20 sm:py-28 lg:py-36 bg-[#9e1c45] overflow-hidden">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute top-8 left-6 w-28 h-28 border-2 border-secondary/20 rounded-xl rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute top-28 left-16 w-10 h-10 bg-secondary/10 rounded-lg -rotate-6" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-6 w-36 h-36 border-[3px] border-white/10 rounded-2xl -rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-24 right-20 w-12 h-12 border-2 border-white/10 rounded-lg rotate-6" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 100px, rgba(242,183,4,0.035) 100px, rgba(242,183,4,0.035) 101px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text — order changes on RTL/LTR via logical flow not needed because grid auto flows; we use order class */}
            <AnimateOnScroll direction="right"
              className={`space-y-6 ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {isRTL
                  ? 'استديو زوايا'
                  : 'Meeting Rooms for Every Occasion'}
              </h2>

              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
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
                    className="flex items-center gap-3 text-white"
                  >
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-[#e2a026]" />
                    </span>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-medium rounded-xl hover:bg-secondary-dark transition-colors"
              >
                {isRTL ? 'احجز قاعة' : 'Book a Room'}
                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
                />
              </Link>
            </AnimateOnScroll>

            {/* Images */}
            <AnimateOnScroll direction="left" delay={150}
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
                  src="/images/decoimage/3.jpg"
                  alt={isRTL ? 'تفاصيل' : 'Details'}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>}



      {/* ============================================================= */}
      {/*  FEATURES                                                        */}
      {/* ============================================================= */}
      <section className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
        {/* Decorative background */}
        <div aria-hidden="true" className="pointer-events-none absolute top-6 left-6 w-44 h-44 border-[3px] border-primary/10 rounded-3xl rotate-12" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-6 w-44 h-44 border-[3px] border-secondary/15 rounded-3xl -rotate-12" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-primary text-white overflow-hidden shadow-2xl shadow-primary/20">
              {/* Panel decorations */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -end-32 w-[28rem] h-[28rem] rounded-full bg-secondary/25 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -start-24 w-[26rem] h-[26rem] rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              />

              <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-14 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                {/* Heading column */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <span
                    aria-hidden="true"
                    className="block w-14 h-1.5 rounded-full bg-secondary mb-6"
                  />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                    {isRTL ? 'مميزاتنا' : 'Our Features'}
                  </h2>
                  <p className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed max-w-md">
                    {isRTL
                      ? 'نوفر لك كل ما تحتاجه لتحقيق أقصى إنتاجية في بيئة عمل ملهمة'
                      : 'We provide everything you need to achieve maximum productivity in an inspiring work environment.'}
                  </p>
                </div>

                {/* Features column */}
                <div className="lg:col-span-8">
                  <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {features.map((feature, idx) => (
                      <li key={idx} className="h-full">
                        <AnimateOnScroll
                          direction="up"
                          delay={idx * 70}
                          duration={500}
                          className="h-full"
                        >
                          <div className="group h-full flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-4 sm:p-5 transition-all duration-300 hover:bg-white hover:border-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10">
                            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary text-white flex items-center justify-center shadow-md shadow-black/10 transition-transform duration-300 group-hover:scale-105">
                              {feature.icon}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-lg font-bold leading-snug text-white transition-colors group-hover:text-primary">
                                {feature.title}
                              </h3>
                              {feature.desc && feature.desc !== '-' && (
                                <p className="mt-1 text-sm leading-relaxed text-white/65 transition-colors group-hover:text-gray-custom">
                                  {feature.desc}
                                </p>
                              )}
                            </div>
                          </div>
                        </AnimateOnScroll>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
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
          <AnimateOnScroll direction="up">
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
          </AnimateOnScroll>

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
              <AnimateOnScroll key={idx} direction="up" delay={idx * 60} className={`relative ${item.h} rounded-2xl overflow-hidden`}>
                <Image
                  src={item.src}
                  alt={`${isRTL ? 'صورة' : 'Image'} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

    </div>
  );
}
