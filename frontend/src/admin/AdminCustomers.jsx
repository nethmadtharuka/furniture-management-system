/**
 * ============================================================================
 * ADMIN CUSTOMERS MANAGEMENT
 * ============================================================================
 * 
 * View and manage customer accounts.
 * 
 * BACKEND CONNECTIONS:
 * - GET /api/customers - List all customers
 * - GET /api/customers/{id} - Get customer details
 * 
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiDownload, FiEye, FiX, FiUser, FiMail, FiPhone,
  FiMapPin, FiCalendar, FiShoppingBag, FiDollarSign, FiStar,
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Try to fetch from backend
        const response = await api.get('/customers');
        if (response.data.success) {
          setCustomers(response.data.data);
        }
      } catch (error) {
        // Use mock data if API not available
        const mockCustomers = [
          { id: 1, name: 'John Perera', email: 'john@email.com', phone: '0771234567', address: '123 Main St, Colombo 03', joinDate: '2024-06-15', totalOrders: 5, totalSpent: 450000, status: 'active' },
          { id: 2, name: 'Sarah Silva', email: 'sarah@email.com', phone: '0779876543', address: '45 Galle Road, Dehiwala', joinDate: '2024-08-20', totalOrders: 3, totalSpent: 280000, status: 'active' },
          { id: 3, name: 'Mike Fernando', email: 'mike@email.com', phone: '0765432109', address: '78 Kandy Road, Kadawatha', joinDate: '2024-10-05', totalOrders: 2, totalSpent: 320000, status: 'active' },
          { id: 4, name: 'Lisa Jayawardena', email: 'lisa@email.com', phone: '0712345678', address: '90 High Level Road, Nugegoda', joinDate: '2024-11-10', totalOrders: 4, totalSpent: 520000, status: 'active' },
          { id: 5, name: 'David Bandara', email: 'david@email.com', phone: '0778765432', address: '12 Temple Road, Mount Lavinia', joinDate: '2025-01-02', totalOrders: 1, totalSpent: 45000, status: 'active' },
        ];
        setCustomers(mockCustomers);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount) => new Intl.NumberFormat('en-LK', {
    style: 'currency', currency: 'LKR', minimumFractionDigits: 0,
  }).format(amount);

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your customer base</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <FiDownload className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <FiShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgOrderValue)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Order Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text" placeholder="Search customers..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <FiUser className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No customers found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                          {customer.name.charAt(0)}
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300">{customer.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{customer.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(customer.totalSpent)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 dark:text-gray-400">{customer.joinDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => { setSelectedCustomer(customer); setShowDetailModal(true); }}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedCustomer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customer Details</h2>
                  <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedCustomer.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">Customer since {selectedCustomer.joinDate}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FiMail className="w-5 h-5" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <FiPhone className="w-5 h-5" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                    <FiMapPin className="w-5 h-5 mt-0.5" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCustomer.totalOrders}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(selectedCustomer.totalSpent)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;