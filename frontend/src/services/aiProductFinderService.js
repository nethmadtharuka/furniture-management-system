/**
 * ============================================================================
 * AI PRODUCT FINDER SERVICE
 * ============================================================================
 * 
 * This service handles all API calls to the AI Product Finder backend.
 * 
 * Backend Endpoint: POST /api/ai/product-finder
 * 
 * FLOW:
 * 1. User types natural language query: "comfortable bed under 100k"
 * 2. Frontend sends query to backend
 * 3. Backend uses Gemini AI to understand intent
 * 4. Backend searches database for matching products
 * 5. Backend returns ranked products with AI explanations
 * 6. Frontend displays results with match scores
 * 
 * ============================================================================
 */

import axios from 'axios';

// Create axios instance for AI service
const aiApi = axios.create({
  baseURL: 'http://localhost:8080/api/ai',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add JWT token to requests if available
 * (AI endpoints are public, but token helps with personalization if logged in)
 */
aiApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * AI Product Finder Service
 */
const aiProductFinderService = {
  /**
   * Find products using natural language query
   * 
   * @param {string} query - Natural language query (e.g., "bed under 100000 LKR")
   * @param {Array<string>} conversationHistory - Optional previous queries for context
   * @returns {Promise} - AI response with matched products
   * 
   * Example Request:
   * {
   *   "query": "I need a comfortable bed under 100000 LKR",
   *   "conversationHistory": []
   * }
   * 
   * Example Response:
   * {
   *   "success": true,
   *   "matches": [
   *     {
   *       "product": { id: 1, name: "Queen Comfort Bed", price: 89000, ... },
   *       "matchScore": 0.95,
   *       "explanation": "Excellent match! This bed fits your budget...",
   *       "matchReasons": ["Within budget", "In stock", "Matches category"]
   *     }
   *   ],
   *   "intent": {
   *     "category": "bed",
   *     "budget": { "max": 100000 },
   *     "keywords": ["comfortable"]
   *   },
   *   "followUpQuestion": null,
   *   "totalMatches": 1
   * }
   */
  findProducts: async (query, conversationHistory = []) => {
    try {
      console.log('🤖 Sending AI query:', query);
      
      const response = await aiApi.post('/product-finder', {
        query,
        conversationHistory,
      });

      console.log('✅ AI Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ AI Product Finder Error:', error);
      
      // Enhanced error handling
      if (error.response) {
        // Server responded with error
        throw new Error(
          error.response.data?.message || 
          `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // No response received
        throw new Error(
          'Cannot connect to AI service. Please check if the backend is running.'
        );
      } else {
        throw new Error(error.message);
      }
    }
  },

  /**
   * Get AI suggestions based on partial query
   * (Future enhancement - can be used for autocomplete)
   * 
   * @param {string} partialQuery - Incomplete query
   * @returns {Promise} - Suggested completions
   */
  getSuggestions: async (partialQuery) => {
    // TODO: Implement when backend supports this
    // For now, return some static suggestions
    return {
      suggestions: [
        'comfortable bed under 100000 LKR',
        'modern office chair',
        'dining table for 6 people',
        'outdoor furniture set',
      ],
    };
  },
};

export default aiProductFinderService;
