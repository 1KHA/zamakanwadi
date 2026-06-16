import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

export default function CartPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: isRTL ? 'مكتب فردي' : 'Individual Office', price: 1500, quantity: 1, type: isRTL ? 'مكتب' : 'Office' },
    { id: '2', name: isRTL ? 'قاعة متوسطة' : 'Medium Theater', price: 600, quantity: 2, type: isRTL ? 'قاعة' : 'Theater' },
  ]);
  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

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
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              {isRTL ? 'استكشف الخدمات' : 'Explore Services'}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center shrink-0">
                    <Tag className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-custom">{item.type}</div>
                    <h3 className="font-bold text-dark truncate">{item.name}</h3>
                    <div className="text-primary font-bold">{item.price.toLocaleString()} SAR</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
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

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'كود الخصم' : 'Promo Code'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={isRTL ? 'أدخل الكود' : 'Enter code'}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-dark text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      {isRTL ? 'تطبيق' : 'Apply'}
                    </button>
                  </div>
                </div>

                <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
                  {isRTL ? 'إتمام الطلب' : 'Checkout'}
                </button>

                <div className="mt-4 text-center">
                  <Link to="/services" className="text-primary text-sm hover:underline">
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
