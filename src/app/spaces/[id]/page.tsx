'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingCart,
  Armchair,
  AlertCircle,
} from 'lucide-react';
import { getSpaceById, CartItem, CART_STORAGE_KEY } from '@/lib/spaces';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export default function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const space = useMemo(() => (id ? getSpaceById(id as string) : undefined), [id]);
  const [activeImage, setActiveImage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(space?.durationOptions[0]?.value || '');
  const [hours, setHours] = useState(1);
  const [bookingType, setBookingType] = useState<'space' | 'desk'>('space');
  const [added, setAdded] = useState(false);

  if (!space) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">
            {isRTL ? 'المساحة غير موجودة' : 'Space not found'}
          </h1>
          <Link href="/" className="text-primary hover:underline">
            {isRTL ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </div>
      </div>
    );
  }

  const selectedDuration = space.durationOptions.find((d) => d.value === duration);
  const unitPrice = space.price;
  const total =
    space.type === 'workspace'
      ? unitPrice * (selectedDuration?.multiplier || 1)
      : unitPrice * hours;

  const endDate = startDate
    ? space.type === 'workspace'
      ? addDays(new Date(startDate), (selectedDuration?.multiplier || 1) * 30).toISOString().split('T')[0]
      : startDate
    : '';

  const handleAddToCart = () => {
    if (!startDate) return;

    const cart = getCart();
    const item: CartItem = {
      id: generateId(),
      spaceId: space.id,
      name: isRTL ? space.title.ar : space.title.en,
      nameAr: space.title.ar,
      type: bookingType === 'desk' ? 'desk' : space.type,
      price: total,
      quantity: 1,
      startDate,
      endDate: endDate || undefined,
      durationType: space.type === 'workspace' ? duration : `hourly-${hours}`,
      durationLabel:
        space.type === 'workspace'
          ? isRTL
            ? selectedDuration?.label.ar || ''
            : selectedDuration?.label.en || ''
          : `${hours} ${isRTL ? 'ساعات' : 'hrs'}`,
    };

    saveCart([...cart, item]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBookNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className={`min-h-screen bg-gray-50 pb-16 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero / Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-custom mb-4">
            <Link href="/" className="hover:text-primary">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-dark">{isRTL ? space.title.ar : space.title.en}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-3">
            {isRTL ? space.title.ar : space.title.en}
          </h1>
          <p className="text-gray-custom max-w-3xl leading-relaxed">
            {isRTL ? space.desc.ar : space.desc.en}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column: images + details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <Image
                  src={space.images[activeImage]}
                  alt={isRTL ? space.title.ar : space.title.en}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {space.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${isRTL ? 'صورة' : 'Image'} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 20vw"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dark mb-4">
                {isRTL ? 'تفاصيل المساحة' : 'Space Details'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-custom">{isRTL ? 'السعة' : 'Capacity'}</div>
                    <div className="font-bold text-dark">{space.capacity} {isRTL ? 'أشخاص' : 'people'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary-dark" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-custom">{isRTL ? 'السعر' : 'Price'}</div>
                    <div className="font-bold text-dark">{space.price.toLocaleString()} SAR {isRTL ? space.period.ar : space.period.en}</div>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-dark mb-3">{isRTL ? 'المميزات' : 'Features'}</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {(isRTL ? space.features.ar : space.features.en).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-custom">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column: booking panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {isRTL ? 'الحجز' : 'Booking'}
              </h2>

              {/* Space vs Desk toggle for workspaces */}
              {space.type === 'workspace' && (
                <div className="flex rounded-lg bg-gray-100 p-1 mb-5">
                  <button
                    onClick={() => setBookingType('space')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      bookingType === 'space' ? 'bg-primary text-white' : 'text-gray-custom hover:text-dark'
                    }`}
                  >
                    {isRTL ? 'احجز مساحة' : 'Book Space'}
                  </button>
                  <button
                    onClick={() => setBookingType('desk')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      bookingType === 'desk' ? 'bg-primary text-white' : 'text-gray-custom hover:text-dark'
                    }`}
                  >
                    {isRTL ? 'احجز مكتب' : 'Book Desk'}
                  </button>
                </div>
              )}

              {bookingType === 'desk' ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-custom">
                    {isRTL
                      ? 'اختر مكتبك المفضل من خريطة المكاتب المتاحة.'
                      : 'Choose your preferred desk from the available desk map.'}
                  </p>
                  <Link
                    href="/choose-desk"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    <Armchair className="w-5 h-5" />
                    {isRTL ? 'اختر مكتبك' : 'Choose Your Desk'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {space.type === 'workspace'
                        ? isRTL
                          ? 'تاريخ بداية الاشتراك'
                          : 'Start Date'
                        : isRTL
                        ? 'تاريخ الحجز'
                        : 'Booking Date'}
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {space.type === 'workspace' ? (
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        {isRTL ? 'مدة الاشتراك' : 'Duration'}
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {space.durationOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {isRTL ? opt.label.ar : opt.label.en}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        {isRTL ? 'عدد الساعات' : 'Hours'}
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setHours((h) => Math.max(1, h - 1))}
                          className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-dark">{hours}</span>
                        <button
                          onClick={() => setHours((h) => h + 1)}
                          className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-primary/5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-custom">{isRTL ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-2xl font-bold text-primary">{total.toLocaleString()} SAR</span>
                    </div>
                    {endDate && space.type === 'workspace' && (
                      <div className="text-xs text-gray-custom mt-2">
                        {isRTL ? 'حتى' : 'Until'}: {endDate}
                      </div>
                    )}
                  </div>

                  {added && (
                    <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg text-center">
                      {isRTL ? 'تمت الإضافة إلى السلة' : 'Added to cart'}
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={!startDate}
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isRTL ? 'أضف إلى السلة' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleBookNow}
                    disabled={!startDate}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    {isRTL ? 'احجز الآن' : 'Book Now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
