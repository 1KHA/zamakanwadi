'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CreditCard, Lock, Check, AlertCircle, Calendar, Tag } from 'lucide-react';
import { apiFetch } from '@/lib/apiFetch';

interface DueBooking {
  id: string;
  itemName: string;
  itemNameAr: string | null;
  total: number;
  durationType: string | null;
  startDate: string | null;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function PaymentContent() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref') || '';
  const applied = searchParams.get('applied') || '';
  const { status } = useSession();

  const [bookings, setBookings] = useState<DueBooking[]>([]);
  const [amountDue, setAmountDue] = useState(0);
  const [loading, setLoading] = useState(!!reference);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    // Unauthenticated renders its own screen before the loading check,
    // so no state change is needed here.
    if (status !== 'authenticated' || !reference) return;
    let cancelled = false;
    apiFetch(`/api/payments?ref=${encodeURIComponent(reference)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setBookings(data.bookings ?? []);
        setAmountDue(data.amountDue ?? 0);
      })
      .catch(() => {
        if (!cancelled) setError(isRTL ? 'فشل تحميل تفاصيل الدفع' : 'Failed to load payment details');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, reference, isRTL]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPaying(true);
    try {
      const res = await apiFetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceNumber: reference, cardName, cardNumber, expiry, cvc }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || (isRTL ? 'فشل الدفع' : 'Payment failed'));
      const appliedParam = applied ? `&applied=${applied}` : '';
      router.push(`/dashboard?confirmed=1&ref=${reference}&paid=1${appliedParam}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : isRTL ? 'فشل الدفع' : 'Payment failed');
      setPaying(false);
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-4">{isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in'}</h1>
          <a href="/signin" className="inline-flex px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </a>
        </div>
      </div>
    );
  }

  if (loading || status === 'loading') {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-gray-custom">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  if (!reference || bookings.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">
            {isRTL ? 'لا توجد مدفوعات مستحقة' : 'Nothing due for payment'}
          </h1>
          <p className="text-gray-custom mb-4">
            {isRTL ? 'هذا الحجز لا يتطلب دفعاً إلكترونياً أو تم دفعه مسبقاً.' : 'This booking needs no online payment or was already paid.'}
          </p>
          <a href="/dashboard" className="text-primary hover:underline font-medium">
            {isRTL ? 'الذهاب إلى لوحة التحكم' : 'Go to dashboard'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-2 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-primary" />
          {isRTL ? 'إتمام الدفع' : 'Payment'}
        </h1>
        <p className="text-sm text-gray-custom mb-8">
          {isRTL
            ? 'صفحة دفع تجريبية لأغراض العرض — لن يتم خصم أي مبلغ فعلي.'
            : 'Demo payment page for presentation purposes — no real charge will be made.'}
        </p>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Card form */}
          <div className="lg:col-span-3">
            <form onSubmit={handlePay} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'الاسم على البطاقة' : 'Name on Card'}
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder={isRTL ? 'محمد علي' : 'John Doe'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'رقم البطاقة' : 'Card Number'}
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  dir="ltr"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4111 1111 1111 1111"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'تاريخ الانتهاء' : 'Expiry'}
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    dir="ltr"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">CVC</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    dir="ltr"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

              <button
                type="submit"
                disabled={paying}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                {paying
                  ? isRTL
                    ? 'جاري الدفع...'
                    : 'Processing...'
                  : `${isRTL ? 'ادفع' : 'Pay'} ${amountDue.toLocaleString()} SAR`}
              </button>
              <p className="text-xs text-gray-custom text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                {isRTL ? 'عملية آمنة (تجريبية)' : 'Secure checkout (demo)'}
              </p>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-dark text-lg mb-4">{isRTL ? 'ملخص الطلب' : 'Order Summary'}</h2>
              <div className="text-xs text-gray-custom mb-4">
                {isRTL ? 'رقم المرجع:' : 'Reference:'} <span className="font-bold text-dark">{reference}</span>
              </div>
              <div className="space-y-4 mb-6">
                {bookings.map((b) => (
                  <div key={b.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-dark text-sm truncate">
                        {isRTL && b.itemNameAr ? b.itemNameAr : b.itemName}
                      </div>
                      <div className="text-xs text-gray-custom mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {b.startDate ? new Date(b.startDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US') : '-'}
                        {b.durationType ? ` · ${b.durationType}` : ''}
                      </div>
                      <div className="text-primary font-bold text-sm mt-1">{b.total.toLocaleString()} SAR</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-dark text-lg pt-4 border-t border-gray-100">
                <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span className="text-primary">{amountDue.toLocaleString()} SAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-custom">Loading...</div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
