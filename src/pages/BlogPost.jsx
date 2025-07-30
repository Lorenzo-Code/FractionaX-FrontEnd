import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { smartFetch } from "../utils/apiClient";
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, Twitter, Linkedin, Facebook, Link2, Copy } from 'lucide-react';
import dayjs from 'dayjs';
import Footer from "../components/common/Footer";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await smartFetch(`/api/blogs/${slug}`);
        const data = await res.json();
        const currentPost = data.post || data;
        setPost(currentPost);
        
        // Fetch related posts
        if (currentPost) {
          await fetchRelatedPosts(currentPost);
        }
      } catch (err) {
        console.error("❌ Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const fetchRelatedPosts = async (currentPost) => {
    try {
      const res = await smartFetch('/api/blogs');
      const data = await res.json();
      
      if (Array.isArray(data.blogs)) {
        // Find related posts based on shared tags
        const related = data.blogs
          .filter(blog => blog._id !== currentPost._id) // Exclude current post
          .map(blog => {
            const sharedTags = (blog.tags || []).filter(tag => 
              (currentPost.tags || []).includes(tag)
            );
            return { ...blog, sharedTagCount: sharedTags.length };
          })
          .filter(blog => blog.sharedTagCount > 0) // Only include posts with shared tags
          .sort((a, b) => {
            // Sort by shared tags first, then by date
            if (a.sharedTagCount !== b.sharedTagCount) {
              return b.sharedTagCount - a.sharedTagCount;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .slice(0, 3); // Take top 3
        
        // If we don't have enough related posts, fill with recent posts
        if (related.length < 3) {
          const recentPosts = data.blogs
            .filter(blog => blog._id !== currentPost._id && !related.find(r => r._id === blog._id))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3 - related.length);
          
          related.push(...recentPosts);
        }
        
        setRelatedPosts(related);
      }
    } catch (err) {
      console.error('❌ Failed to load related posts:', err);
    }
  };

  // Calculate reading time
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h3>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(post.content || post.wysiwygContent);

  return (
    <>
      <SEO 
        title={`${post.title} | FractionaX Blog`}
        description={post.summary || post.wysiwygContent?.replace(/<[^>]+>/g, '').slice(0, 160) + '...' || 'Read the latest insights on real estate investment and blockchain technology from FractionaX.'}
        keywords={post.tags || ['real estate', 'blockchain', 'investment', 'tokenization', 'FractionaX']}
        canonical={`/blog/${post.slug}`}
        openGraph={{
          type: 'article',
          title: post.title,
          description: post.summary || post.wysiwygContent?.replace(/<[^>]+>/g, '').slice(0, 160) + '...',
          url: `/blog/${post.slug}`,
          site_name: 'FractionaX',
          images: post.image ? [{
            url: post.image,
            width: 1200,
            height: 630,
            alt: post.title
          }] : undefined,
          publishedTime: post.createdAt,
          modifiedTime: post.updatedAt,
          author: post.author || 'FractionaX'
        }}
        twitter={{
          card: 'summary_large_image',
          site: '@FractionaX',
          creator: '@FractionaX',
          title: post.title,
          description: post.summary || post.wysiwygContent?.replace(/<[^>]+>/g, '').slice(0, 160) + '...',
          image: post.image
        }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.summary || post.wysiwygContent?.replace(/<[^>]+>/g, '').slice(0, 160) + '...',
          "image": post.image,
          "author": {
            "@type": "Person",
            "name": post.author || "FractionaX"
          },
          "publisher": {
            "@type": "Organization",
            "name": "FractionaX",
            "logo": {
              "@type": "ImageObject",
              "url": "/logo.png"
            }
          },
          "datePublished": post.createdAt,
          "dateModified": post.updatedAt || post.createdAt,
          "articleSection": "Real Estate Investment",
          "keywords": post.tags?.join(', ') || 'real estate, blockchain, investment'
        }}
      />
      <article className="max-w-4xl mx-auto py-10 px-4">
        {/* Navigation */}
      <div className="mb-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
          {post.title}
        </h1>
        
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{post.author || 'FractionaX'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{dayjs(post.createdAt).format('MMMM D, YYYY')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="mb-10">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg" 
          />
        </div>
      )}

      {/* Article Content */}
      <div 
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700" 
        dangerouslySetInnerHTML={{ __html: post.content || post.wysiwygContent }} 
      />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} />
      )}

      {/* Share Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoyed this article?</h3>
          <p className="text-gray-600">Share it with others who might find it interesting.</p>
        </div>
        <SocialShare title={post.title} url={window.location.href} />
      </div>

      {/* Back to Blog CTA */}
      <div className="mt-12 text-center">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <BookOpen className="w-4 h-4" />
          Read More Articles
        </Link>
      </div>
    </article>
    </>
  );
};

// Related Posts Component
function RelatedPosts({ posts }) {
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Articles</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => {
          const hasImage = post.image && post.image.trim() !== '';
          
          return (
            <article key={post._id} className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              {/* Image or Gradient Header */}
              <div className={`h-32 relative overflow-hidden ${
                hasImage 
                  ? 'bg-gray-200' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {hasImage && (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
                      e.target.parentElement.classList.remove('bg-gray-200');
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-200" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Link to={`/blog/${post.slug}`}>
                    <h4 className="text-white font-semibold text-sm group-hover:text-blue-100 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>
                </div>
              </div>
            
            <div className="p-4">
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{dayjs(post.createdAt).format('MMM D')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{calculateReadTime(post.wysiwygContent)} min</span>
                </div>
              </div>
              
              {/* Summary */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {post.summary || 
                 post.wysiwygContent?.replace(/<[^>]+>/g, '').slice(0, 80) + '...'}
              </p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="text-xs text-gray-500 px-1">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
              
              {/* Read More */}
              <Link 
                to={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:underline transition-colors"
              >
                Read Article →
              </Link>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}

// Social Share Component
function SocialShare({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: title,
    text: `Check out this article: ${title}`,
    url: url
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-500 hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-700 hover:text-white'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-600 hover:text-white'
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {/* Social Platform Buttons */}
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg transition-all duration-200 ${social.color}`}
            aria-label={`Share on ${social.name}`}
          >
            <IconComponent className="w-4 h-4" />
            <span className="font-medium">{social.name}</span>
          </a>
        );
      })}
      
      {/* Native Share or Copy Link */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200"
        aria-label="Share or copy link"
      >
        {navigator.share ? (
          <>
            <Share2 className="w-4 h-4" />
            <span className="font-medium">Share</span>
          </>
        ) : (
          <>
            {copied ? (
              <>
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="font-medium text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="font-medium">Copy Link</span>
              </>
            )}
          </>
        )}
      </button>
    </div>
  );
}

// Loading Skeleton for Blog Post
function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-pulse">
      {/* Navigation */}
      <div className="mb-8">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="h-12 bg-gray-200 rounded mb-6" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" />
        
        <div className="flex gap-6 mb-6">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        <div className="flex gap-2 mb-8">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-12" />
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-10">
        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl" />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mt-8" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded" />
      </div>
      < Footer />
    </div>
  );
}

export default BlogPost;
