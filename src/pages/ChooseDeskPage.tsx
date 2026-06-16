import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Monitor, Wifi, Coffee, Check, Armchair } from 'lucide-react';

export default function ChooseDeskPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);

  const desks = Array.from({ length: 24 }, (_, i) => {
    const id = `desk-${i + 1}`;
    const isWindow = i < 8;
    const isCorner = [0, 7, 16, 23].includes(i);
    const status = Math.random() > 0.7 ? 'occupied' : 'available';
    return {
      id,
      number: i + 1,
      status: status as 'available' | 'occupied' | 'selected',
      type: isCorner ? 'corner' : isWindow ? 'window' : 'standard',
      price: isCorner ? 200 : isWindow ? 150 : 100,
    };
  }).map((d) => ({
    ...d,
    status: d.id === selectedDesk ? 'selected' : d.status,
  }));

  const selectedDeskData = desks.find((d) => d.id === selectedDesk);

  return (
    <div className={`min-h-screen bg-gray-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            {isRTL ? 'اختر مكتبك' : 'Choose Your Desk'}
          </h1>
          <p className="text-gray-custom">
            {isRTL ? 'اختر المكتب الذي يناسبك من الخريطة أدناه' : 'Select the desk that suits you from the map below'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-gray-custom">{isRTL ? 'متاح' : 'Available'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded" />
            <span className="text-sm text-gray-custom">{isRTL ? 'محجوز' : 'Occupied'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded" />
            <span className="text-sm text-gray-custom">{isRTL ? 'مختار' : 'Selected'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded" />
            <span className="text-sm text-gray-custom">{isRTL ? 'نافذة' : 'Window'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded" />
            <span className="text-sm text-gray-custom">{isRTL ? 'زاوية' : 'Corner'}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Desk Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {desks.map((desk) => (
                  <button
                    key={desk.id}
                    onClick={() => desk.status !== 'occupied' && setSelectedDesk(desk.id)}
                    disabled={desk.status === 'occupied'}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      desk.status === 'occupied'
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : desk.status === 'selected'
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : desk.type === 'corner'
                        ? 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-2 border-purple-200'
                        : desk.type === 'window'
                        ? 'bg-secondary/10 text-secondary-dark hover:bg-secondary/20 border-2 border-secondary/30'
                        : 'bg-green-50 text-green-600 hover:bg-green-100 border-2 border-green-200'
                    }`}
                  >
                    <Armchair className="w-5 h-5" />
                    <span className="text-xs font-bold">{desk.number}</span>
                    {desk.status === 'selected' && <Check className="w-3 h-3 absolute top-1 right-1" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-dark text-lg mb-4">
                {isRTL ? 'تفاصيل الاختيار' : 'Selection Details'}
              </h2>

              {selectedDeskData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{selectedDeskData.number}</div>
                    <div className="text-sm text-gray-custom">
                      {selectedDeskData.type === 'corner'
                        ? isRTL ? 'مكتب زاوية' : 'Corner Desk'
                        : selectedDeskData.type === 'window'
                        ? isRTL ? 'مكتب بنافذة' : 'Window Desk'
                        : isRTL ? 'مكتب قياسي' : 'Standard Desk'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-custom">
                      <Wifi className="w-4 h-4 text-primary" />
                      {isRTL ? 'واي فاي عالي السرعة' : 'High-speed WiFi'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-custom">
                      <Monitor className="w-4 h-4 text-primary" />
                      {isRTL ? 'شاشة متوفرة' : 'Monitor available'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-custom">
                      <Coffee className="w-4 h-4 text-primary" />
                      {isRTL ? 'قهوة مجانية' : 'Free coffee'}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-custom">{isRTL ? 'السعر/شهر' : 'Price/month'}</span>
                      <span className="text-2xl font-bold text-primary">{selectedDeskData.price} SAR</span>
                    </div>
                    <Link
                      to="/cart"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                      <Check className="w-5 h-5" />
                      {isRTL ? 'احجز هذا المكتب' : 'Book This Desk'}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Armchair className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-custom">
                    {isRTL ? 'اختر مكتباً من الخريطة' : 'Select a desk from the map'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
