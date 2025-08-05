import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch, FiX, FiFilter, FiClock } from 'react-icons/fi';

const EnhancedSearchBar = ({ 
  faqData, 
  searchTerm, 
  onSearchChange, 
  onCategoryFilter,
  selectedCategories = [],
  resultsCount = 0 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('faq_search_history');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.warn('Failed to parse search history:', error);
      }
    }
  }, []);

  // Generate suggestions based on current input
  useEffect(() => {
    if (searchTerm.length > 0) {
      generateSuggestions(searchTerm);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, faqData]);

  const generateSuggestions = useCallback((term) => {
    const lowerTerm = term.toLowerCase();
    const suggestions = [];

    // Add matching questions
    faqData.forEach(category => {
      category.questions.forEach(item => {
        if (item.question.toLowerCase().includes(lowerTerm)) {
          suggestions.push({
            type: 'question',
            text: item.question,
            category: category.category,
            highlight: highlightMatch(item.question, term)
          });
        }
      });
    });

    // Add category suggestions
    faqData.forEach(category => {
      if (category.category.toLowerCase().includes(lowerTerm)) {
        suggestions.push({
          type: 'category',
          text: category.category,
          count: category.questions.length,
          highlight: highlightMatch(category.category, term)
        });
      }
    });

    // Add search history matches
    searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().includes(lowerTerm) && 
          !suggestions.find(s => s.text.toLowerCase() === historyItem.toLowerCase())) {
        suggestions.push({
          type: 'history',
          text: historyItem,
          highlight: highlightMatch(historyItem, term)
        });
      }
    });

    // Limit to 8 suggestions
    setSuggestions(suggestions.slice(0, 8));
  }, [faqData, searchHistory]);

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleSearchSubmit = (term) => {
    if (term.trim()) {
      // Add to search history
      const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('faq_search_history', JSON.stringify(newHistory));
      
      // Trigger search
      onSearchChange({ target: { value: term } });
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearchSubmit(suggestion.text);
  };

  const clearSearch = () => {
    onSearchChange({ target: { value: '' } });
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('faq_search_history');
  };

  const handleCategoryToggle = (categoryName) => {
    const newSelected = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    onCategoryFilter(newSelected);
  };

  const clearAllFilters = () => {
    onCategoryFilter([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allCategories = faqData.map(cat => cat.category);

  return (
    <div className="max-w-3xl mx-auto mb-8">
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={onSearchChange}
            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(searchTerm)}
            className="w-full pl-12 pr-20 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded transition-colors ${
                selectedCategories.length > 0 || showFilters
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Filter by category"
            >
              <FiFilter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  {suggestion.type === 'history' && (
                    <FiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  {suggestion.type === 'category' && (
                    <div className="w-4 h-4 bg-blue-100 rounded flex-shrink-0" />
                  )}
                  {suggestion.type === 'question' && (
                    <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="text-gray-900 truncate"
                      dangerouslySetInnerHTML={{ __html: suggestion.highlight }}
                    />
                    {suggestion.category && (
                      <div className="text-xs text-gray-500 mt-1">
                        in {suggestion.category}
                      </div>
                    )}
                    {suggestion.count && (
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.count} questions
                      </div>
                    )}
                  </div>
                  {suggestion.type === 'history' && (
                    <span className="text-xs text-gray-400">Recent</span>
                  )}
                </div>
              </div>
            ))}
            
            {searchHistory.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearSearchHistory}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear search history
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Filter by Category</h4>
            {selectedCategories.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {searchTerm && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>
            {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
            {selectedCategories.length > 0 && (
              <span> in {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'}</span>
            )}
          </span>
          {selectedCategories.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs">Active filters:</span>
              {selectedCategories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {category}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="ml-1 hover:text-blue-900"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
