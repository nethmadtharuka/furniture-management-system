import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiAward,
  FiUsers,
  FiGlobe,
  FiTruck,
  FiShield,
  FiHeart,
  FiStar,
} from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Hero Section */}
      <AboutHero />
      
      {/* Company Stats */}
      <CompanyStats />
      
      {/* Timeline Milestones */}
      <Timeline />
      
      {/* Key Business Areas */}
      <BusinessAreas />
      
      {/* Our Values */}
      <OurValues />
      
      {/* Team Section */}
      <TeamSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

// ============================================
// HERO SECTION
// ============================================
const AboutHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20" />
      
      {/* Animated shapes */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-gold-400/10 to-amber-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-primary-400/10 to-purple-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            style={{ y, opacity }}
            className="relative z-10"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <span className="text-white font-bold text-3xl">S</span>
              </motion.div>
              <span className="text-4xl font-display font-bold tracking-tight">
                SUHADA FURNITURE  HORANA
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
            >
              About us and
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600">
                our company
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-xl"
            >
              We have come a long way from being a small yet highly ambitious company to 
              becoming  supplying premium furniture across Sri Lanka. 
              Our success has been achieved through the hard work of our team, a commitment 
              to quality and innovation, as well as fruitful partnerships that we have 
              cultivated throughout our journey.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl"
            >
              We adhere to principles of reliability, responsibility, and high service 
              standards, which have allowed us to earn the trust and respect of our clients.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-20 h-20 rounded-full border-2 border-gold-500 flex items-center justify-center hover:bg-gold-500 transition-all duration-300"
                >
                  <FiArrowRight className="w-8 h-8 text-gold-500 group-hover:text-white transition-colors" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Our Team"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">+43</p>
                    <p className="text-sm text-gray-500">Years Experience</p>
                  </div>
                </div>
              </motion.div>

              {/* Second Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/40?img=${i + 10}`}
                        alt="Team member"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium">50+ Team Members</p>
                </div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-0 right-0 flex items-center gap-4 text-gray-400"
            >
              <span className="text-sm tracking-widest">(SCROLL / DRAG)</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border border-gold-400/30 rounded-full flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPANY STATS
// ============================================
const CompanyStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { number: "43+", label: "Years Experience", icon: FiAward },
    { number: "1M+", label: "Happy Customers", icon: FiUsers },
    { number: "50+", label: "Team Members", icon: FiHeart },
    { number: "1M", label: "Products Delivered", icon: FiTruck },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-gold-500/30"
              >
                <stat.icon className="w-8 h-8 text-white" />
              </motion.div>
              <motion.p
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: "spring" }}
              >
                {stat.number}
              </motion.p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// TIMELINE SECTION
// ============================================
const Timeline = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const milestones = [
    {
      year: "1982",
      title: "The Beginning",
      description: "We started as a small furniture shop in Horana Area with a vision to provide quality furniture to every home.",
    },
    {
      year: "2002",
      title: "First Showroom",
      description: "Opened our first dedicated showroom near Horana, expanding our product range and reaching more customers.",
    },
    {
      year: "2007",
      title: " Started Free Delivery around Horana",
      description: "Launched our FREE delivery service around Horana, making premium furniture accessible across Area.",
    },
    {
      year: "2009",
      title: "Manufacturing Unit",
      description: "Established our own manufacturing unit to ensure quality control and customization options.",
    },
    {
      year: "2022",
      title: "Digital Transformation",
      description: "Starting of online business.",
    },
    {
      year: "2025",
      title: "1 OF Market leaders around Horana",
      description: "Became a leading furniture brand in Sri Lanka with over 1M happy customers.",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-100/50 to-transparent dark:from-gold-900/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            KEY COMPANY{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600">
              MILESTONES
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute inset-0 bg-gradient-to-b from-primary-500 to-purple-600 origin-top"
            />
          </div>

          {/* Milestones */}
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.year}
                milestone={milestone}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ milestone, index, isLeft }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`relative flex items-center ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-row`}
    >
      {/* Content */}
      <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'} pl-20 md:pl-0`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600"
          >
            {milestone.year}
          </motion.span>
          <h3 className="text-xl font-bold mt-2 mb-3">{milestone.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
        </motion.div>
      </div>

      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
        className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-4 border-gold-500 shadow-lg">
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gold-400/30"
          />
        </div>
      </motion.div>

      {/* Empty space for other side */}
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
};

// ============================================
// BUSINESS AREAS
// ============================================
const BusinessAreas = () => {
  const areas = [
    {
      title: "PREMIUM FURNITURE",
      subtitle: "SHOWROOM EXPERIENCE",
      description: "Visit our showroom to experience the quality and craftsmanship of our furniture firsthand. Our expert consultants will help you find the perfect pieces for your space.",
      link: "/products",
      linkText: "Visit Showroom",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    },
    {
      title: "CUSTOM FURNITURE",
      subtitle: "MADE FOR YOU",
      description: "We offer personalized furniture solutions tailored to your specific needs and preferences. From design to delivery, we ensure every piece reflects your unique style.",
      link: "/contact",
      linkText: "Start Custom Order",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            KEY AREAS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600">
              OF OUR BUSINESS
            </span>
          </h2>
        </motion.div>

        {/* Business Areas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold">
              {areas[0].title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600">
                {areas[0].subtitle}
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {areas[0].description}
            </p>
            <Link to={areas[0].link}>
              <motion.span
                whileHover={{ x: 10 }}
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
              >
                {areas[0].linkText}
                <FiArrowUpRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>

          {/* Center Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-4 shadow-2xl"
              style={{ perspective: '1000px' }}
            >
              {/* Browser Frame */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-inner">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white dark:bg-gray-700 rounded-full px-4 py-1 text-xs text-gray-400 text-center">
                      suhada.com/products
                    </div>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80"
                  alt="Product showcase"
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Floating Product Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -right-4 bottom-1/4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=150&q=80"
                  alt="Featured product"
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
                <p className="text-xs font-medium">Luxury Armchair</p>
                <p className="text-sm font-bold text-gold-600">Rs. 85,000</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold">
              {areas[1].title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600">
                {areas[1].subtitle}
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {areas[1].description}
            </p>
            <Link to={areas[1].link}>
              <motion.span
                whileHover={{ x: 10 }}
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
              >
                {areas[1].linkText}
                <FiArrowUpRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// OUR VALUES
// ============================================
const OurValues = () => {
  const values = [
    {
      icon: FiShield,
      title: "Quality Assurance",
      description: "Every piece undergoes rigorous quality checks to ensure durability and excellence.",
    },
    {
      icon: FiHeart,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to exceed expectations.",
    },
    {
      icon: FiStar,
      title: "Innovation",
      description: "We constantly evolve our designs and services to meet modern lifestyle needs.",
    },
    {
      icon: FiGlobe,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and sustainable material sourcing.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Our Core{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600">
              Values
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            These principles guide everything we do and help us deliver exceptional experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-gold-500/30"
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// TEAM SECTION
// ============================================
const TeamSection = () => {
  const team = [
    { name: "Suhada Perera", role: "Founder & CEO", image: "https://i.pravatar.cc/200?img=11" },
    { name: "Kavindi Silva", role: "Design Director", image: "https://i.pravatar.cc/200?img=5" },
    { name: "Nuwan Fernando", role: "Operations Head", image: "https://i.pravatar.cc/200?img=12" },
    { name: "Dilini Jayawardena", role: "Customer Relations", image: "https://i.pravatar.cc/200?img=9" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-amber-600">
              Team
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate professionals dedicated to making your furniture dreams come true
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={member.image}
                  alt={member.name}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className="text-gold-400">{member.role}</p>
                </div>
              </div>
              <div className="mt-4 text-center group-hover:opacity-0 transition-opacity">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA SECTION
// ============================================
const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=80"
          alt="Bedroom interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Are you ready to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-500">
                create
              </span>
              <br />
              your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-500">
                dream project
              </span>
              <br />
              interior?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              Start now or leave the request with information on your project. 
              Our team will get back to you within 24 hours.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold px-8 py-4 rounded-full shadow-xl transition-all duration-300"
                >
                  CREATE A PROJECT
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  SEND REQUEST
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex justify-center"
          >
            {/* Phone Frame */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Phone Body */}
              <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-700">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
                
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* App Header */}
                  <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <span className="font-bold">SUHADA</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full" />
                      <div className="w-6 h-6 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Home →</p>
                        <p className="font-bold">In progress</p>
                      </div>
                      <p className="text-sm">Total: <span className="font-bold">Rs. 245,000</span></p>
                    </div>
                    
                    {/* Product Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={`https://images.unsplash.com/photo-${1555041469 + i}-a586c61ea9bc?w=100&q=60`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://picsum.photos/100?random=${i}`;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Room Labels */}
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-xs font-medium">
                        Living room
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        Bedroom
                      </span>
                    </div>
                    
                    {/* Recent Items */}
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Product Item</p>
                            <p className="text-xs text-gray-500">Rs. 45,000</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 to-amber-500/20 blur-2xl rounded-[4rem] -z-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-10 left-1/4 w-20 h-20 border border-white/10 rounded-full"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 right-1/4 w-16 h-16 border border-white/10 rounded-full"
      />
    </section>
  );
};

export default About;