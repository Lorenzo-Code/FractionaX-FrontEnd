import React from 'react';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';

const TermsAndConditions = () => {
  // Generate SEO data for Terms and Conditions page
  const seoData = generatePageSEO({
    title: 'Terms and Conditions | FractionaX Legal Terms',
    description: 'Read FractionaX terms and conditions for our fractional real estate investment platform. Understand your rights, responsibilities, and platform usage guidelines.',
    keywords: [
      'fractionax terms conditions',
      'fractional real estate terms',
      'investment platform legal',
      'tokenized property terms',
      'blockchain investment agreement',
      'user agreement fractionax',
      'real estate platform terms',
      'FXCT token terms'
    ],
    url: '/terms-and-conditions',
  });

  // Structured data for legal document
  const structuredData = [
    generateStructuredData.breadcrumb([
      { name: "Home", url: "/" },
      { name: "Terms and Conditions", url: "/terms-and-conditions" }
    ]),
    generateStructuredData.webPage({
      title: seoData.title,
      description: seoData.description,
      url: '/terms-and-conditions',
      type: 'WebPage',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'LegalDocument',
      'name': 'FractionaX Terms and Conditions',
      'description': 'Legal terms and conditions governing the use of FractionaX fractional real estate investment platform',
      'url': 'https://fractionax.io/terms-and-conditions',
      'publisher': {
        '@type': 'Organization',
        'name': 'FractionaX'
      },
      'dateModified': new Date().toISOString(),
      'inLanguage': 'en-US'
    }
  ];

  return (
    <>
      <SEO
        {...seoData}
        structuredData={structuredData}
      >
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </SEO>
      
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
        <p>Our terms and conditions will be detailed here soon.</p>
      </div>
    </>
  );
};

export default TermsAndConditions;
