import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Copy, Eye, EyeOff, Trash2, Edit3, Check, X, Calendar, Users, Shield } from 'lucide-react';
import { smartFetch } from '../../../shared/utils';

const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetails, setShowDetails] = useState({});
  const [selectedCode, setSelectedCode] = useState(null);

  // Form state for creating/editing codes
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    maxUses: '',
    expirationDate: '',
    isActive: true
  });

  // Filters
  const [filters, setFilters] = useState({
    status: 'all', // all, active, expired, disabled
    sortBy: 'createdAt', // createdAt, code, uses, expiration
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    used: 0,
    expired: 0
  });

  // Mock data for development - will be replaced with API calls
  useEffect(() => {
    loadPromoCodes();
  }, [filters]);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await smartFetch('/api/admin/promo-codes');
      // const data = await response.json();
      
      // Mock data for now
      const mockData = [
        {
          id: '1',
          code: 'WELCOME2024',
          description: 'Welcome code for new users',
          maxUses: 100,
          currentUses: 23,
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          expirationDate: '2024-12-31T23:59:59Z',
          createdBy: 'admin@fractionax.io'
        },
        {
          id: '2',
          code: 'EARLYBIRD',
          description: 'Early bird access for beta users',
          maxUses: 50,
          currentUses: 45,
          isActive: true,
          createdAt: '2024-01-10T10:00:00Z',
          expirationDate: '2024-06-30T23:59:59Z',
          createdBy: 'admin@fractionax.io'
        },
        {
          id: '3',
          code: 'INVESTOR2024',
          description: 'Special access for qualified investors',
          maxUses: 25,
          currentUses: 12,
          isActive: false,
          createdAt: '2024-01-05T10:00:00Z',
          expirationDate: '2024-12-31T23:59:59Z',
          createdBy: 'admin@fractionax.io'
        }
      ];

      setPromoCodes(mockData);
      
      // Calculate stats
      const totalCodes = mockData.length;
      const activeCodes = mockData.filter(code => code.isActive).length;
      const usedCodes = mockData.reduce((sum, code) => sum + code.currentUses, 0);
      const expiredCodes = mockData.filter(code => 
        new Date(code.expirationDate) < new Date()
      ).length;

      setStats({
        total: totalCodes,
        active: activeCodes,
        used: usedCodes,
        expired: expiredCodes
      });
    } catch (error) {
      console.error('Error loading promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      // await smartFetch('/api/admin/promo-codes', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });

      // Mock creation
      const newCode = {
        id: Date.now().toString(),
        code: formData.code,
        description: formData.description,
        maxUses: parseInt(formData.maxUses) || null,
        currentUses: 0,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        expirationDate: formData.expirationDate || null,
        createdBy: 'admin@fractionax.io'
      };

      setPromoCodes(prev => [newCode, ...prev]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating promo code:', error);
    }
  };

  const handleToggleActive = async (codeId) => {
    try {
      // TODO: Replace with actual API call
      setPromoCodes(prev => 
        prev.map(code => 
          code.id === codeId 
            ? { ...code, isActive: !code.isActive }
            : code
        )
      );
    } catch (error) {
      console.error('Error toggling code status:', error);
    }
  };

  const handleDeleteCode = async (codeId) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    
    try {
      // TODO: Replace with actual API call
      setPromoCodes(prev => prev.filter(code => code.id !== codeId));
    } catch (error) {
      console.error('Error deleting promo code:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      maxUses: '',
      expirationDate: '',
      isActive: true
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  const toggleDetails = (codeId) => {
    setShowDetails(prev => ({
      ...prev,
      [codeId]: !prev[codeId]
    }));
  };

  const filteredCodes = promoCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' ||
                         (filters.status === 'active' && code.isActive) ||
                         (filters.status === 'expired' && new Date(code.expirationDate) < new Date()) ||
                         (filters.status === 'disabled' && !code.isActive);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (code) => {
    if (!code.isActive) return 'text-gray-500 bg-gray-100';
    if (code.expirationDate && new Date(code.expirationDate) < new Date()) {
      return 'text-red-600 bg-red-100';
    }
    return 'text-green-600 bg-green-100';
  };

  const getUsagePercentage = (code) => {
    if (!code.maxUses) return 0;
    return (code.currentUses / code.maxUses) * 100;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Promo Code Management</h1>
        <p className="text-gray-600">
          Create and manage access codes for user registration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Codes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <Check className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Active Codes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Uses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.used}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search codes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Code
          </button>
        </div>
      </div>

      {/* Promo Codes Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading promo codes...</p>
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No promo codes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCodes.map((code) => (
                  <React.Fragment key={code.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-mono text-sm font-medium text-gray-900">
                            {code.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{code.description}</div>
                        <div className="text-xs text-gray-500">
                          Created {formatDate(code.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {code.currentUses} / {code.maxUses || '∞'}
                        </div>
                        {code.maxUses && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${getUsagePercentage(code)}%` }}
                            ></div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(code)}`}>
                          {!code.isActive ? 'Disabled' : 
                           code.expirationDate && new Date(code.expirationDate) < new Date() ? 'Expired' : 
                           'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {code.expirationDate ? formatDate(code.expirationDate) : 'No expiration'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDetails(code.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {showDetails[code.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleActive(code.id)}
                            className={`${code.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {code.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCode(code.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Details Row */}
                    <AnimatePresence>
                      {showDetails[code.id] && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50"
                        >
                          <td colSpan="6" className="px-6 py-4">
                            <div className="text-sm text-gray-600">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <span className="font-medium">Created by:</span>
                                  <br />
                                  {code.createdBy}
                                </div>
                                <div>
                                  <span className="font-medium">Created:</span>
                                  <br />
                                  {formatDate(code.createdAt)}
                                </div>
                                <div>
                                  <span className="font-medium">Max Uses:</span>
                                  <br />
                                  {code.maxUses || 'Unlimited'}
                                </div>
                                <div>
                                  <span className="font-medium">Usage Rate:</span>
                                  <br />
                                  {code.maxUses ? `${getUsagePercentage(code).toFixed(1)}%` : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Code Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Create New Promo Code</h3>
              
              <form onSubmit={handleCreateCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="WELCOME2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of this code's purpose"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Uses (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUses}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Activate immediately
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Code
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromoCodeManager;
