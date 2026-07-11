'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart, ArrowRight, Tag, Calendar, Clock } from 'lucide-react';
import { CartItem, CART_STORAGE_KEY } from '@/lib/spaces';

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

export default function CartPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initialize cart from localStorage on client mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setItems(getCart());
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveCart(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  if (!mounted) {
    return (
      <div className={`min-h-screen bg-gray-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          {isRTL ? 'سلة التسوق' : 'Shopping Cart'}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark mb-2">
              {isRTL ? 'سلة التسوق فارغة' : 'Your cart is empty'}
            </h2>
            <p className="text-gray-custom mb-6">
              {isRTL ? 'استكشف خدماتنا وأضف ما يناسبك' : 'Explore our services and add what suits you'}
            </p>
            <Link
              href="/#packages"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              {isRTL ? 'استكشف المساحات' : 'Explore Spaces'}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center shrink-0">
                    <Tag className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-custom capitalize">{item.type}</div>
                    <h3 className="font-bold text-dark truncate">{item.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-custom">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.startDate}
                      </span>
                      {item.endDate && item.endDate !== item.startDate && (
                        <span className="inline-flex items-center gap-1">
                          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                          {item.endDate}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.durationLabel}
                      </span>
                    </div>
                    <div className="text-primary font-bold mt-2">{item.price.toLocaleString()} SAR</div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-dark text-lg mb-4">
                  {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-custom">
                    <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>{subtotal.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex justify-between text-gray-custom">
                    <span>{isRTL ? 'الضريبة (15%)' : 'Tax (15%)'}</span>
                    <span>{tax.toLocaleString()} SAR</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-dark text-lg">
                    <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-primary">{total.toLocaleString()} SAR</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
                >
                  {isRTL ? 'إتمام الحجز' : 'Checkout'}
                </button>

                <div className="mt-4 text-center">
                  <Link href="/#packages" className="text-primary text-sm hover:underline">
                    {isRTL ? 'مواصلة التسوق' : 'Continue Shopping'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
