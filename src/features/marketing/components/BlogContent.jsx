import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { useHeadingIds } from './TableOfContents';

const BlogContent = ({ post, readTime, relatedPosts, onShare }) => {
  // Use the hook to add IDs to headings
  useHeadingIds(post.content || post.wysiwygContent);

  return (
    <>
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
          {post.title}
        </h1>

        {/* Summary */}
        {post.summary && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              {post.summary}
            </p>
          </div>
        )}

        {/* Meta Information */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex flex-wrap items-center gap-6 text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {post.author ? post.author.charAt(0).toUpperCase() : 'F'}
              </div>
              <div>
                <span className="font-medium text-gray-900">{post.author || 'FractionaX Team'}</span>
                <div className="text-sm text-gray-500">Author</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-medium">{dayjs(post.createdAt).format('MMMM D, YYYY')}</span>
                <div className="text-sm text-gray-500">Published</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-medium text-blue-700">{readTime} min read</span>
                <div className="text-sm text-gray-500">Reading time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-sm font-medium text-gray-500 mr-2">Topics:</span>
            {post.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full hover:bg-blue-200 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Table of Contents - Mobile only */}
      <div className="block lg:hidden mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Table of Contents</h3>
          <p className="text-sm text-gray-600">Navigate this article on desktop for an interactive table of contents.</p>
        </div>
      </div>

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
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content || post.wysiwygContent }}
      />

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Continue Learning</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map(relatedPost => {
              const hasImage = relatedPost.image && relatedPost.image.trim() !== '';
              const calculateReadTime = (content) => {
                const wordsPerMinute = 200;
                const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
                return Math.max(1, Math.ceil(words / wordsPerMinute));
              };

              return (
                <article key={relatedPost._id} className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                  {/* Image or Gradient Header */}
                  <div className={`h-32 relative overflow-hidden ${hasImage
                      ? 'bg-gray-200'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                    {hasImage && (
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
                          e.target.parentElement.classList.remove('bg-gray-200');
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-200" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Link to={`/blog/${relatedPost.slug}`}>
                        <h4 className="text-white font-semibold text-sm group-hover:text-blue-100 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </Link>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dayjs(relatedPost.createdAt).format('MMM D')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{calculateReadTime(relatedPost.wysiwygContent)} min</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {relatedPost.summary ||
                        relatedPost.wysiwygContent?.replace(/<[^>]+>/g, '').slice(0, 80) + '...'}
                    </p>

                    {/* Tags */}
                    {relatedPost.tags && relatedPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {relatedPost.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                        {relatedPost.tags.length > 2 && (
                          <span className="text-xs text-gray-500 px-1">
                            +{relatedPost.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read More */}
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:underline transition-colors"
                    >
                      Continue Reading →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Share Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Found this helpful?</h3>
          <p className="text-gray-600">Share this knowledge with others in the community.</p>
        </div>
        {onShare && onShare()}
      </div>

      {/* Back to Blog CTA */}
      <div className="mt-12 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <BookOpen className="w-4 h-4" />
          Explore More Articles
        </Link>
      </div>
    </>
  );
};

export default BlogContent;
