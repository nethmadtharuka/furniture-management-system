import { motion } from 'framer-motion';

const DeliveryInfo = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
              alt="Delivered furniture"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Delivered furniture to 81 countries
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              We value your time and save you the hassle. A personal manager will take care of all the details — all you have to do is choose
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <StatCard number="274" label="Manufacturers" />
              <StatCard number="81" label="Countries" />
              <StatCard number="15+" label="Years Experience" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Stat Card Component
const StatCard = ({ number, label }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
  >
    <div className="text-3xl font-bold gradient-text mb-2">{number}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </motion.div>
);

export default DeliveryInfo;