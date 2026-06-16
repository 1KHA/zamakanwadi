import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Monitor, Users, Projector, Mic, Wifi, Check } from 'lucide-react';

export default function TheatersPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const rooms = [
    {
      id: 'small',
      name: isRTL ? 'قاعة صغيرة' : 'Small Theater',
      capacity: '10-20',
      price: 300,
      period: isRTL ? '/ساعة' : '/hour',
      features: ['Projector', 'Screen', 'Sound System', 'WiFi'],
      image: 'bg-gradient-to-br from-primary/20 to-primary/5',
    },
    {
      id: 'medium',
      name: isRTL ? 'قاعة متوسطة' : 'Medium Theater',
      capacity: '20-50',
      price: 600,
      period: isRTL ? '/ساعة' : '/hour',
      features: ['4K Projector', 'Large Screen', 'Sound System', 'WiFi', 'Microphone'],
      image: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
    },
    {
      id: 'large',
      name: isRTL ? 'قاعة كبيرة' : 'Large Theater',
      capacity: '50-100',
      price: 1200,
      period: isRTL ? '/ساعة' : '/hour',
      features: ['4K Projector', 'Cinema Screen', 'Surround Sound', 'WiFi', 'Wireless Mic', 'Stage'],
      image: 'bg-gradient-to-br from-blue-100 to-blue-50',
    },
  ];

  const featureIcons: Record<string, React.ReactNode> = {
    Projector: <Projector className="w-4 h-4" />,
    '4K Projector': <Projector className="w-4 h-4" />,
    Screen: <Monitor className="w-4 h-4" />,
    'Large Screen': <Monitor className="w-4 h-4" />,
    'Cinema Screen': <Monitor className="w-4 h-4" />,
    'Sound System': <Mic className="w-4 h-4" />,
    'Surround Sound': <Mic className="w-4 h-4" />,
    WiFi: <Wifi className="w-4 h-4" />,
    Microphone: <Mic className="w-4 h-4" />,
    'Wireless Mic': <Mic className="w-4 h-4" />,
    Stage: <Users className="w-4 h-4" />,
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="relative py-16 bg-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {isRTL ? 'قاعات العروض والاجتماعات' : 'Theaters & Meeting Rooms'}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            {isRTL ? 'قاعات مجهزة بأحدث التقنيات لفعالياتك واجتماعاتك' : 'Rooms equipped with the latest technology for your events and meetings'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rooms Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
              className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden ${
                selectedRoom === room.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className={`h-48 ${room.image} flex items-center justify-center`}>
                <Monitor className="w-20 h-20 text-dark/20" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-dark text-lg mb-1">{room.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-custom mb-4">
                  <Users className="w-4 h-4" />
                  {room.capacity} {isRTL ? 'شخص' : 'people'}
                </div>
                <div className="space-y-2 mb-6">
                  {room.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-custom">
                      <span className="text-primary">{featureIcons[f]}</span>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-primary">{room.price}</span>
                  <span className="text-gray-custom text-sm">SAR{room.period}</span>
                </div>
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {isRTL ? 'احجز الآن' : 'Book Now'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Info */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-dark mb-4">
            {isRTL ? 'معلومات الحجز' : 'Booking Information'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-custom">{isRTL ? 'إلغاء مجاني حتى 24 ساعة قبل الحجز' : 'Free cancellation up to 24 hours before booking'}</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-custom">{isRTL ? 'دعم فني متواجد أثناء الفعالية' : 'Technical support available during the event'}</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-custom">{isRTL ? 'إمكانية تسجيل الفعالية' : 'Event recording available'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-custom">{isRTL ? 'تجهيزات قابلة للتخصيص' : 'Customizable setup'}</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-custom">{isRTL ? 'خدمة ضيافة متوفرة' : 'Catering service available'}</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-custom">{isRTL ? 'موقف سيارات مجاني' : 'Free parking'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
