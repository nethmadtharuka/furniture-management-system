/**
 * ============================================================================
 * AI PRODUCT FINDER COMPONENT
 * ============================================================================
 * 
 * A beautiful, modern AI-powered product search interface.
 * 
 * Features:
 * - Natural language search
 * - AI-powered intent understanding
 * - Match score visualization
 * - AI explanations for recommendations
 * - Smooth animations
 * - Mobile responsive
 * 
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiX, FiChevronRight, FiStar,
    FiShoppingCart, FiHeart, FiEye, FiZap, FiTrendingUp,
    FiCheckCircle, FiAlertCircle, FiLoader, FiPackage
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import aiProductFinderService from '../services/aiProductFinderService';

/**
 * AI Product Finder Component
 */
const AIProductFinder = ({ onClose }) => {
    // State
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [conversationHistory, setConversationHistory] = useState([]);

    /**
     * Handle AI search
     */
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await aiProductFinderService.findProducts(
                query,
                conversationHistory
            );

            setResults(response);
            setConversationHistory([...conversationHistory, query]);
        } catch (err) {
            setError(err.message);
            setResults(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Clear search
     */
    const handleClear = () => {
        setQuery('');
        setResults(null);
        setError(null);
        setConversationHistory([]);
    };

    /**
     * Format price
     */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    /**
     * Get match score color
     */
    const getMatchScoreColor = (score) => {
        if (score >= 0.9) return 'text-green-500';
        if (score >= 0.7) return 'text-blue-500';
        if (score >= 0.5) return 'text-yellow-500';
        return 'text-gray-500';
    };

    /**
     * Get match score label
     */
    const getMatchScoreLabel = (score) => {
        if (score >= 0.9) return 'Excellent Match';
        if (score >= 0.7) return 'Good Match';
        if (score >= 0.5) return 'Fair Match';
        return 'Possible Match';
    };

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                                <FiZap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    AI Product Finder
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Powered by Google Gemini
                                </p>
                            </div>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <FiX className="w-6 h-6 text-gray-500" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Try: 'comfortable bed under 100000 LKR' or 'modern office chair'"
                                className="w-full pl-16 pr-32 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all shadow-lg"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="absolute right-28 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-gray-500" />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="w-5 h-5 animate-spin" />
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiZap className="w-5 h-5" />
                                        <span>Search</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Example Queries */}
                    {!results && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6"
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                💡 Try these examples:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'comfortable bed under 100000 LKR',
                                    'modern office chair',
                                    'dining table for 6 people',
                                    'outdoor furniture set',
                                    'kids bedroom furniture',
                                ].map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setQuery(example)}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:text-purple-500 transition-all"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Loading State */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-12"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                                <FiLoader className="w-5 h-5 text-purple-500 animate-spin" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    AI is analyzing your request...
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error State */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8"
                        >
                            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                                <div className="flex items-start gap-3">
                                    <FiAlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-1">
                                            Oops! Something went wrong
                                        </h3>
                                        <p className="text-red-700 dark:text-red-300">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {results && results.success && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* AI Understanding Section */}
                            {results.intent && (
                                <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FiCheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                AI Understanding
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {results.intent.category && (
                                                    <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        📁 Category: {results.intent.category}
                                                    </span>
                                                )}
                                                {results.intent.budget && results.intent.budget.max && (
                                                    <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        💰 Budget: Up to {formatPrice(results.intent.budget.max)}
                                                    </span>
                                                )}
                                                {results.intent.keywords && results.intent.keywords.length > 0 && (
                                                    results.intent.keywords.map((keyword, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            🔑 {keyword}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Found <strong>{results.totalMatches}</strong> matching product{results.totalMatches !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}

                            {/* Products Grid */}
                            {results.matches && results.matches.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.matches.map((match, index) => (
                                        <motion.div
                                            key={match.product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
                                        >
                                            {/* Match Score Badge */}
                                            <div className="relative">
                                                <div className="absolute top-4 right-4 z-10">
                                                    <div className="px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full shadow-lg flex items-center gap-2">
                                                        <FiTrendingUp className={`w-4 h-4 ${getMatchScoreColor(match.matchScore)}`} />
                                                        <span className={`text-sm font-bold ${getMatchScoreColor(match.matchScore)}`}>
                                                            {Math.round(match.matchScore * 100)}%
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Product Image */}
                                                <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                    {match.product.imageUrl ? (
                                                        <img
                                                            src={match.product.imageUrl}
                                                            alt={match.product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FiPackage className="w-16 h-16 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-6">
                                                {/* Match Label */}
                                                <div className="mb-3">
                                                    <span className={`text-xs font-semibold ${getMatchScoreColor(match.matchScore)}`}>
                                                        {getMatchScoreLabel(match.matchScore)}
                                                    </span>
                                                </div>

                                                {/* Product Name */}
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                    {match.product.name}
                                                </h3>

                                                {/* Price */}
                                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                                                    {formatPrice(match.product.price)}
                                                </p>

                                                {/* AI Explanation */}
                                                {match.explanation && (
                                                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                            "{match.explanation}"
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Match Reasons */}
                                                {match.matchReasons && match.matchReasons.length > 0 && (
                                                    <div className="mb-4 space-y-1">
                                                        {match.matchReasons.slice(0, 3).map((reason, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                <span>{reason}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/products/${match.product.id}`}
                                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all text-center flex items-center justify-center gap-2"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                        <span>View Details</span>
                                                    </Link>
                                                    <button className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                        <FiHeart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <FiSearch className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        No matches found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Try adjusting your search criteria or browse our catalog
                                    </p>
                                </div>
                            )}

                            {/* Follow-up Question */}
                            {results.followUpQuestion && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl"
                                >
                                    <div className="flex items-start gap-3">
                                        <FiZap className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                AI Suggestion
                                            </h4>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {results.followUpQuestion}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIProductFinder;
