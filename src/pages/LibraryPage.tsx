import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, BookOpen, Download, Bookmark, Filter, ArrowRight } from 'lucide-react';

export default function LibraryPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: isRTL ? 'الكل' : 'All' },
    { id: 'articles', label: isRTL ? 'مقالات' : 'Articles' },
    { id: 'guides', label: isRTL ? 'أدلة' : 'Guides' },
    { id: 'reports', label: isRTL ? 'تقارير' : 'Reports' },
    { id: 'videos', label: isRTL ? 'فيديوهات' : 'Videos' },
  ];

  const resources = [
    { title: isRTL ? 'دليل ريادة الأعمال' : 'Entrepreneurship Guide', category: 'guides', desc: isRTL ? 'كل ما تحتاجه لبدء مشروعك' : 'Everything you need to start your business', downloads: 1200 },
    { title: isRTL ? 'تقرير سوق العمل 2024' : 'Labor Market Report 2024', category: 'reports', desc: isRTL ? 'تحليل شامل لسوق العمل السعودي' : 'Comprehensive analysis of Saudi labor market', downloads: 850 },
    { title: isRTL ? 'كيف تبني فريقاً ناجحاً' : 'How to Build a Successful Team', category: 'articles', desc: isRTL ? 'استراتيجيات بناء فريق فعال' : 'Strategies for building an effective team', downloads: 2100 },
    { title: isRTL ? 'دليل الاستثمار' : 'Investment Guide', category: 'guides', desc: isRTL ? 'أساسيات الاستثمار للمبتدئين' : 'Investment basics for beginners', downloads: 940 },
    { title: isRTL ? 'ورشة عمل التصميم' : 'Design Workshop', category: 'videos', desc: isRTL ? 'تعلم أصول التصميم الجرافيكي' : 'Learn the basics of graphic design', downloads: 560 },
    { title: isRTL ? 'تقرير الابتكار' : 'Innovation Report', category: 'reports', desc: isRTL ? 'أحدث اتجاهات الابتكار في المنطقة' : 'Latest innovation trends in the region', downloads: 720 },
  ];

  const filtered = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="relative py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              {isRTL ? 'المكتبة' : 'Library'}
            </h1>
            <p className="text-gray-custom mb-8">
              {isRTL ? 'مصادر معرفية متنوعة لتطوير مهاراتك ونمو مشروعك' : 'Diverse knowledge resources to develop your skills and grow your business'}
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isRTL ? 'ابحث في المكتبة...' : 'Search library...'}
                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Filter className="w-5 h-5 text-gray-400" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-custom hover:text-dark border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resource, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-custom text-xs rounded-md mb-3">
                {categories.find((c) => c.id === resource.category)?.label}
              </span>
              <h3 className="font-bold text-dark mb-2 group-hover:text-primary transition-colors">{resource.title}</h3>
              <p className="text-gray-custom text-sm mb-4">{resource.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-custom flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {resource.downloads}
                </span>
                <button className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                  {isRTL ? 'تحميل' : 'Download'}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-custom text-lg">
              {isRTL ? 'لا توجد نتائج مطابقة' : 'No matching results found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
