'use client';

import { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Calendar } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import { spaces, Space } from '@/lib/spaces';

/* ------------------------------------------------------------------ */
/*  Tabs derived from spaces data                                     */
/* ------------------------------------------------------------------ */

const tabs: { key: Space['category']; label: { ar: string; en: string } }[] = [
  { key: 'offices', label: { ar: 'مكاتب العمل', en: 'Work Offices' } },
  { key: 'meeting', label: { ar: 'قاعات الاجتماعات', en: 'Meeting Rooms' } },
  { key: 'theater', label: { ar: 'المسارح', en: 'Theaters' } },
];

/* ------------------------------------------------------------------ */
/*  Package card                                                        */
/* ------------------------------------------------------------------ */

function PackageCard({
  space,
  isRTL,
  index,
}: {
  space: Space;
  isRTL: boolean;
  index: number;
}) {
  return (
    <AnimateOnScroll direction="up" delay={index * 120} duration={500} className="h-full">
      <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full bg-white">
        {/* Image with title badge */}
        <div className="relative h-44 w-full shrink-0">
          <Image
            src={space.images[0]}
            alt={isRTL ? space.title.ar : space.title.en}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient overlay so badge is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-transparent" />
          {/* Title badge — top start corner */}
          <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-white/90 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm`}>
            {isRTL ? space.title.ar : space.title.en}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Description */}
          <p className="text-sm font-bold text-gray-700 leading-relaxed mb-4">
            {isRTL ? space.desc.ar : space.desc.en}
          </p>

          <ul className="space-y-2 flex-1">
            {(isRTL ? space.features.ar : space.features.en).slice(0, 4).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl font-bold text-primary">{space.price.toLocaleString()}</span>
              <span className="text-gray-custom text-sm">SAR {isRTL ? space.period.ar : space.period.en}</span>
            </div>
            <Link
              href={`/spaces/${space.id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Calendar className="w-4 h-4" />
              {isRTL ? 'احجز الآن' : 'Book Now'}
            </Link>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                        */
/* ------------------------------------------------------------------ */

function PackagesSectionContent() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  // Meeting rooms tab (middle) is the primary/default tab
  const [activeTab, setActiveTab] = useState(1);

  const activeKey = tabs[activeTab].key;
  const visibleSpaces = spaces.filter((s) => s.category === activeKey);

  return (
    <section id="packages" className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
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
              {tabs.map((t, i) => (
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
            visibleSpaces.length === 4
              ? 'sm:grid-cols-2 lg:grid-cols-4'
              : visibleSpaces.length === 3
              ? 'sm:grid-cols-2 lg:grid-cols-3'
              : 'sm:grid-cols-2'
          }`}
        >
          {visibleSpaces.map((space, i) => (
            <PackageCard key={space.id} space={space} isRTL={isRTL} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PackagesSection() {
  return (
    <Suspense fallback={
      <section id="packages" className="relative py-20 sm:py-28 lg:py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="h-10 bg-gray-200 rounded w-48 mx-auto" />
          </div>
          <div className="flex justify-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-full max-w-lg" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    }>
      <PackagesSectionContent />
    </Suspense>
  );
}
