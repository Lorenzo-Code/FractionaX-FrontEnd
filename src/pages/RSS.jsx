import React, { useEffect, useState } from 'react';
import { smartFetch } from '../utils/apiClient';
import SEO from '../components/SEO';

const RSS = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await smartFetch('/api/blogs');
        const data = await res.json();
        
        if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
          generateRSSFeed(data.blogs);
        }
      } catch (err) {
        console.error('❌ Failed to load blogs for RSS:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const generateRSSFeed = (blogs) => {
    const rssContent = generateRSSXML(blogs);
    
    // Set the content type and return the RSS
    const blob = new Blob([rssContent], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download or display
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fractionax-blog-feed.xml';
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  const generateRSSXML = (blogs) => {
    const baseUrl = 'https://fractionax.io'; // Change to your actual domain
    const currentDate = new Date().toUTCString();
    
    const items = blogs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20) // Limit to 20 latest posts
      .map(blog => {
        const cleanContent = blog.summary || 
          (blog.wysiwygContent || '').replace(/<[^>]+>/g, '').slice(0, 300) + '...';
        
        return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blog/${blog.slug}</link>
      <guid>${baseUrl}/blog/${blog.slug}</guid>
      <description><![CDATA[${cleanContent}]]></description>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
      <author>${blog.author || 'FractionaX'}</author>
      ${(blog.tags || []).map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>`;
      }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FractionaX Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Insights on tokenized real estate, AI, blockchain, and the future of investing</description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>FractionaX Blog</title>
      <link>${baseUrl}/blog</link>
    </image>${items}
  </channel>
</rss>`;
  };

  if (loading) {
    return (
      <>
        <SEO
          title="RSS Feed | FractionaX Blog"
          description="Subscribe to the FractionaX blog RSS feed for the latest insights on real estate tokenization, AI-powered property search, and blockchain technology."
          keywords={["RSS feed", "blog feed", "FractionaX blog", "real estate news", "tokenization updates", "blockchain insights"]}
          canonical="/rss"
          openGraph={{
            type: 'website',
            title: 'RSS Feed | FractionaX Blog',
            description: 'Subscribe to the FractionaX blog RSS feed for the latest insights on real estate tokenization and blockchain technology.',
            url: '/rss',
            site_name: 'FractionaX'
          }}
        />
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Generating RSS feed...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="RSS Feed | FractionaX Blog"
        description="Subscribe to the FractionaX blog RSS feed for the latest insights on real estate tokenization, AI-powered property search, and blockchain technology."
        keywords={["RSS feed", "blog feed", "FractionaX blog", "real estate news", "tokenization updates", "blockchain insights"]}
        canonical="/rss"
        openGraph={{
          type: 'website',
          title: 'RSS Feed | FractionaX Blog',
          description: 'Subscribe to the FractionaX blog RSS feed for the latest insights on real estate tokenization and blockchain technology.',
          url: '/rss',
          site_name: 'FractionaX'
        }}
      />
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">RSS Feed Generated</h1>
      <p className="text-gray-600 mb-8">
        Your RSS feed has been downloaded. You can also access it at:
      </p>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <code className="text-sm break-all">https://fractionax.io/rss</code>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => generateRSSFeed(blogs)}
          className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download RSS Feed Again
        </button>
        <a
          href="/blog"
          className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Blog
        </a>
      </div>
      </div>
    </>
  );
};

export default RSS;
