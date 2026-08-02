'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Save, X, Check, ShoppingBag } from 'lucide-react';

interface FeatureRow {
  id: string;
  kind: 'INFO' | 'TIME' | 'QUANTITY';
  nameAr: string;
  nameEn: string;
  descAr: string | null;
  descEn: string | null;
  category: string | null;
  unitPrice: number | null;
  purchasable: boolean;
  sortOrder: number;
  active: boolean;
}

interface PurchaseRow {
  id: string;
  nameAr: string;
  nameEn: string;
  amount: number;
  unitPrice: number;
  total: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string; phone: string | null };
}

const emptyFeature: FeatureRow = {
  id: '',
  kind: 'INFO',
  nameAr: '',
  nameEn: '',
  descAr: null,
  descEn: null,
  category: null,
  unitPrice: null,
  purchasable: false,
  sortOrder: 0,
  active: true,
};

const kindLabel: Record<string, string> = {
  INFO: 'عرض فقط / Display',
  TIME: 'ساعات / Hours',
  QUANTITY: 'كمية / Quantity',
};

export default function AdminFeaturesTab() {
  const [features, setFeatures] = useState<FeatureRow[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<FeatureRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rejecting, setRejecting] = useState<PurchaseRow | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [featRes, purRes] = await Promise.all([
        fetch('/api/admin/features'),
        fetch('/api/admin/purchase-requests'),
      ]);
      if (featRes.ok) setFeatures(await featRes.json());
      if (purRes.ok) setPurchases(await purRes.json());
    } catch {
      setError('Failed to load features');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, [loadAll]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      const url = isCreating ? '/api/admin/features' : `/api/admin/features/${editing.id}`;
      const method = isCreating ? 'POST' : 'PATCH';
      const payload = isCreating ? editing : { ...editing, id: undefined };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to save feature');
      setEditing(null);
      setIsCreating(false);
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save feature');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الميزة؟ / Delete this feature?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/features/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      if (data.deactivated) {
        setError('الميزة مستخدمة في مساحات أو طلبات، تم تعطيلها بدلاً من حذفها / Feature is in use — deactivated instead of deleted.');
      }
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const toggleActive = async (feature: FeatureRow) => {
    try {
      const res = await fetch(`/api/admin/features/${feature.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !feature.active }),
      });
      if (!res.ok) throw new Error('Failed to update');
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const decidePurchase = async (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    setError('');
    try {
      const res = await fetch('/api/admin/purchase-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectionReason: reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update request');
      setRejecting(null);
      setRejectReason('');
      await loadAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        جاري التحميل...
      </div>
    );
  }

  const pending = purchases.filter((p) => p.status === 'PENDING');
  const decided = purchases.filter((p) => p.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark">الخدمات والمزايا / Features & Services</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditing({ ...emptyFeature });
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة ميزة / Add Feature
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {editing && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-dark">
            {isCreating ? 'إضافة ميزة جديدة / Add Feature' : 'تعديل الميزة / Edit Feature'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">المعرف / ID (slug)</label>
              <input
                type="text"
                value={editing.id}
                disabled={!isCreating}
                onChange={(e) => setEditing({ ...editing, id: e.target.value })}
                placeholder="meeting-hours"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">النوع / Kind</label>
              <select
                value={editing.kind}
                onChange={(e) => setEditing({ ...editing, kind: e.target.value as FeatureRow['kind'] })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="INFO">عرض فقط / Display only</option>
                <option value="TIME">ساعات / Hours balance</option>
                <option value="QUANTITY">كمية / Quantity balance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">الاسم عربي / Name AR</label>
              <input
                type="text"
                value={editing.nameAr}
                onChange={(e) => setEditing({ ...editing, nameAr: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">الاسم إنجليزي / Name EN</label>
              <input
                type="text"
                value={editing.nameEn}
                onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {editing.kind === 'TIME' && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  الفئة (لأي نوع مساحة تنطبق الساعات) / Category
                </label>
                <select
                  value={editing.category ?? ''}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">— اختر / Select —</option>
                  <option value="meeting">قاعات الاجتماعات / Meeting rooms</option>
                  <option value="theater">المسارح / Theaters</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">الترتيب / Sort Order</label>
              <input
                type="number"
                value={editing.sortOrder}
                onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {editing.kind !== 'INFO' && (
              <>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="purchasable"
                    checked={editing.purchasable}
                    onChange={(e) => setEditing({ ...editing, purchasable: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="purchasable" className="text-sm text-dark">
                    قابلة للشراء من لوحة العميل / Purchasable from user dashboard
                  </label>
                </div>
                {editing.purchasable && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      سعر الوحدة (ريال) / Unit Price (SAR)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editing.unitPrice ?? ''}
                      onChange={(e) =>
                        setEditing({ ...editing, unitPrice: e.target.value === '' ? null : Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              حفظ / Save
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setIsCreating(false);
              }}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              إلغاء / Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-right font-medium">المعرف / ID</th>
                <th className="px-4 py-3 text-right font-medium">الاسم / Name</th>
                <th className="px-4 py-3 text-right font-medium">النوع / Kind</th>
                <th className="px-4 py-3 text-right font-medium">الفئة / Category</th>
                <th className="px-4 py-3 text-right font-medium">السعر / Price</th>
                <th className="px-4 py-3 text-right font-medium">نشط / Active</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {features.map((feature) => (
                <tr key={feature.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{feature.id}</td>
                  <td className="px-4 py-3 font-medium text-dark">
                    {feature.nameAr}
                    <span className="block text-xs text-gray-500">{feature.nameEn}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{kindLabel[feature.kind]}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{feature.category || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {feature.purchasable && feature.unitPrice ? `${feature.unitPrice.toLocaleString()} SAR` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(feature)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        feature.active ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          feature.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setEditing(feature);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل / Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(feature.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف / Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase request queue */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          طلبات الشراء / Purchase Requests
          {pending.length > 0 && (
            <span className="px-2 py-0.5 bg-secondary/20 text-secondary-dark text-xs rounded-full">
              {pending.length}
            </span>
          )}
        </h3>
        {purchases.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">لا توجد طلبات شراء / No purchase requests yet.</p>
        ) : (
          <div className="space-y-3">
            {[...pending, ...decided].map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4 border border-gray-100 rounded-xl">
                <div>
                  <div className="font-bold text-dark text-sm">
                    {p.amount} × {p.nameAr} <span className="text-xs text-gray-500">({p.nameEn})</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {p.user.name || p.user.email} · {p.total.toLocaleString()} SAR ·{' '}
                    {new Date(p.createdAt).toLocaleDateString('en-US')}
                  </div>
                  {p.status === 'REJECTED' && p.rejectionReason && (
                    <div className="text-xs text-red-600 mt-1">السبب: {p.rejectionReason}</div>
                  )}
                </div>
                {p.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decidePurchase(p.id, 'APPROVED')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      موافقة / Approve
                    </button>
                    <button
                      onClick={() => setRejecting(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      رفض / Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.status === 'APPROVED' ? 'تمت الموافقة / Approved' : 'مرفوض / Rejected'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejecting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="font-bold text-dark mb-3">رفض طلب الشراء / Reject Purchase</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="سبب الرفض / Rejection reason"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => decidePurchase(rejecting.id, 'REJECTED', rejectReason)}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                رفض / Reject
              </button>
              <button
                onClick={() => {
                  setRejecting(null);
                  setRejectReason('');
                }}
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
