import api from './api';

export const productService = {
  // Get all products
  async getAllProducts() {
    const response = await api.get('/products');
    return response.data;
  },

  // Get products with pagination
  async getProductsPaginated(page = 0, size = 12, sortBy = 'createdAt', sortDir = 'DESC') {
    const response = await api.get('/products/paginated', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get product by ID
  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  async searchProducts(query) {
    const response = await api.get('/products/search', {
      params: { query }
    });
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(category) {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Create product (admin)
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (admin)
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin)
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};