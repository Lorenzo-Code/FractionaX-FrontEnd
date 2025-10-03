import React from 'react';
import { SEO } from '../../../shared/components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';

const PrivacyPolicy = () => {
  // Generate SEO data for Privacy Policy page
  const seoData = generatePageSEO({
    title: 'Privacy Policy | FractionaX Data Protection & Privacy',
    description: 'Learn how FractionaX protects your personal information and data privacy. Our comprehensive privacy policy covers data collection, usage, and security practices.',
    keywords: [
      'fractionax privacy policy',
      'data protection fractionax',
      'personal information security',
      'blockchain data privacy',
      'investment platform privacy',
      'user data protection',
      'GDPR compliance',
      'cryptocurrency privacy'
    ],
    url: '/privacy-policy',
  });

  // Structured data for privacy policy document
  const structuredData = [
    generateStructuredData.breadcrumb([
      { name: "Home", url: "/" },
      { name: "Privacy Policy", url: "/privacy-policy" }
    ]),
    generateStructuredData.webPage({
      title: seoData.title,
      description: seoData.description,
      url: '/privacy-policy',
      type: 'WebPage',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'LegalDocument',
      'name': 'FractionaX Privacy Policy',
      'description': 'Privacy policy detailing how FractionaX collects, uses, and protects user personal information and data',
      'url': 'https://fractionax.io/privacy-policy',
      'publisher': {
        '@type': 'Organization',
        'name': 'FractionaX'
      },
      'dateModified': new Date().toISOString(),
      'inLanguage': 'en-US',
      'about': {
        '@type': 'Thing',
        'name': 'Data Privacy and Protection'
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p>Our privacy policy will be detailed here soon.</p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
