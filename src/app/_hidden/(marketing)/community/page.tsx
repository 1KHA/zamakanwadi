'use client';
import { useTranslation } from 'react-i18next';
import { Users, User, ArrowRight, Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const members = [
    { name: isRTL ? 'محمد علي' : 'Mohammed Ali', role: isRTL ? 'مؤسس' : 'Founder', company: 'TechStart' },
    { name: isRTL ? 'سارة أحمد' : 'Sarah Ahmed', role: isRTL ? 'مديرة' : 'Director', company: 'InnovateCo' },
    { name: isRTL ? 'عمر خالد' : 'Omar Khaled', role: isRTL ? 'مطور' : 'Developer', company: 'CodeBase' },
    { name: isRTL ? 'نورة سعد' : 'Noura Saad', role: isRTL ? 'مصممة' : 'Designer', company: 'DesignHub' },
    { name: isRTL ? 'فهد عبدالله' : 'Fahad Abdullah', role: isRTL ? 'مدير تسويق' : 'Marketing Lead', company: 'GrowthX' },
    { name: isRTL ? 'ليلى حسن' : 'Laila Hassan', role: isRTL ? 'محللة' : 'Analyst', company: 'DataPro' },
  ];

  const testimonials = [
    { text: isRTL ? 'زمكان غيرت طريقة عملي بالكامل. البيئة الملهمة والمجتمع الرائع ساعداني على النمو' : 'Zamakan completely changed the way I work. The inspiring environment and amazing community helped me grow', author: isRTL ? 'أحمد صالح' : 'Ahmed Saleh', role: 'CEO, StartupX' },
    { text: isRTL ? 'أفضل مساحة عمل شاركتها. الخدمات ممتازة والفريق متعاون للغاية' : 'The best coworking space I have been to. Excellent services and a very supportive team', author: isRTL ? 'منى فارس' : 'Mona Fares', role: 'Designer' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {isRTL ? 'مجتمعنا' : 'Our Community'}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {isRTL ? 'تعرف على الأشخاص الذين يمكنون الآخرين من تحقيق المزيد' : 'Meet the people who are empowering others to achieve more'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '500+', label: isRTL ? 'عضو' : 'Members' },
            { value: '50+', label: isRTL ? 'شركة' : 'Companies' },
            { value: '100+', label: isRTL ? 'فعالية' : 'Events' },
            { value: '98%', label: isRTL ? 'رضا' : 'Satisfaction' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-gray-custom">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Members Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-dark mb-8 text-center">
            {isRTL ? 'أعضاء مجتمعنا' : 'Community Members'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-dark">{member.name}</h3>
                <p className="text-primary text-sm font-medium">{member.role}</p>
                <p className="text-gray-custom text-sm mt-1">{member.company}</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-dark mb-8 text-center">
            {isRTL ? 'آراء أعضائنا' : 'Member Testimonials'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm">
                <MessageCircle className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-dark leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-dark">{t.author}</div>
                    <div className="text-sm text-gray-custom">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-dark rounded-2xl p-8 sm:p-12 text-center text-white">
          <Users className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {isRTL ? 'انضم إلى مجتمع زمكان' : 'Join the Zamakan Community'}
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            {isRTL ? 'كن جزءاً من شبكة تضم أكثر من 500 محترف وشركة ناشئة' : 'Be part of a network of 500+ professionals and startups'}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary-light transition-colors"
          >
            {isRTL ? 'انضم الآن' : 'Join Now'}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
