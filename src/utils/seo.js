// SEO utility functions for FractionaX platform

export const siteConfig = {
  name: 'FractionaX',
  description: 'Tokenized real estate investing with AI-driven deal discovery, smart contracts, and fractional ownership on Base blockchain.',
  url: 'https://fractionax.io',
  ogImage: 'https://fractionax.io/og-image1.png',
  twitterHandle: '@FractionaX',
  keywords: 'tokenized real estate, FXCT token, fractional investing, AI real estate, Base blockchain, DeFi, smart contracts',
};

export const generatePageSEO = ({
  title,
  description,
  keywords = [],
  image = siteConfig.ogImage,
  url = '',
  type = 'website',
  publishedTime = null,
  modifiedTime = null,
  author = null,
}) => {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullUrl = `${siteConfig.url}${url}`;
  const allKeywords = [...siteConfig.keywords.split(', '), ...keywords].join(', ');

  return {
    title: fullTitle,
    description: description || siteConfig.description,
    canonical: fullUrl,
    openGraph: {
      type,
      title: fullTitle,
      description: description || siteConfig.description,
      url: fullUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      site_name: siteConfig.name,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { author }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: fullTitle,
      description: description || siteConfig.description,
      image,
    },
    keywords: allKeywords,
  };
};

export const generateBlogPostSEO = (post) => {
  return generatePageSEO({
    title: post.title,
    description: post.excerpt || post.content?.substring(0, 160),
    keywords: post.tags || [],
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
    author: post.author,
  });
};

export const generatePropertySEO = (property) => {
  return generatePageSEO({
    title: `${property.title} - Tokenized Real Estate Investment`,
    description: `Invest in ${property.title} through fractional ownership. ${property.description?.substring(0, 120)}`,
    keywords: ['real estate investment', 'tokenized property', property.location, property.type],
    url: `/marketplace/${property.id}`,
    image: property.images?.[0] || siteConfig.ogImage,
  });
};

export const generateStructuredData = {
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/assets/images/MainLogo1.webp`,
      width: 600,
      height: 60,
      contentUrl: `${siteConfig.url}/assets/images/MainLogo1.webp`,
    },
    image: {
      '@type': 'ImageObject',  
      url: `${siteConfig.url}/favicon1.svg`,
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'FractionaX Team',
    },
    sameAs: [
      `https://twitter.com/${siteConfig.twitterHandle.replace('@', '')}`,
      'https://github.com/Lorenzo-Code/FractionaX-FrontEnd',
      // Add other social media URLs
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@fractionax.io',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    knowsAbout: [
      'Real Estate Investment',
      'Blockchain Technology', 
      'Tokenization',
      'Cryptocurrency',
      'Base Network',
      'Smart Contracts'
    ],
  }),

  website: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),

  blogPost: (post) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content?.substring(0, 160),
    image: post.featuredImage || siteConfig.ogImage,
    author: {
      '@type': 'Person',
      name: post.author || 'FractionaX Team',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/assets/images/MainLogo1.webp`,
      },
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
  }),

  realEstateProperty: (property) => ({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${siteConfig.url}/marketplace/${property.id}`,
    image: property.images || [],
    price: property.tokenPrice,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    ...(property.location && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location,
      },
    }),
  }),

  breadcrumb: (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }),

  webPage: ({ title, description, url, type = 'WebPage' }) => ({
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description: description,
    url: `${siteConfig.url}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  }),

  service: ({ name, description, url, serviceType = 'FinancialService' }) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    name,
    description,
    url: `${siteConfig.url}${url}`,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: 'Global',
    category: 'Financial Services',
  }),

  faqPage: (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),
};
