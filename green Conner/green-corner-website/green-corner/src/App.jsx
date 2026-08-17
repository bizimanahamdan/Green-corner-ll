import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import WhatsAppModal from "./components/WhatsAppModal";
import MobileActionBar from "./components/MobileActionBar";
import ScrollToTop from "./components/ScrollToTop";
import { WhatsAppModalProvider } from "./lib/WhatsAppModalContext";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Specials from "./pages/Specials";
import Reviews from "./pages/Reviews";
import Location from "./pages/Location";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/AdminOverview";
import AdminMenu from "./admin/AdminMenu";
import AdminGallery from "./admin/AdminGallery";
import AdminSpecials from "./admin/AdminSpecials";
import AdminReviews from "./admin/AdminReviews";
import AdminHours from "./admin/AdminHours";
import AdminBusinessInfo from "./admin/AdminBusinessInfo";
import AdminMedia from "./admin/AdminMedia";
import AdminReservations from "./admin/AdminReservations";
import AdminInquiries from "./admin/AdminInquiries";
import ProtectedRoute from "./admin/ProtectedRoute";

function PublicLayout({ children }) {
  return (
    <WhatsAppModalProvider>
      <Navbar />
      <main className="pb-16 sm:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileActionBar />
      <WhatsAppModal />
    </WhatsAppModalProvider>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/menu" element={<PublicLayout><Menu /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/specials" element={<PublicLayout><Specials /></PublicLayout>} />
        <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
        <Route path="/location" element={<PublicLayout><Location /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="specials" element={<AdminSpecials />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="hours" element={<AdminHours />} />
          <Route path="business-info" element={<AdminBusinessInfo />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}
