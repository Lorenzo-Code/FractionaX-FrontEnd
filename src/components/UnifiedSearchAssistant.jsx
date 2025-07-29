import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSearch, FiSend, FiClock, FiHelpCircle, FiX } from 'react-icons/fi';

const UnifiedSearchAssistant = ({
  faqData,
  searchTerm,
  handleSearchChange,
  handleCategoryFilter,
  handleAIQuery,
  selectedCategories,
  resultsCount,
}) => {
  const [query, setQuery] = useState(searchTerm);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Common question patterns for auto-completion
  const questionPatterns = [
    'How do I create an account',
    'How do I reset my password',
    'How do I deposit funds',
    'How do I withdraw funds',
    'How do I buy tokens',
    'How do I sell my tokens',
    'How do I enable 2FA',
    'How do I update my profile',
    'How do I get my money back',
    'How do I contact support',
    'How does tokenization work',
    'How are properties selected',
    'What is FractionaX',
    'What documents do I need',
    'What are the fees',
    'What payment methods',
    'Why was my payment declined',
    'Can I delete my account',
    'Can I sell tokens anytime',
    'Can I get a refund',
    'Is my wallet secure',
    'Is FractionaX regulated',
    'When do I receive rental income',
    'Where can I see my transactions'
  ];

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

  // Generate intelligent suggestions based on current input
  const generateSuggestions = useCallback((input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    const lowerInput = input.toLowerCase();
    let newSuggestions = [];

    // Combine all suggestion sources
    const combinedSuggestions = [
      // Auto-complete common question patterns
      ...questionPatterns.map(pattern => ({
        text: pattern,
        highlight: highlightMatch(pattern, input),
        icon: <FiHelpCircle className="w-4 h-4 text-blue-500" />
      })),
      // Matching FAQ questions
      ...faqData.flatMap(category => category.questions.map(item => ({
        text: item.question,
        category: category.category,
        highlight: highlightMatch(item.question, input),
        icon: <FiSearch className="w-4 h-4 text-green-500" />
      }))),
      // Search history matches
      ...searchHistory.map(historyItem => ({
        text: historyItem,
        highlight: highlightMatch(historyItem, input),
        icon: <FiClock className="w-4 h-4 text-gray-400" />
      })),
      // Smart phrase completions
      { text: 'How do I sign up for an account?', highlight: 'How do I sign up for an account?', icon: <FiHelpCircle className="w-4 h-4 text-purple-500" />},
      { text: 'What is property tokenization?', highlight: 'What is property tokenization?', icon: <FiHelpCircle className="w-4 h-4 text-purple-500" />}
    ];

    // Filter and sort by relevance using keyword matching and analytics
    newSuggestions = combinedSuggestions.filter(s =>
      s.text.toLowerCase().includes(lowerInput)
    ).sort((a, b) => {
      // Placeholder for future analytics-based sorting logic
      return 0;
    });

    // Limit to top 8 suggestions
    setSuggestions(newSuggestions.slice(0, 8));
  }, [faqData, searchHistory]);

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearchChange({ target: { value } });
    generateSuggestions(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    const searchText = suggestion.text;
    setQuery(searchText);
    handleSearchChange({ target: { value: searchText } });
    addToSearchHistory(searchText);
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const addToSearchHistory = (searchText) => {
    const newHistory = [searchText, ...searchHistory.filter(h => h !== searchText)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('faq_search_history', JSON.stringify(newHistory));
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const handleAIRequest = async () => {
    if (!query.trim()) return;

    addToSearchHistory(query);
    setIsLoading(true);
    try {
      const res = await fetch('https://dummy-ai-backend.com/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Failed to fetch AI response');

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('AI request error:', error);
      setResponse("Sorry, I couldn't find an answer to your question.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    handleAIRequest();
  };

  const clearQuery = () => {
    setQuery('');
    handleSearchChange({ target: { value: '' } });
    setShowSuggestions(false);
    setResponse('');
    searchRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative" ref={searchRef}>
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for answers or ask AI... (try typing 'How do I' or 'What is')"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            className="w-full pl-12 pr-24 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              {isLoading ? 'Loading...' : <FiSend />}
            </button>
          </div>
        </div>

        {/* Modern Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`group relative px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3 ${
                    index === selectedSuggestion 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm ring-1 ring-blue-200/50 scale-[1.02]' 
                      : 'hover:bg-gray-50/80 hover:shadow-sm hover:scale-[1.01]'
                  }`}
                >
                  {/* Unified icon styling */}
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-200">
                    {React.cloneElement(suggestion.icon, {
                      className: "w-4 h-4 text-blue-600"
                    })}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div 
                      className="font-medium text-gray-900 truncate leading-tight"
                      dangerouslySetInnerHTML={{ __html: suggestion.highlight }}
                    />
                    
                    {/* Only show category for FAQ items */}
                    {suggestion.category && (
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.category}
                      </div>
                    )}
                  </div>

                  {/* Modern arrow indicator */}
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    index === selectedSuggestion ? 'opacity-100' : ''
                  }`}>
                    <div className="p-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modern footer with subtle gradient */}
            <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-gray-100/50 px-4 py-2 rounded-b-xl">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-600 font-mono text-xs">↑↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-600 font-mono text-xs">↵</kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-600 font-mono text-xs">esc</kbd>
                  <span>close</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </form>

      {response && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">AI Assistant Response:</h4>
            <button
              onClick={() => setResponse('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-700">{response}</p>
        </div>
      )}

      <div className="mt-3 text-sm text-gray-600">
        {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
        {selectedCategories.length > 0 && (
          <span>
            {' '}
            in {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'}
          </span>
        )}
      </div>
    </div>
  );
};

export default UnifiedSearchAssistant;

