
import { useEffect } from 'react';

const useDocumentHead = (props) => {
  useEffect(() => {
    const { title, description, keywords, canonical, openGraph, twitter, structuredData } = props;

    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateProperty = (property, content) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

    if (description) {
      updateMeta('description', description);
    }
    if (keywords) {
        updateMeta('keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    }

    // Update canonical link
    if (canonical) {
        let element = document.querySelector('link[rel="canonical"]');
        if (!element) {
          element = document.createElement('link');
          element.setAttribute('rel', 'canonical');
          document.head.appendChild(element);
        }
        element.setAttribute('href', canonical);
      }

    // OpenGraph
    if(openGraph) {
        if (openGraph.type) updateProperty('og:type', openGraph.type);
        if (openGraph.title) updateProperty('og:title', openGraph.title);
        if (openGraph.description) updateProperty('og:description', openGraph.description);
        if (openGraph.url) updateProperty('og:url', openGraph.url);
        if (openGraph.site_name) updateProperty('og:site_name', openGraph.site_name);
        if (openGraph.publishedTime) updateProperty('article:published_time', openGraph.publishedTime);
        if (openGraph.modifiedTime) updateProperty('article:modified_time', openGraph.modifiedTime);
        if (openGraph.author) updateProperty('article:author', openGraph.author);
        if (openGraph.images) {
            openGraph.images.forEach(image => {
                if (image.url) updateProperty('og:image', image.url);
                if (image.width) updateProperty('og:image:width', image.width);
                if (image.height) updateProperty('og:image:height', image.height);
                if (image.alt) updateProperty('og:image:alt', image.alt);
            });
        }
    }


    // Twitter
    if (twitter) {
        if (twitter.card) updateMeta('twitter:card', twitter.card);
        if (twitter.site) updateMeta('twitter:site', twitter.site);
        if (twitter.creator) updateMeta('twitter:creator', twitter.creator);
        if (twitter.title) updateMeta('twitter:title', twitter.title);
        if (twitter.description) updateMeta('twitter:description', twitter.description);
        if (twitter.image) updateMeta('twitter:image', twitter.image);
    }


    // Structured data
    if (structuredData) {
      let element = document.querySelector('script[type="application/ld+json"]');
      if (!element) {
        element = document.createElement('script');
        element.setAttribute('type', 'application/ld+json');
        document.head.appendChild(element);
      }
      element.innerHTML = JSON.stringify(structuredData);
    }

  }, [props]);
};

export default useDocumentHead;

