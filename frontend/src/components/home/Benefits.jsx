import { motion } from 'framer-motion';

const Benefits = () => {
  const benefits = [
    {
      id: 1,
      title: 'Up to 90% savings',
      description: 'Competition among manufacturers ensures premium quality at affordable prices',
      icon: '💰',
      gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    },
    {
      id: 2,
      title: 'Freedom of choice',
      description: "We'll help you buy quality furniture, lighting, and sanitation from China at low prices",
      icon: '🎨',
      gradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
    },
    {
      id: 3,
      title: 'Quality under control',
      description: 'Our specialists thoroughly check the products for defects. We take full responsibility for the external appearance',
      icon: '✓',
      gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    },
    {
      id: 4,
      title: 'Customization of products',
      description: "Can't find the right color, size or material? Give any model your personal touch",
      icon: '🛠️',
      gradient: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      large: true,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Stereotype <span className="italic">"Made in China"</span> is no longer relevant
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Or why ordering furniture from China is the right decision
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefit Card Component
const BenefitCard = ({ benefit, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`${benefit.large ? 'md:col-span-1 md:row-span-2' : ''}`}
    >
      <motion.div
        whileHover={{ y: -5 }}
        className={`h-full rounded-2xl p-8 ${benefit.gradient} ${
          benefit.large ? 'relative overflow-hidden' : ''
        }`}
      >
        {benefit.large && (
          <>
            <img
              src={benefit.image}
              alt={benefit.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/60" />
          </>
        )}

        <div className={`relative ${benefit.large ? 'text-white' : ''}`}>
          {/* Icon */}
          <div className="text-5xl mb-4">{benefit.icon}</div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
          
          {/* Description */}
          <p className={`text-lg ${benefit.large ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
            {benefit.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Benefits;