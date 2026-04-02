import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiSearch, FiShoppingCart, FiUser,
  FiSun, FiMoon, FiLogOut, FiGrid, FiZap
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine if we should show solid background/dark text
  // Show if scrolled OR if NOT on home page
  const showSolidNav = scrolled || location.pathname !== '/';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showSolidNav
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent backdrop-blur-none shadow-none'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md"
            >
              <span className="text-white font-bold text-2xl">S</span>
            </motion.div>
            <div>
              <h1 className={`text-3xl font-display font-bold leading-tight ${showSolidNav ? 'gradient-text' : 'text-white'}`}>
                Suhada
              </h1>
              <p className={`text-sm ${showSolidNav ? 'text-gray-500 dark:text-gray-400' : 'text-gray-200'}`}>Premium Furniture</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink to="/" scrolled={showSolidNav}>Home</NavLink>
            <NavLink to="/products" scrolled={showSolidNav}>Products</NavLink>
            <NavLink to="/categories" scrolled={showSolidNav}>Categories</NavLink>
            <NavLink to="/about" scrolled={showSolidNav}>About</NavLink>
            <NavLink to="/contact" scrolled={showSolidNav}>Contact</NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-5">

            {/* AI Product Finder Button */}
            <Link to="/ai-finder">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FiZap className="w-5 h-5" />
                <span>AI Finder</span>
              </motion.button>
            </Link>

            {/* Search Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-3 rounded-xl bg-white/75 text-gray-800 shadow-md hover:bg-white/90"
            >
              <FiSearch className="w-6 h-6" />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-xl bg-white/75 text-gray-800 shadow-md hover:bg-white/90"
            >
              {isDark ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-white/75 text-gray-800 shadow-md hover:bg-white/90 relative"
            >
              <FiShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                0
              </span>
            </motion.button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-base font-bold">
                      {user?.fullName?.charAt(0)}
                    </span>
                  </div>
                </motion.button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-4 border-b dark:border-gray-700">
                    <p className="font-semibold">{user?.fullName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiGrid className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FiUser className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors w-full"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Login
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-t dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for furniture..."
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-600 outline-none"
                  autoFocus
                />
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="px-4 py-7 space-y-5">
              <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/ai-finder" onClick={() => setIsOpen(false)}>
                <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <FiZap className="w-5 h-5" />
                  AI Finder
                </span>
              </MobileNavLink>
              <MobileNavLink to="/products" onClick={() => setIsOpen(false)}>Products</MobileNavLink>
              <MobileNavLink to="/categories" onClick={() => setIsOpen(false)}>Categories</MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// NavLink Component
const NavLink = ({ to, children, scrolled }) => (
  <Link
    to={to}
    className={`relative font-semibold text-lg transition-colors group ${scrolled
        ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
        : 'text-gray-100 hover:text-primary-200'
      }`}
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 group-hover:w-full transition-all duration-300" />
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-5 py-4 rounded-lg font-semibold text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;