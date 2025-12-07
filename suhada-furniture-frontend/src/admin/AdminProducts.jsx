/**
 * ============================================================================
 * ADMIN PRODUCTS MANAGEMENT
 * ============================================================================
 * 
 * Full CRUD operations for products.
 * 
 * BACKEND CONNECTIONS:
 * - GET /api/products/paginated - List all products
 * - POST /api/products - Create new product
 * - PUT /api/products/{id} - Update product
 * - DELETE /api/products/{id} - Delete product
 * 
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiDownload,
  FiChevronLeft, FiChevronRight, FiX, FiPackage, FiDollarSign,
  FiTag, FiLayers, FiRefreshCw, FiImage, FiCheck,
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

const AdminProducts = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('DESC');
  const [pagination, setPagination] = useState({
    currentPage: 0, totalPages: 0, totalElements: 0, pageSize: 10,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    sku: '', name: '', description: '', price: '', costPrice: '',
    stockQuantity: '', category: '', images: [], lowStockThreshold: 10,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const categories = ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Kids Room', 'Kitchen', 'Bathroom'];

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/paginated', {
        params: { page: pagination.currentPage, size: pagination.pageSize, sortBy, sortDir },
      });

      if (response.data.success) {
        let filteredProducts = response.data.data.content;
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }
        setProducts(filteredProducts);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.totalPages,
          totalElements: response.data.data.totalElements,
        }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, sortBy, sortDir, searchQuery, selectedCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-LK', {
    style: 'currency', currency: 'LKR', minimumFractionDigits: 0,
  }).format(amount);

  const validateForm = () => {
    const errors = {};
    if (!formData.sku.trim()) errors.sku = 'SKU is required';
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    if (!formData.stockQuantity || formData.stockQuantity < 0) errors.stockQuantity = 'Valid stock is required';
    if (!formData.category) errors.category = 'Category is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
      };
      const response = await api.post('/products', productData);
      if (response.data.success) {
        toast.success('Product created successfully!');
        setShowAddModal(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
      };
      const response = await api.put(`/products/${selectedProduct.id}`, productData);
      if (response.data.success) {
        toast.success('Product updated successfully!');
        setShowEditModal(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setSaving(true);
      const response = await api.delete(`/products/${selectedProduct.id}`);
      if (response.data.success) {
        toast.success('Product deleted successfully!');
        setShowDeleteModal(false);
        setSelectedProduct(null);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ sku: '', name: '', description: '', price: '', costPrice: '', stockQuantity: '', category: '', images: [], lowStockThreshold: 10 });
    setFormErrors({});
    setSelectedProduct(null);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku, name: product.name, description: product.description || '',
      price: product.price.toString(), costPrice: product.costPrice?.toString() || '',
      stockQuantity: product.stockQuantity.toString(), category: product.category || '',
      images: product.images || [], lowStockThreshold: product.lowStockThreshold || 10,
    });
    setShowEditModal(true);
  };

  const getStockStatus = (product) => {
    if (product.stockQuantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (product.lowStock || product.stockQuantity <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  };

  // Product Form Component
  const ProductForm = ({ onSubmit, isEdit }) => (
    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SKU <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" name="sku" value={formData.sku} onChange={handleInputChange}
              placeholder="e.g., SOFA001"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 ${formErrors.sku ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
            />
          </div>
          {formErrors.sku && <p className="mt-1 text-sm text-red-500">{formErrors.sku}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiPackage className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" name="name" value={formData.name} onChange={handleInputChange}
              placeholder="e.g., Luxury Leather Sofa"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 ${formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
            />
          </div>
          {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selling Price (LKR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number" name="price" value={formData.price} onChange={handleInputChange}
              placeholder="e.g., 150000" min="0" step="0.01"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 ${formErrors.price ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
            />
          </div>
          {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
        </div>

        {/* Cost Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cost Price (LKR)</label>
          <div className="relative">
            <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number" name="costPrice" value={formData.costPrice} onChange={handleInputChange}
              placeholder="e.g., 100000" min="0" step="0.01"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange}
            placeholder="e.g., 50" min="0"
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 ${formErrors.stockQuantity ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
          />
          {formErrors.stockQuantity && <p className="mt-1 text-sm text-red-500">{formErrors.stockQuantity}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="category" value={formData.category} onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 ${formErrors.category ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          {formErrors.category && <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            name="description" value={formData.description} onChange={handleInputChange}
            rows="4" placeholder="Product description..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
          <div className="relative">
            <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.images[0] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
              placeholder="https://example.com/image.jpg"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
          className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/25"
        >
          {saving ? <FiRefreshCw className="w-5 h-5 animate-spin" /> : <FiCheck className="w-5 h-5" />}
          {isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text" placeholder="Search products..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          value={`${sortBy}-${sortDir}`}
          onChange={(e) => { const [f, d] = e.target.value.split('-'); setSortBy(f); setSortDir(d); }}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300"
        >
          <option value="createdAt-DESC">Newest First</option>
          <option value="createdAt-ASC">Oldest First</option>
          <option value="name-ASC">Name A-Z</option>
          <option value="price-ASC">Price Low-High</option>
          <option value="price-DESC">Price High-Low</option>
        </select>
        <button onClick={fetchProducts} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-primary transition-all">
          <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" /><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" /></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <FiPackage className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No products found</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-4 text-primary hover:underline">Add your first product</button>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiPackage className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-gray-600 dark:text-gray-400 font-mono text-sm">{product.sku}</span></td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {product.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4"><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.price)}</span></td>
                      <td className="px-6 py-4"><span className="text-gray-700 dark:text-gray-300">{product.stockQuantity}</span></td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelectedProduct(product); setShowViewModal(true); }} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(product)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.currentPage + 1} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 0}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddModal(false); resetForm(); }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Product</h2>
                <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <ProductForm onSubmit={handleAddProduct} isEdit={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowEditModal(false); resetForm(); }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Product</h2>
                <button onClick={() => { setShowEditModal(false); resetForm(); }} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <ProductForm onSubmit={handleEditProduct} isEdit={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FiTrash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Delete Product</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to delete <strong>{selectedProduct.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => setShowDeleteModal(false)} className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleDeleteProduct} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors">
                    {saving ? <FiRefreshCw className="w-5 h-5 animate-spin" /> : <FiTrash2 className="w-5 h-5" />}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Product Modal */}
      <AnimatePresence>
        {showViewModal && selectedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowViewModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Details</h2>
                <button onClick={() => setShowViewModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      {selectedProduct.images?.[0] ? (
                        <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">SKU</p>
                      <p className="font-mono text-gray-900 dark:text-white">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                      <p className="text-gray-900 dark:text-white">{selectedProduct.category || 'Uncategorized'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(selectedProduct.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedProduct.stockQuantity}</p>
                      </div>
                    </div>
                    {selectedProduct.description && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                        <p className="text-gray-700 dark:text-gray-300">{selectedProduct.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => { setShowViewModal(false); openEditModal(selectedProduct); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                    <FiEdit className="w-4 h-4" />
                    Edit Product
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;