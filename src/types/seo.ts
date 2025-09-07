/**
 * Type definitions for SEO-related functionality
 */

// Basic SEO meta data
export interface SEOMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
}

// Open Graph meta data
export interface OpenGraphMeta {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
  url: string;
  image: string;
  imageAlt?: string;
  siteName?: string;
  locale?: string;
}

// Twitter Card meta data
export interface TwitterMeta {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}

// Structured data (JSON-LD)
export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Article structured data
export interface ArticleStructuredData extends StructuredData {
  '@type': 'Article';
  headline: string;
  description: string;
  image: string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

// Breadcrumb structured data
export interface BreadcrumbStructuredData extends StructuredData {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

// Website structured data
export interface WebsiteStructuredData extends StructuredData {
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

// Complete SEO configuration for a page
export interface PageSEOConfig {
  meta: SEOMeta;
  openGraph: OpenGraphMeta;
  twitter: TwitterMeta;
  structuredData?: StructuredData[];
  additionalMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

// SEO utilities configuration
export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultImage: string;
  twitterHandle: string;
  facebookAppId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}