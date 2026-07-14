'use client';

import { useState, useEffect } from 'react';
import { Space, HourlyPriceTier } from '@/lib/spaces';
import { defaultSpaces } from '@/lib/defaultSpaces';
import { Pencil, Trash2, Plus, Save, X, MapPin, Trash } from 'lucide-react';

const emptySpace: Space = {
  id: '',
  category: 'meeting',
  type: 'meeting',
  title: { ar: '', en: '' },
  desc: { ar: '', en: '' },
  price: 0,
  period: { ar: '', en: '' },
  capacity: '',
  features: { ar: [], en: [] },
  images: [],
  durationOptions: [{ value: 'hourly', label: { ar: 'بالساعة', en: 'Hourly' }, multiplier: 1 }],
  hourlyPrices: [{ maxHours: null, price: 0 }],
  active: true,
};

function isHourlyType(type: Space['type']) {
  return type === 'meeting' || type === 'theater';
}

function sortTiers(tiers: HourlyPriceTier[]): HourlyPriceTier[] {
  return [...tiers].sort((a, b) => (a.maxHours ?? Infinity) - (b.maxHours ?? Infinity));
}

function formatTierSummary(tiers: HourlyPriceTier[]): string[] {
  const sorted = sortTiers(tiers);
  return sorted.map((tier, index) => {
    const prevMax = sorted[index - 1]?.maxHours;
    const priceStr = tier.price.toLocaleString() + ' SAR';
    if (tier.maxHours === null) {
      return `>${prevMax ?? 0}h: ${priceStr}`;
    }
    if (index === 0) return `≤${tier.maxHours}h: ${priceStr}`;
    return `>${prevMax}h – ${tier.maxHours}h: ${priceStr}`;
  });
}

function validateTiers(tiers: HourlyPriceTier[]): string | null {
  if (!tiers || tiers.length === 0) return 'At least one price tier is required';
  for (const tier of tiers) {
    if (typeof tier.price !== 'number' || Number.isNaN(tier.price) || tier.price < 0) {
      return 'All tier prices must be non-negative numbers';
    }
    if (tier.maxHours !== null && (tier.maxHours <= 0 || !Number.isFinite(tier.maxHours))) {
      return 'Max hours must be a positive number or empty (unlimited)';
    }
  }
  const sorted = sortTiers(tiers);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].maxHours;
    const curr = sorted[i].maxHours;
    if (prev !== null && curr !== null && prev >= curr) {
      return 'Max hours must be strictly increasing';
    }
  }
  return null;
}

export default function AdminSpacesTab() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Space | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadSpaces = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/spaces');
        if (!res.ok) throw new Error('Failed to load spaces');
        const data = await res.json();
        if (!cancelled) setSpaces(data);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load spaces');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadSpaces();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المساحة؟ / Are you sure you want to delete this space?')) return;
    try {
      const res = await fetch(`/api/admin/spaces/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete space');
      setSpaces((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete space');
    }
  };

  const handleToggleActive = async (space: Space) => {
    try {
      const res = await fetch(`/api/admin/spaces/${space.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !space.active }),
      });
      if (!res.ok) throw new Error('Failed to update space');
      const updated = await res.json();
      setSpaces((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update space');
    }
  };

  const handleSave = async (space: Space) => {
    setSaving(true);
    setError('');
    try {
      const isNew = isCreating;
      const url = isNew ? '/api/admin/spaces' : `/api/admin/spaces/${space.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(space),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save space');
      }
      const saved = await res.json();
      if (isNew) {
        setSpaces((prev) => [...prev, saved]);
      } else {
        setSpaces((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
      }
      setEditing(null);
      setIsCreating(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save space');
    } finally {
      setSaving(false);
    }
  };

  const seedDefaults = async () => {
    setSaving(true);
    setError('');
    try {
      for (const space of defaultSpaces) {
        await fetch('/api/admin/spaces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(space),
        });
      }
      const res = await fetch('/api/admin/spaces');
      const data = await res.json();
      setSpaces(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to seed spaces');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        جاري تحميل المساحات...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark">إدارة المساحات / Spaces Management</h2>
        <div className="flex items-center gap-2">
          {spaces.length === 0 && (
            <button
              onClick={seedDefaults}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-dark text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <MapPin className="w-4 h-4" />
              استعادة المساحات الافتراضية / Restore Defaults
            </button>
          )}
          <button
            onClick={() => {
              setIsCreating(true);
              setEditing({ ...emptySpace });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة مساحة / Add Space
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {(editing || isCreating) && (
        <SpaceEditor
          key={editing?.id ?? 'new'}
          space={editing || emptySpace}
          isNew={isCreating}
          saving={saving}
          onChange={setEditing}
          onSave={() => editing && handleSave(editing)}
          onCancel={() => {
            setEditing(null);
            setIsCreating(false);
          }}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-right font-medium">المعرف / ID</th>
                <th className="px-4 py-3 text-right font-medium">الاسم / Name</th>
                <th className="px-4 py-3 text-right font-medium">النوع / Type</th>
                <th className="px-4 py-3 text-right font-medium">السعر / Price</th>
                <th className="px-4 py-3 text-right font-medium">السعة / Capacity</th>
                <th className="px-4 py-3 text-right font-medium">نشط / Active</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {spaces.map((space) => (
                <tr key={space.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{space.id}</td>
                  <td className="px-4 py-3 font-medium text-dark">
                    {space.title.ar}
                    <span className="block text-xs text-gray-500">{space.title.en}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{space.category}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {space.hourlyPrices && space.hourlyPrices.length > 0 ? (
                      <div className="space-y-0.5">
                        {formatTierSummary(space.hourlyPrices).map((line, i) => (
                          <div key={i} className="text-xs">{line}</div>
                        ))}
                      </div>
                    ) : (
                      <span>{space.price.toLocaleString()} SAR</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{space.capacity}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(space)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        space.active ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          space.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setEditing(space);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل / Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(space.id)}
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
    </div>
  );
}

function SpaceEditor({
  space,
  isNew,
  saving,
  onChange,
  onSave,
  onCancel,
}: {
  space: Space;
  isNew: boolean;
  saving: boolean;
  onChange: (space: Space) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [imagesText, setImagesText] = useState(space.images.join('\n'));
  const [featuresArText, setFeaturesArText] = useState(space.features.ar.join('\n'));
  const [featuresEnText, setFeaturesEnText] = useState(space.features.en.join('\n'));
  const [durationText, setDurationText] = useState(JSON.stringify(space.durationOptions, null, 2));
  const [tiers, setTiers] = useState<HourlyPriceTier[]>(space.hourlyPrices ?? [{ maxHours: null, price: 0 }]);

  const updateField = <K extends keyof Space>(field: K, value: Space[K]) => {
    onChange({ ...space, [field]: value });
  };

  const commitChanges = () => {
    const images = imagesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const featuresAr = featuresArText.split('\n').map((s) => s.trim()).filter(Boolean);
    const featuresEn = featuresEnText.split('\n').map((s) => s.trim()).filter(Boolean);
    let durationOptions: Space['durationOptions'] = [];
    try {
      durationOptions = JSON.parse(durationText);
    } catch {
      alert('Invalid duration options JSON');
      return;
    }
    if (isHourlyType(space.type)) {
      const tierError = validateTiers(tiers);
      if (tierError) {
        alert(tierError);
        return;
      }
    }
    onChange({
      ...space,
      images,
      features: { ar: featuresAr, en: featuresEn },
      durationOptions,
      hourlyPrices: isHourlyType(space.type) ? sortTiers(tiers) : undefined,
    });
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="text-lg font-bold text-dark">
        {isNew ? 'إضافة مساحة جديدة / Add New Space' : 'تعديل المساحة / Edit Space'}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">المعرف / ID</label>
          <input
            type="text"
            value={space.id}
            disabled={!isNew}
            onChange={(e) => updateField('id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">السعة / Capacity</label>
          <input
            type="text"
            value={space.capacity}
            onChange={(e) => updateField('capacity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">الفئة / Category</label>
          <select
            value={space.category}
            onChange={(e) => updateField('category', e.target.value as Space['category'])}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="offices">مكاتب العمل / Work Offices</option>
            <option value="meeting">قاعات الاجتماعات / Meeting Rooms</option>
            <option value="theater">المسارح / Theaters</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">النوع / Type</label>
          <select
            value={space.type}
            onChange={(e) => updateField('type', e.target.value as Space['type'])}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="workspace">مساحة عمل / Workspace</option>
            <option value="meeting">قاعة اجتماعات / Meeting</option>
            <option value="theater">مسرح / Theater</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">العنوان عربي / Title AR</label>
          <input
            type="text"
            value={space.title.ar}
            onChange={(e) => updateField('title', { ...space.title, ar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">العنوان إنجليزي / Title EN</label>
          <input
            type="text"
            value={space.title.en}
            onChange={(e) => updateField('title', { ...space.title, en: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">الوصف عربي / Description AR</label>
          <textarea
            value={space.desc.ar}
            onChange={(e) => updateField('desc', { ...space.desc, ar: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">الوصف إنجليزي / Description EN</label>
          <textarea
            value={space.desc.en}
            onChange={(e) => updateField('desc', { ...space.desc, en: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {isHourlyType(space.type) ? 'السعر الأساسي (للعرض) / Base Price (display only)' : 'السعر / Price'}
          </label>
          <input
            type="number"
            value={space.price}
            onChange={(e) => updateField('price', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {isHourlyType(space.type) && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">أسعار الحجز بالساعة / Hourly Price Tiers</label>
            <div className="space-y-2">
              {sortTiers(tiers).map((tier, index) => {
                const sorted = sortTiers(tiers);
                const isLast = index === sorted.length - 1;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Max hours / الحد الأقصى"
                      value={tier.maxHours ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const newMax = value === '' ? null : Number(value);
                        const newTiers = [...tiers];
                        const originalIndex = tiers.indexOf(tier);
                        newTiers[originalIndex] = { ...tier, maxHours: newMax };
                        setTiers(newTiers);
                      }}
                      className="w-28 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <span className="text-xs text-gray-500">
                      {isLast && tier.maxHours === null ? 'hours+ / ساعات فما فوق' : 'hours / ساعات'}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Price / السعر"
                      value={tier.price}
                      onChange={(e) => {
                        const newTiers = [...tiers];
                        const originalIndex = tiers.indexOf(tier);
                        newTiers[originalIndex] = { ...tier, price: Number(e.target.value) };
                        setTiers(newTiers);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <span className="text-xs text-gray-500">SAR</span>
                    <button
                      type="button"
                      onClick={() => setTiers(tiers.filter((t) => t !== tier))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف / Remove"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => setTiers([...tiers, { maxHours: null, price: 0 }])}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                إضافة فئة سعرية / Add price tier
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave max hours empty for the last tier (above previous tier). / اترك الحد الأقصى فارغاً للفئة الأخيرة.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">الفترة عربي / Period AR</label>
            <input
              type="text"
              value={space.period.ar}
              onChange={(e) => updateField('period', { ...space.period, ar: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">الفترة إنجليزي / Period EN</label>
            <input
              type="text"
              value={space.period.en}
              onChange={(e) => updateField('period', { ...space.period, en: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">الصور (رابط لكل سطر) / Images (one URL per line)</label>
          <textarea
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">المميزات عربي / Features AR</label>
            <textarea
              value={featuresArText}
              onChange={(e) => setFeaturesArText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">المميزات إنجليزي / Features EN</label>
            <textarea
              value={featuresEnText}
              onChange={(e) => setFeaturesEnText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">خيارات المدة (JSON) / Duration Options (JSON)</label>
          <textarea
            value={durationText}
            onChange={(e) => setDurationText(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={commitChanges}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          حفظ / Save
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          إلغاء / Cancel
        </button>
      </div>
    </div>
  );
}
