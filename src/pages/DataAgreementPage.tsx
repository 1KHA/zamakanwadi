import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Upload, FileText, Check, ArrowRight, X,
  Mail, Phone, User, Building2, MapPin
} from 'lucide-react';

export default function DataAgreementPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [files, setFiles] = useState<File[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    activityType: '',
  });

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit:', { form, files, agreed });
  };

  const activityTypes = [
    isRTL ? 'شركة ناشئة' : 'Startup',
    isRTL ? 'شركة صغيرة' : 'Small Company',
    isRTL ? 'شركة متوسطة' : 'Medium Company',
    isRTL ? 'شركة كبيرة' : 'Large Company',
    isRTL ? 'استشارات' : 'Consulting',
    isRTL ? 'تعليم' : 'Education',
    isRTL ? 'تقنية' : 'Technology',
    isRTL ? 'أخرى' : 'Other',
  ];

  return (
    <div className={`min-h-screen bg-gray-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            {isRTL ? 'البيانات والاتفاقية' : 'Data & Agreement'}
          </h1>
          <p className="text-gray-custom">
            {isRTL ? 'أكمل بياناتك واستعرض الاتفاقية للمتابعة' : 'Complete your information and review the agreement to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-dark text-lg mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {isRTL ? 'بيانات الشركة' : 'Company Information'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'اسم الشركة *' : 'Company Name *'}
                </label>
                <div className="relative">
                  <Building2 className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'اسم المسؤول *' : 'Contact Name *'}
                </label>
                <div className="relative">
                  <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'البريد الإلكتروني *' : 'Email *'}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'رقم الجوال *' : 'Phone *'}
                </label>
                <div className="relative">
                  <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'العنوان' : 'Address'}
                </label>
                <div className="relative">
                  <MapPin className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-dark mb-2">
                  {isRTL ? 'نوع النشاط' : 'Activity Type'}
                </label>
                <select
                  value={form.activityType}
                  onChange={(e) => setForm({ ...form, activityType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">{isRTL ? 'اختر النشاط' : 'Select activity'}</option>
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-dark text-lg mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              {isRTL ? 'الملفات المرفقة' : 'Attached Files'}
            </h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary transition-colors"
            >
              <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-custom mb-2">
                {isRTL ? 'اسحب الملفات هنا أو' : 'Drag files here or'}
                <label className="text-primary font-medium cursor-pointer hover:underline mx-1">
                  {isRTL ? 'تصفح' : 'browse'}
                  <input type="file" multiple className="hidden" onChange={handleFileInput} accept=".png,.jpg,.jpeg,.pdf,.doc,.docx" />
                </label>
              </p>
              <p className="text-xs text-gray-custom">
                {isRTL ? 'PNG, JPG, JPEG, PDF, DOC, DOCX' : 'PNG, JPG, JPEG, PDF, DOC, DOCX'}
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm text-dark truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-gray-custom">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agreement */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-dark text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {isRTL ? 'الاتفاقية' : 'Agreement'}
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-custom max-h-48 overflow-y-auto mb-4 leading-relaxed">
              <p className="mb-2">
                {isRTL
                  ? 'بموافقتك على هذه الاتفاقية، فإنك توافق على الشروط والأحكام التالية:'
                  : 'By agreeing to this agreement, you agree to the following terms and conditions:'}
              </p>
              <ol className="list-decimal list-inside space-y-1 ms-2">
                <li>{isRTL ? 'تقديم معلومات دقيقة وصحيحة' : 'Provide accurate and correct information'}</li>
                <li>{isRTL ? 'الالتزام بسياسات استخدام المساحة' : 'Comply with space usage policies'}</li>
                <li>{isRTL ? 'دفع الرسوم المستحقة في الوقت المحدد' : 'Pay due fees on time'}</li>
                <li>{isRTL ? 'الحفاظ على الممتلكات والمعدات' : 'Maintain property and equipment'}</li>
                <li>{isRTL ? 'احترام خصوصية الآخرين' : 'Respect others privacy'}</li>
              </ol>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-sm text-dark">
                {isRTL ? 'أوافق على الشروط والأحكام' : 'I agree to the terms and conditions'}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={!agreed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              {isRTL ? 'إرسال الطلب' : 'Submit Request'}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-dark font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
