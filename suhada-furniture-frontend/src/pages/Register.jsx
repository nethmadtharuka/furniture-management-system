import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiCheck,
  FiShield
} from 'react-icons/fi';
import { authService } from '../services/auth';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER', // Add role field
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password Strength
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || null,
        password: formData.password,
        role: formData.role, // Use selected role
      };

      const response = await authService.register(registerData);

      if (response.success) {
        toast.success('Account created successfully!');

        // Auto-login after registration
        const loginResponse = await authService.login(
          formData.email,
          formData.password
        );

        if (loginResponse.success) {
          const { token, userId, email, fullName, role } = loginResponse.data;
          login({ userId, email, fullName, role }, token);

          toast.success(`Welcome, ${fullName}!`);
          
          // Redirect based on role
          if (role === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error toast already shown by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-2xl">S</span>
              </motion.div>
              <div className="text-left">
                <h1 className="text-2xl font-display font-bold gradient-text">Suhada</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium Furniture</p>
              </div>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join us and start shopping premium furniture
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0771234567"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* PASSWORD SECTION */}
            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i < passwordStrength
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    {passwordStrength <= 2 && 'Weak password'}
                    {passwordStrength === 3 && 'Medium password'}
                    {passwordStrength === 4 && 'Strong password'}
                    {passwordStrength === 5 && 'Very strong password'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                    <FiCheck className="text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* ✨ ROLE SELECTOR - NEW! */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FiShield className="text-blue-600 dark:text-blue-400" />
                  <label className="block text-sm font-medium">
                    Account Type
                  </label>
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 outline-none text-sm font-medium"
                >
                  <option value="CUSTOMER">👤 Customer</option>
                  <option value="STAFF">👔 Staff</option>
                  <option value="ADMIN">👑 Admin</option>
                </select>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {formData.role === 'ADMIN' && '👑 Full system access - manage everything'}
                {formData.role === 'STAFF' && '👔 Manage products and orders'}
                {formData.role === 'CUSTOMER' && '👤 Browse and purchase furniture'}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;