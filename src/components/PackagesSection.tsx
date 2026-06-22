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
          title: { ar: 'الباقة المؤسسية', en: 'Corporate Package' },
          image: '/images/disimage/NSPACE FULL-10.jpg',
          features: {
            ar: ['نظام أمان', 'مكتبة', 'موقف سيارات', 'إنترنت عالي السرعة', 'منطقة ترفيه', 'قاعة اجتماعات'],
            en: ['Security system', 'Library', 'Parking', 'High-speed Internet', 'Entertainment area', 'Meeting room'],
          },
        },
        {
          title: { ar: 'باقة رائد+', en: '+ Pioneer Package' },
          image: '/images/disimage/IMG_0219.jpg',
          features: {
            ar: ['نظام أمان', 'مكتبة', 'موقف سيارات', 'إنترنت عالي السرعة', 'منطقة ترفيه'],
            en: ['Security system', 'Library', 'Parking', 'High-speed Internet', 'Entertainment area'],
          },
        },
        {
          title: { ar: 'باقة رائد', en: 'Pioneer Package' },
          image: '/images/disimage/IMG_0368.jpg',
          features: {
            ar: ['نظام أمان', 'مكتبة', 'موقف سيارات', 'إنترنت عالي السرعة'],
            en: ['Security system', 'Library', 'Parking', 'High-speed Internet'],
          },
        },
        {
          title: { ar: 'باقة الطالب', en: 'Student Package' },
          image: '/images/disimage/IMG_0267.jpg',
          features: {
            ar: ['نظام أمان', 'مكتبة', 'إنترنت عالي السرعة'],
            en: ['Security system', 'Library', 'High-speed Internet'],
          },
        },
      ],
    },
    {
      key: 'meeting',
      label: { ar: 'قاعات الاجتماعات', en: 'Meeting Rooms' },
      packages: [
        {
          title: { ar: 'القاعة الصغيرة', en: 'Small Room' },
          image: '/images/disimage/IMG_0376 - Copy.jpg',
          features: {
            ar: ['سبورة ذكية', 'نظام صوتي', 'تكييف', 'واي فاي مخصص', 'تسع حتى 8 أشخاص'],
            en: ['Smart board', 'Audio system', 'AC', 'Dedicated Wi-Fi', 'Up to 8 persons'],
          },
        },
        {
          title: { ar: 'القاعة المتوسطة', en: 'Medium Room' },
          image: '/images/disimage/NBL_9534.JPG',
          features: {
            ar: ['سبورة ذكية', 'نظام صوتي', 'تكييف', 'واي فاي مخصص', 'خدمة ضيافة', 'تسع حتى 20 شخصاً'],
            en: ['Smart board', 'Audio system', 'AC', 'Dedicated Wi-Fi', 'Catering service', 'Up to 20 persons'],
          },
        },
        {
          title: { ar: 'القاعة الكبيرة', en: 'Large Room' },
          image: '/images/disimage/NSPACE FULL-8.jpg',
          features: {
            ar: ['سبورة ذكية', 'نظام صوتي متكامل', 'تكييف', 'واي فاي مخصص', 'خدمة ضيافة', 'تسجيل فيديو', 'تسع حتى 50 شخصاً'],
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
          title: { ar: 'المسرح الصغير', en: 'Small Theater' },
          image: '/images/disimage/space&cafe-7.jpg',
          features: {
            ar: ['شاشة عرض كبيرة', 'نظام صوتي احترافي', 'إضاءة قابلة للضبط', 'تكييف', 'تسع حتى 40 شخصاً'],
            en: ['Large display screen', 'Professional audio system', 'Adjustable lighting', 'AC', 'Up to 40 persons'],
          },
        },
        {
          title: { ar: 'المسرح الكبير', en: 'Large Theater' },
          image: '/images/disimage/GNR_1879 copy.jpg',
          features: {
            ar: ['شاشة عرض ضخمة', 'نظام صوتي احترافي', 'إضاءة متقدمة', 'تكييف مركزي', 'منصة عرض', 'تسجيل بث مباشر', 'تسع حتى 120 شخصاً'],
            en: ['Huge display screen', 'Professional audio system', 'Advanced lighting', 'Central AC', 'Stage', 'Live stream recording', 'Up to 120 persons'],
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
  active,
}: {
  pkg: (typeof data.tabs)[0]['packages'][0];
  isRTL: boolean;
  index: number;
  active: boolean;
}) {
  return (
    <AnimateOnScroll direction="up" delay={index * 120} duration={500} className="h-full">
      <div
        className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full bg-white"
      >
        {/* Image */}
        <div className="relative h-44 w-full">
          <Image
            src={pkg.image}
            alt={isRTL ? pkg.title.ar : pkg.title.en}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-bold text-dark mb-4">
            {isRTL ? pkg.title.ar : pkg.title.en}
          </h3>
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
              {isRTL ? 'باقاتنا' : 'Our Packages'}
            </h2>
            <p className="text-base sm:text-lg text-gray-custom max-w-2xl mx-auto leading-relaxed">
              {isRTL
                ? 'اختر الباقة التي تناسب احتياجاتك من مجموعة متنوعة من الخيارات المصممة لكل نوع من المستخدمين'
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
              active={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
