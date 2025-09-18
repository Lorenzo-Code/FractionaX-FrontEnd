import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, FileText, Hash } from 'lucide-react';
import DOMPurify from 'dompurify';

const EnhancedSearch = ({ 
  blogs = [], 
  onSearch, 
  placeholder = "Search articles by title, content, or tags...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('fractionax-blog-searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      return {
        articles: [],
        tags: [],
        recent: recentSearches.slice(0, 3)
      };
    }

    const term = searchTerm.toLowerCase();

    // Article suggestions
    const articleMatches = blogs
      .filter(blog => 
        blog.title.toLowerCase().includes(term) ||
        (blog.summary || '').toLowerCase().includes(term) ||
        blog.wysiwygContent?.toLowerCase().includes(term)
      )
      .slice(0, 4)
      .map(blog => ({
        type: 'article',
        id: blog._id,
        title: blog.title,
        summary: blog.summary || DOMPurify.sanitize(blog.wysiwygContent, { ALLOWED_TAGS: [] }).slice(0, 100),
        slug: blog.slug,
        readTime: calculateReadTime(blog.wysiwygContent),
        author: blog.author || 'FractionaX Team'
      }));

    // Tag suggestions
    const allTags = blogs.flatMap(blog => blog.tags || []);
    const tagMatches = [...new Set(allTags)]
      .filter(tag => tag.toLowerCase().includes(term))
      .slice(0, 5)
      .map(tag => ({
        type: 'tag',
        id: tag,
        name: tag,
        count: allTags.filter(t => t === tag).length
      }));

    return {
      articles: articleMatches,
      tags: tagMatches,
      recent: recentSearches.filter(search => 
        search.toLowerCase().includes(term)
      ).slice(0, 2)
    };
  }, [searchTerm, blogs, recentSearches]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // All suggestions flattened for keyboard navigation
  const allSuggestions = useMemo(() => {
    const items = [];
    
    if (suggestions.recent.length > 0) {
      suggestions.recent.forEach((search, index) => {
        items.push({ type: 'recent', value: search, index });
      });
    }
    
    suggestions.articles.forEach((article, index) => {
      items.push({ type: 'article', value: article, index });
    });
    
    suggestions.tags.forEach((tag, index) => {
      items.push({ type: 'tag', value: tag, index });
    });
    
    return items;
  }, [suggestions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFocusedIndex(-1);
    setIsOpen(value.length > 0);
    onSearch(value);
  };

  const handleInputFocus = () => {
    setIsOpen(searchTerm.length > 0 || recentSearches.length > 0);
  };

  const handleInputBlur = (e) => {
    // Delay closing to allow click events on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSuggestionClick(allSuggestions[focusedIndex]);
        } else if (searchTerm.trim()) {
          handleSearch(searchTerm);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    switch (suggestion.type) {
      case 'article':
        // Navigate to article
        window.location.href = `/blog/${suggestion.value.slug}`;
        break;
      
      case 'tag':
        handleSearch(`#${suggestion.value.name}`);
        break;
      
      case 'recent':
        handleSearch(suggestion.value);
        break;
    }
  };

  const handleSearch = (term) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    // Add to recent searches
    const newRecent = [cleanTerm, ...recentSearches.filter(s => s !== cleanTerm)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('fractionax-blog-searches', JSON.stringify(newRecent));

    // Update search term and close dropdown
    setSearchTerm(cleanTerm);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSearch(cleanTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
    setFocusedIndex(-1);
    onSearch('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('fractionax-blog-searches');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isOpen ? 'text-blue-500' : 'text-gray-400'
        } transition-colors`} />
        
        <input
          ref={searchRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          autoComplete="off"
        />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {searchTerm.length < 2 && suggestions.recent.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              </div>
              {suggestions.recent.map((search, index) => {
                const isActive = focusedIndex === index;
                return (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Clock className="w-3 h-3 inline mr-2" />
                    {search}
                  </button>
                );
              })}
            </div>
          )}

          {/* Article Suggestions */}
          {suggestions.articles.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500 block mb-2">Articles</span>
              {suggestions.articles.map((article, index) => {
                const globalIndex = suggestions.recent.length + index;
                const isActive = focusedIndex === globalIndex;
                return (
                  <button
                    key={article.id}
                    onClick={() => handleSuggestionClick({ type: 'article', value: article })}
                    className={`w-full text-left p-2 rounded transition-colors ${
                      isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className={`font-medium text-sm line-clamp-1 ${
                          isActive ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{article.author}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{article.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tag Suggestions */}
          {suggestions.tags.length > 0 && (
            <div className="p-3">
              <span className="text-sm font-medium text-gray-500 block mb-2">Topics</span>
              <div className="flex flex-wrap gap-2">
                {suggestions.tags.map((tag, index) => {
                  const globalIndex = suggestions.recent.length + suggestions.articles.length + index;
                  const isActive = focusedIndex === globalIndex;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleSuggestionClick({ type: 'tag', value: tag })}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors ${
                        isActive 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Hash className="w-3 h-3" />
                      {tag.name}
                      <span className="text-xs opacity-60">({tag.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchTerm.length >= 2 && 
           suggestions.articles.length === 0 && 
           suggestions.tags.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{searchTerm}"</p>
              <p className="text-xs mt-1">Try different keywords or browse by topics</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
