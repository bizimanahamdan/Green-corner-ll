import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import WhatsAppModal from "./components/WhatsAppModal";
import MobileActionBar from "./components/MobileActionBar";
import OrderDrawer from "./components/OrderDrawer";
import ScrollToTop from "./components/ScrollToTop";
import { WhatsAppModalProvider } from "./lib/WhatsAppModalContext";
import { CartProvider } from "./lib/CartContext";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Specials from "./pages/Specials";
import Reviews from "./pages/Reviews";
import Location from "./pages/Location";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./admin/ProtectedRoute";

const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminOverview = lazy(() => import("./admin/AdminOverview"));
const AdminMenu = lazy(() => import("./admin/AdminMenu"));
const AdminGallery = lazy(() => import("./admin/AdminGallery"));
const AdminSpecials = lazy(() => import("./admin/AdminSpecials"));
const AdminReviews = lazy(() => import("./admin/AdminReviews"));
const AdminHours = lazy(() => import("./admin/AdminHours"));
const AdminBusinessInfo = lazy(() => import("./admin/AdminBusinessInfo"));
const AdminMedia = lazy(() => import("./admin/AdminMedia"));
const AdminReservations = lazy(() => import("./admin/AdminReservations"));
const AdminInquiries = lazy(() => import("./admin/AdminInquiries"));
const AdminSettings = lazy(() => import("./admin/AdminSettings"));

function PublicLayout({ children }) {
  return (
    <CartProvider>
      <WhatsAppModalProvider>
        <Navbar />
        <main className="pb-16 sm:pb-0">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MobileActionBar />
        <WhatsAppModal />
        <OrderDrawer />
      </WhatsAppModalProvider>
    </CartProvider>
  );
}

function AdminFallback() {
  return (
    <div className="min-h-screen bg-char-950 text-cream flex items-center justify-center">
      Loading…
    </div>
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

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
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
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}
