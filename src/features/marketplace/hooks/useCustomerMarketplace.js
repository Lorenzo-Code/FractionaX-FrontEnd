import { useState, useEffect, useMemo } from 'react';
import { useMarketplace } from './useMarketplace';

/**
 * Customer marketplace hook with user-specific features
 * Extends the base marketplace hook with authentication-specific functionality
 * @param {Object} userPreferences - User preferences for personalization
 * @returns {Object} Enhanced marketplace state and methods for authenticated users
 */
export const useCustomerMarketplace = (userPreferences = {}) => {
  // Use base marketplace hook with authentication enabled
  const baseMarketplace = useMarketplace({ 
    isAuthenticated: true, 
    userPreferences 
  });

  // User-specific states
  const [userLikes, setUserLikes] = useState(new Set());
  const [userBookmarks, setUserBookmarks] = useState(new Set());
  const [userCommitments, setUserCommitments] = useState({}); // propertyId -> commitmentAmount
  const [userShares, setUserShares] = useState(new Set());
  const [userNotes, setUserNotes] = useState({}); // propertyId -> note
  const [userWatchlist, setUserWatchlist] = useState(new Set());
  const [showUserInsights, setShowUserInsights] = useState(true);

  // User activity analytics
  const [userActivity, setUserActivity] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalCommitments: 0,
    totalShares: 0,
    averageROIInterest: 0,
    favoritePropertyTypes: [],
    priceRangePreference: [0, 0],
    locationPreferences: []
  });

  // Enhanced filters with user-specific options
  const [customerFilters, setCustomerFilters] = useState({
    ...baseMarketplace.baseFilters,
    showOnlyLiked: false,
    showOnlyBookmarked: false,
    showOnlyCommitted: false
  });

  // Enhanced quick filters with user-specific options
  const [customerQuickFilters, setCustomerQuickFilters] = useState({
    ...baseMarketplace.quickFilters,
    myInteractions: false,
    trending: false
  });

  // User interaction methods
  const toggleLike = (propertyId) => {
    setUserLikes(prev => {
      const newLikes = new Set(prev);
      if (newLikes.has(propertyId)) {
        newLikes.delete(propertyId);
      } else {
        newLikes.add(propertyId);
      }
      return newLikes;
    });
  };

  const toggleBookmark = (propertyId) => {
    setUserBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(propertyId)) {
        newBookmarks.delete(propertyId);
      } else {
        newBookmarks.add(propertyId);
      }
      return newBookmarks;
    });
  };

  const addCommitment = (propertyId, amount) => {
    setUserCommitments(prev => ({
      ...prev,
      [propertyId]: amount
    }));
  };

  const removeCommitment = (propertyId) => {
    setUserCommitments(prev => {
      const newCommitments = { ...prev };
      delete newCommitments[propertyId];
      return newCommitments;
    });
  };

  const toggleShare = (propertyId) => {
    setUserShares(prev => {
      const newShares = new Set(prev);
      if (newShares.has(propertyId)) {
        newShares.delete(propertyId);
      } else {
        newShares.add(propertyId);
      }
      return newShares;
    });
  };

  const updateNote = (propertyId, note) => {
    setUserNotes(prev => ({
      ...prev,
      [propertyId]: note
    }));
  };

  const addToWatchlist = (propertyId) => {
    setUserWatchlist(prev => new Set([...prev, propertyId]));
  };

  const removeFromWatchlist = (propertyId) => {
    setUserWatchlist(prev => {
      const newWatchlist = new Set(prev);
      newWatchlist.delete(propertyId);
      return newWatchlist;
    });
  };

  // Enhanced filtering with user-specific options
  const filteredCustomerProperties = useMemo(() => {
    const userFilters = {
      showOnlyLiked: customerFilters.showOnlyLiked,
      showOnlyBookmarked: customerFilters.showOnlyBookmarked,
      showOnlyCommitted: customerFilters.showOnlyCommitted,
      userLikes,
      userBookmarks,
      userCommitments
    };

    let filtered = baseMarketplace.getFilteredProperties(
      baseMarketplace.currentProperties,
      customerFilters,
      baseMarketplace.searchQuery,
      customerQuickFilters,
      userFilters
    );

    // Additional customer-specific filtering
    if (customerQuickFilters.myInteractions) {
      filtered = filtered.filter(property => 
        userLikes.has(property.id) || 
        userBookmarks.has(property.id) || 
        userCommitments[property.id] > 0
      );
    }
    
    if (customerQuickFilters.trending) {
      filtered = filtered.filter(property => property.userInteractions?.trending);
    }

    // Enhanced sorting options for customer marketplace
    switch (customerFilters.sortBy) {
      case 'personal':
        filtered.sort((a, b) => {
          const aScore = (userLikes.has(a.id) ? 10 : 0) + 
                        (userBookmarks.has(a.id) ? 8 : 0) + 
                        (userCommitments[a.id] ? 15 : 0) +
                        (a.userInteractions?.hotness || 0);
          const bScore = (userLikes.has(b.id) ? 10 : 0) + 
                        (userBookmarks.has(b.id) ? 8 : 0) + 
                        (userCommitments[b.id] ? 15 : 0) +
                        (b.userInteractions?.hotness || 0);
          return bScore - aScore;
        });
        break;
      case 'hotness':
        filtered.sort((a, b) => (b.userInteractions?.hotness || 0) - (a.userInteractions?.hotness || 0));
        break;
    }

    return filtered;
  }, [
    baseMarketplace.currentProperties, 
    customerFilters, 
    baseMarketplace.searchQuery, 
    customerQuickFilters, 
    userLikes, 
    userBookmarks, 
    userCommitments,
    baseMarketplace.getFilteredProperties
  ]);

  // Customer-specific paginated properties
  const paginatedCustomerProperties = useMemo(() => {
    const startIdx = (baseMarketplace.currentPage - 1) * baseMarketplace.itemsPerPage;
    const endIdx = startIdx + baseMarketplace.itemsPerPage;
    return filteredCustomerProperties.slice(startIdx, endIdx);
  }, [filteredCustomerProperties, baseMarketplace.currentPage, baseMarketplace.itemsPerPage]);

  const totalCustomerPages = Math.ceil(filteredCustomerProperties.length / baseMarketplace.itemsPerPage);

  // Load user activity data
  useEffect(() => {
    // Simulate loading user activity data
    setUserActivity({
      totalViews: 145,
      totalLikes: userLikes.size,
      totalCommitments: Object.keys(userCommitments).length,
      totalShares: userShares.size,
      averageROIInterest: 9.2,
      favoritePropertyTypes: ['condo', 'house'],
      priceRangePreference: [300000, 800000],
      locationPreferences: ['Houston', 'Sugar Land', 'Austin']
    });
  }, [userLikes.size, Object.keys(userCommitments).length, userShares.size]);

  // Reset page when customer-specific filters change
  useEffect(() => {
    baseMarketplace.setCurrentPage(1);
  }, [customerFilters, customerQuickFilters]);

  return {
    // Inherit all base marketplace functionality
    ...baseMarketplace,

    // Override with customer-specific data
    baseFilters: customerFilters,
    quickFilters: customerQuickFilters,
    filteredProperties: filteredCustomerProperties,
    paginatedProperties: paginatedCustomerProperties,
    totalPages: totalCustomerPages,

    // Customer-specific state
    userLikes,
    userBookmarks,
    userCommitments,
    userShares,
    userNotes,
    userWatchlist,
    showUserInsights,
    userActivity,
    customerFilters,
    customerQuickFilters,

    // Customer-specific actions
    setCustomerFilters,
    setCustomerQuickFilters,
    setShowUserInsights,
    toggleLike,
    toggleBookmark,
    addCommitment,
    removeCommitment,
    toggleShare,
    updateNote,
    addToWatchlist,
    removeFromWatchlist,

    // Additional computed properties
    hasUserInteractions: userLikes.size > 0 || userBookmarks.size > 0 || Object.keys(userCommitments).length > 0,
    totalUserInteractions: userLikes.size + userBookmarks.size + Object.keys(userCommitments).length,
  };
};

export default useCustomerMarketplace;