import React from 'react';
import useDocumentHead from '../hooks/useDocumentHead';

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  openGraph = {},
  twitter = {},
  structuredData,
  children,
}) => {
  const safe = (val) =>
    typeof val === 'string' || typeof val === 'number' ? String(val) : undefined;

  // Sanitize props for the hook
  const sanitizedProps = {
    title: safe(title),
    description: safe(description),
    keywords: keywords && (
      Array.isArray(keywords)
        ? keywords.filter(Boolean).map(safe).join(', ')
        : safe(keywords)
    ),
    canonical: safe(canonical),
    openGraph: {
      type: safe(openGraph.type),
      title: safe(openGraph.title),
      description: safe(openGraph.description),
      url: safe(openGraph.url),
      site_name: safe(openGraph.site_name),
      publishedTime: safe(openGraph.publishedTime),
      modifiedTime: safe(openGraph.modifiedTime),
      author: safe(openGraph.author),
      images: (openGraph.images || []).filter(img => img?.url).map(img => ({
        url: safe(img.url),
        width: safe(img.width),
        height: safe(img.height),
        alt: safe(img.alt)
      })).filter(img => img.url)
    },
    twitter: {
      card: safe(twitter.card),
      site: safe(twitter.site),
      creator: safe(twitter.creator),
      title: safe(twitter.title),
      description: safe(twitter.description),
      image: safe(twitter.image)
    },
    structuredData
  };

  // Use the custom hook to update document head
  useDocumentHead(sanitizedProps);

  return (
    <>
      {children}
    </>
  );
};

export default SEO;
