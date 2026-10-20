'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Check, Clock, XCircle } from 'lucide-react';
import { apiFetch } from '@/lib/apiFetch';

const POLL_MS = 2000;
const MAX_POLLS = 30; // ~1 minute, then tell the user we'll notify them

/**
 * Landing page Strabl sends the browser back to (cart.merchantUrls).
 *
 * Arriving here with status=success only means the BROWSER saw a success
 * message. The booking is confirmed when the signed webhook lands, so this
 * page polls the server until it agrees, and never marks anything itself.
 */
function ResultContent() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status');
  const ref = params.get('ref') ?? '';
  const applied = params.get('applied') ?? '';
  const failureReason = params.get('failureReason');
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (status !== 'success' || !ref) return;
    let cancelled = false;
    let polls = 0;

    const tick = async () => {
      if (cancelled) return;
      const res = await apiFetch(`/api/payments?ref=${encodeURIComponent(ref)}`);
      const data = res.ok ? await res.json().catch(() => null) : null;
      if (cancelled) return;
      if (data?.paid) {
        const appliedParam = applied ? `&applied=${encodeURIComponent(applied)}` : '';
        router.replace(`/dashboard?confirmed=1&ref=${encodeURIComponent(ref)}&paid=1${appliedParam}`);
        return;
      }
      if (++polls >= MAX_POLLS) {
        setTimedOut(true);
        return;
      }
      setTimeout(tick, POLL_MS);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status, ref, applied, router]);

  const shell = (children: React.ReactNode) => (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center max-w-md">{children}</div>
    </div>
  );

  if (status === 'failed') {
    return shell(
      <>
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-dark mb-2">{isRTL ? 'لم تتم عملية الدفع' : 'Payment failed'}</h1>
        {failureReason && <p className="text-sm text-gray-custom mb-4 break-words">{failureReason}</p>}
        <p className="text-gray-custom mb-6">
          {isRTL ? 'لم يتم خصم أي مبلغ. يمكنك المحاولة مرة أخرى.' : 'You have not been charged. You can try again.'}
        </p>
        <a
          href={`/payment?ref=${encodeURIComponent(ref)}`}
          className="inline-flex px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
        >
          {isRTL ? 'المحاولة مرة أخرى' : 'Try again'}
        </a>
      </>
    );
  }

  if (status === 'success' && !timedOut) {
    return shell(
      <>
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-dark mb-2">{isRTL ? 'جاري تأكيد الدفع…' : 'Confirming your payment…'}</h1>
        <p className="text-gray-custom">
          {isRTL ? 'يرجى عدم إغلاق هذه الصفحة.' : 'Please keep this page open.'}
        </p>
      </>
    );
  }

  if (status === 'success' && timedOut) {
    return shell(
      <>
        <Clock className="w-16 h-16 text-secondary-dark mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-dark mb-2">{isRTL ? 'تم استلام الدفع' : 'Payment received'}</h1>
        <p className="text-gray-custom mb-6">
          {isRTL
            ? 'التأكيد في الطريق. سنرسل لك إشعاراً فور تأكيد الحجز.'
            : "Confirmation is on its way. We'll notify you as soon as the booking is confirmed."}
        </p>
        <a href="/dashboard" className="text-primary hover:underline font-medium">
          {isRTL ? 'الذهاب إلى لوحة التحكم' : 'Go to dashboard'}
        </a>
      </>
    );
  }

  // Unknown/missing status — send them somewhere useful.
  return shell(
    <>
      <Check className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <a href={ref ? `/payment?ref=${encodeURIComponent(ref)}` : '/dashboard'} className="text-primary hover:underline font-medium">
        {isRTL ? 'العودة' : 'Go back'}
      </a>
    </>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-custom">Loading...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
