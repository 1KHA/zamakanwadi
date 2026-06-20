'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  User, Folder, ChartBar, ShoppingCart, Bookmark,
  Settings, LogOut, HelpCircle, Briefcase, Search,
  ChevronRight, FileText, Bell
} from 'lucide-react';

export default function ProfilePage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState('files');

  const sidebarItems = [
    { id: 'files', label: isRTL ? 'الملفات' : 'Uploaded files', icon: Folder },
    { id: 'subscription', label: isRTL ? 'حالة الاشتراك' : 'Subscription Status', icon: ChartBar },
    { id: 'orders', label: isRTL ? 'طلبات الخدمات' : 'Order Services', icon: ShoppingCart },
    { id: 'saved', label: isRTL ? 'الملفات المحفوظة' : 'Saved files', icon: Bookmark },
    { id: 'testimonials', label: isRTL ? 'آراء العملاء' : 'Testimonials', icon: FileText },
    { id: 'settings', label: isRTL ? 'إعدادات الحساب' : 'Account Settings', icon: Settings },
    { id: 'help', label: isRTL ? 'المساعدة' : 'Help', icon: HelpCircle },
    { id: 'career', label: isRTL ? 'الوظائف' : 'Career', icon: Briefcase },
  ];

  const files = [
    { name: 'File 1.pdf', size: '2.4 MB', date: '2024-01-15' },
    { name: 'File 2.docx', size: '1.1 MB', date: '2024-01-14' },
    { name: 'File 3.jpg', size: '3.2 MB', date: '2024-01-12' },
    { name: 'File 4.pdf', size: '1.8 MB', date: '2024-01-10' },
    { name: 'File 5.png', size: '4.5 MB', date: '2024-01-08' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-dark">{isRTL ? 'أحمد صالح' : 'Ahmed Saleh'}</h3>
                <p className="text-sm text-gray-custom">{isRTL ? 'عضو منذ 2001' : 'Member since 2001'}</p>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-custom hover:bg-gray-50 hover:text-dark'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="text-start flex-1">{item.label}</span>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </nav>

              <button className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                <LogOut className="w-5 h-5" />
                <span>{isRTL ? 'تسجيل الخروج' : 'Sign out'}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Folder className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-dark">24</div>
                    <div className="text-sm text-gray-custom">{isRTL ? 'ملف' : 'Files'}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-secondary-dark" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-dark">8</div>
                    <div className="text-sm text-gray-custom">{isRTL ? 'طلب' : 'Orders'}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Bookmark className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-dark">12</div>
                    <div className="text-sm text-gray-custom">{isRTL ? 'محفوظ' : 'Saved'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark">
                  {sidebarItems.find((i) => i.id === activeTab)?.label}
                </h2>
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    placeholder={isRTL ? 'بحث...' : 'Search...'}
                    className={`${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </div>
              </div>

              {activeTab === 'files' && (
                <div className="space-y-3">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-dark">{file.name}</div>
                          <div className="text-sm text-gray-custom">{file.size} · {file.date}</div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <ChevronRight className={`w-5 h-5 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-dark text-lg">{isRTL ? 'الباقة المتقدمة' : 'Pro Plan'}</h3>
                      <p className="text-gray-custom">{isRTL ? 'تجديد تلقائي شهري' : 'Monthly auto-renewal'}</p>
                    </div>
                    <div className="text-2xl font-bold text-primary">$599<span className="text-sm text-gray-custom font-normal">/{isRTL ? 'شهر' : 'mo'}</span></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-sm text-gray-custom mb-4">{isRTL ? '15 يوم متبقي في الاشتراك' : '15 days remaining in subscription'}</p>
                  <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                    {isRTL ? 'تجديد الاشتراك' : 'Renew Subscription'}
                  </button>
                </div>
              )}

              {activeTab !== 'files' && activeTab !== 'subscription' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-custom">{isRTL ? 'لا يوجد محتوى لعرضه' : 'No content to display'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
