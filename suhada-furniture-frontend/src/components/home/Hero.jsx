import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPhone, FiX, FiSend, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookMessenger, FaRobot } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showContactButtons, setShowContactButtons] = useState(false);

  // Show contact buttons after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowContactButtons(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/1205.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/65 z-10" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 mb-6 leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          >
            Transform Your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-400 drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
              Living Space
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          >
            Discover premium furniture &
            Create your dream home with our curated collection of luxury pieces.
          </motion.p>

          {/* Quick Contact Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            {/* WhatsApp Button */}
            <ContactButton
              href="https://wa.me/94774842458?text=Hi! I'm interested in your furniture collection."
              icon={FaWhatsapp}
              label="WhatsApp"
              color="from-green-500 to-green-600"
              hoverColor="hover:from-green-600 hover:to-green-700"
              shadowColor="shadow-green-500/30"
              delay={0.6}
            />

            {/* Call Button */}
            <ContactButton
              href="tel:+94777185809"
              icon={FiPhone}
              label="Call Now"
              color="from-blue-500 to-blue-600"
              hoverColor="hover:from-blue-600 hover:to-blue-700"
              shadowColor="shadow-blue-500/30"
              delay={0.7}
            />

            {/* Facebook Messenger Button */}
            <ContactButton
              href="https://m.me/SuhadaFurniture"
              icon={FaFacebookMessenger}
              label="Messenger"
              color="from-purple-500 to-indigo-600"
              hoverColor="hover:from-purple-600 hover:to-indigo-700"
              shadowColor="shadow-purple-500/30"
              delay={0.8}
            />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center mt-6 mb-16"
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold text-xl px-12 py-6 rounded-full shadow-2xl transition-all duration-300 flex items-center space-x-4"
              >
                <span>Explore Collection</span>
                <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Floating Contact Buttons (Right Side) */}
      <AnimatePresence>
        {showContactButtons && (
          <FloatingContactButtons />
        )}
      </AnimatePresence>

      {/* 3D AI Chatbot */}
      <AIChatbot isOpen={chatOpen} setIsOpen={setChatOpen} />
    </div>
  );
};

// Contact Button Component
const ContactButton = ({ href, icon: Icon, label, color, hoverColor, shadowColor, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.95 }}
    className={`group relative overflow-hidden bg-gradient-to-r ${color} ${hoverColor} text-white font-semibold px-6 py-3 rounded-full shadow-xl ${shadowColor} hover:shadow-2xl transition-all duration-300 flex items-center gap-3`}
  >
    {/* Shine effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
      initial={{ x: '-200%' }}
      whileHover={{ x: '200%' }}
      transition={{ duration: 0.8 }}
    />
    <Icon className="w-5 h-5 relative z-10" />
    <span className="relative z-10">{label}</span>
  </motion.a>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="glass bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center group cursor-pointer"
  >
    <motion.div 
      className="text-4xl mb-3"
      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </motion.div>
);

// Floating Contact Buttons (Right Side)
const FloatingContactButtons = () => {
  const [expanded, setExpanded] = useState(false);

  const buttons = [
    {
      icon: FaWhatsapp,
      href: 'https://wa.me/94774842458',
      color: 'bg-green-500 hover:bg-green-600',
      label: 'WhatsApp',
    },
    {
      icon: FiPhone,
      href: 'tel:+94777185809',
      color: 'bg-blue-500 hover:bg-blue-600',
      label: 'Call',
    },
    {
      icon: FaFacebookMessenger,
      href: 'https://m.me/SuhadaFurniture',
      color: 'bg-purple-500 hover:bg-purple-600',
      label: 'Messenger',
    },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      <AnimatePresence>
        {expanded && buttons.map((btn, index) => (
          <motion.a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 50, scale: 0 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.15, x: -10 }}
            className={`${btn.color} p-4 rounded-full shadow-xl text-white transition-all duration-300 group relative`}
          >
            <btn.icon className="w-6 h-6" />
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {btn.label}
            </span>
            {/* Pulse effect */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current" />
          </motion.a>
        ))}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setExpanded(!expanded)}
        className={`p-4 rounded-full shadow-2xl text-white transition-all duration-500 ${
          expanded 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700'
        }`}
      >
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {expanded ? <FiX className="w-6 h-6" /> : <FiMessageCircle className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
};

// 3D AI Chatbot Component
const AIChatbot = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: "Hello! 👋 I'm Suhada AI Assistant. How can I help you find the perfect furniture today?",
      time: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    "Show me sofas",
    "What's on sale?",
    "Delivery info",
    "Talk to human"
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      time: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = {
        "show me sofas": "We have a stunning collection of sofas! 🛋️ Our best sellers include L-shaped sofas starting from Rs. 85,000. Would you like me to show you our catalog or connect you with a sales representative?",
        "what's on sale?": "Great timing! 🎉 We have up to 30% off on selected bedroom sets and dining tables this month. I can share our latest offers via WhatsApp if you'd like!",
        "delivery info": "We offer FREE island-wide delivery! 🚚 Colombo & suburbs: 2-3 days, Other areas: 5-7 days. We also provide installation service for all furniture!",
        "talk to human": "I'll connect you with our team right away! 📞 You can reach us at:\n• WhatsApp: 077 484 2458\n• Call: 077 718 5809\n• Visit our showroom in Colombo"
      };

      const lowerText = text.toLowerCase();
      let response = botResponses[lowerText] || 
        "Thanks for your interest! 😊 I can help you with:\n• Browsing our furniture collection\n• Pricing & discounts\n• Delivery information\n• Connecting with our team\n\nWhat would you like to know?";

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response,
        time: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* 3D Floating Bot Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl"
          />
          
          {/* 3D Bot Container */}
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 15 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            {/* Inner glow */}
            <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
            
            {/* 3D Robot Face */}
            <motion.div
              animate={isOpen ? {} : {
                y: [0, -3, 0],
                rotateZ: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              {isOpen ? (
                <FiX className="w-8 h-8 text-white" />
              ) : (
                <div className="relative">
                  {/* Robot Head */}
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
                    {/* Eyes */}
                    <div className="flex gap-2">
                      <motion.div
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="w-2 h-2 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"
                      />
                      <motion.div
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="w-2 h-2 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                  {/* Antenna */}
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-white rounded-full"
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
            />
          </motion.div>

          {/* Notification badge */}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                1
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
          className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          <span className="font-medium text-gray-800 dark:text-white">Chat with AI 🤖</span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 rotate-45" />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            {/* Chat Container with 3D effect */}
            <div 
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
              style={{ 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <div className="relative p-4 flex items-center gap-4">
                  {/* 3D Bot Avatar */}
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <FaRobot className="w-7 h-7 text-purple-500" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">Suhada AI</h3>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      <span className="text-white/80 text-sm">Online • Ready to help</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <FaRobot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-md shadow-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FaRobot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md shadow-md flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={reply}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(reply)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputValue);
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="p-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FiSend className="w-5 h-5" />
                  </motion.button>
                </form>

                {/* Powered by */}
                <p className="text-center text-xs text-gray-400 mt-2">
                  Powered by Suhada AI • 24/7 Support
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Hero;