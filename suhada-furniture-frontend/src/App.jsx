/**
 * ============================================================================
 * APP.JSX - Main Application Router (FIXED)
 * ============================================================================
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import About from './pages/About';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCustomers from './admin/AdminCustomers';

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Placeholder for pages not yet built
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400">This page is coming soon!</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* ============================================
            ADMIN ROUTES - Must come BEFORE public routes
            ============================================ */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="categories" element={<PlaceholderPage title="Categories Management" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="promotions" element={<PlaceholderPage title="Promotions" />} />
          <Route path="deliveries" element={<PlaceholderPage title="Deliveries" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="help" element={<PlaceholderPage title="Help Center" />} />
        </Route>

        {/* ============================================
            PUBLIC ROUTES
            ============================================ */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/categories" element={<PublicLayout><Categories /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#333', color: '#fff' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </Router>
  );
}

export default App;