'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Phone, User, Briefcase } from 'lucide-react';

const INQUIRY_GROUPS = [
  {
    label: { ar: 'مكاتب العمل', en: 'Work Offices' },
    options: [
      { value: 'office-flex',      ar: 'الباقة المرنة',    en: 'Flex Package' },
      { value: 'office-pioneer',   ar: 'باقة الرواد',      en: 'Pioneer Package' },
      { value: 'office-pioneer-plus', ar: 'باقة الرواد +', en: 'Pioneer+ Package' },
      { value: 'office-corporate', ar: 'باقة الشركات',     en: 'Corporate Package' },
    ],
  },
  {
    label: { ar: 'قاعات الاجتماعات', en: 'Meeting Rooms' },
    options: [
      { value: 'room-riyadah-1', ar: 'قاعة ريادة ١', en: 'Riyadah Room 1' },
      { value: 'room-riyadah-2', ar: 'قاعة ريادة ٢', en: 'Riyadah Room 2' },
      { value: 'room-bina',      ar: 'قاعة بناء',    en: 'Bina Room' },
    ],
  },
  {
    label: { ar: 'المسارح', en: 'Theaters' },
    options: [
      { value: 'theater-ithraa',  ar: 'مسرح إثراء',  en: 'Ithraa Theater' },
      { value: 'theater-tarabut', ar: 'مسرح ترابط',  en: 'Tarabut Theater' },
      { value: 'theater-rakeeza', ar: 'مسرح ركيزة',  en: 'Rakeeza Theater' },
    ],
  },
  {
    label: { ar: 'أخرى', en: 'Other' },
    options: [
      { value: 'general', ar: 'استفسار عام', en: 'General Inquiry' },
    ],
  },
];

export default function ContactSection() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    activity: '',
    inquiryType: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'success' || status === 'error') {
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ fullName: '', phone: '', activity: '', inquiryType: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(data.error || '');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('');
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 lg:py-36 bg-gray-50 overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute top-6 left-6 w-36 h-36 border-[3px] border-primary/10 rounded-2xl rotate-12" />
      <div aria-hidden="true" className="pointer-events-none absolute top-20 left-20 w-10 h-10 border-2 border-secondary/20 rounded-lg -rotate-6" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-6 w-44 h-44 border-[3px] border-secondary/15 rounded-3xl -rotate-12" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-20 right-24 w-14 h-14 border-2 border-primary/10 rounded-xl rotate-6" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(157,25,66,0.025) 80px, rgba(157,25,66,0.025) 81px)' }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-4">
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
          </h2>
          <p className="text-base sm:text-lg text-gray-custom leading-relaxed">
            {isRTL
              ? 'املأ النموذج أدناه وسنعود إليك في أقرب وقت.'
              : 'Fill out the form below and we will get back to you as soon as possible.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder={isRTL ? 'اسمك الكامل' : 'Your full name'}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'رقم الجوال *' : 'Mobile Phone *'}
                </label>
                <div className="relative">
                  <Phone className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  {isRTL ? 'يرجى إدخال رقم سعودي يبدأ بـ +966' : 'Please enter a Saudi number starting with +966'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                {isRTL ? 'النشاط *' : 'Activity *'}
              </label>
              <div className="relative">
                <Briefcase className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  required
                  value={form.activity}
                  onChange={(e) => handleChange('activity', e.target.value)}
                  placeholder={isRTL ? 'مجال عملك أو نشاطك' : 'Your field or activity'}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                {isRTL ? 'نوع الاستفسار *' : 'Inquiry Type *'}
              </label>
              <select
                required
                value={form.inquiryType}
                onChange={(e) => handleChange('inquiryType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="">
                  {isRTL ? 'اختر نوع الاستفسار' : 'Select inquiry type'}
                </option>
                {INQUIRY_GROUPS.map((group) => (
                  <optgroup key={group.label.en} label={isRTL ? group.label.ar : group.label.en}>
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {isRTL ? option.ar : option.en}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {status === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm">
                {isRTL
                  ? 'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.'
                  : 'Your message has been sent successfully. We will contact you soon.'}
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                {errorMsg ||
                  (isRTL ? 'فشل إرسال الرسالة، يرجى المحاولة مرة أخرى.' : 'Failed to send message, please try again.')}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {status === 'loading'
                ? isRTL
                  ? 'جاري الإرسال...'
                  : 'Sending...'
                : isRTL
                  ? 'إرسال الاستفسار'
                  : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
