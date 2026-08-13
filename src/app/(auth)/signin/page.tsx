'use client';
import { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Clock } from 'lucide-react';
import Logo from '@/components/Logo';
import { resolveLoginDestination } from '@/lib/redirects';
import { IDLE_TIMEOUT_MINUTES } from '@/lib/sessionPolicy';

function SignInForm() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get('expired');
  const callbackUrl = searchParams.get('callbackUrl');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
      return;
    }

    const session = await getSession();
    router.push(resolveLoginDestination(callbackUrl, session?.user?.role));
    router.refresh();
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo width={160} height={72} />
            </div>
            <h1 className="text-2xl font-bold text-dark">
              {isRTL ? 'تسجيل الدخول' : 'Sign In'}
            </h1>
            <p className="text-gray-custom mt-2">
              {isRTL ? 'أهلاً بك مجدداً في زمكان' : 'Welcome back to Zamakan'}
            </p>
          </div>

          {expired && (
            <div className="mb-6 p-4 bg-secondary/15 border border-secondary/30 rounded-xl text-secondary-dark text-sm flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {isRTL
                  ? `تم تسجيل خروجك تلقائياً بعد ${IDLE_TIMEOUT_MINUTES} دقيقة من عدم النشاط. يرجى تسجيل الدخول مرة أخرى.`
                  : `You were signed out automatically after ${IDLE_TIMEOUT_MINUTES} minutes of inactivity. Please sign in again.`}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="your@email.com"
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
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12'} py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
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
              {loading ? (isRTL ? 'جاري الدخول...' : 'Signing in...') : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-custom text-sm">
              {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link href="/signup" className="text-primary font-bold hover:text-primary-dark">
                {isRTL ? 'سجل الآن' : 'Sign Up'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-custom">Loading...</div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
