import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiFacebook, FiInstagram, FiTwitter, FiLinkedin, 
  FiMail, FiPhone, FiMapPin, FiSend 
} from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold">Suhada</h3>
                <p className="text-xs text-gray-400">Premium Furniture</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Transform your living space with our curated collection of premium furniture. 
              Quality craftsmanship meets modern design.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<FiFacebook />} />
              <SocialIcon icon={<FiInstagram />} />
              <SocialIcon icon={<FiTwitter />} />
              <SocialIcon icon={<FiLinkedin />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/products">Products</FooterLink>
              <FooterLink to="/categories">Categories</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/shipping">Shipping Info</FooterLink>
              <FooterLink to="/returns">Returns & Refunds</FooterLink>
              <FooterLink to="/warranty">Warranty</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <ContactItem 
                icon={<FiMapPin />} 
                text="No 83,Panadura Rd,Horana / New Suhada Furniture,Elimba Junction,Munagama,Horana"

              />
              <ContactItem 
                icon={<FiPhone />} 
                text="+94 774842458 /+94 771856722 /+94 77185809"
              />
              <ContactItem 
                icon={<FiMail />} 
                text="suhadafurniturelk@gmail.com"
              />
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-semibold mb-3">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary-600"
                />
                <button className="bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 rounded-r-lg hover:from-primary-600 hover:to-primary-800 transition-all">
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Suhada Furniture. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social Icon Component
const SocialIcon = ({ icon }) => (
  <motion.a
    whileHover={{ scale: 1.2, y: -2 }}
    href="#"
    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-700 transition-all"
  >
    {icon}
  </motion.a>
);

// Footer Link Component
const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to}
      className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
    >
      {children}
    </Link>
  </li>
);

// Contact Item Component
const ContactItem = ({ icon, text }) => (
  <div className="flex items-start space-x-3">
    <div className="text-primary-400 mt-1">{icon}</div>
    <p className="text-gray-400">{text}</p>
  </div>
);

export default Footer;