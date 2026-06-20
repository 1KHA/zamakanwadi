'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from 'lucide-react';

export default function SignUpPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    agreeTerms: false,
  });

  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (isRTL ? 'فشل إنشاء الحساب' : 'Failed to create account'));
        setLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(isRTL ? 'تم إنشاء الحساب لكن فشل تسجيل الدخول' : 'Account created but sign in failed');
        setLoading(false);
        return;
      }

      router.push('/profile');
      router.refresh();
    } catch (err) {
      setError(isRTL ? 'حدث خطأ ما' : 'Something went wrong');
      setLoading(false);
    }
  };

  const inputClass = `w-full py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`;

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-dark">
              {isRTL ? 'إنشاء حساب' : 'Create Account'}
            </h1>
            <p className="text-gray-custom mt-2">
              {isRTL ? 'انضم إلى مجتمع زمكان اليوم' : 'Join the Zamakan community today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                {isRTL ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={inputClass}
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
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
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} ${isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12'}`}
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

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                className="w-4 h-4 mt-0.5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-sm text-gray-custom">
                {isRTL ? 'أوافق على ' : 'I agree to the '}
                <Link href="/terms" className="text-primary font-medium hover:underline">
                  {isRTL ? 'الشروط والأحكام' : 'terms and conditions'}
                </Link>
              </span>
            </label>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.agreeTerms}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (isRTL ? 'جاري الإنشاء...' : 'Creating...') : (isRTL ? 'إنشاء حساب' : 'Create Account')}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-custom text-sm">
              {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link href="/signin" className="text-primary font-bold hover:text-primary-dark">
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
