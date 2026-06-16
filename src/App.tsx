import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PlansPage = lazy(() => import('./pages/PlansPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WorkOfficesPage = lazy(() => import('./pages/WorkOfficesPage'));
const TheatersPage = lazy(() => import('./pages/TheatersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ChooseDeskPage = lazy(() => import('./pages/ChooseDeskPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const DataAgreementPage = lazy(() => import('./pages/DataAgreementPage'));

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="work-offices" element={<WorkOfficesPage />} />
          <Route path="theaters" element={<TheatersPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="choose-desk" element={<ChooseDeskPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="data-agreement" element={<DataAgreementPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
