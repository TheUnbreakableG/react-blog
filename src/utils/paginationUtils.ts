/**
 * Pagination Utilities
 * Functions for handling pagination logic across the blog application
 * Includes pagination calculation, page navigation, and data slicing
 */

import { BlogPost, PaginationData } from '@/types/blog';

/**
 * Pagination options interface
 */
export interface PaginationOptions {
  /** Current page number (default: 1) */
  currentPage?: number;
  /** Number of items per page (default: 10) */
  postsPerPage?: number;
  /** Total number of items (optional, will be calculated from posts array if not provided) */
  totalPosts?: number;
}

/**
 * Default pagination options
 */
const DEFAULT_PAGINATION_OPTIONS: PaginationOptions = {
  currentPage: 1,
  postsPerPage: 10,
};

/**
 * Calculate pagination data for a given set of posts
 */
export const calculatePagination = (
  posts: BlogPost[],
  options: PaginationOptions = {}
): PaginationData => {
  const mergedOptions = { ...DEFAULT_PAGINATION_OPTIONS, ...options };
  const { currentPage = 1, postsPerPage = 10 } = mergedOptions;
  
  const totalPosts = mergedOptions.totalPosts || posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    totalPosts,
    postsPerPage,
    hasNextPage,
    hasPreviousPage,
  };
};

/**
 * Get paginated slice of posts for the current page
 */
export const getPaginatedPosts = (
  posts: BlogPost[],
  options: PaginationOptions = {}
): BlogPost[] => {
  const { currentPage = 1, postsPerPage = 10 } = { 
    ...DEFAULT_PAGINATION_OPTIONS, 
    ...options 
  };
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  
  return posts.slice(startIndex, endIndex);
};

/**
 * Generate page numbers for pagination navigation
 * Returns an array of page numbers with ellipsis for large page ranges
 */
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 7
): (number | '...')[] => {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const halfVisible = Math.floor(maxVisiblePages / 2);
  
  // Always show first page
  pages.push(1);
  
  if (currentPage > halfVisible + 1) {
    pages.push('...');
  }
  
  // Calculate start and end of visible page range
  let startPage = Math.max(2, currentPage - halfVisible);
  let endPage = Math.min(totalPages - 1, currentPage + halfVisible);
  
  // Adjust if near start
  if (currentPage <= halfVisible + 1) {
    endPage = maxVisiblePages - 1;
  }
  
  // Adjust if near end
  if (currentPage >= totalPages - halfVisible) {
    startPage = totalPages - maxVisiblePages + 2;
  }
  
  // Add visible pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  if (endPage < totalPages - 1) {
    pages.push('...');
  }
  
  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
};

/**
 * Get URL parameters for pagination
 * Useful for building pagination links in Next.js or React Router
 */
export const getPaginationUrlParams = (
  page: number,
  basePath: string = '/blog',
  queryParams: Record<string, string> = {}
): string => {
  const params = new URLSearchParams();
  
  // Add page parameter if not page 1
  if (page > 1) {
    params.set('page', page.toString());
  }
  
  // Add other query parameters
  Object.entries(queryParams).forEach(([key, value]) => {
    params.set(key, value);
  });
  
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

/**
 * Parse pagination parameters from URL search params
 */
export const parsePaginationParams = (
  searchParams: URLSearchParams,
  defaultPostsPerPage: number = 10
): PaginationOptions => {
  const pageParam = searchParams.get('page');
  const perPageParam = searchParams.get('perPage');
  
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const postsPerPage = perPageParam 
    ? Math.max(1, Math.min(50, parseInt(perPageParam, 10))) 
    : defaultPostsPerPage;
  
  return {
    currentPage,
    postsPerPage,
  };
};

/**
 * Calculate range display text (e.g., "1-10 of 100")
 */
export const getRangeDisplayText = (
  currentPage: number,
  postsPerPage: number,
  totalPosts: number
): string => {
  const start = (currentPage - 1) * postsPerPage + 1;
  const end = Math.min(currentPage * postsPerPage, totalPosts);
  
  return `${start}-${end} of ${totalPosts}`;
};

/**
 * Validate pagination parameters
 * Ensures page numbers are within valid range
 */
export const validatePagination = (
  currentPage: number,
  totalPages: number
): { isValid: boolean; correctedPage?: number } => {
  if (currentPage < 1) {
    return { isValid: false, correctedPage: 1 };
  }
  
  if (currentPage > totalPages && totalPages > 0) {
    return { isValid: false, correctedPage: totalPages };
  }
  
  return { isValid: true };
};

/**
 * Get adjacent page numbers for navigation
 * Useful for showing previous/next page buttons
 */
export const getAdjacentPages = (
  currentPage: number,
  totalPages: number
): { previous: number | null; next: number | null } => {
  return {
    previous: currentPage > 1 ? currentPage - 1 : null,
    next: currentPage < totalPages ? currentPage + 1 : null,
  };
};

/**
 * Calculate total pages from total posts and posts per page
 */
export const calculateTotalPages = (
  totalPosts: number,
  postsPerPage: number
): number => {
  return Math.ceil(totalPosts / postsPerPage);
};

/**
 * Create pagination metadata for API responses
 */
export const createPaginationMetadata = (
  paginationData: PaginationData
): {
  pagination: PaginationData;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
} => {
  const { currentPage, totalPages } = paginationData;
  
  return {
    pagination: paginationData,
    links: {
      first: getPaginationUrlParams(1),
      last: getPaginationUrlParams(totalPages),
      prev: currentPage > 1 ? getPaginationUrlParams(currentPage - 1) : null,
      next: currentPage < totalPages ? getPaginationUrlParams(currentPage + 1) : null,
    },
  };
};

/**
 * Export pagination configuration constants
 */
export const PAGINATION_CONFIG = {
  DEFAULT_POSTS_PER_PAGE: 10,
  MAX_POSTS_PER_PAGE: 50,
  MIN_POSTS_PER_PAGE: 1,
  MAX_VISIBLE_PAGES: 7,
} as const;

export default {
  calculatePagination,
  getPaginatedPosts,
  generatePageNumbers,
  getPaginationUrlParams,
  parsePaginationParams,
  getRangeDisplayText,
  validatePagination,
  getAdjacentPages,
  calculateTotalPages,
  createPaginationMetadata,
  PAGINATION_CONFIG,
};
