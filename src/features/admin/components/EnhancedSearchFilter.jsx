import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaMapMarkerAlt,
  FaUser, FaShieldAlt, FaCoins, FaSort, FaSortUp, FaSortDown
} from 'react-icons/fa';

const EnhancedSearchFilter = ({ 
  onSearchChange, 
  onFiltersChange, 
  onSortChange,
  initialFilters = {},
  availableFilters = [],
  sortOptions = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [quickFilters, setQuickFilters] = useState({
    activeUsers: false,
    verifiedUsers: false,
    suspendedUsers: false,
    highValueUsers: false
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange && onSearchChange(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  const handleQuickFilter = (filterKey) => {
    const newQuickFilters = {
      ...quickFilters,
      [filterKey]: !quickFilters[filterKey]
    };
    setQuickFilters(newQuickFilters);
    onFiltersChange && onFiltersChange({ ...filters, quickFilters: newQuickFilters });
  };

  const handleSort = (field) => {
    let newDirection = 'asc';
    if (sortBy === field && sortDirection === 'asc') {
      newDirection = 'desc';
    }
    setSortBy(field);
    setSortDirection(newDirection);
    onSortChange && onSortChange({ field, direction: newDirection });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({});
    setQuickFilters({
      activeUsers: false,
      verifiedUsers: false,
      suspendedUsers: false,
      highValueUsers: false
    });
    setDateRange({ from: '', to: '' });
    onSearchChange && onSearchChange('');
    onFiltersChange && onFiltersChange({});
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="text-blue-600" /> : 
      <FaSortDown className="text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by email, name, wallet address, or transaction hash..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${
              showAdvancedFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FaFilter />
            <span>Advanced Filters</span>
          </button>

          {/* Clear Filters */}
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <FaTimes />
            <span>Clear All</span>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickFilter('activeUsers')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              quickFilters.activeUsers
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaUser className="inline mr-1" />
            Active Users
          </button>
          <button
            onClick={() => handleQuickFilter('verifiedUsers')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              quickFilters.verifiedUsers
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaShieldAlt className="inline mr-1" />
            Verified Users
          </button>
          <button
            onClick={() => handleQuickFilter('suspendedUsers')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              quickFilters.suspendedUsers
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaTimes className="inline mr-1" />
            Suspended Users
          </button>
          <button
            onClick={() => handleQuickFilter('highValueUsers')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              quickFilters.highValueUsers
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaCoins className="inline mr-1" />
            High Value Users
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* KYC Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KYC Status
              </label>
              <select
                value={filters.kycStatus || ''}
                onChange={(e) => handleFilterChange('kycStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All KYC Status</option>
                <option value="not_started">Not Started</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Registration Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered From
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Registration Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered To
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Token Balance Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min FXCT Balance
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={filters.minBalance || ''}
                onChange={(e) => handleFilterChange('minBalance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max FXCT Balance
              </label>
              <input
                type="number"
                placeholder="1000000.00"
                value={filters.maxBalance || ''}
                onChange={(e) => handleFilterChange('maxBalance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Last Login */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Login
              </label>
              <select
                value={filters.lastLogin || ''}
                onChange={(e) => handleFilterChange('lastLogin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="never">Never</option>
              </select>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Level
              </label>
              <select
                value={filters.riskLevel || ''}
                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex space-x-2">
            {[
              { key: 'createdAt', label: 'Registration Date' },
              { key: 'lastLogin', label: 'Last Login' },
              { key: 'email', label: 'Email' },
              { key: 'fxctBalance', label: 'FXCT Balance' },
              { key: 'fxstBalance', label: 'FXST Balance' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => handleSort(option.key)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1 ${
                  sortBy === option.key
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{option.label}</span>
                {getSortIcon(option.key)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchFilter;
