/**
 * ============================================================================
 * ADMIN ORDERS MANAGEMENT
 * ============================================================================
 * 
 * Manage customer orders - view, update status, track deliveries.
 * 
 * BACKEND CONNECTIONS:
 * - GET /api/orders - List all orders
 * - GET /api/orders/{id} - Get order details
 * - PUT /api/orders/{id}/status - Update order status
 * 
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiFilter, FiEye, FiDownload, FiChevronLeft, FiChevronRight,
  FiX, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle,
  FiRefreshCw, FiPhone, FiMail, FiMapPin, FiCalendar, FiDollarSign,
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

// API Instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: FiClock },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: FiRefreshCw },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: FiTruck },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: FiCheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: FiXCircle },
  ];

  // Mock orders data (replace with actual API call when backend is ready)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockOrders = [
          {
            id: 'ORD-001', customer: { name: 'John Perera', email: 'john@email.com', phone: '0771234567' },
            items: [{ name: 'Luxury Leather Sofa', quantity: 1, price: 125000, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100' }],
            total: 125000, status: 'delivered', date: '2025-01-25', address: '123 Main St, Colombo 03',
            paymentMethod: 'Cash on Delivery', notes: 'Please call before delivery'
          },
          {
            id: 'ORD-002', customer: { name: 'Sarah Silva', email: 'sarah@email.com', phone: '0779876543' },
            items: [
              { name: 'Modern Office Chair', quantity: 2, price: 35000, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=100' },
              { name: 'Office Desk', quantity: 1, price: 55000, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=100' }
            ],
            total: 125000, status: 'processing', date: '2025-01-25', address: '45 Galle Road, Dehiwala',
            paymentMethod: 'Card Payment', notes: ''
          },
          {
            id: 'ORD-003', customer: { name: 'Mike Fernando', email: 'mike@email.com', phone: '0765432109' },
            items: [{ name: 'King Size Bed Frame', quantity: 1, price: 245000, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=100' }],
            total: 245000, status: 'pending', date: '2025-01-24', address: '78 Kandy Road, Kadawatha',
            paymentMethod: 'Bank Transfer', notes: 'Weekend delivery preferred'
          },
          {
            id: 'ORD-004', customer: { name: 'Lisa Jayawardena', email: 'lisa@email.com', phone: '0712345678' },
            items: [{ name: 'Dining Table Set', quantity: 1, price: 185000, image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=100' }],
            total: 185000, status: 'shipped', date: '2025-01-24', address: '90 High Level Road, Nugegoda',
            paymentMethod: 'Cash on Delivery', notes: ''
          },
          {
            id: 'ORD-005', customer: { name: 'David Bandara', email: 'david@email.com', phone: '0778765432' },
            items: [{ name: 'TV Stand', quantity: 1, price: 45000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100' }],
            total: 45000, status: 'cancelled', date: '2025-01-23', address: '12 Temple Road, Mount Lavinia',
            paymentMethod: 'Card Payment', notes: 'Customer requested cancellation'
          },
        ];
        
        let filtered = mockOrders;
        if (searchQuery) {
          filtered = filtered.filter(o => 
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (statusFilter) {
          filtered = filtered.filter(o => o.status === statusFilter);
        }
        setOrders(filtered);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [searchQuery, statusFilter]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-LK', {
    style: 'currency', currency: 'LKR', minimumFractionDigits: 0,
  }).format(amount);

  const getStatusConfig = (status) => statuses.find(s => s.value === status) || statuses[0];

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      // Mock update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer orders and deliveries</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <FiDownload className="w-4 h-4" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statuses.map(status => {
          const count = orders.filter(o => o.status === status.value).length;
          const Icon = status.icon;
          return (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.02 }}
              onClick={() => setStatusFilter(statusFilter === status.value ? '' : status.value)}
              className={`p-4 rounded-xl text-left transition-all ${
                statusFilter === status.value 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className={`inline-flex p-2 rounded-lg ${status.color} mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{status.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text" placeholder="Search by order ID or customer..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300"
        >
          <option value="">All Status</option>
          {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <FiPackage className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 dark:text-gray-300">{order.items.length} item(s)</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-500 dark:text-gray-400">{order.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order {selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.date}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">{selectedOrder.customer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <FiMail className="w-4 h-4" />
                        <span>{selectedOrder.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <FiPhone className="w-4 h-4" />
                        <span>{selectedOrder.customer.phone}</span>
                      </div>
                      <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <FiMapPin className="w-4 h-4 mt-1" />
                        <span>{selectedOrder.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Status</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Status</p>
                        {(() => {
                          const statusConfig = getStatusConfig(selectedOrder.status);
                          const StatusIcon = statusConfig.icon;
                          return (
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusConfig.label}
                            </span>
                          );
                        })()}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {statuses.filter(s => s.value !== selectedOrder.status).map(status => (
                            <button
                              key={status.value}
                              onClick={() => handleStatusUpdate(selectedOrder.id, status.value)}
                              disabled={updatingStatus}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-105 disabled:opacity-50 ${status.color} border-current/20`}
                            >
                              <status.icon className="w-3.5 h-3.5" />
                              {status.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="mt-6 p-4 bg-primary/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Order Total</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-4">
                <button onClick={() => setShowDetailModal(false)} className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  Close
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                  <FiDownload className="w-4 h-4" />
                  Download Invoice
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;