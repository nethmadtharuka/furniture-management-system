import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageCircle,
  FiUser,
  FiEdit3,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';
import {
  FaFacebookF,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeMethod, setActiveMethod] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent successfully! We will get back to you soon.');

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  // Contact methods data
  const contactMethods = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: FaWhatsapp,
      value: '0774842458  & 0771856722',
      description: 'Chat with us instantly',
      color: 'from-green-400 to-green-600',
      hoverColor: 'hover:shadow-green-500/50',
      link: 'https://wa.me/94774842458',
      secondaryLink: 'https://wa.me/94771856722',
      bgPattern: 'radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
    },
    {
      id: 'phone',
      name: 'Call Us',
      icon: FiPhone,
      value: '077 718 5809',
      extraNumbers: ['077 484 2458', '077 185 6722'],
      description: '9AM-10PM',
      color: 'from-blue-400 to-blue-600',
      hoverColor: 'hover:shadow-blue-500/50',
      link: 'tel:+94777185809',
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
    },
    {
      id: 'email',
      name: 'Email Us',
      icon: FiMail,
      value: 'suhadafurniturelk@gmail.com',
      description: 'We reply within 24 hours',
      color: 'from-purple-400 to-purple-600',
      hoverColor: 'hover:shadow-purple-500/50',
      link: 'mailto:suhadafurniturelk@gmail.com',
      bgPattern: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebookF,
      value: 'Suhada Furniture-Horana',
      description: 'Follow us for updates',
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'hover:shadow-indigo-500/50',
      link: 'https://www.facebook.com/share/18R8Jf3spu/?mibextid=wwXIfr',
      bgPattern: 'radial-gradient(circle at 30% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
    },
  ];

  // Social media links
  const socialLinks = [
    { icon: FaFacebookF, link: 'https://facebook.com/SuhadaFurniture', color: '#1877F2', name: 'Facebook' },
    { icon: FaInstagram, link: 'https://instagram.com/SuhadaFurniture', color: '#E4405F', name: 'Instagram' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-gold-500/10 to-orange-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.3), transparent, rgba(217, 119, 6, 0.3), transparent)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full border border-primary-500/20 mb-6"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              We are here to help
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="block text-gray-900 dark:text-white">Get in</span>
            <span className="block gradient-text">Touch</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have questions about our furniture? Want to discuss a custom order? 
            We would love to hear from you. Reach out through any of these channels.
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={method.id}
              method={method}
              index={index}
              isActive={activeMethod === method.id}
              onHover={() => setActiveMethod(method.id)}
              onLeave={() => setActiveMethod(null)}
            />
          ))}
        </motion.div>

        {/* Main Content - Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Decorative element */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-2xl blur-xl" />
              
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <FiMessageCircle className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold">Send us a Message</h2>
                    <p className="text-gray-600 dark:text-gray-400">Fill out the form below</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6"
                      >
                        <FiCheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        We will get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          icon={FiUser}
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <FormInput
                          icon={FiMail}
                          name="email"
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Phone & Subject Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          icon={FiPhone}
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <FormInput
                          icon={FiEdit3}
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Message */}
                      <div className="relative group">
                        <textarea
                          name="message"
                          rows={5}
                          placeholder="Your Message..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all resize-none"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none" />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                      >
                        {/* Animated background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary-600"
                          initial={{ x: '100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <span className="relative z-10">
                          {loading ? 'Sending...' : 'Send Message'}
                        </span>
                        
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="relative z-10"
                          >
                            <FiSend className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            className="relative z-10"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <FiArrowRight className="w-5 h-5" />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Location Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Visit Our Showrooms</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      NO 83,Panadura Road,Horana,<br />
                      New Suhada Furniture,Elimba Junction,Munagama,Horana,<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>
                
                {/* Map Placeholder with animation */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                    alt="Map"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <FiMapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0.5 h-4 bg-red-500" />
                  </motion.div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <button className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-2 px-4 rounded-lg font-medium text-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      View on Google Maps
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-orange-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-orange-600 rounded-xl flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Working Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">We are open for you</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { day: 'Monday - Friday', time: '9:00 AM - 9:00 PM', isOpen: true },
                    { day: 'Saturday', time: '10:00 AM - 9:00 PM', isOpen: true },
                    { day: 'Sunday', time: '9:00 AM - 9:00 PM', isOpen: false },
                  ].map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                    >
                      <span className="font-medium">{schedule.day}</span>
                      <span className={`flex items-center gap-2 ${
                        schedule.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          schedule.isOpen ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {schedule.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50">
                <h3 className="text-xl font-bold mb-6">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all"
                      style={{ backgroundColor: social.color }}
                    >
                      <social.icon className="w-6 h-6" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: 'Do you offer delivery island-wide?',
                answer: 'Yes! We deliver to all areas in Sri Lanka. Delivery charges may vary based on location.',
              },
              {
                question: 'Can I customize furniture?',
                answer: 'Absolutely! We offer customization options for most of our furniture pieces. Contact us to discuss your requirements.',
              },
              {
                question: 'What is your warranty policy?',
                answer: 'We provide a 2-year warranty on all furniture against manufacturing defects.',
              },
              {
                question: 'Do you have installment options?',
                answer: 'Yes, we partner with major banks to offer 0% installment plans up to 12 months.',
              },
            ].map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Contact Method Card Component
const ContactMethodCard = ({ method, index, isActive, onHover, onLeave }) => {
  const Icon = method.icon;

  return (
    <motion.a
      href={method.link}
      target={method.link.startsWith('http') ? '_blank' : '_self'}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl ${method.hoverColor} hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-gray-100 dark:border-gray-700`}
      style={{ background: method.bgPattern }}
    >
      {/* Animated gradient border on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* Icon Container */}
      <motion.div
        animate={isActive ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {method.name}
      </h3>
      <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
        {method.value}
      </p>
      {/* Extra phone numbers */}
      {method.extraNumbers && (
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {method.extraNumbers.map((num, i) => (
            <span key={i}>
              {num}{i < method.extraNumbers.length - 1 && ' / '}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {method.description}
      </p>

      {/* Arrow indicator */}
      <motion.div
        className="absolute bottom-6 right-6"
        animate={isActive ? { x: [0, 5, 0] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
      </motion.div>

      {/* Floating particles on hover */}
      {isActive && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (i - 1) * 30],
                y: [0, -50],
              }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className={`absolute bottom-10 left-1/2 w-2 h-2 rounded-full bg-gradient-to-br ${method.color}`}
            />
          ))}
        </>
      )}
    </motion.a>
  );
};

// Form Input Component
const FormInput = ({ icon: Icon, name, type = 'text', placeholder, value, onChange, required }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all"
      />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none" />
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-bold pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg
            className="w-5 h-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Contact;