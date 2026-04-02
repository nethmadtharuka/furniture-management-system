/**
 * ============================================================================
 * SUHADA FURNITURE - PRODUCTS PAGE
 * ============================================================================
 * 
 * 🎓 UNDERSTANDING FRONTEND-BACKEND CONNECTION
 * ============================================
 * 
 * This file demonstrates how React frontend communicates with Spring Boot backend.
 * 
 * THE COMPLETE FLOW:
 * ==================
 * 
 * 1. USER ACTION (Frontend)
 *    └─→ User visits /products page or clicks "Load Products"
 * 
 * 2. REACT COMPONENT MOUNTS
 *    └─→ useEffect() hook triggers when component loads
 *    └─→ Calls fetchProducts() function
 * 
 * 3. API CALL (Frontend → Backend)
 *    └─→ Axios sends HTTP GET request to: http://localhost:8080/api/products
 *    └─→ Request includes:
 *        • Headers (Authorization: Bearer JWT_TOKEN)
 *        • Query params (?page=0&size=12&sortBy=createdAt&sortDir=DESC)
 * 
 * 4. BACKEND RECEIVES REQUEST (Spring Boot)
 *    └─→ ProductController.java receives the request
 *    └─→ @GetMapping("/api/products") method handles it
 *    └─→ Extracts query parameters (page, size, sort)
 *    └─→ Calls ProductService.getAllProductsPaginated(pageable)
 * 
 * 5. SERVICE LAYER (Spring Boot)
 *    └─→ ProductServiceImpl.java processes business logic
 *    └─→ Calls ProductRepository.findAll(pageable)
 * 
 * 6. DATABASE QUERY (MySQL)
 *    └─→ Spring Data JPA generates SQL:
 *        SELECT * FROM products ORDER BY created_at DESC LIMIT 12 OFFSET 0
 *    └─→ MySQL executes query and returns rows
 * 
 * 7. RESPONSE JOURNEY BACK
 *    └─→ Repository returns List<Product> entities
 *    └─→ Service converts to List<ProductDTO> (removes sensitive data like costPrice)
 *    └─→ Controller wraps in ApiResponse and returns JSON
 * 
 * 8. FRONTEND RECEIVES RESPONSE
 *    └─→ Axios receives JSON response
 *    └─→ React setState() updates component state
 *    └─→ Component re-renders with new data
 *    └─→ User sees products on screen!
 * 
 * VISUAL DIAGRAM:
 * ===============
 * 
 *   [Browser/React]                    [Spring Boot]                    [MySQL]
 *        │                                  │                              │
 *        │ ─────── HTTP GET ──────────────→ │                              │
 *        │   /api/products?page=0           │                              │
 *        │                                  │ ────── SQL Query ──────────→ │
 *        │                                  │                              │
 *        │                                  │ ←───── Result Set ────────── │
 *        │ ←────── JSON Response ────────── │                              │
 *        │   {success: true, data: [...]}   │                              │
 *        │                                  │                              │
 *   [Re-render UI]                          │                              │
 * 
 * ============================================================================
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiShoppingCart,
  FiEye,
  FiX,
  FiStar,
  FiSliders,
  FiRefreshCw,
  FiPackage,
  FiTruck,
  FiShield,
  FiArrowUp,
} from 'react-icons/fi';
import { BsGrid3X3Gap, BsListUl } from 'react-icons/bs';
import axios from 'axios';

// ============================================================================
// API SERVICE - HOW FRONTEND TALKS TO BACKEND
// ============================================================================
/**
 * 🎓 AXIOS INSTANCE EXPLAINED
 * 
 * Axios is a library that makes HTTP requests from browser to server.
 * We create a configured instance with:
 * - baseURL: Where your backend is running
 * - Headers: Default headers sent with every request
 * 
 * This instance is reused throughout the app for consistency.
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Your Spring Boot server
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🎓 AXIOS INTERCEPTOR EXPLAINED
 * 
 * Interceptors run BEFORE every request is sent.
 * 
 * WHY WE NEED THIS:
 * - Your backend has protected endpoints (requires JWT token)
 * - We stored the token in localStorage after login
 * - This interceptor automatically adds the token to EVERY request
 * 
 * FLOW:
 * 1. User logs in → Backend returns JWT token
 * 2. Frontend stores token in localStorage
 * 3. Every subsequent API call → Interceptor adds token to headers
 * 4. Backend validates token → Returns data or 401 Unauthorized
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (saved during login)
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 🎓 PRODUCT SERVICE - API FUNCTIONS
 * 
 * These functions encapsulate all product-related API calls.
 * This is a common pattern called "Service Layer" in frontend.
 * 
 * Benefits:
 * - Centralized API logic
 * - Easy to modify endpoints
 * - Reusable across components
 * - Cleaner component code
 */
const productService = {
  /**
   * GET ALL PRODUCTS (with pagination)
   * 
   * Backend endpoint: GET /api/products/paginated
   * 
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Items per page
   * @param {string} sortBy - Field to sort by
   * @param {string} sortDir - Sort direction (ASC/DESC)
   * @returns {Promise} - Product data with pagination info
   */
  getAllProducts: async (page = 0, size = 12, sortBy = 'createdAt', sortDir = 'DESC') => {
    // This creates: GET /api/products/paginated?page=0&size=12&sortBy=createdAt&sortDir=DESC
    const response = await api.get('/products/paginated', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  /**
   * SEARCH PRODUCTS
   * 
   * Backend endpoint: GET /api/products/search?query=sofa
   */
  searchProducts: async (query, page = 0, size = 12) => {
    const response = await api.get('/products/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  /**
   * GET PRODUCTS BY CATEGORY
   * 
   * Backend endpoint: GET /api/products/category/{categoryName}
   */
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  /**
   * GET SINGLE PRODUCT BY ID
   * 
   * Backend endpoint: GET /api/products/{id}
   */
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

// ============================================================================
// ANIMATION VARIANTS - FRAMER MOTION
// ============================================================================
/**
 * 🎓 FRAMER MOTION EXPLAINED
 * 
 * Framer Motion is an animation library for React.
 * 
 * "variants" = Predefined animation states
 * - initial: Starting state (before animation)
 * - animate: End state (after animation)
 * - exit: State when component unmounts
 * 
 * EXAMPLE:
 * initial={{ opacity: 0 }} → Start invisible
 * animate={{ opacity: 1 }} → Fade to visible
 * transition={{ duration: 0.5 }} → Take 0.5 seconds
 */

// Container animation - staggers children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each child animates 0.1s after previous
    },
  },
};

// Individual product card animation
const productVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, // Start 50px below
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0, // Move to normal position
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// Sidebar filter animation
const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    x: -300, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// MAIN PRODUCTS PAGE COMPONENT
// ============================================================================
const Products = () => {
  // React Router hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  /**
   * 🎓 useState HOOK EXPLAINED
   * 
   * useState creates "reactive" variables in React.
   * When state changes, the component re-renders automatically.
   * 
   * Syntax: const [value, setValue] = useState(initialValue);
   * - value: Current state value
   * - setValue: Function to update state
   * - initialValue: Starting value
   */
  
  // Products data from backend
  const [products, setProducts] = useState([]);
  
  // Loading state - shows skeleton while fetching
  const [loading, setLoading] = useState(true);
  
  // Error state - shows error message if API fails
  const [error, setError] = useState(null);
  
  // Pagination info from backend
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12,
  });

  // View mode: 'grid' or 'list'
  const [viewMode, setViewMode] = useState('grid');
  
  // Mobile filter sidebar visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // Search input value
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active search (submitted search)
  const [activeSearch, setActiveSearch] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'createdAt',
    sortDir: 'DESC',
  });

  // Quick view modal state
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Wishlist (stored in localStorage)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Categories for filter sidebar
  const categories = [
    'All Categories',
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Office',
    'Outdoor',
    'Kids Room',
    'Kitchen',
    'Bathroom',
  ];

  // Sort options
  const sortOptions = [
    { label: 'Newest First', value: 'createdAt-DESC' },
    { label: 'Oldest First', value: 'createdAt-ASC' },
    { label: 'Price: Low to High', value: 'price-ASC' },
    { label: 'Price: High to Low', value: 'price-DESC' },
    { label: 'Name: A-Z', value: 'name-ASC' },
    { label: 'Name: Z-A', value: 'name-DESC' },
  ];

  // ========================================
  // DATA FETCHING
  // ========================================
  /**
   * 🎓 useCallback HOOK EXPLAINED
   * 
   * useCallback memoizes (caches) a function so it doesn't get
   * recreated on every render.
   * 
   * WHY WE NEED IT:
   * - Prevents unnecessary re-renders
   * - Required for useEffect dependencies
   * - Performance optimization
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching products from backend...');
      console.log('📍 API URL:', `${api.defaults.baseURL}/products/paginated`);
      console.log('📝 Parameters:', {
        page: pagination.currentPage,
        size: pagination.pageSize,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      });

      let response;

      // Determine which API to call based on filters
      if (activeSearch) {
        // Search products
        console.log('🔍 Searching for:', activeSearch);
        response = await productService.searchProducts(
          activeSearch,
          pagination.currentPage,
          pagination.pageSize
        );
      } else if (filters.category && filters.category !== 'All Categories') {
        // Filter by category
        console.log('📁 Filtering by category:', filters.category);
        response = await productService.getProductsByCategory(filters.category);
      } else {
        // Get all products with pagination
        console.log('📦 Getting all products');
        response = await productService.getAllProducts(
          pagination.currentPage,
          pagination.pageSize,
          filters.sortBy,
          filters.sortDir
        );
      }

      console.log('✅ Backend Response:', response);

      /**
       * 🎓 RESPONSE STRUCTURE EXPLAINED
       * 
       * Your backend returns:
       * {
       *   success: true,
       *   message: "Products retrieved",
       *   data: {
       *     content: [...products],      // Array of products
       *     totalPages: 5,               // Total number of pages
       *     totalElements: 50,           // Total products count
       *     number: 0,                   // Current page (0-indexed)
       *     size: 12,                    // Items per page
       *   }
       * }
       */
      
      if (response.success) {
        // Handle paginated response
        if (response.data.content) {
          setProducts(response.data.content);
          setPagination({
            currentPage: response.data.number,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            pageSize: response.data.size,
          });
        } else if (Array.isArray(response.data)) {
          // Handle non-paginated response (like category filter)
          setProducts(response.data);
          setPagination(prev => ({
            ...prev,
            totalElements: response.data.length,
            totalPages: 1,
          }));
        }
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      
      /**
       * 🎓 ERROR HANDLING EXPLAINED
       * 
       * Different types of errors:
       * - Network error: Can't reach server
       * - 401 Unauthorized: Token expired/invalid
       * - 404 Not Found: Wrong endpoint
       * - 500 Server Error: Backend crashed
       */
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
        
        // If 401, redirect to login
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else if (err.request) {
        // No response received (network error)
        setError('Cannot connect to server. Is the backend running on localhost:8080?');
      } else {
        setError(err.message);
      }

      // Set empty products on error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, filters.sortBy, filters.sortDir, filters.category, activeSearch, navigate]);

  // ========================================
  // EFFECTS
  // ========================================
  /**
   * 🎓 useEffect HOOK EXPLAINED
   * 
   * useEffect runs side effects (like API calls) in React.
   * 
   * Syntax: useEffect(callback, dependencies)
   * - callback: Function to run
   * - dependencies: Array of values - effect re-runs when these change
   * 
   * WHEN IT RUNS:
   * - Empty array []: Only on mount (once)
   * - [value]: On mount AND when value changes
   * - No array: On every render (avoid this!)
   */
  
  // Fetch products when component mounts or filters change
  useEffect(() => {
    console.log('🔄 useEffect triggered - fetching products');
    fetchProducts();
  }, [fetchProducts]);

  // Update URL params when category changes
  useEffect(() => {
    if (filters.category && filters.category !== 'All Categories') {
      setSearchParams({ category: filters.category });
    } else {
      setSearchParams({});
    }
  }, [filters.category, setSearchParams]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ========================================
  // EVENT HANDLERS
  // ========================================
  
  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
    setActiveSearch('');
    setSearchQuery('');
  };

  // Handle sort change
  const handleSortChange = (value) => {
    const [sortBy, sortDir] = value.split('-');
    setFilters(prev => ({ ...prev, sortBy, sortDir }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      // Scroll to top of products
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'createdAt',
      sortDir: 'DESC',
    });
    setSearchQuery('');
    setActiveSearch('');
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  // ========================================
  // RENDER HELPERS
  // ========================================
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, pagination.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(pagination.totalPages, start + maxVisible);
    
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ========================================
  // COMPONENT RENDER
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* ============================================
          HERO SECTION - Page Header
          ============================================ */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-gold/20 to-orange-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6"
          >
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">Products</span>
            {filters.category && filters.category !== 'All Categories' && (
              <>
                <span>/</span>
                <span className="text-primary font-medium">{filters.category}</span>
              </>
            )}
          </motion.nav>

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {filters.category && filters.category !== 'All Categories' 
                ? filters.category 
                : 'Our Collection'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Discover our handcrafted furniture pieces designed to transform your space into a haven of comfort and style.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm">
              <FiPackage className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {pagination.totalElements} Products
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm">
              <FiTruck className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Free Delivery
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm">
              <FiShield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                2 Year Warranty
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SEARCH & FILTER BAR
          ============================================ */}
      <section className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full md:w-auto md:flex-1 max-w-xl">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-20 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <FiX className="w-4 h-4 text-gray-500" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter & View Controls */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FiFilter className="w-5 h-5" />
                <span className="font-medium">Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${filters.sortBy}-${filters.sortDir}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-gray-700 dark:text-gray-300 font-medium cursor-pointer focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <BsGrid3X3Gap className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <BsListUl className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(activeSearch || filters.category) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap items-center gap-2 mt-4"
            >
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {activeSearch && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Search: "{activeSearch}"
                  <button onClick={clearSearch} className="hover:bg-primary/20 rounded-full p-0.5">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {filters.category && filters.category !== 'All Categories' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                  {filters.category}
                  <button 
                    onClick={() => handleCategoryChange('')}
                    className="hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded-full p-0.5"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                <FiRefreshCw className="w-3 h-3" />
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================
          MAIN CONTENT - Sidebar + Products Grid
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          
          {/* ========================================
              SIDEBAR - Desktop Filter Panel
              ======================================== */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-36 space-y-6">
              
              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiSliders className="w-5 h-5 text-primary" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category === 'All Categories' ? '' : category)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${
                        (category === 'All Categories' && !filters.category) ||
                        filters.category === category
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Price Range */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Price Range
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </motion.div>

              {/* In Stock Filter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 dark:text-gray-300">In Stock Only</span>
                </label>
              </motion.div>

              {/* Reset Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={resetFilters}
                className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:border-primary hover:text-primary transition-all"
              >
                Reset All Filters
              </motion.button>
            </div>
          </aside>

          {/* ========================================
              MOBILE SIDEBAR OVERLAY
              ======================================== */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                />
                
                {/* Sidebar */}
                <motion.aside
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-50 overflow-y-auto lg:hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {/* Categories */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              handleCategoryChange(category === 'All Categories' ? '' : category);
                              setShowFilters(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${
                              (category === 'All Categories' && !filters.category) ||
                              filters.category === category
                                ? 'bg-primary text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ========================================
              PRODUCTS GRID
              ======================================== */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-square mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FiX className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {error}
                </p>
                <button
                  onClick={fetchProducts}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <FiPackage className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Reset Filters
                </button>
              </motion.div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    index={index}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    onQuickView={() => setQuickViewProduct(product)}
                    formatPrice={formatPrice}
                  />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-12"
              >
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full font-medium transition-all ${
                      pageNum === pagination.currentPage
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                  className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================
          QUICK VIEW MODAL
          ============================================ */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            formatPrice={formatPrice}
            isWishlisted={wishlist.includes(quickViewProduct.id)}
            onToggleWishlist={() => toggleWishlist(quickViewProduct.id)}
          />
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================
const ProductCard = ({ 
  product, 
  viewMode, 
  index, 
  isWishlisted, 
  onToggleWishlist, 
  onQuickView,
  formatPrice 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Default image if none provided
  const productImage = product.images && product.images.length > 0
    ? product.images[0]
    : `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80`;

  if (viewMode === 'list') {
    // List View Card
    return (
      <motion.div
        variants={productVariants}
        layout
        className="flex gap-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-shadow"
      >
        {/* Image */}
        <Link to={`/products/${product.id}`} className="w-48 h-48 flex-shrink-0">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.lowStock && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                Low Stock
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <span className="text-sm text-primary font-medium">{product.category}</span>
            <Link to={`/products/${product.id}`}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-1 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              {product.description || 'Premium quality furniture for your home.'}
            </p>
            
            {/* SKU */}
            <p className="text-sm text-gray-400 mt-2">SKU: {product.sku}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              <span className={`ml-2 text-sm ${product.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleWishlist}
                className={`p-2 rounded-full transition-colors ${
                  isWishlisted 
                    ? 'bg-red-100 text-red-500' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onQuickView}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-primary transition-colors"
              >
                <FiEye className="w-5 h-5" />
              </button>
              <Link
                to={`/products/${product.id}`}
                className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View Card
  return (
    <motion.div
      variants={productVariants}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        
        {/* Product Image */}
        <motion.img
          src={productImage}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.lowStock && (
            <motion.span
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full"
            >
              Low Stock
            </motion.span>
          )}
          {product.stockQuantity === 0 && (
            <motion.span
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full"
            >
              Out of Stock
            </motion.span>
          )}
        </div>

        {/* Quick Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-4 left-4 right-4 flex justify-center gap-2"
        >
          <button
            onClick={onToggleWishlist}
            className={`p-3 rounded-full backdrop-blur-sm transition-all ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
          >
            <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onQuickView}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-primary hover:text-white transition-all"
          >
            <FiEye className="w-5 h-5" />
          </button>
          <button
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-primary hover:text-white transition-all"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
        />
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {product.category || 'Furniture'}
        </span>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating (placeholder) */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">(24)</span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>
          <span className={`text-sm font-medium ${
            product.stockQuantity > 10 
              ? 'text-green-500' 
              : product.stockQuantity > 0 
                ? 'text-orange-500' 
                : 'text-red-500'
          }`}>
            {product.stockQuantity > 10 
              ? 'In Stock' 
              : product.stockQuantity > 0 
                ? `Only ${product.stockQuantity} left`
                : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={product.stockQuantity === 0}
          className="w-full mt-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// QUICK VIEW MODAL COMPONENT
// ============================================================================
const QuickViewModal = ({ product, onClose, formatPrice, isWishlisted, onToggleWishlist }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [`https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80`];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="fixed inset-4 md:inset-10 lg:inset-20 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden z-50 flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-700/90 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Image Gallery */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-700 p-6">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            {product.category}
          </span>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {product.name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-500">(24 reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">
            {product.description || 'Premium quality furniture crafted with attention to detail. Perfect for modern homes looking to add a touch of elegance.'}
          </p>

          {/* Stock Status */}
          <div className="mt-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              product.stockQuantity > 10
                ? 'bg-green-100 text-green-700'
                : product.stockQuantity > 0
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                product.stockQuantity > 10
                  ? 'bg-green-500'
                  : product.stockQuantity > 0
                    ? 'bg-orange-500'
                    : 'bg-red-500'
              }`} />
              {product.stockQuantity > 10
                ? 'In Stock'
                : product.stockQuantity > 0
                  ? `Only ${product.stockQuantity} left`
                  : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              disabled={product.stockQuantity === 0}
              className="flex-1 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <FiShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={onToggleWishlist}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                isWishlisted
                  ? 'bg-red-100 text-red-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500'
              }`}
            >
              <FiHeart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* View Full Details Link */}
          <Link
            to={`/products/${product.id}`}
            className="block text-center mt-6 text-primary font-medium hover:underline"
          >
            View Full Details →
          </Link>
        </div>
      </motion.div>
    </>
  );
};

// ============================================================================
// SCROLL TO TOP BUTTON COMPONENT
// ============================================================================
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors z-40"
        >
          <FiArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default Products;