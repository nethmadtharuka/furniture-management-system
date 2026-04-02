import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Furniture Tours',
      description: 'Visit our showroom and experience furniture in person with guided tours',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
    },
    {
      id: 2,
      title: 'Ordering Furniture Online',
      description: 'Browse our complete catalog and order from the comfort of your home',
      image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
    },
    {
      id: 3,
      title: 'Business Furniture',
      description: 'Complete office solutions for corporate clients and businesses',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    },
    {
      id: 4,
      title: 'Kitchens',
      description: 'Custom kitchen solutions designed to fit your space perfectly',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    },
    {
      id: 5,
      title: 'Wardrobes',
      description: 'Elegant wardrobe systems with smart storage solutions',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
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
            Suhada — not just about online shopping
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Service Card Component
const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={index === 0 ? 'md:col-span-2' : ''}
    >
      <motion.div
        whileHover={{ y: -10 }}
        className="relative overflow-hidden rounded-2xl aspect-video cursor-pointer group"
      >
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h3 className="text-white text-3xl font-bold mb-3 group-hover:text-gold-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-200 text-lg">
            {service.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Services;