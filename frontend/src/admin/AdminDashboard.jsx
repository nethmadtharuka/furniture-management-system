/**
 * ============================================================================
 * ADMIN DASHBOARD (FIXED - No Chart.js dependency)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiDollarSign, FiShoppingCart, FiUsers, FiPackage,
  FiTrendingUp, FiTrendingDown, FiArrowRight, FiEye, FiEdit,
  FiAlertTriangle, FiCheckCircle, FiClock, FiXCircle, FiPlus,
  FiDownload, FiRefreshCw,
} from 'react-icons/fi';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 2500000,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 245,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
    customersGrowth: 15.3,
    productsGrowth: -2.1,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch products
        try {
          const productsRes = await api.get('/products');
          if (productsRes.data.success) {
            const products = productsRes.data.data;
            setStats(prev => ({ ...prev, totalProducts: products.length }));
            const lowStock = products.filter(p => p.stockQuantity <= 10 && p.stockQuantity > 0);
            setLowStockProducts(lowStock.slice(0, 5));
          }
        } catch (e) {
          console.log('Products API not available');
        }

        // Mock recent orders
        setRecentOrders([
          { id: 'ORD-001', customer: 'John Perera', total: 125000, status: 'completed', date: '2025-01-25' },
          { id: 'ORD-002', customer: 'Sarah Silva', total: 89000, status: 'processing', date: '2025-01-25' },
          { id: 'ORD-003', customer: 'Mike Fernando', total: 245000, status: 'pending', date: '2025-01-24' },
          { id: 'ORD-004', customer: 'Lisa Jayawardena', total: 56000, status: 'shipped', date: '2025-01-24' },
          { id: 'ORD-005', customer: 'David Bandara', total: 178000, status: 'completed', date: '2025-01-23' },
        ]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-LK', {
    style: 'currency', currency: 'LKR', minimumFractionDigits: 0,
  }).format(amount);

  const statsCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), change: stats.revenueGrowth, icon: FiDollarSign, color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-500/10', textColor: 'text-green-500' },
    { title: 'Total Orders', value: stats.totalOrders, change: stats.ordersGrowth, icon: FiShoppingCart, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10', textColor: 'text-blue-500' },
    { title: 'Total Customers', value: stats.totalCustomers, change: stats.customersGrowth, icon: FiUsers, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-500/10', textColor: 'text-purple-500' },
    { title: 'Total Products', value: stats.totalProducts, change: stats.productsGrowth, icon: FiPackage, color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-500/10', textColor: 'text-orange-500' },
  ];

  // Simple bar chart data
  const chartData = [
    { day: 'Mon', value: 32, revenue: 320000 },
    { day: 'Tue', value: 45, revenue: 450000 },
    { day: 'Wed', value: 28, revenue: 280000 },
    { day: 'Thu', value: 52, revenue: 520000 },
    { day: 'Fri', value: 38, revenue: 380000 },
    { day: 'Sat', value: 62, revenue: 620000 },
    { day: 'Sun', value: 48, revenue: 480000 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  const getStatusBadge = (status) => {
    const config = {
      completed: { icon: FiCheckCircle, color: 'text-green-500 bg-green-500/10', label: 'Completed' },
      processing: { icon: FiRefreshCw, color: 'text-blue-500 bg-blue-500/10', label: 'Processing' },
      pending: { icon: FiClock, color: 'text-yellow-500 bg-yellow-500/10', label: 'Pending' },
      shipped: { icon: FiPackage, color: 'text-purple-500 bg-purple-500/10', label: 'Shipped' },
      cancelled: { icon: FiXCircle, color: 'text-red-500 bg-red-500/10', label: 'Cancelled' },
    }[status] || { icon: FiClock, color: 'text-gray-500 bg-gray-500/10', label: status };
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <FiDownload className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <motion.div
              key={stat.title}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Simple CSS Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Weekly revenue statistics</p>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 pt-8">
            {chartData.map((item, index) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.value / maxValue) * 180}px` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative group cursor-pointer"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(item.revenue)}
                    </div>
                  </motion.div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Status - Simple Donut */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Orders Status</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current month breakdown</p>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Completed', value: 45, color: 'bg-green-500' },
              { label: 'Processing', value: 25, color: 'bg-blue-500' },
              { label: 'Pending', value: 20, color: 'bg-yellow-500' },
              { label: 'Cancelled', value: 10, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <FiAlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lowStockProducts.length} products need attention</p>
              </div>
            </div>
            <Link to="/admin/products" className="text-sm text-purple-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-500">{product.stockQuantity}</p>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiCheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">All products are well stocked!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest customer orders</p>
            </div>
            <Link to="/admin/orders" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/products" className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white hover:shadow-lg hover:shadow-purple-600/25 transition-all">
          <div className="p-3 bg-white/20 rounded-xl">
            <FiPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">Add Product</p>
            <p className="text-sm text-white/80">Create new product</p>
          </div>
        </Link>
        
        <Link to="/admin/orders" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <FiShoppingCart className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Manage Orders</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">12 pending orders</p>
          </div>
        </Link>
        
        <Link to="/admin/customers" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <FiUsers className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Customers</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">View all customers</p>
          </div>
        </Link>
        
        <Link to="/admin/analytics" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all">
          <div className="p-3 bg-orange-500/10 rounded-xl">
            <FiTrendingUp className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Analytics</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">View reports</p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;