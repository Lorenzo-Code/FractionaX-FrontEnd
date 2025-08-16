import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import { Search, Filter, Clock, Calendar, BookOpen, X } from 'lucide-react';
import { SEO } from '../../../shared/components';
import { getBlogs } from '../utils/apiClient';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        const blogPosts = data.blogs || [];
        
        // Filter for published blogs
        const publishedBlogs = blogPosts.filter(blog => {
          return blog.published === true;
        });
        
        setBlogs(publishedBlogs);
        const allTags = publishedBlogs.flatMap(blog => blog.tags || []);
        const uniqueTags = Array.from(new Set(allTags));
        setTags(['All', ...uniqueTags]);
      } catch (err) {
        console.error('❌ Failed to load blogs:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
        (blog.summary || '').toLowerCase().includes(search.toLowerCase()) ||
        (blog.wysiwygContent || '').toLowerCase().includes(search.toLowerCase());
      const matchesTag = selectedTag === 'All' || (blog.tags || []).includes(selectedTag);
      return matchesSearch && matchesTag;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [blogs, search, selectedTag, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedTag('All');
    setSortBy('newest');
  };

  const hasActiveFilters = search !== '' || selectedTag !== 'All' || sortBy !== 'newest';

  // Generate SEO data for blog listing page
  const seoData = {
    title: 'FractionaX Blog - Real Estate & Blockchain Insights',
    description: 'Explore insights on tokenized real estate, AI property analysis, blockchain technology, and the future of fractional investing. Stay updated with FractionaX.',
    keywords: [
      'real estate blog',
      'tokenized real estate insights',
      'blockchain property investment',
      'AI real estate analysis',
      'FXCT token updates',
      'DeFi real estate news',
      'fractional ownership guides'
    ],
    url: '/blog',
  };

  // Enhanced structured data for blog
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "FractionaX Blog",
    "description": "Expert insights on tokenized real estate, AI-driven property analysis, and blockchain investing.",
    "url": "https://fractionax.io/blog",
    "author": {
      "@type": "Organization",
      "name": "FractionaX"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FractionaX",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fractionax.io/assets/images/MainLogo1.webp"
      }
    },
    "blogPost": blogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt || blog.createdAt,
      "author": {
        "@type": "Person",
        "name": blog.author || "FractionaX Team"
      },
      "url": `https://fractionax.io/blog/${blog.slug}`,
      "description": blog.summary || blog.wysiwygContent?.slice(0, 160).replace(/<[^>]+>/g, '') + '...'
    }))
  };

  return (
    <>
      <SEO
        {...seoData}
        structuredData={blogStructuredData}
      >
        <meta name="robots" content="index, follow" />
        <meta name="article:section" content="Real Estate" />
        <meta name="article:tag" content="Tokenized Real Estate, Blockchain, AI, Investing" />
      </SEO>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-black">FractionaX Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights on tokenized real estate, AI, blockchain, and the future of investing
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${searchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search articles by title, content, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag === 'All' ? 'All Topics' : `#${tag}`}</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">A-Z Title</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Search: "{search}"
                  <button onClick={() => setSearch('')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTag !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  #{selectedTag}
                  <button onClick={() => setSelectedTag('All')} className="hover:bg-green-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sortBy !== 'newest' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Sort: {sortBy === 'oldest' ? 'Oldest First' : 'A-Z Title'}
                  <button onClick={() => setSortBy('newest')} className="hover:bg-purple-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredAndSortedBlogs.length === 0
                ? 'No articles found'
                : `${filteredAndSortedBlogs.length} article${filteredAndSortedBlogs.length === 1 ? '' : 's'} found`}
            </p>
          </div>
        )}

        {loading ? (
          <BlogSkeleton />
        ) : filteredAndSortedBlogs.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedBlogs.map(blog => (
              <BlogCard key={blog._id} blog={blog} readTime={calculateReadTime(blog.wysiwygContent)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function BlogCard({ blog, readTime }) {
  const hasImage = blog.image && blog.image.trim() !== '';

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className={`h-48 relative overflow-hidden ${hasImage
          ? 'bg-gray-200'
          : 'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}>
        {hasImage && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
              e.target.parentElement.classList.remove('bg-gray-200');
            }}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
        <div className="absolute bottom-4 left-4 right-4">
          <Link to={`/blog/${blog.slug}`}>
            <h2 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors line-clamp-2">
              {blog.title}
            </h2>
          </Link>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{dayjs(blog.createdAt).format('MMM D, YYYY')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {blog.summary || DOMPurify.sanitize(blog.wysiwygContent, { ALLOWED_TAGS: [] }).slice(0, 120) + '...'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(blog.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-md hover:bg-blue-100 hover:text-blue-700 cursor-pointer">
              #{tag}
            </span>
          ))}
          {blog.tags?.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">+{blog.tags.length - 3} more</span>
          )}
        </div>
        <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:gap-3 transition-all">
          <BookOpen className="w-4 h-4" /> Read Article <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </article>
  );
}

function BlogSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-6">
            <div className="flex gap-4 mb-3">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-md w-12" />
              <div className="h-6 bg-gray-200 rounded-md w-16" />
              <div className="h-6 bg-gray-200 rounded-md w-14" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div>
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {hasFilters ? 'No articles match your filters' : 'No blog posts yet'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {hasFilters
            ? "Try adjusting your search terms or filters to find what you're looking for."
            : 'Check back soon for insightful articles about tokenized real estate and blockchain technology.'}
        </p>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <X className="w-4 h-4" /> Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}