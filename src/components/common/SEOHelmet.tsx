/**
 * SEO Helmet Component
 * Wrapper around React Helmet Async for consistent SEO meta tags
 * Provides sensible defaults and easy customization for page-specific SEO
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOMeta, OpenGraphMeta, PageSEOConfig } from '@/types/seo';

// Default site configuration
const SITE_CONFIG = {
  title: 'React Blog',
  description: 'A modern, SEO-optimized React blog built with TypeScript and Vite',
  url: 'https://yourblog.com',
  author: 'Your Name',
  social: {
    twitter: '@yourtwitter',
  },
};

// Props for SEOHelmet component
interface SEOHelmetProps {
  /** Page-specific SEO data */
  seo?: Partial<PageSEOConfig>;
  /** Page title (will be combined with site title) */
  title?: string;
  /** Page description (overrides default if provided) */
  description?: string;
  /** Canonical URL for the page */
  canonicalUrl?: string;
  /** Whether to noindex the page */
  noindex?: boolean;
  /** Whether to nofollow the page */
  nofollow?: boolean;
  /** Open Graph image URL */
  ogImage?: string;
  /** Open Graph type */
  ogType?: string;
  /** Additional meta tags */
  meta?: Array<{ name: string; content: string }>;
}

/**
 * SEOHelmet Component
 * Manages all SEO meta tags for a page with sensible defaults
 * Supports Open Graph, Twitter Cards, and structured data
 */
const SEOHelmet: React.FC<SEOHelmetProps> = ({
  seo = {},
  title,
  description,
  canonicalUrl,
  noindex = false,
  nofollow = false,
  ogImage,
  ogType = 'website',
  meta = [],
}) => {
  // Merge provided SEO data with defaults
  const mergedMeta: SEOMeta = {
    title: title || seo.meta?.title || SITE_CONFIG.title,
    description: description || seo.meta?.description || SITE_CONFIG.description,
    keywords: seo.meta?.keywords || 'react, blog, typescript, vite',
    canonical: canonicalUrl || seo.meta?.canonical || undefined,
    robots: (noindex || nofollow) 
      ? `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`
      : seo.meta?.robots || undefined,
  };

  const mergedOpenGraph: OpenGraphMeta = {
    title: mergedMeta.title,
    description: mergedMeta.description,
    type: (ogType as 'website' | 'article') || seo.openGraph?.type || 'website',
    url: mergedMeta.canonical || window.location.href,
    image: ogImage || seo.openGraph?.image || '/images/og-default.jpg',
    siteName: SITE_CONFIG.title,
  };

  // Construct full title (page title + site title)
  const fullTitle = mergedMeta.title.includes(SITE_CONFIG.title)
    ? mergedMeta.title
    : `${mergedMeta.title} | ${SITE_CONFIG.title}`;

  // Construct canonical URL
  const fullCanonicalUrl = mergedMeta.canonical
    ? new URL(mergedMeta.canonical, SITE_CONFIG.url).toString()
    : undefined;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={mergedMeta.description} />
      
      {/* Keywords */}
      {mergedMeta.keywords && (
        <meta name="keywords" content={mergedMeta.keywords} />
      )}
      
      {/* Robots meta */}
      {mergedMeta.robots && (
        <meta name="robots" content={mergedMeta.robots} />
      )}
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={mergedMeta.description} />
      <meta property="og:type" content={mergedOpenGraph.type} />
      <meta property="og:url" content={mergedOpenGraph.url} />
      <meta property="og:image" content={mergedOpenGraph.image} />
      <meta property="og:site_name" content={mergedOpenGraph.siteName} />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={mergedMeta.description} />
      <meta name="twitter:image" content={mergedOpenGraph.image} />
      <meta name="twitter:creator" content={SITE_CONFIG.social.twitter} />
      
      {/* Additional meta tags */}
      {meta.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}
      
      {/* Structured data for better search engine understanding */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_CONFIG.title,
          description: SITE_CONFIG.description,
          url: SITE_CONFIG.url,
          author: {
            '@type': 'Person',
            name: SITE_CONFIG.author,
          },
        })}
      </script>
      
      {/* Additional structured data for blog posts */}
      {mergedOpenGraph.type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: fullTitle,
            description: mergedMeta.description,
            author: {
              '@type': 'Person',
              name: SITE_CONFIG.author,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_CONFIG.title,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_CONFIG.url}/logo.png`,
              },
            },
            datePublished: new Date().toISOString(),
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': fullCanonicalUrl || window.location.href,
            },
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;
