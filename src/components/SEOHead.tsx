import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'AllInWeb3 - Your Gateway to Web3 World',
  description = 'Comprehensive Web3 platform offering educational resources, real-time analytics, development tools, and professional services for blockchain projects.',
  keywords = 'Web3, Blockchain, DeFi, NFT, Cryptocurrency, Smart Contracts, Blockchain Development, Web3 Education',
  image = 'https://allinweb3.com/og-image.jpg'
}) => {
  const { pathname } = useLocation();
  const canonicalUrl = `https://allinweb3.com${pathname}`;

  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AllInWeb3',
    url: 'https://allinweb3.com',
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://allinweb3.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;