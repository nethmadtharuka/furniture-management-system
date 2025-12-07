import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Sofas & Armchairs',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      link: '/products?category=Living Room',
    },
    {
      id: 2,
      name: 'Beds & Mattresses',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      link: '/products?category=Bedroom',
    },
    {
      id: 3,
      name: 'Cabinets & Storage',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      link: '/products?category=Storage',
    },
    {
      id: 4,
      name: 'Tables & Chairs',
      image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800',
      link: '/products?category=Dining',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Equip your home, office or restaurant
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Category Card Component
const CategoryCard = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={category.link}>
        <motion.div
          whileHover={{ y: -10 }}
          className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
        >
          {/* Image */}
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Category Name */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-white text-xl font-bold mb-2 group-hover:text-gold-400 transition-colors">
              {category.name}
            </h3>
            <motion.div
              initial={{ width: 0 }}
              whileHover={{ width: '50%' }}
              className="h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default Categories;