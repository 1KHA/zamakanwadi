'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, MinusCircle, SlidersHorizontal, User as UserIcon } from 'lucide-react';

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
}

interface EntitlementRow {
  id: string;
  featureId: string | null;
  nameAr: string;
  nameEn: string;
  kind: 'TIME' | 'QUANTITY' | 'INFO';
  category: string | null;
  totalAmount: number;
  usedAmount: number;
  available: number;
  source: 'BOOKING' | 'PURCHASE' | 'ADMIN';
  bookingId: string | null;
  revoked: boolean;
  createdAt: string;
}

interface LedgerRow {
  id: string;
  action: string;
  amount: number;
  note: string | null;
  actorRole: string | null;
  createdAt: string;
}

interface FeatureOption {
  id: string;
  kind: string;
  nameAr: string;
  nameEn: string;
}

const sourceLabels: Record<string, string> = {
  BOOKING: 'حجز / Booking',
  PURCHASE: 'شراء / Purchase',
  ADMIN: 'إدارة / Admin',
};

const actionLabels: Record<string, string> = {
  GRANT: 'إضافة / Grant',
  CLAIM: 'استخدام / Claim',
  AUTO_APPLY: 'خصم حجز / Auto-apply',
  REFUND: 'استرجاع / Refund',
  REVOKE: 'إلغاء / Revoke',
  ADJUST: 'تعديل / Adjust',
};

export default function UserEntitlementsTab() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [entitlements, setEntitlements] = useState<EntitlementRow[]>([]);
  const [ledger, setLedger] = useState<LedgerRow[]>([]);
  const [features, setFeatures] = useState<FeatureOption[]>([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState('');

  const [grantFeatureId, setGrantFeatureId] = useState('');
  const [grantAmount, setGrantAmount] = useState(1);
  const [grantNote, setGrantNote] = useState('');
  const [busy, setBusy] = useState(false);

  const [claimTarget, setClaimTarget] = useState<EntitlementRow | null>(null);
  const [claimAmount, setClaimAmount] = useState(1);
  const [claimNote, setClaimNote] = useState('');

  const [adjustTarget, setAdjustTarget] = useState<EntitlementRow | null>(null);
  const [adjustTotal, setAdjustTotal] = useState(0);

  useEffect(() => {
    fetch('/api/admin/features')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: FeatureOption[]) => setFeatures(data.filter((f) => f.kind !== 'INFO')))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/admin/users?query=${encodeURIComponent(query)}`);
        if (res.ok) setUsers(await res.json());
      } catch {
        // ignore search errors
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  const loadUser = useCallback(async (user: UserRow) => {
    setSelectedUser(user);
    setLoadingUser(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/entitlements?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to load user services');
      const data = await res.json();
      setEntitlements(data.entitlements ?? []);
      setLedger(data.ledger ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load user services');
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const refresh = () => selectedUser && loadUser(selectedUser);

  const grant = async () => {
    if (!selectedUser || !grantFeatureId) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/entitlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          featureId: grantFeatureId,
          amount: grantAmount,
          note: grantNote || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to grant');
      setGrantFeatureId('');
      setGrantAmount(1);
      setGrantNote('');
      refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to grant');
    } finally {
      setBusy(false);
    }
  };

  const claimOnBehalf = async () => {
    if (!claimTarget) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/entitlements/${claimTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimAmount, note: claimNote || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to claim');
      setClaimTarget(null);
      setClaimAmount(1);
      setClaimNote('');
      refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to claim');
    } finally {
      setBusy(false);
    }
  };

  const adjust = async () => {
    if (!adjustTarget) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/entitlements/${adjustTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: adjustTotal }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to adjust');
      setAdjustTarget(null);
      refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to adjust');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (entitlement: EntitlementRow) => {
    if (!confirm('حذف/إلغاء هذا الرصيد؟ / Delete or revoke this balance?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/entitlements/${entitlement.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">المستخدمين والخدمات / Users & Services</h2>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User search */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو البريد / Search name or email"
              className="w-full ps-9 pe-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          {searching ? (
            <p className="text-xs text-gray-500 p-2">جاري البحث... / Searching...</p>
          ) : (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => loadUser(user)}
                  className={`w-full text-start p-3 rounded-lg text-sm transition-colors ${
                    selectedUser?.id === user.id ? 'bg-primary text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="block font-medium truncate">{user.name || '-'}</span>
                  <span
                    className={`block text-xs truncate ${
                      selectedUser?.id === user.id ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {user.email}
                  </span>
                </button>
              ))}
              {users.length === 0 && <p className="text-xs text-gray-500 p-2">لا توجد نتائج / No results</p>}
            </div>
          )}
        </div>

        {/* User detail */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedUser ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">
              <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              اختر مستخدماً لعرض خدماته / Select a user to manage their services
            </div>
          ) : loadingUser ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">جاري التحميل...</div>
          ) : (
            <>
              {/* Grant form */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="font-bold text-dark text-sm mb-3">
                  إضافة خدمة لـ {selectedUser.name || selectedUser.email} / Grant a service
                </h3>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-40">
                    <label className="block text-xs font-medium text-gray-500 mb-1">الخدمة / Service</label>
                    <select
                      value={grantFeatureId}
                      onChange={(e) => setGrantFeatureId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="">— اختر / Select —</option>
                      {features.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.nameAr} ({f.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-500 mb-1">الكمية / Amount</label>
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={grantAmount}
                      onChange={(e) => setGrantAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-32">
                    <label className="block text-xs font-medium text-gray-500 mb-1">ملاحظة / Note</label>
                    <input
                      type="text"
                      value={grantNote}
                      onChange={(e) => setGrantNote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                  <button
                    onClick={grant}
                    disabled={busy || !grantFeatureId || grantAmount <= 0}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة / Grant
                  </button>
                </div>
              </div>

              {/* Entitlements */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="font-bold text-dark text-sm mb-3">الأرصدة / Balances</h3>
                {entitlements.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">لا توجد خدمات / No services yet</p>
                ) : (
                  <div className="space-y-2">
                    {entitlements.map((e) => (
                      <div
                        key={e.id}
                        className={`flex flex-wrap items-center justify-between gap-3 p-3 border rounded-xl ${
                          e.revoked ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-100'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-dark text-sm">
                            {e.nameAr} <span className="text-xs text-gray-500">({e.nameEn})</span>
                            {e.revoked && <span className="text-xs text-red-500 ms-2">ملغي / Revoked</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {sourceLabels[e.source]} · {new Date(e.createdAt).toLocaleDateString('en-US')}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary">
                            {e.available}
                            <span className="text-xs font-medium text-gray-500"> / {e.totalAmount}</span>
                          </span>
                          {!e.revoked && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setClaimTarget(e);
                                  setClaimAmount(1);
                                }}
                                disabled={e.available <= 0}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30"
                                title="استخدام بالنيابة / Claim on behalf"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setAdjustTarget(e);
                                  setAdjustTotal(e.totalAmount);
                                }}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="تعديل الإجمالي / Adjust total"
                              >
                                <SlidersHorizontal className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => remove(e)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف / Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ledger */}
              {ledger.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <h3 className="font-bold text-dark text-sm mb-3">سجل الحركات / Activity Log</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="text-gray-500">
                        <tr>
                          <th className="text-start px-2 py-1.5 font-medium">العملية / Action</th>
                          <th className="text-start px-2 py-1.5 font-medium">الكمية / Amount</th>
                          <th className="text-start px-2 py-1.5 font-medium">بواسطة / By</th>
                          <th className="text-start px-2 py-1.5 font-medium">ملاحظة / Note</th>
                          <th className="text-start px-2 py-1.5 font-medium">التاريخ / Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {ledger.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-2 py-2 font-medium text-dark">
                              {actionLabels[entry.action] || entry.action}
                            </td>
                            <td className="px-2 py-2">{entry.amount}</td>
                            <td className="px-2 py-2 text-gray-500">{entry.actorRole || '-'}</td>
                            <td className="px-2 py-2 text-gray-500">{entry.note || '-'}</td>
                            <td className="px-2 py-2 text-gray-500">
                              {new Date(entry.createdAt).toLocaleString('en-US')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Claim-on-behalf modal */}
      {claimTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="font-bold text-dark mb-1">استخدام بالنيابة / Claim on behalf</h3>
            <p className="text-sm text-gray-500 mb-4">
              {claimTarget.nameAr} — المتاح / Available: {claimTarget.available}
            </p>
            <input
              type="number"
              min={0.5}
              max={claimTarget.available}
              step={0.5}
              value={claimAmount}
              onChange={(e) => setClaimAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            <input
              type="text"
              value={claimNote}
              onChange={(e) => setClaimNote(e.target.value)}
              placeholder="ملاحظة / Note (e.g. walk-in usage)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={claimOnBehalf}
                disabled={busy || claimAmount <= 0 || claimAmount > claimTarget.available}
                className="flex-1 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                تأكيد / Confirm
              </button>
              <button
                onClick={() => setClaimTarget(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                إلغاء / Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust modal */}
      {adjustTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="font-bold text-dark mb-1">تعديل الإجمالي / Adjust total</h3>
            <p className="text-sm text-gray-500 mb-4">
              {adjustTarget.nameAr} — المستخدم / Used: {adjustTarget.usedAmount}
            </p>
            <input
              type="number"
              min={adjustTarget.usedAmount}
              step={0.5}
              value={adjustTotal}
              onChange={(e) => setAdjustTotal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={adjust}
                disabled={busy || adjustTotal < adjustTarget.usedAmount}
                className="flex-1 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                حفظ / Save
              </button>
              <button
                onClick={() => setAdjustTarget(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                إلغاء / Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
