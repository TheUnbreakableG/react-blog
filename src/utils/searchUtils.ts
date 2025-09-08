/**
 * Search Utilities
 * Functions for implementing search functionality across blog posts
 * Includes text search, filtering, and ranking algorithms
 */

import { BlogPost } from '@/types/blog';

/**
 * Search options interface for configuring search behavior
 */
export interface SearchOptions {
  /** Fields to search in (default: ['title', 'excerpt', 'content', 'tags']) */
  fields?: string[];
  /** Minimum search query length (default: 2) */
  minQueryLength?: number;
  /** Whether to use fuzzy search (default: true) */
  fuzzy?: boolean;
  /** Fuzzy search threshold (0-1, default: 0.6) */
  fuzzyThreshold?: number;
  /** Maximum number of results to return (default: 10) */
  limit?: number;
  /** Whether to include post content in search (default: false) */
  includeContent?: boolean;
}

/**
 * Default search options
 */
const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  fields: ['title', 'excerpt', 'content', 'tags'],
  minQueryLength: 2,
  fuzzy: true,
  fuzzyThreshold: 0.6,
  limit: 10,
  includeContent: false,
};

/**
 * Search result interface with relevance score
 */
export interface SearchResult {
  post: BlogPost;
  score: number;
  matches: {
    field: string;
    value: string;
    score: number;
  }[];
}

/**
 * Simple text similarity function using Levenshtein distance
 * Returns a similarity score between 0 and 1
 */
const similarity = (a: string, b: string): number => {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  
  const maxLength = Math.max(a.length, b.length);
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  return 1 - distance / maxLength;
};

/**
 * Levenshtein distance implementation for string similarity
 */
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[b.length][a.length];
};

/**
 * Tokenize text into words for better search matching
 */
const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out short words
};

/**
 * Calculate relevance score for a post based on search query
 */
const calculateRelevance = (
  post: BlogPost,
  query: string,
  options: SearchOptions
): SearchResult => {
  const queryTokens = tokenize(query);
  const matches: SearchResult['matches'] = [];
  let totalScore = 0;
  
  // Search in specified fields
  const searchFields = options.fields || DEFAULT_SEARCH_OPTIONS.fields!;
  
  for (const field of searchFields) {
    const fieldValue = getFieldValue(post, field);
    if (!fieldValue) continue;
    
    let fieldScore = 0;
    let bestMatch = '';
    
    // Calculate score for each token
    for (const token of queryTokens) {
      const useFuzzy = options.fuzzy ?? DEFAULT_SEARCH_OPTIONS.fuzzy!;
      const threshold = options.fuzzyThreshold ?? DEFAULT_SEARCH_OPTIONS.fuzzyThreshold!;
      
      const tokenScore = useFuzzy
        ? similarity(fieldValue, token)
        : fieldValue.includes(token) ? 1 : 0;
      
      if (tokenScore > threshold) {
        fieldScore += tokenScore;
        bestMatch = token;
      }
    }
    
    // Apply field weights
    const fieldWeight = getFieldWeight(field);
    fieldScore *= fieldWeight;
    
    if (fieldScore > 0) {
      matches.push({
        field,
        value: bestMatch,
        score: fieldScore,
      });
      totalScore += fieldScore;
    }
  }
  
  // Boost score for exact matches in title
  if (post.title.toLowerCase().includes(query.toLowerCase())) {
    totalScore += 2;
  }
  
  // Boost score for featured posts
  if (post.featured) {
    totalScore += 1;
  }
  
  return {
    post,
    score: totalScore,
    matches,
  };
};

/**
 * Get field value from post object
 */
const getFieldValue = (post: BlogPost, field: string): string => {
  switch (field) {
    case 'title':
      return post.title;
    case 'excerpt':
      return post.excerpt;
    case 'content':
      return post.content;
    case 'tags':
      return post.tags.join(' ');
    case 'categories':
      return post.categories.map(cat => cat.name).join(' ');
    case 'author':
      return post.author.name;
    default:
      return '';
  }
};

/**
 * Get weight for search field (higher weight = more important)
 */
const getFieldWeight = (field: string): number => {
  const weights: Record<string, number> = {
    title: 3,
    tags: 2,
    categories: 1.5,
    excerpt: 1.2,
    author: 1,
    content: 0.8,
  };
  
  return weights[field] || 1;
};

/**
 * Main search function
 * Searches through posts with the given query and options
 */
export const searchPosts = (
  posts: BlogPost[],
  query: string,
  options: SearchOptions = {}
): SearchResult[] => {
  const mergedOptions = { ...DEFAULT_SEARCH_OPTIONS, ...options };
  
  // Validate query length
  if (query.length < (mergedOptions.minQueryLength || 2)) {
    return [];
  }
  
  // Calculate relevance for each post
  const results = posts
    .map(post => calculateRelevance(post, query, mergedOptions))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);
  
  // Apply limit
  return results.slice(0, mergedOptions.limit);
};

/**
 * Advanced search with multiple criteria
 */
export const advancedSearch = (
  posts: BlogPost[],
  criteria: {
    query?: string;
    category?: string;
    tag?: string;
    author?: string;
    featured?: boolean;
    dateRange?: { start?: string; end?: string };
  },
  options: SearchOptions = {}
): BlogPost[] => {
  let filteredPosts = [...posts];
  
  // Filter by category
  if (criteria.category) {
    filteredPosts = filteredPosts.filter(post =>
      post.categories.some(cat => 
        cat.name.toLowerCase() === criteria.category!.toLowerCase() ||
        cat.slug === criteria.category
      )
    );
  }
  
  // Filter by tag
  if (criteria.tag) {
    filteredPosts = filteredPosts.filter(post =>
      post.tags.some(tag => 
        tag.toLowerCase() === criteria.tag!.toLowerCase()
      )
    );
  }
  
  // Filter by author
  if (criteria.author) {
    filteredPosts = filteredPosts.filter(post =>
      post.author.name.toLowerCase().includes(criteria.author!.toLowerCase()) ||
      post.author.slug === criteria.author
    );
  }
  
  // Filter by featured
  if (criteria.featured !== undefined) {
    filteredPosts = filteredPosts.filter(post => post.featured === criteria.featured);
  }
  
  // Filter by date range
  if (criteria.dateRange) {
    const { start, end } = criteria.dateRange;
    if (start) {
      const startDate = new Date(start);
      filteredPosts = filteredPosts.filter(post => 
        new Date(post.publishedAt) >= startDate
      );
    }
    if (end) {
      const endDate = new Date(end);
      filteredPosts = filteredPosts.filter(post => 
        new Date(post.publishedAt) <= endDate
      );
    }
  }
  
  // Apply text search if query is provided
  if (criteria.query) {
    const searchResults = searchPosts(filteredPosts, criteria.query, options);
    filteredPosts = searchResults.map(result => result.post);
  }
  
  return filteredPosts;
};

/**
 * Get search suggestions based on query
 */
export const getSearchSuggestions = (
  posts: BlogPost[],
  query: string,
  maxSuggestions: number = 5
): string[] => {
  if (query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  // Add matching titles
  posts.forEach(post => {
    if (post.title.toLowerCase().includes(queryLower)) {
      suggestions.add(post.title);
    }
  });
  
  // Add matching tags
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    });
  });
  
  // Add matching categories
  posts.forEach(post => {
    post.categories.forEach(category => {
      if (category.name.toLowerCase().includes(queryLower)) {
        suggestions.add(category.name);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, maxSuggestions);
};

/**
 * Export search history to localStorage
 */
export const saveSearchHistory = (query: string): void => {
  try {
    const history = getSearchHistory();
    const newHistory = [query, ...history.filter(q => q !== query)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  } catch (error) {
    console.warn('Failed to save search history:', error);
  }
};

/**
 * Get search history from localStorage
 */
export const getSearchHistory = (): string[] => {
  try {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.warn('Failed to get search history:', error);
    return [];
  }
};

/**
 * Clear search history
 */
export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem('searchHistory');
  } catch (error) {
    console.warn('Failed to clear search history:', error);
  }
};
