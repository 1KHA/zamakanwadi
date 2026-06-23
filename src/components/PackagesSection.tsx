'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Check } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const data = {
  tabs: [
    {
      key: 'offices',
      label: { ar: 'مكاتب العمل', en: 'Work Offices' },
      packages: [
        {
          title: { ar: 'الباقة المرنة', en: 'Flex Package' },
          desc: {
            ar: 'مكتب حر في مساحة عمل مشتركة.',
            en: 'Flexible shared workspace ideal for freelancers and remote workers with no long-term commitments.',
          },
          image: '/images/office/DSC_5994.JPG',
          features: {
            ar: ['٧/٢٤ على مدار اليوم', 'انترنت', 'صالة ترفيهية', 'مصلى'],
            en: ['24/7 access', 'Internet', 'Lounge area', 'Prayer room'],
          },
        },
        {
          title: { ar: 'باقة الرواد', en: 'Pioneer Package' },
          desc: {
            ar: 'مكتب مخصص في مساحات عمل مشتركة تمكن المشتركين من تبادل الخبرات وتوسيع دائرة معارفهم​.',
            en: 'A dedicated permanent desk giving you privacy and stability while enjoying community benefits.',
          },
          image: '/images/office/DSC_5994٤.JPG',
          features: {
            ar: ['٧/٢٤ على مدار اليوم', 'انترنت', 'صالة ترفيهية', 'مصلى', '٢ ساعات شهريا لقاعات الاجتماعات'],
            en: ['24/7 access', 'Internet', 'Lounge area', 'Prayer room', '2 hrs/month meeting rooms'],
          },
        },
        {
          title: { ar: 'باقة الرواد +', en: 'Pioneer+ Package' },
          desc: {
            ar: 'مكاتب مغلقة للمشتركين الراغبين في خلق مساحة خاصة بهم في بيئة استثنائية ذات خصوصية تامة..',
            en: 'A private enclosed workspace with full focus and professional meeting capabilities.',
          },
          image: '/images/office/IMG_0349.jpg',
          features: {
            ar: ['٧/٢٤ على مدار اليوم', 'انترنت', 'صالة ترفيهية', 'مصلى', '٤ ساعات شهريا لقاعات الاجتماعات', 'ساعتين شهريا للمسرح'],
            en: ['24/7 access', 'Internet', 'Lounge area', 'Prayer room', '4 hrs/month meeting rooms', '2 hrs/month theater'],
          },
        },
        {
          title: { ar: 'باقة الشركات', en: 'Corporate Package' },
          desc: {
            ar: 'مساحة عمل مستقلة ،ومؤثثة بالكامل للشركات المتوسطة والكبيرة.​.',
            en: 'A fully enclosed office for companies and growing teams with exclusive perks and booking priority.',
          },
          image: '/images/office/comp01.jpg',
          features: {
            ar: ['٧/٢٤ على مدار اليوم', 'انترنت', 'صالة ترفيهية', 'مصلى', '٤ ساعات شهريا لقاعات الاجتماعات', 'ساعتين شهريا للمسرح', 'دخول ذكي'],
            en: ['24/7 access', 'Internet', 'Lounge area', 'Prayer room', '4 hrs/month meeting rooms', '2 hrs/month theater', 'Smart access'],
          },
        },
      ],
    },
    {
      key: 'meeting',
      label: { ar: 'قاعات الاجتماعات', en: 'Meeting Rooms' },
      packages: [
        {
          title: { ar: 'قاعة ريادة ١', en: 'Riyadah Room 1' },
          desc: {
            ar: 'قاعة اجتماعات تمتاز بتصميم عصري في بيئة مريحة تساعد على الإنتاجية  تم تجهيزها  بأفضل الوسائل التقنية المساعدة في الاجتماعات.',
            en: 'Fully equipped small room for meetings and creative sessions for small teams.',
          },
          image: '/images/decoimage/6.jpg',
          features: {
            ar: ['شاشة تلفاز', 'دفتر ملاحظات', 'سبورة', 'دعم تقني', 'نظام صوتي'],
            en: ['Smart board', 'Audio system', 'AC', 'Dedicated Wi-Fi', 'Up to 8 persons'],
          },
        },
        {
          title: { ar: 'قاعة ريادة ٢', en: 'Riyadah Room 2' },
          desc: {
            ar: 'قاعة اجتماعات تجمع بين التصميم العملي والراحة مع توفير وسائل العرض والخدمات المساندة.',
            en: 'Medium room ideal for workshops, training sessions and extended meetings with catering.',
          },
          image: '/images/decoimage/DSC_2340.JPG',
          features: {
            ar: ['نظام عرض', 'دفتر ملاحظات', 'سبورة', 'دعم تقني'],
            en: ['Smart board', 'Audio system', 'AC', 'Dedicated Wi-Fi', 'Catering service', 'Up to 20 persons'],
          },
        },
        {
          title: { ar: 'قاعة بناء', en: 'Bina Room' },
          desc: {
            ar: 'قاعة مجهزة بالكامل لإقامة ورش العمل والدورات التدريبية​.',
            en: 'Large multi-purpose room with the latest display and recording technologies for major events.',
          },
          image: '/images/wmk01.png',
          features: {
            ar: ['جهاز عرض','سبورة', 'دعم تقني', 'أثاث مرن', 'منصة تقديم'],
            en: ['Smart board', 'Full audio system', 'AC', 'Dedicated Wi-Fi', 'Catering service', 'Video recording', 'Up to 50 persons'],
          },
        },
      ],
    },
    {
      key: 'theater',
      label: { ar: 'المسارح', en: 'Theaters' },
      packages: [
        {
          title: { ar: 'مسرح إثراء', en: 'Ithraa Theater' },
          desc: {
            ar: 'مسرح متكامل يجمع بين التصميم الحديث والتقنية المتطورة لاستضافة الفعاليات .',
            en: 'A full-featured theater combining modern design and advanced technology for events and conferences.',
          },
          image: '/images/theater/DSC2119.jpg',
          features: {
            ar: ['شاشة عرض كبيرة', 'نظام صوتي احترافي', 'إضاءة قابلة للضبط', 'تسع حتى 40 شخصاً'],
            en: ['Large display screen', 'Professional audio system', 'Adjustable lighting', 'AC', 'Up to 40 persons'],
          },
        },
        {
          title: { ar: 'مسرح ترابط', en: 'Tarabut Theater' },
          desc: {
            ar: 'مدرج مصمم بطريقة عصرية للقاءات والفعاليات.',
            en: 'An authentic wooden theater offering a warm atmosphere for cultural, training and creative presentations.',
          },
          image: '/images/theater/IMG_0181.jpg',
          features: {
            ar: ['نظام عرض', 'منصة عرض','سبورة','دعم تقني'],
            en: ['Huge display screen', 'Professional audio system', 'Advanced lighting', 'Central AC', 'Stage', 'Live streaming', 'Up to 120 persons'],
          },
        },
        {
          title: { ar: 'مسرح ركيزة', en: 'Rakeeza Theater' },
          desc: {
            ar: 'مسرح مرن يمكن تشكيله حسب الطلب.',
            en: 'A large professional theater with cutting-edge sound and lighting for major conferences and events.',
          },
          image: '/images/theater/DSC_55544.jpg',
          features: {
            ar: ['شاشة تلفاز', 'سبورة', 'دعم تقني'],
            en: ['Huge display screen', 'Professional audio system', 'Advanced lighting', 'Central AC', 'Stage', 'Live streaming', 'Up to 120 persons'],
          },
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Package card                                                        */
/* ------------------------------------------------------------------ */

function PackageCard({
  pkg,
  isRTL,
  index,
}: {
  pkg: (typeof data.tabs)[0]['packages'][0];
  isRTL: boolean;
  index: number;
}) {
  return (
    <AnimateOnScroll direction="up" delay={index * 120} duration={500} className="h-full">
      <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full bg-white">

        {/* Image with title badge */}
        <div className="relative h-44 w-full shrink-0">
          <Image
            src={pkg.image}
            alt={isRTL ? pkg.title.ar : pkg.title.en}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient overlay so badge is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-transparent" />
          {/* Title badge — top start corner */}
          <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-white/90 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm`}>
            {isRTL ? pkg.title.ar : pkg.title.en}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Description in place of old title */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {isRTL ? pkg.desc.ar : pkg.desc.en}
          </p>

          <ul className="space-y-2 flex-1">
            {(isRTL ? pkg.features.ar : pkg.features.en).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                        */
/* ------------------------------------------------------------------ */

export default function PackagesSection() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState(0);

  const tab = data.tabs[activeTab];

  return (
    <section className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
      {/* Decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute top-6 left-6 w-40 h-40 border-[3px] border-primary/8 rounded-3xl rotate-12" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-6 w-32 h-32 border-2 border-secondary/15 rounded-2xl -rotate-6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimateOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#9e1c45]">
              {isRTL ? 'مساحات الأعمال' : 'Our Packages'}
            </h2>
            <p className="text-base sm:text-lg text-gray-custom max-w-2xl mx-auto leading-relaxed">
              {isRTL
                ? 'بيئة أعمال متكاملة تضم مكاتب وقاعات ومسارح متعددة الاستخدامات'
                : 'Choose the package that suits your needs from a variety of options designed for every type of user.'}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Tabs */}
        <AnimateOnScroll direction="up" delay={100}>
          <div className="flex justify-center mb-12">
            <div className="flex gap-0 border-b border-gray-200 w-full max-w-lg">
              {data.tabs.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 pb-3 pt-2 text-sm sm:text-base font-semibold transition-all duration-200 relative ${
                    activeTab === i
                      ? 'text-primary'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isRTL ? t.label.ar : t.label.en}
                  {activeTab === i && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Cards */}
        <div
          className={`grid gap-6 ${
            tab.packages.length === 4
              ? 'sm:grid-cols-2 lg:grid-cols-4'
              : tab.packages.length === 3
              ? 'sm:grid-cols-2 lg:grid-cols-3'
              : 'sm:grid-cols-2'
          }`}
        >
          {tab.packages.map((pkg, i) => (
            <PackageCard
              key={`${activeTab}-${i}`}
              pkg={pkg}
              isRTL={isRTL}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
