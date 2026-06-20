'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const contactInfo = [
    { icon: Mail, label: isRTL ? 'البريد الإلكتروني' : 'Email', value: 'info@zamakan.com' },
    { icon: Phone, label: isRTL ? 'الهاتف' : 'Phone', value: '+966 12 345 6789' },
    { icon: MapPin, label: isRTL ? 'الموقع' : 'Location', value: isRTL ? 'المملكة العربية السعودية' : 'Saudi Arabia' },
    { icon: Clock, label: isRTL ? 'ساعات العمل' : 'Working Hours', value: isRTL ? 'الأحد - الخميس: 9ص - 6م' : 'Sun - Thu: 9AM - 6PM' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="relative py-20 bg-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {isRTL ? 'نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت' : 'We are here to help. Reach out and we will get back to you soon'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-custom mb-1">{item.label}</div>
                  <div className="font-medium text-dark">{item.value}</div>
                </div>
              </div>
            ))}

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-primary/40" />
              </div>
              <div className="p-4">
                <div className="font-medium text-dark">{isRTL ? 'موقعنا' : 'Our Location'}</div>
                <div className="text-sm text-gray-custom">{isRTL ? 'زيارة مكتبنا' : 'Visit our office'}</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">
                {isRTL ? 'أرسل لنا رسالة' : 'Send us a Message'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {isRTL ? 'الاسم' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={isRTL ? 'اسمك الكامل' : 'Your full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {isRTL ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'الموضوع' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={isRTL ? 'موضوع الرسالة' : 'Message subject'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {isRTL ? 'الرسالة' : 'Message'}
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>
                {status === 'success' && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                    {isRTL ? 'تم إرسال الرسالة بنجاح' : 'Message sent successfully'}
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {isRTL ? 'فشل إرسال الرسالة' : 'Failed to send message'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {status === 'loading' ? (isRTL ? 'جاري الإرسال...' : 'Sending...') : (isRTL ? 'إرسال الرسالة' : 'Send Message')}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
