'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Calendar,
  LampDesk,
  LogOut,
  Check,
  Clock,
  X,
  AlertCircle,
  ChevronRight,
  Mail,
  Phone,
  Monitor,
  Bell,
  Gift,
} from 'lucide-react';
import ServicesTab from '@/components/dashboard/ServicesTab';
import { apiFetch } from '@/lib/apiFetch';

interface Booking {
  id: string;
  itemName: string;
  itemNameAr: string | null;
  itemType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  total: number;
  originalTotal: number | null;
  appliedHours: number | null;
  paymentStatus: 'NOT_REQUIRED' | 'PENDING_PAYMENT' | 'PAID' | null;
  startDate: string;
  endDate: string | null;
  durationType: string | null;
  referenceNumber: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: { ar: string; en: string }; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: { ar: 'بانتظار الموافقة', en: 'Pending Approval' },
    color: 'bg-secondary/20 text-secondary-dark',
    icon: <Clock className="w-4 h-4" />,
  },
  APPROVED: {
    label: { ar: 'تمت الموافقة', en: 'Approved' },
    color: 'bg-green-100 text-green-700',
    icon: <Check className="w-4 h-4" />,
  },
  REJECTED: {
    label: { ar: 'مرفوض', en: 'Rejected' },
    color: 'bg-red-100 text-red-700',
    icon: <X className="w-4 h-4" />,
  },
  CANCELLED: {
    label: { ar: 'ملغي', en: 'Cancelled' },
    color: 'bg-gray-100 text-gray-600',
    icon: <X className="w-4 h-4" />,
  },
  COMPLETED: {
    label: { ar: 'مكتمل', en: 'Completed' },
    color: 'bg-primary/10 text-primary',
    icon: <Check className="w-4 h-4" />,
  },
};

function DashboardContent() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed');
  const reference = searchParams.get('ref');
  const appliedHours = Number(searchParams.get('applied') || 0);
  const paid = searchParams.get('paid');

  const tabParam = searchParams.get('tab');
  const initialTab =
    tabParam === 'services' || tabParam === 'notifications' || tabParam === 'profile' ? tabParam : 'bookings';
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'notifications' | 'profile'>(initialTab);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; read: boolean; createdAt: string }>>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      apiFetch('/api/bookings')
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch bookings');
          return res.json();
        })
        .then((data) => setBookings(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && activeTab === 'notifications') {
      let cancelled = false;
      const loadNotifications = async () => {
        setNotificationsLoading(true);
        try {
          const res = await apiFetch('/api/notifications');
          if (!res.ok) throw new Error('Failed to fetch notifications');
          const data = await res.json();
          if (!cancelled) setNotifications(data);
        } catch (err: unknown) {
          if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
        } finally {
          if (!cancelled) setNotificationsLoading(false);
        }
      };

      loadNotifications();
      return () => {
        cancelled = true;
      };
    }
  }, [status, activeTab]);

  const markAllRead = async () => {
    setMarkingRead(true);
    try {
      const res = await apiFetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error('Failed to mark notifications as read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update notifications';
      setError(message);
    } finally {
      setMarkingRead(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-gray-custom">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-4">
            {isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in'}
          </h1>
          <a
            href="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </a>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmed && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">
                  {isRTL ? 'تم استلام طلب الحجز بنجاح!' : 'Booking request submitted successfully!'}
                </div>
                <div className="text-sm mt-1">
                  {isRTL ? 'رقم مرجع الحجز:' : 'Booking reference:'}{' '}
                  <span className="font-bold">{reference}</span>
                </div>
                {paid && (
                  <div className="text-sm mt-1 font-medium">
                    {isRTL ? 'تم استلام الدفع بنجاح.' : 'Payment received successfully.'}
                  </div>
                )}
                {appliedHours > 0 && (
                  <div className="text-sm mt-1 font-medium">
                    {isRTL
                      ? `تم خصم ${appliedHours} ساعة من رصيدك تلقائياً.`
                      : `${appliedHours}h were automatically applied from your balance.`}
                  </div>
                )}
                <div className="text-sm mt-1">
                  {isRTL
                    ? 'سيتم مراجعة طلبك والرد عليك قريباً.'
                    : 'Your request is pending review and you will be notified soon.'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-dark">{user?.name || (isRTL ? 'مستخدم' : 'User')}</h3>
                <p className="text-sm text-gray-custom">{user?.email}</p>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-primary text-white'
                      : 'text-gray-custom hover:bg-gray-50 hover:text-dark'
                  }`}
                >
                  <Calendar className="w-5 h-5 shrink-0" />
                  <span className="text-start flex-1">{isRTL ? 'حجوزاتي' : 'My Bookings'}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'services'
                      ? 'bg-primary text-white'
                      : 'text-gray-custom hover:bg-gray-50 hover:text-dark'
                  }`}
                >
                  <Gift className="w-5 h-5 shrink-0" />
                  <span className="text-start flex-1">{isRTL ? 'خدماتي ورصيدي' : 'My Services'}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-primary text-white'
                      : 'text-gray-custom hover:bg-gray-50 hover:text-dark'
                  }`}
                >
                  <Bell className="w-5 h-5 shrink-0" />
                  <span className="text-start flex-1">{isRTL ? 'الإشعارات' : 'Notifications'}</span>
                  {notifications.some((n) => !n.read) && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'text-gray-custom hover:bg-gray-50 hover:text-dark'
                  }`}
                >
                  <User className="w-5 h-5 shrink-0" />
                  <span className="text-start flex-1">{isRTL ? 'الملف الشخصي' : 'Profile'}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </nav>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>{isRTL ? 'تسجيل الخروج' : 'Sign out'}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                  <LampDesk className="w-5 h-5 text-primary" />
                  {isRTL ? 'حجوزاتي' : 'My Bookings'}
                </h2>

                {loading ? (
                  <div className="text-center py-12 text-gray-custom">
                    {isRTL ? 'جاري التحميل...' : 'Loading...'}
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">{error}</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-custom">
                      {isRTL ? 'لا توجد حجوزات بعد' : 'No bookings yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const status = statusConfig[booking.status] || statusConfig.PENDING;
                      return (
                        <div
                          key={booking.id}
                          className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Monitor className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <div className="font-bold text-dark">
                                  {isRTL && booking.itemNameAr ? booking.itemNameAr : booking.itemName}
                                </div>
                                <div className="text-xs text-gray-custom capitalize">{booking.itemType}</div>
                              </div>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${status.color}`}>
                              {status.icon}
                              {isRTL ? status.label.ar : status.label.en}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-custom text-xs mb-1">{isRTL ? 'رقم المرجع' : 'Reference'}</div>
                              <div className="font-medium text-dark">{booking.referenceNumber || '-'}</div>
                            </div>
                            <div>
                              <div className="text-gray-custom text-xs mb-1">{isRTL ? 'تاريخ البداية' : 'Start Date'}</div>
                              <div className="font-medium text-dark">
                                {booking.startDate
                                  ? new Date(booking.startDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
                                  : '-'}
                                {booking.startDate && (booking.itemType === 'meeting' || booking.itemType === 'theater') && (
                                  <span className="block text-xs text-gray-custom" dir="ltr">
                                    {new Date(booking.startDate).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-custom text-xs mb-1">{isRTL ? 'تاريخ النهاية' : 'End Date'}</div>
                              <div className="font-medium text-dark">
                                {booking.endDate
                                  ? new Date(booking.endDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
                                  : '-'}
                                {booking.endDate && (booking.itemType === 'meeting' || booking.itemType === 'theater') && (
                                  <span className="block text-xs text-gray-custom" dir="ltr">
                                    {new Date(booking.endDate).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-custom text-xs mb-1">{isRTL ? 'المبلغ' : 'Amount'}</div>
                              <div className="font-bold text-primary">{booking.total.toLocaleString()} SAR</div>
                              {(booking.appliedHours ?? 0) > 0 && (
                                <div className="text-xs text-green-600 mt-0.5">
                                  {isRTL
                                    ? `تم خصم ${booking.appliedHours} ساعة من رصيدك`
                                    : `−${booking.appliedHours}h credit applied`}
                                </div>
                              )}
                              {booking.paymentStatus === 'PAID' && (
                                <div className="text-xs text-green-600 mt-0.5">
                                  {isRTL ? 'مدفوع' : 'Paid'}
                                </div>
                              )}
                              {booking.paymentStatus === 'PENDING_PAYMENT' &&
                                booking.status !== 'CANCELLED' &&
                                booking.status !== 'REJECTED' && (
                                  <a
                                    href={`/payment?ref=${booking.referenceNumber}`}
                                    className="inline-block text-xs font-bold text-red-600 hover:underline mt-0.5"
                                  >
                                    {isRTL ? 'بانتظار الدفع — ادفع الآن' : 'Payment pending — Pay now'}
                                  </a>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && <ServicesTab />}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    {isRTL ? 'الإشعارات' : 'Notifications'}
                  </h2>
                  {notifications.some((n) => !n.read) && (
                    <button
                      onClick={markAllRead}
                      disabled={markingRead}
                      className="text-sm text-primary hover:text-primary-dark font-medium disabled:opacity-50"
                    >
                      {isRTL ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                    </button>
                  )}
                </div>

                {notificationsLoading ? (
                  <div className="text-center py-12 text-gray-custom">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-custom">{isRTL ? 'لا توجد إشعارات' : 'No notifications'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border ${notification.read ? 'bg-gray-50 border-gray-100' : 'bg-primary/5 border-primary/10'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notification.read ? 'bg-gray-300' : 'bg-primary'}`} />
                          <div className="flex-1">
                            <div className="font-bold text-dark text-sm">{notification.title}</div>
                            <p className="text-gray-custom text-sm mt-1">{notification.message}</p>
                            <div className="text-xs text-gray-custom mt-2">
                              {new Date(notification.createdAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {isRTL ? 'الملف الشخصي' : 'Profile'}
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-custom">{isRTL ? 'الاسم' : 'Name'}</div>
                      <div className="font-bold text-dark">{user?.name || '-'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-secondary-dark" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-custom">{isRTL ? 'البريد الإلكتروني' : 'Email'}</div>
                      <div className="font-bold text-dark">{user?.email || '-'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-custom">{isRTL ? 'رقم الجوال' : 'Phone'}</div>
                      <div className="font-bold text-dark">{session?.user?.phone || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-custom">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
