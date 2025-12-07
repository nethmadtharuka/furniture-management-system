import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { productService } from '../../services/products';
import toast from 'react-hot-toast';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium furniture pieces, 
            crafted with excellence and designed for modern living.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card group relative overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-xl h-64 bg-gray-200 dark:bg-gray-700">
        <motion.img
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Low Stock Badge */}
        {product.lowStock && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Low Stock
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-4 right-4 flex gap-2"
        >
          <ActionButton icon={<FiHeart />} tooltip="Add to Wishlist" />
          <ActionButton icon={<FiEye />} tooltip="Quick View" />
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2 uppercase tracking-wide">
          {product.category}
        </p>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-gold-500">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            (4.5)
          </span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Rs. {product.price?.toLocaleString()}
            </p>
            {product.stockQuantity > 0 ? (
              <p className="text-xs text-green-600 dark:text-green-400">
                {product.stockQuantity} in stock
              </p>
            ) : (
              <p className="text-xs text-red-600 dark:text-red-400">
                Out of stock
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-primary-500 to-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            disabled={product.stockQuantity === 0}
          >
            <FiShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Action Button Component
const ActionButton = ({ icon, tooltip }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all group relative"
    title={tooltip}
  >
    {icon}
  </motion.button>
);

// Loading Skeleton
const ProductCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-t-xl" />
    <div className="p-6 space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
    </div>
  </div>
);

export default FeaturedProducts;