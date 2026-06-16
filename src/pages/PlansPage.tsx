import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Mail,
  Search,
  Sparkles,
  Zap,
  Crown,
  Building2,
  UtensilsCrossed,
  Cpu,
  Landmark,
  Briefcase,

  GraduationCap,

  Truck,
  HardHat,
  Church,
  Rocket,
  Lightbulb,
  Sprout,
  Film,
  DollarSign,
  Fuel,
  CalendarDays,
  Plus,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  nameAr: string;
  price: string;
  period: string;
  periodAr: string;
  description: string;
  descriptionAr: string;
  features: PlanFeature[];
  highlighted?: boolean;
  icon: React.ReactNode;
}

interface Category {
  label: string;
  labelAr: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { label: 'Food', labelAr: 'الطعام', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { label: 'Engineering', labelAr: 'الهندسة', icon: <HardHat className="w-4 h-4" /> },
  { label: 'Small Company', labelAr: 'شركة صغيرة', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Consulting', labelAr: 'استشارات', icon: <Briefcase className="w-4 h-4" /> },
  { label: 'Religion', labelAr: 'دين', icon: <Church className="w-4 h-4" /> },
  { label: 'Artificial Intelligence', labelAr: 'الذكاء الاصطناعي', icon: <Cpu className="w-4 h-4" /> },
  { label: 'Startup', labelAr: 'ناشئة', icon: <Rocket className="w-4 h-4" /> },
  { label: 'Entrepreneurship', labelAr: 'ريادة الأعمال', icon: <Lightbulb className="w-4 h-4" /> },
  { label: 'Incubator', labelAr: 'حاضنة', icon: <Sprout className="w-4 h-4" /> },
  { label: 'Media', labelAr: 'إعلام', icon: <Film className="w-4 h-4" /> },
  { label: 'Medium Company', labelAr: 'شركة متوسطة', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Financial', labelAr: 'مالية', icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Petroleum Industries', labelAr: 'صناعة البترول', icon: <Fuel className="w-4 h-4" /> },
  { label: 'Event Management', labelAr: 'إدارة الفعاليات', icon: <CalendarDays className="w-4 h-4" /> },
  { label: 'Large Company', labelAr: 'شركة كبيرة', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Education', labelAr: 'تعليم', icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Hajj and Umrah', labelAr: 'الحج والعمرة', icon: <Landmark className="w-4 h-4" /> },
  { label: 'Logistical Operations', labelAr: 'العمليات اللوجستية', icon: <Truck className="w-4 h-4" /> },
  { label: 'Another', labelAr: 'أخرى', icon: <Plus className="w-4 h-4" /> },
];

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    nameAr: 'أساسي',
    price: '299',
    period: '/month',
    periodAr: '/شهر',
    description: 'Perfect for individuals and small teams getting started.',
    descriptionAr: 'مثالي للأفراد والفرق الصغيرة التي تبدأ رحلتها.',
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      { text: 'Access to shared workspaces', included: true },
      { text: 'High-speed Wi-Fi', included: true },
      { text: 'Community events access', included: true },
      { text: 'Meeting room 2 hrs/month', included: true },
      { text: 'Dedicated desk', included: false },
      { text: '24/7 access', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    nameAr: 'احترافي',
    price: '599',
    period: '/month',
    periodAr: '/شهر',
    description: 'Ideal for growing teams that need more flexibility.',
    descriptionAr: 'مثالي للفرق النامية التي تحتاج إلى مزيد من المرونة.',
    highlighted: true,
    icon: <Zap className="w-6 h-6" />,
    features: [
      { text: 'Dedicated desk', included: true },
      { text: 'High-speed Wi-Fi', included: true },
      { text: 'Community events access', included: true },
      { text: 'Meeting room 10 hrs/month', included: true },
      { text: '24/7 access', included: true },
      { text: 'Priority support', included: true },
      { text: 'Mail handling', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameAr: 'مؤسسي',
    price: '1,199',
    period: '/month',
    periodAr: '/شهر',
    description: 'Full-service solution for established organizations.',
    descriptionAr: 'حل متكامل للمؤسسات الراسخة.',
    icon: <Crown className="w-6 h-6" />,
    features: [
      { text: 'Private office suite', included: true },
      { text: 'High-speed Wi-Fi', included: true },
      { text: 'Unlimited meeting rooms', included: true },
      { text: '24/7 access', included: true },
      { text: 'Priority support', included: true },
      { text: 'Mail handling', included: true },
      { text: 'Custom branding', included: true },
    ],
  },
];

export default function PlansPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;
  const DirectionArrow = isRTL ? ArrowLeft : ArrowRight;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full overflow-hidden bg-primary text-white">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)`,
            }}
          />
        </div>
        {/* Decorative floating shapes */}
        <div className="absolute top-10 right-[10%] w-32 h-32 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-10 left-[5%] w-48 h-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">
                {isRTL ? 'اختر الخطة التي تناسبك' : 'Choose the plan that fits you'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {isRTL ? (
                <>
                  خطط <span className="text-secondary">زمكان</span> المميزة
                </>
              ) : (
                <>
                  Zamakan <span className="text-secondary">Premium</span> Plans
                </>
              )}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
              {isRTL
                ? 'استكشف باقاتنا المتنوعة المصممة لتلبية احتياجات عملك، من الفرق الصغيرة إلى المؤسسات الكبرى.'
                : 'Explore our diverse packages designed to meet your business needs, from small teams to large enterprises.'}
            </p>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 37 768 43 864 45C960 47 1056 45 1152 41.7C1248 37 1344 30 1392 26.7L1440 23V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
              fill="#ffbf19"
            />
          </svg>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION (Yellow Accent) ===== */}
      <section className="relative w-full bg-[#ffbf19] py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              {isRTL ? 'مجالات عملنا' : 'Our Industries'}
            </h2>
            <p className="text-dark/70 text-lg max-w-2xl mx-auto">
              {isRTL
                ? 'نحن نخدم مجموعة واسعة من القطاعات والصناعات لتلبية احتياجاتك المحددة.'
                : 'We serve a wide range of sectors and industries to meet your specific needs.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : cat.label)
                  }
                  className={`
                    group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                    text-sm font-semibold transition-all duration-300 cursor-pointer
                    border-2
                    ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-lg scale-105'
                        : 'bg-white text-dark border-white hover:border-primary hover:text-primary hover:shadow-md'
                    }
                  `}
                >
                  <span className={isSelected ? 'text-white' : 'text-primary group-hover:text-primary'}>
                    {cat.icon}
                  </span>
                  <span>{isRTL ? cat.labelAr : cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decorative arrow */}
        <div className="absolute top-8 right-8 hidden lg:block opacity-20">
          <DirectionArrow className="w-16 h-16 text-dark" />
        </div>
        <div className="absolute bottom-8 left-8 hidden lg:block opacity-20 rotate-45">
          <ArrowIcon className="w-12 h-12 text-dark" />
        </div>
      </section>

      {/* ===== PRICING PLANS SECTION (Dark Navy) ===== */}
      <section className="relative w-full bg-[#0d0f25] py-20 sm:py-28 lg:py-32">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-20">
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">
              {isRTL ? 'التسعير' : 'Pricing'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
              {isRTL ? 'اختر خطتك' : 'Choose Your Plan'}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {isRTL
                ? 'باقات مرنة تناسب جميع الأحجام، من العمل الحر إلى الشركات الكبرى.'
                : 'Flexible packages for all sizes, from freelancers to large corporations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-300
                  ${
                    plan.highlighted
                      ? 'bg-white text-dark scale-100 lg:scale-105 shadow-2xl shadow-secondary/20 ring-2 ring-secondary'
                      : 'bg-white/5 text-white border border-white/10 hover:border-white/30 hover:bg-white/10'
                  }
                `}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-secondary text-dark text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                      <Zap className="w-3 h-3" />
                      {isRTL ? 'الأكثر شيوعاً' : 'Most Popular'}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.highlighted ? 'bg-primary/10 text-primary' : 'bg-white/10 text-secondary'
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      plan.highlighted ? 'text-dark' : 'text-white'
                    }`}
                  >
                    {isRTL ? plan.nameAr : plan.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      plan.highlighted ? 'text-dark/60' : 'text-white/60'
                    }`}
                  >
                    {isRTL ? plan.descriptionAr : plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl sm:text-5xl font-bold ${
                        plan.highlighted ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        plan.highlighted ? 'text-dark/50' : 'text-white/50'
                      }`}
                    >
                      {isRTL ? plan.periodAr : plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 text-sm ${
                        plan.highlighted
                          ? feature.included
                            ? 'text-dark/80'
                            : 'text-dark/30'
                          : feature.included
                          ? 'text-white/80'
                          : 'text-white/25'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included
                            ? plan.highlighted
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary/20 text-secondary'
                            : plan.highlighted
                            ? 'bg-dark/5 text-dark/20'
                            : 'bg-white/5 text-white/20'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </span>
                      <span className={feature.included ? '' : 'line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`
                    w-full py-3.5 px-6 rounded-xl font-semibold text-sm
                    transition-all duration-300 cursor-pointer
                    flex items-center justify-center gap-2
                    ${
                      plan.highlighted
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40'
                    }
                  `}
                >
                  {isRTL ? 'ابدأ الآن' : 'Get Started'}
                  <DirectionArrow className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="relative w-full bg-[#ffbf19] py-20 sm:py-24 lg:py-28 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-dark/10 p-8 sm:p-12 lg:p-14">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
                  <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
                  {isRTL ? 'انضم إلى قائمة مراسلتنا' : 'Join Our Mailing List'}
                </h2>
                <p className="text-gray-custom max-w-md mx-auto">
                  {isRTL
                    ? 'اشترك الآن واحصل على أحدث الأخبار والعروض الحصرية مباشرة إلى بريدك الإلكتروني.'
                    : 'Subscribe now and get the latest news and exclusive offers delivered straight to your inbox.'}
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-custom" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني...' : 'Enter your email...'}
                    required
                    className="w-full ps-11 pe-4 py-3.5 rounded-xl border-2 border-gray-100
                               bg-gray-50 text-dark placeholder:text-gray-custom
                               focus:outline-none focus:border-primary focus:bg-white
                               transition-all duration-200 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5
                             bg-primary text-white font-semibold text-sm rounded-xl
                             hover:bg-primary-dark active:scale-[0.98]
                             transition-all duration-200 cursor-pointer
                             shadow-lg shadow-primary/25"
                >
                  {isRTL ? 'اشترك' : 'Subscribe'}
                  <DirectionArrow className="w-4 h-4" />
                </button>
              </form>

              {subscribed && (
                <div className="mt-5 text-center">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <Check className="w-4 h-4" />
                    {isRTL
                      ? 'تم الاشتراك بنجاح! شكراً لك.'
                      : 'Subscribed successfully! Thank you.'}
                  </span>
                </div>
              )}

              <p className="text-center text-xs text-gray-custom mt-5">
                {isRTL
                  ? 'نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.'
                  : 'We respect your privacy. You can unsubscribe at any time.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON / TRUST SECTION ===== */}
      <section className="relative w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '50+', label: 'Partners', labelAr: 'شريك' },
              { value: '10K+', label: 'Members', labelAr: 'عضو' },
              { value: '99%', label: 'Satisfaction', labelAr: 'رضا' },
              { value: '24/7', label: 'Support', labelAr: 'دعم' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-custom font-medium">
                  {isRTL ? stat.labelAr : stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative w-full bg-primary py-14 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5">
            {isRTL
              ? 'هل تحتاج إلى حل مخصص لشركتك؟'
              : 'Need a custom solution for your company?'}
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            {isRTL
              ? 'فريقنا جاهز لمساعدتك في بناء باقة مخصصة تلبي جميع احتياجاتك.'
              : 'Our team is ready to help you build a custom package that meets all your needs.'}
          </p>
          <button
            className="inline-flex items-center justify-center gap-2 px-8 py-4
                       bg-secondary text-dark font-bold text-sm rounded-xl
                       hover:bg-secondary-dark active:scale-[0.98]
                       transition-all duration-200 cursor-pointer
                       shadow-lg shadow-secondary/30"
          >
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
            <DirectionArrow className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
