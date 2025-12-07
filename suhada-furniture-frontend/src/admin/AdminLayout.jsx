/**
 * ============================================================================
 * ADMIN DASHBOARD LAYOUT (FIXED)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  FiHome, FiPackage, FiUsers, FiShoppingCart, FiBarChart2,
  FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiSearch,
  FiMoon, FiSun, FiChevronDown, FiUser, FiHelpCircle,
  FiTag, FiTruck, FiLayers,
} from 'react-icons/fi';

// Navigation Items
const navigationItems = [
  { name: 'Dashboard', path: '/admin', icon: FiHome, exact: true },
  { name: 'Products', path: '/admin/products', icon: FiPackage },
  { name: 'Categories', path: '/admin/categories', icon: FiLayers },
  { name: 'Orders', path: '/admin/orders', icon: FiShoppingCart, badge: 12 },
  { name: 'Customers', path: '/admin/customers', icon: FiUsers },
  { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
  { name: 'Promotions', path: '/admin/promotions', icon: FiTag },
  { name: 'Deliveries', path: '/admin/deliveries', icon: FiTruck },
];

const bottomNavItems = [
  { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  { name: 'Help', path: '/admin/help', icon: FiHelpCircle },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Get user from localStorage (with fallback)
  const user = JSON.parse(localStorage.getItem('user') || '{"fullName": "Admin User", "email": "admin@suhada.com"}');

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Check if path is active
  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New Order', message: 'Order #1234 received', time: '5 min ago', unread: true },
    { id: 2, title: 'Low Stock Alert', message: 'Luxury Sofa is running low', time: '1 hour ago', unread: true },
    { id: 3, title: 'Payment Received', message: 'Rs. 150,000 from Order #1233', time: '2 hours ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0f]">
      {/* ============================================
          SIDEBAR - Desktop
          ============================================ */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col bg-white dark:bg-[#12121a] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'w-[280px]' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center ${sidebarOpen ? 'px-6' : 'px-4 justify-center'} border-b border-gray-200 dark:border-gray-800`}>
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl text-gray-900 dark:text-white">Suhada</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                      active
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="font-medium whitespace-nowrap">{item.name}</span>
                    )}
                    {item.badge && sidebarOpen && (
                      <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.badge && !sidebarOpen && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-6 mx-3 border-t border-gray-200 dark:border-gray-800" />

          <ul className="space-y-1 px-3">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className={`p-4 border-t border-gray-200 dark:border-gray-800 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                {user.fullName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || 'admin@suhada.com'}
                </p>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="p-3 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all" title="Logout">
              <FiLogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-sm"
        >
          <FiChevronDown className={`w-4 h-4 transition-transform ${sidebarOpen ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      </aside>

      {/* ============================================
          MOBILE SIDEBAR
          ============================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#12121a] z-50 lg:hidden overflow-y-auto"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
                <Link to="/admin" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">Suhada</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500">
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <nav className="py-6">
                <ul className="space-y-1 px-3">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path, item.exact);
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            active ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${active ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ============================================
          MAIN CONTENT AREA
          ============================================ */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#12121a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-500">
                <FiMenu className="w-6 h-6" />
              </button>
              <div className="hidden md:block relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  className="w-64 lg:w-80 pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${notif.unread ? 'bg-purple-500/5' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full ${notif.unread ? 'bg-purple-600' : 'bg-gray-300'}`} />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user.fullName?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.fullName?.split(' ')[0] || 'Admin'}
                  </span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">{user.fullName || 'Admin User'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/admin/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                          <FiUser className="w-5 h-5" />
                          <span>My Profile</span>
                        </Link>
                        <Link to="/admin/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                          <FiSettings className="w-5 h-5" />
                          <span>Settings</span>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                          <FiLogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - THIS IS WHERE CHILD ROUTES RENDER */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Click outside handlers */}
      {(userMenuOpen || notificationsOpen) && (
        <div className="fixed inset-0 z-20" onClick={() => { setUserMenuOpen(false); setNotificationsOpen(false); }} />
      )}
    </div>
  );
};

export default AdminLayout;