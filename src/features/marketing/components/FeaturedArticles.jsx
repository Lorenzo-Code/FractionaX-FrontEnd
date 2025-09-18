import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Star, Eye } from 'lucide-react';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';

const FeaturedArticles = ({ blogs = [], className = '' }) => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  useEffect(() => {
    if (blogs.length === 0) return;

    // Algorithm to determine featured articles
    const scoredBlogs = blogs.map(blog => {
      const daysOld = dayjs().diff(dayjs(blog.createdAt), 'days');
      const ageScore = Math.max(0, 30 - daysOld) / 30; // Higher score for newer articles
      const tagsScore = (blog.tags?.length || 0) * 0.1; // More tags = slightly higher score
      const contentLength = blog.wysiwygContent?.replace(/<[^>]+>/g, '').length || 0;
      const lengthScore = Math.min(1, contentLength / 2000); // Longer articles get higher score
      
      // Weighted scoring system
      const totalScore = (ageScore * 0.4) + (lengthScore * 0.4) + (tagsScore * 0.2);
      
      return {
        ...blog,
        score: totalScore
      };
    });

    // Sort by score and take top 3-6 articles
    const featured = scoredBlogs
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(6, Math.max(3, blogs.length)));

    setFeaturedBlogs(featured);
  }, [blogs]);

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  if (featuredBlogs.length === 0) return null;

  return (
    <section className={`mb-16 ${className}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
        </div>
        <div className="h-1 flex-grow bg-gradient-to-r from-blue-500 to-transparent opacity-20 rounded"></div>
      </div>

      <div className="grid gap-8">
        {/* Hero Featured Article */}
        <HeroFeaturedCard blog={featuredBlogs[0]} readTime={calculateReadTime(featuredBlogs[0].wysiwygContent)} />
        
        {/* Grid of Additional Featured Articles */}
        {featuredBlogs.length > 1 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.slice(1).map(blog => (
              <FeaturedCard 
                key={blog._id} 
                blog={blog} 
                readTime={calculateReadTime(blog.wysiwygContent)} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Star className="w-4 h-4 text-yellow-500" />
          Featured content updates weekly based on relevance and engagement
        </div>
      </div>
    </section>
  );
};

// Hero Featured Article Card (larger, more prominent)
const HeroFeaturedCard = ({ blog, readTime }) => {
  const hasImage = blog.image && blog.image.trim() !== '';

  return (
    <article className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="grid lg:grid-cols-2 gap-0 min-h-[300px]">
        {/* Image Section */}
        <div className={`relative overflow-hidden ${hasImage 
            ? 'bg-gray-200' 
            : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700'
          }`}>
          {hasImage && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'via-purple-600', 'to-indigo-700');
                e.target.parentElement.classList.remove('bg-gray-200');
              }}
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              <Star className="w-4 h-4" />
              Featured
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{dayjs(blog.createdAt).format('MMM D, YYYY')}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{readTime} min read</span>
              </div>
            </div>
          </div>

          <Link to={`/blog/${blog.slug}`}>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-3">
              {blog.title}
            </h3>
          </Link>

          <p className="text-gray-700 mb-6 line-clamp-3 text-lg leading-relaxed">
            {blog.summary || DOMPurify.sanitize(blog.wysiwygContent, { ALLOWED_TAGS: [] }).slice(0, 200) + '...'}
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.slice(0, 3).map(tag => (
                <span key={tag} className="bg-blue-50 text-blue-700 px-3 py-1 text-sm rounded-full hover:bg-blue-100 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-sm text-gray-500">+{blog.tags.length - 3} more</span>
              )}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {blog.author ? blog.author.charAt(0).toUpperCase() : 'F'}
            </div>
            <span className="text-sm font-medium text-gray-700">{blog.author || 'FractionaX Team'}</span>
          </div>

          <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold group-hover:gap-3 transition-all">
            Read Full Article <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

// Regular Featured Article Card
const FeaturedCard = ({ blog, readTime }) => {
  const hasImage = blog.image && blog.image.trim() !== '';

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className={`h-48 relative overflow-hidden ${hasImage
          ? 'bg-gray-200'
          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
        }`}>
        {hasImage && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-indigo-600');
              e.target.parentElement.classList.remove('bg-gray-200');
            }}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300" />
        
        {/* Featured Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow">
            Featured
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{dayjs(blog.createdAt).format('MMM D')}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{readTime} min</span>
          </div>
        </div>

        <Link to={`/blog/${blog.slug}`}>
          <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
            {blog.title}
          </h4>
        </Link>

        <p className="text-gray-700 mb-4 line-clamp-3 text-sm">
          {blog.summary || DOMPurify.sanitize(blog.wysiwygContent, { ALLOWED_TAGS: [] }).slice(0, 120) + '...'}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                #{tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Author & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              {blog.author ? blog.author.charAt(0).toUpperCase() : 'F'}
            </div>
            <span className="text-xs text-gray-600">{blog.author || 'FractionaX Team'}</span>
          </div>

          <Link to={`/blog/${blog.slug}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:underline transition-colors">
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FeaturedArticles;
