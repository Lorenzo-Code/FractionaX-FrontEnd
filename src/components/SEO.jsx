import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  openGraph,
  twitter,
  structuredData,
  children,
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Meta Tags */}
      {openGraph && (
        <>
          <meta property="og:type" content={openGraph.type} />
          <meta property="og:title" content={openGraph.title} />
          <meta property="og:description" content={openGraph.description} />
          <meta property="og:url" content={openGraph.url} />
          <meta property="og:site_name" content={openGraph.site_name} />
          
          {openGraph.images?.map((image, index) => (
            <React.Fragment key={index}>
              <meta property="og:image" content={image.url} />
              <meta property="og:image:width" content={image.width} />
              <meta property="og:image:height" content={image.height} />
              <meta property="og:image:alt" content={image.alt} />
            </React.Fragment>
          ))}
          
          {openGraph.publishedTime && (
            <meta property="article:published_time" content={openGraph.publishedTime} />
          )}
          {openGraph.modifiedTime && (
            <meta property="article:modified_time" content={openGraph.modifiedTime} />
          )}
          {openGraph.author && (
            <meta property="article:author" content={openGraph.author} />
          )}
        </>
      )}
      
      {/* Twitter Meta Tags */}
      {twitter && (
        <>
          <meta name="twitter:card" content={twitter.card} />
          <meta name="twitter:site" content={twitter.site} />
          <meta name="twitter:creator" content={twitter.creator} />
          <meta name="twitter:title" content={twitter.title} />
          <meta name="twitter:description" content={twitter.description} />
          <meta name="twitter:image" content={twitter.image} />
        </>
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional custom head elements */}
      {children}
    </Helmet>
  );
};

export default SEO;
