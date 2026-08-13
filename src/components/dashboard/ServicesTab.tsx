'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift, Plus, Minus, ShoppingBag, History, Clock, Check, X, Hourglass } from 'lucide-react';
import type {
  CatalogFeature,
  EntitlementDto,
  LedgerEntryDto,
  LedgerAction,
} from '@/lib/entitlementTypes';
import { apiFetch } from '@/lib/apiFetch';

interface PurchaseRequestRow {
  id: string;
  nameAr: string;
  nameEn: string;
  amount: number;
  unitPrice: number;
  total: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  createdAt: string;
}

const actionLabels: Record<LedgerAction, { ar: string; en: string; color: string }> = {
  GRANT: { ar: 'إضافة رصيد', en: 'Credit added', color: 'text-green-600' },
  CLAIM: { ar: 'استخدام', en: 'Claimed', color: 'text-blue-600' },
  AUTO_APPLY: { ar: 'خصم تلقائي عند الحجز', en: 'Applied to booking', color: 'text-blue-600' },
  REFUND: { ar: 'استرجاع', en: 'Refunded', color: 'text-green-600' },
  REVOKE: { ar: 'إلغاء رصيد', en: 'Revoked', color: 'text-red-600' },
  ADJUST: { ar: 'تعديل', en: 'Adjusted', color: 'text-gray-600' },
};

const purchaseStatusConfig = {
  PENDING: { ar: 'بانتظار الموافقة', en: 'Pending', color: 'bg-secondary/20 text-secondary-dark', icon: Hourglass },
  APPROVED: { ar: 'تمت الموافقة', en: 'Approved', color: 'bg-green-100 text-green-700', icon: Check },
  REJECTED: { ar: 'مرفوض', en: 'Rejected', color: 'bg-red-100 text-red-700', icon: X },
};

export default function ServicesTab() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [entitlements, setEntitlements] = useState<EntitlementDto[]>([]);
  const [ledger, setLedger] = useState<LedgerEntryDto[]>([]);
  const [features, setFeatures] = useState<CatalogFeature[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [claiming, setClaiming] = useState<EntitlementDto | null>(null);
  const [claimAmount, setClaimAmount] = useState(1);
  const [claimNote, setClaimNote] = useState('');
  const [claimBusy, setClaimBusy] = useState(false);

  const [buyAmounts, setBuyAmounts] = useState<Record<string, number>>({});
  const [buyBusy, setBuyBusy] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [entRes, featRes, purRes] = await Promise.all([
        apiFetch('/api/entitlements'),
        apiFetch('/api/features'),
        apiFetch('/api/purchase-requests'),
      ]);
      if (entRes.ok) {
        const data = await entRes.json();
        setEntitlements(data.entitlements ?? []);
        setLedger(data.ledger ?? []);
      }
      if (featRes.ok) setFeatures(await featRes.json());
      if (purRes.ok) setPurchases(await purRes.json());
    } catch {
      setError(isRTL ? 'فشل تحميل الخدمات' : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [isRTL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, [loadAll]);

  const submitClaim = async () => {
    if (!claiming) return;
    setClaimBusy(true);
    setError('');
    try {
      const res = await apiFetch('/api/entitlements/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entitlementId: claiming.id, amount: claimAmount, note: claimNote || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to claim');
      setClaiming(null);
      setClaimAmount(1);
      setClaimNote('');
      setMessage(isRTL ? 'تم الاستخدام بنجاح' : 'Claimed successfully');
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to claim');
    } finally {
      setClaimBusy(false);
    }
  };

  const submitPurchase = async (feature: CatalogFeature) => {
    const amount = buyAmounts[feature.id] ?? 1;
    setBuyBusy(feature.id);
    setError('');
    setMessage('');
    try {
      const res = await apiFetch('/api/purchase-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId: feature.id, amount }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to submit purchase');
      setMessage(
        isRTL
          ? 'تم إرسال طلب الشراء وسيتم إضافة الرصيد بعد الموافقة (الدفع يتم خارج الموقع)'
          : 'Purchase request submitted — your balance will be credited after approval (payment is settled offline).'
      );
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit purchase');
    } finally {
      setBuyBusy('');
    }
  };

  const purchasable = features.filter((f) => f.purchasable && f.unitPrice);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center py-12 text-gray-custom">
        {isRTL ? 'جاري التحميل...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
      {message && <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm">{message}</div>}

      {/* Balances */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          {isRTL ? 'خدماتي ورصيدي' : 'My Services & Balance'}
        </h2>
        {entitlements.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-custom">
              {isRTL
                ? 'لا توجد خدمات بعد — تحصل على خدمات الباقة عند الموافقة على حجزك'
                : 'No services yet — package services are added when your booking is approved'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {entitlements.map((e) => {
              const pct = e.totalAmount > 0 ? Math.min(100, (e.usedAmount / e.totalAmount) * 100) : 0;
              const unit = e.kind === 'TIME' ? (isRTL ? 'ساعة' : 'hrs') : isRTL ? 'مرة' : 'uses';
              return (
                <div key={e.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-bold text-dark text-sm">{isRTL ? e.name.ar : e.name.en}</div>
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {e.available}
                    <span className="text-sm font-medium text-gray-custom"> / {e.totalAmount} {unit}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${100 - pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-custom">
                      {isRTL ? `المستخدم: ${e.usedAmount}` : `Used: ${e.usedAmount}`}
                    </span>
                    {e.available > 0 && (
                      <button
                        onClick={() => {
                          setClaiming(e);
                          setClaimAmount(1);
                        }}
                        className="text-sm font-medium text-primary hover:text-primary-dark"
                      >
                        {isRTL ? 'استخدام' : 'Claim'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buy more */}
      {purchasable.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {isRTL ? 'شراء خدمات إضافية' : 'Buy More Services'}
          </h2>
          <p className="text-sm text-gray-custom mb-6">
            {isRTL
              ? 'يتم الدفع خارج الموقع، ويضاف الرصيد بعد موافقة الإدارة على الطلب.'
              : 'Payment is settled offline; your balance is credited once the request is approved.'}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {purchasable.map((f) => {
              const amount = buyAmounts[f.id] ?? 1;
              const unit = f.kind === 'TIME' ? (isRTL ? 'ساعة' : 'hr') : isRTL ? 'وحدة' : 'unit';
              return (
                <div key={f.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="font-bold text-dark text-sm mb-1">{isRTL ? f.name.ar : f.name.en}</div>
                  <div className="text-sm text-gray-custom mb-3">
                    {f.unitPrice?.toLocaleString()} SAR / {unit}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setBuyAmounts((p) => ({ ...p, [f.id]: Math.max(1, amount - 1) }))}
                        className="p-2 text-gray-500 hover:text-dark"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-dark">{amount}</span>
                      <button
                        onClick={() => setBuyAmounts((p) => ({ ...p, [f.id]: Math.min(100, amount + 1) }))}
                        className="p-2 text-gray-500 hover:text-dark"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => submitPurchase(f)}
                      disabled={buyBusy === f.id}
                      className="flex-1 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {buyBusy === f.id
                        ? isRTL
                          ? 'جاري الإرسال...'
                          : 'Submitting...'
                        : `${isRTL ? 'اطلب بـ' : 'Request for'} ${((f.unitPrice ?? 0) * amount).toLocaleString()} SAR`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Purchase history */}
      {purchases.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {isRTL ? 'طلبات الشراء' : 'Purchase Requests'}
          </h2>
          <div className="space-y-3">
            {purchases.map((p) => {
              const cfg = purchaseStatusConfig[p.status];
              const Icon = cfg.icon;
              return (
                <div key={p.id} className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl">
                  <div>
                    <div className="font-bold text-dark text-sm">
                      {p.amount} × {isRTL ? p.nameAr : p.nameEn}
                    </div>
                    <div className="text-xs text-gray-custom mt-1">
                      {p.total.toLocaleString()} SAR · {new Date(p.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </div>
                    {p.status === 'REJECTED' && p.rejectionReason && (
                      <div className="text-xs text-red-600 mt-1">
                        {isRTL ? 'السبب:' : 'Reason:'} {p.rejectionReason}
                      </div>
                    )}
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {isRTL ? cfg.ar : cfg.en}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ledger */}
      {ledger.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            {isRTL ? 'سجل الحركات' : 'Activity History'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-custom text-xs">
                <tr>
                  <th className="text-start px-3 py-2 font-medium">{isRTL ? 'العملية' : 'Action'}</th>
                  <th className="text-start px-3 py-2 font-medium">{isRTL ? 'الكمية' : 'Amount'}</th>
                  <th className="text-start px-3 py-2 font-medium">{isRTL ? 'ملاحظة' : 'Note'}</th>
                  <th className="text-start px-3 py-2 font-medium">{isRTL ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ledger.map((entry) => {
                  const label = actionLabels[entry.action] ?? actionLabels.ADJUST;
                  return (
                    <tr key={entry.id}>
                      <td className={`px-3 py-2.5 font-medium ${label.color}`}>
                        {isRTL ? label.ar : label.en}
                      </td>
                      <td className="px-3 py-2.5 text-dark">{entry.amount}</td>
                      <td className="px-3 py-2.5 text-gray-custom">{entry.note || '-'}</td>
                      <td className="px-3 py-2.5 text-gray-custom">
                        {new Date(entry.createdAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Claim modal */}
      {claiming && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="font-bold text-dark mb-1">{isRTL ? 'استخدام الرصيد' : 'Claim Balance'}</h3>
            <p className="text-sm text-gray-custom mb-4">
              {isRTL ? claiming.name.ar : claiming.name.en} —{' '}
              {isRTL ? `المتاح: ${claiming.available}` : `Available: ${claiming.available}`}
            </p>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {isRTL ? 'الكمية' : 'Amount'}
            </label>
            <input
              type="number"
              min={0.5}
              max={claiming.available}
              step={0.5}
              value={claimAmount}
              onChange={(e) => setClaimAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {isRTL ? 'ملاحظة (اختياري)' : 'Note (optional)'}
            </label>
            <input
              type="text"
              value={claimNote}
              onChange={(e) => setClaimNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={submitClaim}
                disabled={claimBusy || claimAmount <= 0 || claimAmount > claiming.available}
                className="flex-1 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {claimBusy ? (isRTL ? 'جاري...' : 'Claiming...') : isRTL ? 'تأكيد' : 'Confirm'}
              </button>
              <button
                onClick={() => setClaiming(null)}
                disabled={claimBusy}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
