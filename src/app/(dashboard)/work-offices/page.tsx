'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Building2, Users, Wifi, Coffee, Car, ArrowRight, Check, Filter } from 'lucide-react';

export default function WorkOfficesPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [filter, setFilter] = useState('all');

  const offices = [
    {
      name: isRTL ? 'مكتب فردي' : 'Individual Office',
      price: 1500,
      period: isRTL ? '/شهر' : '/month',
      capacity: '1',
      image: 'bg-gradient-to-br from-primary/20 to-primary/5',
      amenities: ['WiFi', 'Coffee', 'Parking'],
      type: 'individual',
    },
    {
      name: isRTL ? 'مكتب صغير' : 'Small Office',
      price: 3500,
      period: isRTL ? '/شهر' : '/month',
      capacity: '2-4',
      image: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
      amenities: ['WiFi', 'Coffee', 'Parking', 'Meeting Room'],
      type: 'small',
    },
    {
      name: isRTL ? 'مكتب متوسط' : 'Medium Office',
      price: 6000,
      period: isRTL ? '/شهر' : '/month',
      capacity: '5-10',
      image: 'bg-gradient-to-br from-green-100 to-green-50',
      amenities: ['WiFi', 'Coffee', 'Parking', 'Meeting Room', 'Printer'],
      type: 'medium',
    },
    {
      name: isRTL ? 'مكتب كبير' : 'Large Office',
      price: 12000,
      period: isRTL ? '/شهر' : '/month',
      capacity: '10-20',
      image: 'bg-gradient-to-br from-blue-100 to-blue-50',
      amenities: ['WiFi', 'Coffee', 'Parking', 'Meeting Room', 'Printer', 'Kitchen'],
      type: 'large',
    },
  ];

  const filtered = filter === 'all' ? offices : offices.filter((o) => o.type === filter);

  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi className="w-4 h-4" />,
    Coffee: <Coffee className="w-4 h-4" />,
    Parking: <Car className="w-4 h-4" />,
    'Meeting Room': <Users className="w-4 h-4" />,
    Printer: <Building2 className="w-4 h-4" />,
    Kitchen: <Coffee className="w-4 h-4" />,
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="relative py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              {isRTL ? 'مكاتب العمل' : 'Work Offices'}
            </h1>
            <p className="text-gray-custom">
              {isRTL ? 'مساحات عمل مرنة تناسب فريقك واحتياجاتك' : 'Flexible workspaces that suit your team and needs'}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Filter className="w-5 h-5 text-gray-400" />
          {[
            { id: 'all', label: isRTL ? 'الكل' : 'All' },
            { id: 'individual', label: isRTL ? 'فردي' : 'Individual' },
            { id: 'small', label: isRTL ? 'صغير' : 'Small' },
            { id: 'medium', label: isRTL ? 'متوسط' : 'Medium' },
            { id: 'large', label: isRTL ? 'كبير' : 'Large' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.id ? 'bg-primary text-white' : 'bg-white text-gray-custom hover:text-dark border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Offices Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((office, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
              <div className={`h-40 ${office.image} flex items-center justify-center`}>
                <Building2 className="w-16 h-16 text-dark/20" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-dark mb-1">{office.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-custom mb-4">
                  <Users className="w-4 h-4" />
                  {office.capacity} {isRTL ? 'أشخاص' : 'people'}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {office.amenities.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-custom text-xs rounded-md">
                      {amenityIcons[a]}
                      {a}
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-primary">{office.price.toLocaleString()}</span>
                  <span className="text-gray-custom text-sm">SAR{office.period}</span>
                </div>
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {isRTL ? 'احجز الآن' : 'Book Now'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">
            {isRTL ? 'تحتاج مساحة مخصصة؟' : 'Need a custom space?'}
          </h3>
          <p className="text-white/80 mb-6">
            {isRTL ? 'تواصل معنا لنصمم مساحة تناسب فريقك' : 'Contact us to design a space that fits your team'}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary-light transition-colors"
          >
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
