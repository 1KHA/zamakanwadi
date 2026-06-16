import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
