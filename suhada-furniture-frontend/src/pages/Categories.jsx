import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiCamera,
  FiArrowRight,
  FiChevronRight,
  FiGrid,
  FiList,
} from 'react-icons/fi';

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState(0);

  // Rotating placeholder suggestions
  const placeholders = [
    "Office chair with wheels",
    "Table for 8 people",
    "Minimalist wooden bench",
    "Grey leather armchair",
    "King-size bed with upholstered headboard",
    "Modern dining table",
  ];

  // Rotate placeholder every 3 seconds
  useState(() => {
    const interval = setInterval(() => {
      setSearchPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24">
      {/* Search Header */}
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={placeholders[searchPlaceholder]}
      />

      {/* Category Navigation Bar */}
      <CategoryNavBar />

      {/* Hero Title */}
      <HeroTitle />

      {/* Main Categories Grid */}
      <MainCategoriesGrid />

      {/* Popular Brands */}
      <PopularBrands />

      {/* Exclusive Collection */}
      <ExclusiveCollection />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Interior Designs */}
      <InteriorDesigns />
    </div>
  );
};

// ============================================
// SEARCH HEADER
// ============================================
const SearchHeader = ({ searchQuery, setSearchQuery, placeholder }) => {
  return (
    <div className="sticky top-20 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Catalog Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-full font-medium shadow-lg"
          >
            <FiGrid className="w-4 h-4" />
            <span>Catalog</span>
          </motion.button>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Photo Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-full hover:border-gold-500 transition-colors"
          >
            <FiCamera className="w-5 h-5" />
            <span className="hidden sm:inline">Photo Search</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CATEGORY NAV BAR
// ============================================
const CategoryNavBar = () => {
  const categories = [
    "Furniture Tour",
    "Sofas & armchairs",
    "Beds & mattresses",
    "Cabinets & storage",
    "Tables & chairs",
    "Lighting",
    "Bathroom products",
    "Children's room",
    "Business furniture",
    "Decor & accessories",
    "Outdoors",
  ];

  const scrollRef = useRef(null);

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                index === 0
                  ? 'bg-gold-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {index === 0 && <span className="mr-1">🏠</span>}
              {category}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ x: 5 }}
            className="p-2 text-gray-400 hover:text-gold-500 transition-colors"
          >
            <FiArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HERO TITLE
// ============================================
const HeroTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display text-center leading-tight">
        <span className="text-gray-900 dark:text-white">Furniture of premium class</span>
        <span className="text-gray-400 dark:text-gray-500"> — directly from the best suppliers</span>
      </h1>
    </motion.div>
  );
};

// ============================================
// MAIN CATEGORIES GRID
// ============================================
const MainCategoriesGrid = () => {
  const categories = [
    {
      id: 1,
      name: "Sofas & armchairs",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      colSpan: 2,
      rowSpan: 2,
    },
    {
      id: 2,
      name: "Beds & mattresses",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 3,
      name: "Cabinets & storage systems",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      id: 4,
      name: "Tables & chairs",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      id: 5,
      name: "Lighting",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      colSpan: 2,
      rowSpan: 2,
    },
    {
      id: 6,
      name: "Bathroom products",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 7,
      name: "Children's room",
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      id: 8,
      name: "Decor & accessories",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      colSpan: 1,
      rowSpan: 1,
    },
    {
      id: 9,
      name: "Outdoors",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 10,
      name: "Business furniture",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      colSpan: 2,
      rowSpan: 2,
    },
    {
      id: 11,
      name: "Finishing & building materials",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 12,
      name: "Sports equipment",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      colSpan: 2,
      rowSpan: 1,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </section>
  );
};

const CategoryCard = ({ category, index }) => {
  // Dynamic classes for grid span
  const colSpanClass = category.colSpan === 2 ? 'md:col-span-2' : 'col-span-1';
  const rowSpanClass = category.rowSpan === 2 ? 'md:row-span-2' : 'row-span-1';
  
  // Height based on row span
  const heightClass = category.rowSpan === 2 ? 'h-[300px] md:h-[500px]' : 'h-[200px] md:h-[240px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.03 }}
      className={`${colSpanClass} ${rowSpanClass} ${heightClass} group`}
    >
      <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="block h-full">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="relative h-full bg-gray-100 dark:bg-gray-800 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
        >
          {/* Product Image - Centered */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={category.image}
              alt={category.name}
              className="max-w-full max-h-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Category Name - Bottom Left */}
          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 z-10">
            <h3 className="text-base md:text-lg lg:text-xl font-medium text-gray-800 dark:text-gray-200">
              {category.name}
            </h3>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl md:rounded-3xl" />

          {/* Hover Arrow - Top Right */}
          <motion.div
            className="absolute top-4 md:top-5 right-4 md:right-5 w-9 h-9 md:w-10 md:h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
          >
            <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-white" />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ============================================
// POPULAR BRANDS
// ============================================
const PopularBrands = () => {
  const brands = [
    { name: "Damro", products: 387 },
    { name: "Arpico", products: 171 },
    { name: "Singer", products: 123 },
    { name: "Abans", products: 147 },
    { name: "Softlogic", products: 106 },
    { name: "DSI", products: 117 },
    { name: "Richlife", products: 378 },
    { name: "Urban", products: 55 },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
        >
          Popular brands
        </motion.h2>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              className="text-center cursor-pointer group"
            >
              <Link to={`/products?brand=${brand.name}`}>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-400 group-hover:text-gold-500 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {brand.products} products
                </p>
              </Link>
            </motion.div>
          ))}
          
          {/* Arrow for more */}
          <motion.div
            whileHover={{ x: 10 }}
            className="text-gray-400 cursor-pointer"
          >
            <FiArrowRight className="w-8 h-8" />
          </motion.div>
        </div>

        <div className="text-center">
          <Link to="/brands">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-full font-medium hover:border-gold-500 hover:text-gold-500 transition-colors"
            >
              See all brands
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ============================================
// EXCLUSIVE COLLECTION
// ============================================
const ExclusiveCollection = () => {
  const collections = [
    {
      id: 1,
      name: "Kitchens of premium class",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    },
    {
      id: 2,
      name: "Wardrobes",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
        >
          Exclusive from Suhada
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/products?collection=${encodeURIComponent(collection.name)}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
                >
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-gold-400 transition-colors">
                      {collection.name}
                    </h3>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <FiArrowRight className="w-6 h-6 text-white" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// NEW ARRIVALS
// ============================================
const NewArrivals = () => {
  const products = [
    {
      id: 1,
      name: "Chair Nuxia",
      price: 45000,
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",
      isHot: true,
    },
    {
      id: 2,
      name: "Bedside Table Nirelda",
      price: 28000,
      image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=400&q=80",
      isHot: false,
    },
    {
      id: 3,
      name: "Console Larmina",
      price: 65000,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
      isHot: false,
    },
    {
      id: 4,
      name: "Sideboard Lucernaio",
      price: 95000,
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80",
      isHot: false,
    },
    {
      id: 5,
      name: "Dining Chair Braidi",
      price: 35000,
      pricePrefix: "from",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
      isHot: false,
    },
  ];

  const scrollRef = useRef(null);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold mb-12"
        >
          New Arrivals
        </motion.h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Scroll Arrow */}
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <FiArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-64 group"
    >
      <Link to={`/products/${product.id}`}>
        <motion.div
          whileHover={{ y: -10 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer"
        >
          {/* Hot Badge */}
          {product.isHot && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 left-4 z-10 px-3 py-1 bg-gold-500 text-white text-xs font-bold rounded-full"
            >
              Hot
            </motion.div>
          )}

          {/* Image */}
          <div className="relative h-64 bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors">
              {product.name}
            </h3>
            <p className="text-lg font-bold mt-1">
              {product.pricePrefix && (
                <span className="text-sm font-normal text-gray-500 mr-1">
                  {product.pricePrefix}
                </span>
              )}
              Rs. {product.price.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ============================================
// INTERIOR DESIGNS
// ============================================
const InteriorDesigns = () => {
  const designs = [
    {
      id: 1,
      name: "Modern bedroom no. 6",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    },
    {
      id: 2,
      name: "Modern living room no. 6",
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&q=80",
    },
    {
      id: 3,
      name: "Modern living room no. 3",
      image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80",
    },
    {
      id: 4,
      name: "Dining room no. 2",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",
    },
  ];

  const scrollRef = useRef(null);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
        >
          Choose your favorite interior design
        </motion.h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {designs.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 group"
              >
                <Link to={`/interiors/${design.id}`}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="relative rounded-3xl overflow-hidden cursor-pointer"
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={design.image}
                      alt={design.name}
                      className="w-full h-72 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <h3 className="mt-4 font-medium text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors">
                    {design.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll Arrow */}
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <FiArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Categories;