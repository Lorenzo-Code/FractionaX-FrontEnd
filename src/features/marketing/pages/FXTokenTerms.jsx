import React from 'react';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';

const FXTokenTerms = () => {
  // Generate SEO data for FX Token Terms page
  const seoData = generatePageSEO({
    title: 'FXCT Token Terms | FractionaX Utility Token Conditions',
    description: 'Read the official terms and conditions for FXCT utility tokens on FractionaX platform. Understand token usage, governance rights, and regulatory compliance.',
    keywords: [
      'FXCT token terms',
      'fractionax token conditions',
      'utility token agreement',
      'blockchain token terms',
      'cryptocurrency legal terms',
      'tokenomics agreement',
      'governance token terms',
      'DeFi token conditions',
      'Base blockchain tokens'
    ],
    url: '/fx-token-terms',
  });

  // Structured data for token terms document
  const structuredData = [
    generateStructuredData.breadcrumb([
      { name: "Home", url: "/" },
      { name: "FX Token Terms", url: "/fx-token-terms" }
    ]),
    generateStructuredData.webPage({
      title: seoData.title,
      description: seoData.description,
      url: '/fx-token-terms',
      type: 'WebPage',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'LegalDocument',
      'name': 'FXCT Token Terms and Conditions',
      'description': 'Legal terms governing the use, ownership, and transfer of FXCT utility tokens within the FractionaX ecosystem',
      'url': 'https://fractionax.io/fx-token-terms',
      'publisher': {
        '@type': 'Organization',
        'name': 'FractionaX'
      },
      'dateModified': new Date().toISOString(),
      'inLanguage': 'en-US',
      'about': {
        '@type': 'Thing',
        'name': 'FXCT Utility Token'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      'name': 'FXCT Utility Token',
      'description': 'Native utility token for the FractionaX fractional real estate investment platform',
      'provider': {
        '@type': 'Organization',
        'name': 'FractionaX'
      },
      'category': 'Utility Token',
      'audience': {
        '@type': 'Audience',
        'audienceType': 'Real Estate Investors'
      }
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
        <h1 className="text-4xl font-bold mb-4">FX Token Terms</h1>
        <p>Details about the FX Token terms and conditions will be available here soon.</p>
      </div>
    </>
  );
};

export default FXTokenTerms;

