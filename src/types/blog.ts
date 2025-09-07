/**
 * Type definitions for blog-related data structures
 */

// Base blog post interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  author: Author;
  categories: Category[];
  tags: string[];
  featured: boolean;
  readingTime: number;
  status: 'published' | 'draft' | 'archived';
  seo: SEOData;
}

// Author information
export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  slug: string;
}

// Category information
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

// SEO data for posts
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// Pagination interface
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Search results interface
export interface SearchResults {
  query: string;
  posts: BlogPost[];
  totalResults: number;
  searchTime: number;
}

// Site configuration
export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    email: string;
  };
  navigation: NavigationItem[];
  postsPerPage: number;
  featuredPostsCount: number;
}

// Navigation item
export interface NavigationItem {
  label: string;
  path: string;
  external?: boolean;
  children?: NavigationItem[];
}

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Newsletter subscription data
export interface NewsletterData {
  email: string;
  name?: string;
}

// Blog statistics
export interface BlogStats {
  totalPosts: number;
  totalAuthors: number;
  totalCategories: number;
  totalViews: number;
  lastUpdated: string;
}

// Related posts configuration
export interface RelatedPostsConfig {
  maxPosts: number;
  algorithm: 'category' | 'tags' | 'mixed';
  excludeCurrentPost: boolean;
}