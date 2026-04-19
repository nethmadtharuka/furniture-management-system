/**
 * ============================================================================
 * PRODUCT DETAIL PAGE
 * ============================================================================
 * 
 * Shows detailed information about a single product.
 * 
 * BACKEND CONNECTION:
 * - Fetches product by ID: GET /api/products/{id}
 * - Fetches related products: GET /api/products/category/{category}
 * 
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiMinus,
  FiPlus,
  FiCheck,
  FiPackage,
  FiClock,
  FiPhone,
  FiMessageCircle,
  FiBox,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';
import api, { getBackendBaseUrl } from '../services/api';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL

  // State
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const has3DModel = Boolean(product?.model3DUrl);
  const backendBaseUrl = getBackendBaseUrl();

  const isMobile = (() => {
    const ua = navigator.userAgent || '';
    return /Android|iPhone|iPad|iPod/i.test(ua);
  })();

  const open3DViewer = ({ preferAR } = { preferAR: false }) => {
    if (!product?.id) return;
    const url = new URL(`${backendBaseUrl}/viewer/3d/${product.id}`);
    if (preferAR) url.searchParams.set('mode', 'ar');
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  /**
   * 🎓 FETCH PRODUCT BY ID
   * 
   * This makes a GET request to: /api/products/{id}
   * The {id} comes from the URL parameter (useParams hook)
   * 
   * Example: /products/5 → fetches product with id=5
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📦 Fetching product with ID:', id);

        // Make API call
        const response = await api.get(`/products/${id}`);

        console.log('✅ Product response:', response.data);

        if (response.data.success) {
          setProduct(response.data.data);

          // Fetch related products by category
          if (response.data.data.category) {
            fetchRelatedProducts(response.data.data.category, response.data.data.id);
          }
        } else {
          throw new Error(response.data.message || 'Product not found');
        }
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        
        if (err.response?.status === 404) {
          setError('Product not found');
        } else {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      // Reset state when product changes
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [id]);

  /**
   * 🎓 FETCH RELATED PRODUCTS
   * 
   * Gets products from the same category
   * Excludes the current product from results
   */
  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const response = await api.get(`/products/category/${encodeURIComponent(category)}`);
      
      if (response.data.success) {
        // Filter out current product and limit to 4
        const filtered = response.data.data
          .filter(p => p.id !== currentProductId)
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  // Check wishlist status
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.includes(Number(id)));
  }, [id]);

  // Handlers
  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(product?.stockQuantity || 10, prev + delta)));
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleToggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productId = Number(id);
    
    if (isWishlisted) {
      const newWishlist = wishlist.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(false);
      toast.success('Removed from wishlist');
    } else {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
      toast.success('Added to wishlist!');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `Check out this ${product.name} from Suhada Furniture!`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleImageZoom = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Default images if none provided
  const productImages = product?.images && product.images.length > 0
    ? product.images
    : [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      ];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <FiPackage className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
            Back to Products
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link 
                  to={`/products?category=${product.category}`} 
                  className="hover:text-primary transition-colors"
                >
                  {product.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </motion.nav>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* ============================================
                IMAGE GALLERY
                ============================================ */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Main Image */}
              <motion.div
                variants={fadeInUp}
                className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleImageZoom}
              >
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={isZoomed ? {
                    transform: 'scale(1.5)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  } : {}}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.lowStock && (
                    <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-full">
                      Low Stock
                    </span>
                  )}
                  {product.stockQuantity === 0 && (
                    <span className="px-3 py-1.5 bg-gray-800 text-white text-sm font-semibold rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Image Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => (prev === 0 ? productImages.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => (prev === productImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Zoom Hint */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                  Hover to zoom
                </div>
              </motion.div>

              {/* Thumbnail Gallery */}
              <motion.div variants={fadeInUp} className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {selectedImage === idx && (
                      <motion.div
                        layoutId="activeThumb"
                        className="absolute inset-0 border-2 border-primary rounded-xl"
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            </motion.div>

            {/* ============================================
                PRODUCT INFO
                ============================================ */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Category & SKU */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {product.category || 'Furniture'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {product.sku}
                </span>
              </motion.div>

              {/* Product Name */}
              <motion.h1
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white"
              >
                {product.name}
              </motion.h1>

              {/* Rating */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  4.5 (24 reviews)
                </span>
              </motion.div>

              {/* Price */}
              <motion.div variants={fadeInUp} className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.costPrice && product.costPrice < product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.costPrice * 1.5)}
                  </span>
                )}
              </motion.div>

              {/* Stock Status */}
              <motion.div variants={fadeInUp}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  product.stockQuantity > 10
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : product.stockQuantity > 0
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    product.stockQuantity > 10
                      ? 'bg-green-500'
                      : product.stockQuantity > 0
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                  }`} />
                  {product.stockQuantity > 10
                    ? `In Stock (${product.stockQuantity} available)`
                    : product.stockQuantity > 0
                      ? `Only ${product.stockQuantity} left in stock`
                      : 'Out of Stock'}
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={fadeInUp}
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {product.description || 'Premium quality furniture crafted with attention to detail. Perfect for modern homes looking to add a touch of elegance and comfort to their living spaces.'}
              </motion.p>

              {/* Quantity Selector */}
              <motion.div variants={fadeInUp} className="flex items-center gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <FiMinus className="w-5 h-5" />
                    </button>
                    <span className="w-14 text-center text-lg font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <FiPlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Total
                  </label>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 min-w-[200px] py-4 px-8 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>

                {/* 3D / AR Buttons */}
                <div className="flex flex-1 min-w-[200px] gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => open3DViewer({ preferAR: false })}
                    disabled={!has3DModel}
                    className="flex-1 py-4 px-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary/60 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    title={has3DModel ? 'Open interactive 3D viewer' : '3D model not available for this product'}
                  >
                    <FiBox className="w-5 h-5" />
                    View in 3D
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => open3DViewer({ preferAR: true })}
                    disabled={!has3DModel || !isMobile}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    title={
                      !has3DModel
                        ? '3D model not available for this product'
                        : !isMobile
                          ? 'AR is best supported on mobile devices'
                          : 'Open AR viewer'
                    }
                  >
                    View in AR
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleWishlist}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isWishlisted
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <FiHeart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary hover:border-primary/50 transition-all"
                >
                  <FiShare2 className="w-6 h-6" />
                </motion.button>
              </motion.div>

              {/* Quick Contact */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/94774842458?text=Hi! I'm interested in ${product.name} (SKU: ${product.sku})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <BsWhatsapp className="w-4 h-4" />
                  Ask on WhatsApp
                </a>
                <a
                  href="tel:+94777185809"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  <FiPhone className="w-4 h-4" />
                  Call Us
                </a>
                {!has3DModel && (
                  <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                    3D/AR not available for this product yet
                  </span>
                )}
              </motion.div>

              {/* Features */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiTruck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Free Delivery</p>
                    <p className="text-xs text-gray-500">Colombo & suburbs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiShield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">2 Year Warranty</p>
                    <p className="text-xs text-gray-500">Full coverage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FiRefreshCw className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Easy Returns</p>
                    <p className="text-xs text-gray-500">7 days return</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FiClock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Fast Delivery</p>
                    <p className="text-xs text-gray-500">3-5 business days</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium capitalize whitespace-nowrap transition-all relative ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'description' && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description || `Experience the perfect blend of comfort and style with our ${product.name}. Crafted with premium materials and attention to detail, this piece is designed to elevate your living space.`}
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <FiCheck className="w-5 h-5 text-green-500" />
                      Premium quality materials for durability
                    </li>
                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <FiCheck className="w-5 h-5 text-green-500" />
                      Modern design that complements any interior
                    </li>
                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <FiCheck className="w-5 h-5 text-green-500" />
                      Easy to maintain and clean
                    </li>
                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <FiCheck className="w-5 h-5 text-green-500" />
                      Eco-friendly manufacturing process
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Product Details
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'SKU', value: product.sku },
                        { label: 'Category', value: product.category || 'Furniture' },
                        { label: 'Material', value: 'Premium Wood' },
                        { label: 'Color', value: 'As shown' },
                        { label: 'Weight', value: '25 kg' },
                      ].map((spec, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400">{spec.label}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Dimensions
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Width', value: '180 cm' },
                        { label: 'Height', value: '85 cm' },
                        { label: 'Depth', value: '90 cm' },
                        { label: 'Seat Height', value: '45 cm' },
                      ].map((spec, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400">{spec.label}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <div className="text-center py-12">
                    <FiMessageCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Be the first to review this product
                    </p>
                    <button className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                Related Products
              </h2>
              <Link
                to={`/products?category=${product.category}`}
                className="text-primary font-medium hover:underline"
              >
                View All →
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct, index) => (
                <motion.div
                  key={relProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/products/${relProduct.id}`}
                    className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={relProduct.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                        {relProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        {formatPrice(relProduct.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;