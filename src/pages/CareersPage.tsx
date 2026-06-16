import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Share2, Search } from 'lucide-react';

export default function CareersPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');

  const jobs = [
    { title: isRTL ? 'مدير تسويق' : 'Marketing Manager', location: 'Riyadh', type: 'Full-time', dept: 'Marketing' },
    { title: isRTL ? 'مصمم UX/UI' : 'UX/UI Designer', location: 'Jeddah', type: 'Full-time', dept: 'Design' },
    { title: isRTL ? 'مطور Full Stack' : 'Full Stack Developer', location: 'Riyadh', type: 'Full-time', dept: 'Engineering' },
    { title: isRTL ? 'مدير حسابات' : 'Account Manager', location: 'Dammam', type: 'Full-time', dept: 'Sales' },
    { title: isRTL ? 'مسؤول موارد بشرية' : 'HR Specialist', location: 'Riyadh', type: 'Full-time', dept: 'HR' },
    { title: isRTL ? 'محلل بيانات' : 'Data Analyst', location: 'Remote', type: 'Part-time', dept: 'Analytics' },
  ];

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="relative py-20 bg-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {isRTL ? 'الوظائف' : 'Careers'}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            {isRTL ? 'انضم إلى فريقنا وكن جزءاً من رحلة التميز' : 'Join our team and be part of the excellence journey'}
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isRTL ? 'ابحث عن وظيفة...' : 'Search jobs...'}
              className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary`}
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-custom">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{job.dept}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {isRTL ? 'تقدم الآن' : 'Apply Now'}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-custom text-lg">
              {isRTL ? 'لا توجد وظائف مطابقة لبحثك' : 'No jobs match your search'}
            </p>
          </div>
        )}

        {/* Share CTA */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">
            {isRTL ? 'شارك هذه الفرصة مع الآخرين' : 'Share this opportunity with others'}
          </h3>
          <p className="text-white/80 mb-6">
            {isRTL ? 'هل تعرف شخصاً مناسباً؟ شارك معه هذه الفرصة' : 'Know someone suitable? Share this opportunity with them'}
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-dark font-bold rounded-xl hover:bg-secondary-light transition-colors">
            <Share2 className="w-5 h-5" />
            {isRTL ? 'مشاركة' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}
