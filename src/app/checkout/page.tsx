'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  ShoppingCart,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Tag,
  Calendar,
  Clock,
} from 'lucide-react';
import { CartItem, CART_STORAGE_KEY } from '@/lib/spaces';

function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function clearCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

function generateReference() {
  return 'ZMK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CheckoutPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize checkout state from localStorage on client mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const cart = getCart();
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }
    setItems(cart);
  }, [router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user account
      const userRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        // If user already exists, allow sign in if password matches
        if (userData.error === 'Email already exists') {
          const signInResult = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false,
          });
          if (signInResult?.error) {
            setLoading(false);
            setError(isRTL ? 'البريد الإلكتروني مسجل مسبقاً بكلمة مرور مختلفة' : 'Email already registered with a different password');
            return;
          }
        } else {
          setLoading(false);
          setError(userData.error || (isRTL ? 'فشل إنشاء الحساب' : 'Failed to create account'));
          return;
        }
      } else {
        // Sign in the new user
        const signInResult = await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        if (signInResult?.error) {
          setLoading(false);
          setError(isRTL ? 'تم إنشاء الحساب لكن فشل تسجيل الدخول' : 'Account created but sign in failed');
          return;
        }
      }

      // 2. Create bookings from cart
      const reference = generateReference();
      for (const item of items) {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemType: item.type,
            itemName: item.name,
            itemNameAr: item.nameAr,
            total: item.price,
            startDate: item.startDate,
            endDate: item.endDate || item.startDate,
            startTime: item.startTime,
            endTime: item.endTime,
            durationType: item.durationType,
            referenceNumber: reference,
            spaceId: item.spaceId,
          }),
        });
      }

      // 3. Clear cart and redirect to dashboard
      clearCart();
      router.push('/dashboard?confirmed=1&ref=' + reference);
      router.refresh();
    } catch {
      setLoading(false);
      setError(isRTL ? 'حدث خطأ ما' : 'Something went wrong');
    }
  };

  if (!mounted) {
    return (
      <div className={`min-h-screen bg-gray-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          {isRTL ? 'إتمام الحجز' : 'Checkout'}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account / Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-dark mb-6">
                {isRTL ? 'معلومات الحساب' : 'Account Information'}
              </h2>

              <p className="text-gray-custom mb-6">
                {isRTL
                  ? 'أدخل بياناتك لإنشاء حساب وتأكيد حجزك. سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني.'
                  : 'Enter your details to create an account and confirm your booking. Booking details will be sent to your email.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className={`w-full py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      placeholder={isRTL ? 'محمد علي' : 'John Doe'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      placeholder={isRTL ? 'your@email.com' : 'your@email.com'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'رقم الجوال' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      placeholder={isRTL ? '05xxxxxxxx' : '+1 234 567 890'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`w-full py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12'}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-gray-400 hover:text-dark`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    isRTL ? 'جاري التأكيد...' : 'Confirming...'
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {isRTL ? 'تأكيد الحجز' : 'Confirm Booking'}
                    </>
                  )}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-dark text-lg mb-4">
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-dark text-sm truncate">{item.name}</div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-custom mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.startDate}
                        </span>
                        {item.startTime && item.endTime && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.startTime} - {item.endTime}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.durationLabel}
                        </span>
                      </div>
                      <div className="text-primary font-bold text-sm mt-1">{item.price.toLocaleString()} SAR</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-custom">
                  <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span>{subtotal.toLocaleString()} SAR</span>
                </div>
                <div className="flex justify-between text-gray-custom">
                  <span>{isRTL ? 'الضريبة (15%)' : 'Tax (15%)'}</span>
                  <span>{tax.toLocaleString()} SAR</span>
                </div>
                <div className="flex justify-between font-bold text-dark text-lg">
                  <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-primary">{total.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
