'use client';

import { useState, useMemo, useEffect } from 'react';
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
  AlertCircle,
} from 'lucide-react';
import { getSpaceById, CartItem, CART_STORAGE_KEY } from '@/lib/spaces';

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;
const MIN_HOURS = 2;

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

function formatTime(hour: number, minute: number = 0) {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m}`;
}

function parseTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  return { hour: h, minute: m };
}

function timeToMinutes(time: string) {
  const { hour, minute } = parseTime(time);
  return hour * 60 + minute;
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return formatTime(h, m);
}

function generateTimeSlots() {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h <= CLOSE_HOUR; h++) {
    slots.push(formatTime(h, 0));
    if (h < CLOSE_HOUR) {
      slots.push(formatTime(h, 30));
    }
  }
  return slots;
}

interface ExistingBooking {
  id: string;
  startDate: string;
  endDate: string;
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
  const [startTime, setStartTime] = useState(formatTime(OPEN_HOUR, 0));
  const [endTime, setEndTime] = useState(formatTime(OPEN_HOUR + MIN_HOURS, 0));
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const isHourly = space?.type === 'meeting' || space?.type === 'theater';

  useEffect(() => {
    if (!isHourly || !startDate || !space) return;

    let cancelled = false;
    const loadAvailability = async () => {
      setAvailabilityLoading(true);
      try {
        const res = await fetch(`/api/bookings/availability?spaceId=${space.id}&date=${startDate}`);
        if (!res.ok) throw new Error('Failed to fetch availability');
        const data = await res.json();
        if (!cancelled) setExistingBookings(data);
      } catch {
        if (!cancelled) setExistingBookings([]);
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    };

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [isHourly, startDate, space]);

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

  const hourlyMinutes = isHourly
    ? Math.max(0, timeToMinutes(endTime) - timeToMinutes(startTime))
    : 0;
  const hourlyHours = hourlyMinutes / 60;

  const total = isHourly
    ? unitPrice * hourlyHours
    : unitPrice * (selectedDuration?.multiplier || 1);

  const endDate = startDate
    ? !isHourly
      ? addDays(new Date(startDate), (selectedDuration?.multiplier || 1) * 30).toISOString().split('T')[0]
      : startDate
    : '';

  const timeSlots = generateTimeSlots();

  function getBookedIntervals() {
    if (!startDate || existingBookings.length === 0) return [];
    const selectedDate = new Date(startDate);
    selectedDate.setHours(0, 0, 0, 0);

    return existingBookings
      .filter((booking) => {
        const bookingDate = new Date(booking.startDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === selectedDate.getTime();
      })
      .map((booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        return {
          start: bookingStart.getHours() * 60 + bookingStart.getMinutes(),
          end: bookingEnd.getHours() * 60 + bookingEnd.getMinutes(),
        };
      });
  }

  function hasOverlap(startMin: number, endMin: number) {
    return getBookedIntervals().some(
      (interval) => startMin < interval.end && endMin > interval.start
    );
  }

  function isTimeBooked(time: string) {
    const timeMin = timeToMinutes(time);
    return getBookedIntervals().some(
      (interval) => timeMin >= interval.start && timeMin < interval.end
    );
  }

  const isEndTimeValid = (end: string) => {
    const endMin = timeToMinutes(end);
    const startMin = timeToMinutes(startTime);
    return (
      endMin >= startMin + MIN_HOURS * 60 &&
      endMin <= CLOSE_HOUR * 60 &&
      !hasOverlap(startMin, endMin)
    );
  };

  const isStartTimeValid = (start: string) => {
    const startMin = timeToMinutes(start);
    return (
      startMin + MIN_HOURS * 60 <= CLOSE_HOUR * 60 &&
      !isTimeBooked(start) &&
      !hasOverlap(startMin, timeToMinutes(endTime))
    );
  };

  const isBookingValid = () => {
    if (!startDate) return false;
    if (!isHourly) return true;
    return isEndTimeValid(endTime) && isStartTimeValid(startTime);
  };

  const validationError = (() => {
    if (!startDate) return '';
    if (!isHourly) return '';
    if (hourlyHours < MIN_HOURS) {
      return isRTL
        ? `الحد الأدنى للحجز هو ${MIN_HOURS} ساعات`
        : `Minimum booking is ${MIN_HOURS} hours`;
    }
    if (timeToMinutes(endTime) > CLOSE_HOUR * 60) {
      return isRTL
        ? `آخر موعد متاح هو ${formatTime(CLOSE_HOUR, 0)}`
        : `Latest available time is ${formatTime(CLOSE_HOUR, 0)}`;
    }
    if (
      hasOverlap(timeToMinutes(startTime), timeToMinutes(endTime))
    ) {
      return isRTL
        ? 'الفترة المحددة تتداخل مع حجز موجود'
        : 'Selected time overlaps with an existing booking';
    }
    return '';
  })();

  const handleBookNow = () => {
    if (!startDate || !isBookingValid()) return;

    const cart = getCart();
    const item: CartItem = {
      id: generateId(),
      spaceId: space.id,
      name: isRTL ? space.title.ar : space.title.en,
      nameAr: space.title.ar,
      type: space.type,
      price: total,
      quantity: 1,
      startDate,
      endDate: endDate || undefined,
      startTime: isHourly ? startTime : undefined,
      endTime: isHourly ? endTime : undefined,
      durationType: isHourly ? `hourly-${hourlyHours}` : duration,
      durationLabel: isHourly
        ? `${hourlyHours} ${isRTL ? 'ساعات' : 'hrs'} (${startTime} - ${endTime})`
        : isRTL
        ? selectedDuration?.label.ar || ''
        : selectedDuration?.label.en || '',
    };

    saveCart([...cart, item]);
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

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {!isHourly
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

                {!isHourly ? (
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
                  <>
                    <div className="p-3 bg-secondary/10 rounded-lg text-sm text-secondary-dark">
                      <div className="font-medium mb-1">
                        {isRTL ? 'ساعات التوفر' : 'Available Hours'}
                      </div>
                      <div>
                        {formatTime(OPEN_HOUR, 0)} - {formatTime(CLOSE_HOUR, 0)}
                      </div>
                      <div className="text-xs mt-1 opacity-80">
                        {isRTL
                          ? `الحد الأدنى للحجز ${MIN_HOURS} ساعات`
                          : `Minimum booking ${MIN_HOURS} hours`}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        {isRTL ? 'وقت البداية' : 'Start Time'}
                      </label>
                      <select
                        value={startTime}
                        onChange={(e) => {
                          const newStart = e.target.value;
                          setStartTime(newStart);
                          const newEndMin = timeToMinutes(newStart) + MIN_HOURS * 60;
                          const currentEndMin = timeToMinutes(endTime);
                          if (currentEndMin < newEndMin) {
                            setEndTime(minutesToTime(newEndMin));
                          }
                        }}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {timeSlots.map((time) => {
                          const startValid = isStartTimeValid(time);
                          return (
                            <option key={time} value={time} disabled={!startValid}>
                              {time} {isTimeBooked(time) ? (isRTL ? ' (محجوز)' : ' (Booked)') : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        {isRTL ? 'وقت النهاية' : 'End Time'}
                      </label>
                      <select
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {timeSlots.map((time) => {
                          const timeMin = timeToMinutes(time);
                          const startMin = timeToMinutes(startTime);
                          const disabled = timeMin <= startMin || timeMin > CLOSE_HOUR * 60 || hasOverlap(startMin, timeMin);
                          return (
                            <option key={time} value={time} disabled={disabled}>
                              {time}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {availabilityLoading && (
                      <div className="text-xs text-gray-custom">
                        {isRTL ? 'جاري التحقق من التوفر...' : 'Checking availability...'}
                      </div>
                    )}

                    {validationError && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {validationError}
                      </div>
                    )}
                  </>
                )}

                <div className="p-4 bg-primary/5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-custom">{isRTL ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-2xl font-bold text-primary">{total.toLocaleString()} SAR</span>
                  </div>
                  {endDate && !isHourly && (
                    <div className="text-xs text-gray-custom mt-2">
                      {isRTL ? 'حتى' : 'Until'}: {endDate}
                    </div>
                  )}
                  {isHourly && (
                    <div className="text-xs text-gray-custom mt-2">
                      {startTime} - {endTime} ({hourlyHours} {isRTL ? 'ساعات' : 'hrs'})
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={!isBookingValid()}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  {isRTL ? 'احجز الآن' : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
