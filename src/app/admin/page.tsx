'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/Logo';
import {
  LayoutDashboard, Users, Folder, ShoppingCart, Settings, MessageSquare,
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  ChevronRight, Bell, Search
} from 'lucide-react';

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatWeekLabel(
  start: Date,
  isCurrent: boolean,
  isRTL: boolean,
  count: number
) {
  const dateStr = start.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  if (isCurrent) {
    return isRTL ? `هذا الأسبوع (${count})` : `This week (${count})`;
  }
  return isRTL
    ? `أسبوع ${dateStr} (${count})`
    : `Week of ${dateStr} (${count})`;
}

export default function AdminPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: isRTL ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
    { id: 'messages', label: isRTL ? 'رسائل التواصل' : 'Contact Messages', icon: MessageSquare },
    { id: 'users', label: isRTL ? 'المستخدمين' : 'Users', icon: Users },
    { id: 'files', label: isRTL ? 'الملفات' : 'Files', icon: Folder },
    { id: 'orders', label: isRTL ? 'الطلبات' : 'Orders', icon: ShoppingCart },
    { id: 'settings', label: isRTL ? 'الإعدادات' : 'Settings', icon: Settings },
  ];

  const stats = [
    { label: isRTL ? 'إجمالي المستخدمين' : 'Total Users', value: '1,284', change: '+12%', up: true, icon: Users },
    { label: isRTL ? 'الإيرادات' : 'Revenue', value: '45,230 SAR', change: '+8%', up: true, icon: DollarSign },
    { label: isRTL ? 'الطلبات' : 'Orders', value: '342', change: '-3%', up: false, icon: ShoppingCart },
    { label: isRTL ? 'الملفات' : 'Files', value: '2,105', change: '+15%', up: true, icon: Folder },
  ];

  const [messages, setMessages] = useState<Array<{
    id: string;
    fullName: string;
    phone: string;
    activity: string;
    inquiryType: string;
    createdAt: string;
  }> | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');

  useEffect(() => {
    if (activeTab !== 'messages') return;

    let cancelled = false;
    setMessagesLoading(true);
    setMessagesError('');

    fetch('/api/contact-messages')
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const message = data.details || data.error || `HTTP ${res.status}`;
          console.error('[admin] Failed to fetch messages:', data);
          throw new Error(message);
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err) => {
        if (!cancelled) setMessagesError(err.message);
      })
      .finally(() => {
        if (!cancelled) setMessagesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const currentWeekStart = getWeekStart(new Date());
  const currentWeekKey = currentWeekStart.toISOString();

  const [openWeeks, setOpenWeeks] = useState<Set<string>>(new Set([currentWeekKey]));

  const toggleWeek = (key: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const groupedMessages = messages
    ? Object.entries(
        messages.reduce<Record<string, typeof messages>>((acc, msg) => {
          const start = getWeekStart(new Date(msg.createdAt));
          const key = start.toISOString();
          if (!acc[key]) acc[key] = [];
          acc[key].push(msg);
          return acc;
        }, {})
      )
        .map(([key, msgs]) => ({
          key,
          start: new Date(key),
          messages: msgs.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        }))
        .sort((a, b) => b.start.getTime() - a.start.getTime())
    : [];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Ahmed Saleh', item: 'Pro Plan', amount: 599, status: 'completed' },
    { id: '#ORD-002', customer: 'Sarah Ahmed', item: 'Medium Office', amount: 6000, status: 'pending' },
    { id: '#ORD-003', customer: 'Mohammed Ali', item: 'Large Theater', amount: 1200, status: 'completed' },
    { id: '#ORD-004', customer: 'Noura Saad', item: 'Basic Plan', amount: 299, status: 'cancelled' },
  ];

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-secondary/20 text-secondary-dark',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark text-white min-h-screen sticky top-0">
          <div className="p-6">
            <div className="mb-8">
              <Logo width={140} height={63} />
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 text-start">{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-dark">
              {sidebarItems.find((i) => i.id === activeTab)?.label}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  placeholder={isRTL ? 'بحث...' : 'Search...'}
                  className={`${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              <button className="relative p-2 text-gray-500 hover:text-dark bg-white rounded-lg border border-gray-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-dark mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-custom">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts Placeholder */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-dark mb-4">
                    {isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                  </h3>
                  <div className="h-48 bg-gradient-to-t from-primary/10 to-transparent rounded-lg flex items-end justify-around p-4">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="w-8 bg-primary rounded-t-lg" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-dark mb-4">
                    {isRTL ? 'توزيع المستخدمين' : 'User Distribution'}
                  </h3>
                  <div className="h-48 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-8 border-primary" />
                      <div className="absolute inset-0 rounded-full border-8 border-secondary" style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)' }} />
                      <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-dark mb-4">
                  {isRTL ? 'أحدث الطلبات' : 'Recent Orders'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-start text-sm font-medium text-gray-custom py-3 px-4">{isRTL ? 'الطلب' : 'Order'}</th>
                        <th className="text-start text-sm font-medium text-gray-custom py-3 px-4">{isRTL ? 'العميل' : 'Customer'}</th>
                        <th className="text-start text-sm font-medium text-gray-custom py-3 px-4">{isRTL ? 'الخدمة' : 'Item'}</th>
                        <th className="text-start text-sm font-medium text-gray-custom py-3 px-4">{isRTL ? 'المبلغ' : 'Amount'}</th>
                        <th className="text-start text-sm font-medium text-gray-custom py-3 px-4">{isRTL ? 'الحالة' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-dark">{order.id}</td>
                          <td className="py-3 px-4 text-gray-custom">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-custom">{order.item}</td>
                          <td className="py-3 px-4 font-medium text-dark">{order.amount} SAR</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-dark mb-4">
                {isRTL ? 'رسائل التواصل' : 'Contact Messages'}
              </h3>
              {messagesLoading ? (
                <p className="text-dark text-center py-8">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
              ) : messagesError ? (
                <p className="text-red-600 text-center py-8">{messagesError}</p>
              ) : messages && messages.length === 0 ? (
                <p className="text-dark text-center py-8">{isRTL ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>
              ) : groupedMessages.length > 0 ? (
                <div className="space-y-4">
                  {groupedMessages.map(({ key, start, messages: weekMessages }) => {
                    const isOpen = openWeeks.has(key);
                    const isCurrent = key === currentWeekKey;
                    return (
                      <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleWeek(key)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-bold text-dark">
                            {formatWeekLabel(start, isCurrent, isRTL, weekMessages.length)}
                          </span>
                          <ChevronRight
                            className={`w-5 h-5 text-dark transition-transform ${
                              isOpen ? 'rotate-90' : isRTL ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="overflow-x-auto p-4">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="text-start text-sm font-semibold text-dark py-3 px-4">{isRTL ? 'الاسم' : 'Name'}</th>
                                  <th className="text-start text-sm font-semibold text-dark py-3 px-4">{isRTL ? 'الجوال' : 'Phone'}</th>
                                  <th className="text-start text-sm font-semibold text-dark py-3 px-4">{isRTL ? 'النشاط' : 'Activity'}</th>
                                  <th className="text-start text-sm font-semibold text-dark py-3 px-4">{isRTL ? 'نوع الاستفسار' : 'Inquiry Type'}</th>
                                  <th className="text-start text-sm font-semibold text-dark py-3 px-4">{isRTL ? 'التاريخ' : 'Date'}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {weekMessages.map((msg) => (
                                  <tr key={msg.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-dark">{msg.fullName}</td>
                                    <td className="py-3 px-4 text-dark text-end whitespace-nowrap" dir="ltr">{msg.phone}</td>
                                    <td className="py-3 px-4 text-dark">{msg.activity}</td>
                                    <td className="py-3 px-4 text-dark">
                                      {msg.inquiryType === 'whole-office' && (isRTL ? 'تأجير مكتب كامل' : 'Rent a whole office')}
                                      {msg.inquiryType === 'shared-desk' && (isRTL ? 'تأجير مكتب في مساحة عمل مشتركة' : 'Rent a desk in shared workspace')}
                                      {msg.inquiryType === 'general' && (isRTL ? 'استفسار عام' : 'General inquiry')}
                                    </td>
                                    <td className="py-3 px-4 text-dark whitespace-nowrap">
                                      {new Date(msg.createdAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          {activeTab !== 'dashboard' && activeTab !== 'messages' && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">
                {isRTL ? 'قريباً' : 'Coming Soon'}
              </h3>
              <p className="text-gray-custom">
                {isRTL ? 'هذه الميزة قيد التطوير' : 'This feature is under development'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
