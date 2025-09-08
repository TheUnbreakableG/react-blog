/**
 * Related Posts Utilities
 * Functions for finding and ranking related blog posts
 * Uses content similarity, tags, categories, and other metrics
 */

import { BlogPost, RelatedPostsConfig } from '@/types/blog';

/**
 * Default related posts configuration
 */
const DEFAULT_RELATED_POSTS_CONFIG: RelatedPostsConfig = {
  maxPosts: 3,
  algorithm: 'mixed',
  excludeCurrentPost: true,
};

/**
 * Calculate similarity between two posts using multiple factors
 */
const calculatePostSimilarity = (
  postA: BlogPost,
  postB: BlogPost,
  algorithm: RelatedPostsConfig['algorithm'] = 'mixed'
): number => {
  let similarityScore = 0;
  
  // Category similarity (highest weight)
  const categorySimilarity = calculateCategorySimilarity(postA, postB);
  similarityScore += categorySimilarity * 0.4;
  
  // Tag similarity (high weight)
  const tagSimilarity = calculateTagSimilarity(postA, postB);
  similarityScore += tagSimilarity * 0.3;
  
  // Content similarity (medium weight)
  const contentSimilarity = calculateContentSimilarity(postA, postB);
  similarityScore += contentSimilarity * 0.2;
  
  // Author similarity (low weight)
  const authorSimilarity = calculateAuthorSimilarity(postA, postB);
  similarityScore += authorSimilarity * 0.1;
  
  return similarityScore;
};

/**
 * Calculate category similarity between two posts
 */
const calculateCategorySimilarity = (postA: BlogPost, postB: BlogPost): number => {
  const categoriesA = postA.categories.map(cat => cat.slug);
  const categoriesB = postB.categories.map(cat => cat.slug);
  
  const commonCategories = categoriesA.filter(cat => categoriesB.includes(cat));
  const totalCategories = new Set([...categoriesA, ...categoriesB]).size;
  
  return totalCategories > 0 ? commonCategories.length / totalCategories : 0;
};

/**
 * Calculate tag similarity between two posts
 */
const calculateTagSimilarity = (postA: BlogPost, postB: BlogPost): number => {
  const tagsA = postA.tags;
  const tagsB = postB.tags;
  
  const commonTags = tagsA.filter(tag => tagsB.includes(tag));
  const totalTags = new Set([...tagsA, ...tagsB]).size;
  
  return totalTags > 0 ? commonTags.length / totalTags : 0;
};

/**
 * Calculate content similarity using simple text comparison
 * For production, consider using more advanced NLP techniques
 */
const calculateContentSimilarity = (postA: BlogPost, postB: BlogPost): number => {
  // Simple approach: compare word overlap in titles and excerpts
  const textA = `${postA.title} ${postA.excerpt}`.toLowerCase();
  const textB = `${postB.title} ${postB.excerpt}`.toLowerCase();
  
  const wordsA = textA.split(/\s+/).filter(word => word.length > 3);
  const wordsB = textB.split(/\s+/).filter(word => word.length > 3);
  
  const commonWords = wordsA.filter(word => wordsB.includes(word));
  const totalWords = new Set([...wordsA, ...wordsB]).size;
  
  return totalWords > 0 ? commonWords.length / totalWords : 0;
};

/**
 * Calculate author similarity between two posts
 */
const calculateAuthorSimilarity = (postA: BlogPost, postB: BlogPost): number => {
  return postA.author.slug === postB.author.slug ? 1 : 0;
};

/**
 * Find related posts for a given post
 */
export const findRelatedPosts = (
  currentPost: BlogPost,
  allPosts: BlogPost[],
  config: Partial<RelatedPostsConfig> = {}
): BlogPost[] => {
  const mergedConfig = { ...DEFAULT_RELATED_POSTS_CONFIG, ...config };
  const { maxPosts, algorithm, excludeCurrentPost } = mergedConfig;
  
  // Filter out current post if needed
  let candidatePosts = allPosts;
  if (excludeCurrentPost) {
    candidatePosts = allPosts.filter(post => post.id !== currentPost.id);
  }
  
  // Calculate similarity scores for all candidate posts
  const scoredPosts = candidatePosts.map(post => ({
    post,
    score: calculatePostSimilarity(currentPost, post, algorithm),
  }));
  
  // Sort by score descending and take top N posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPosts)
    .map(item => item.post);
};

/**
 * Find related posts by category
 */
export const findRelatedByCategory = (
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxPosts: number = 3
): BlogPost[] => {
  const currentCategories = currentPost.categories.map(cat => cat.slug);
  
  return allPosts
    .filter(post => post.id !== currentPost.id)
    .filter(post => 
      post.categories.some(cat => currentCategories.includes(cat.slug))
    )
    .sort((a, b) => {
      // Sort by publication date (newest first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, maxPosts);
};

/**
 * Find related posts by tags
 */
export const findRelatedByTags = (
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxPosts: number = 3
): BlogPost[] => {
  const currentTags = currentPost.tags;
  
  return allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => ({
      post,
      commonTags: post.tags.filter(tag => currentTags.includes(tag)).length,
    }))
    .filter(item => item.commonTags > 0)
    .sort((a, b) => b.commonTags - a.commonTags)
    .map(item => item.post)
    .slice(0, maxPosts);
};

/**
 * Find related posts by author
 */
export const findRelatedByAuthor = (
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxPosts: number = 3
): BlogPost[] => {
  return allPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.author.slug === currentPost.author.slug
    )
    .sort((a, b) => {
      // Sort by publication date (newest first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, maxPosts);
};

/**
 * Find recently published posts (fallback when no strong relations found)
 */
export const findRecentPosts = (
  allPosts: BlogPost[],
  excludePostId?: string,
  maxPosts: number = 3
): BlogPost[] => {
  return allPosts
    .filter(post => !excludePostId || post.id !== excludePostId)
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, maxPosts);
};

/**
 * Get related posts with fallback strategies
 * Tries multiple algorithms and falls back to recent posts if no strong matches found
 */
export const getRelatedPostsWithFallback = (
  currentPost: BlogPost,
  allPosts: BlogPost[],
  config: Partial<RelatedPostsConfig> = {}
): BlogPost[] => {
  const mergedConfig = { ...DEFAULT_RELATED_POSTS_CONFIG, ...config };
  
  // Try the main algorithm first
  let relatedPosts = findRelatedPosts(currentPost, allPosts, mergedConfig);
  
  // If not enough posts found, try category-based
  if (relatedPosts.length < mergedConfig.maxPosts) {
    const categoryPosts = findRelatedByCategory(
      currentPost, 
      allPosts, 
      mergedConfig.maxPosts - relatedPosts.length
    );
    
    // Merge without duplicates
    const existingIds = new Set(relatedPosts.map(p => p.id));
    const newPosts = categoryPosts.filter(post => !existingIds.has(post.id));
    relatedPosts = [...relatedPosts, ...newPosts];
  }
  
  // If still not enough, try tag-based
  if (relatedPosts.length < mergedConfig.maxPosts) {
    const tagPosts = findRelatedByTags(
      currentPost, 
      allPosts, 
      mergedConfig.maxPosts - relatedPosts.length
    );
    
    const existingIds = new Set(relatedPosts.map(p => p.id));
    const newPosts = tagPosts.filter(post => !existingIds.has(post.id));
    relatedPosts = [...relatedPosts, ...newPosts];
  }
  
  // If still not enough, fill with recent posts
  if (relatedPosts.length < mergedConfig.maxPosts) {
    const recentPosts = findRecentPosts(
      allPosts,
      currentPost.id,
      mergedConfig.maxPosts - relatedPosts.length
    );
    
    const existingIds = new Set(relatedPosts.map(p => p.id));
    const newPosts = recentPosts.filter(post => !existingIds.has(post.id));
    relatedPosts = [...relatedPosts, ...newPosts];
  }
  
  return relatedPosts.slice(0, mergedConfig.maxPosts);
};

/**
 * Check if two posts are related based on minimum similarity threshold
 */
export const arePostsRelated = (
  postA: BlogPost,
  postB: BlogPost,
  minSimilarity: number = 0.3
): boolean => {
  const similarity = calculatePostSimilarity(postA, postB);
  return similarity >= minSimilarity;
};

/**
 * Get related posts configuration for different contexts
 */
export const getRelatedPostsConfig = (
  context: 'post' | 'homepage' | 'category' | 'author' = 'post'
): RelatedPostsConfig => {
  const baseConfig: RelatedPostsConfig = {
    maxPosts: 3,
    algorithm: 'mixed',
    excludeCurrentPost: true,
  };
  
  switch (context) {
    case 'homepage':
      return { ...baseConfig, maxPosts: 6, algorithm: 'category' };
    case 'category':
      return { ...baseConfig, maxPosts: 4, algorithm: 'tags' };
    case 'author':
      return { ...baseConfig, maxPosts: 4, algorithm: 'category' };
    default:
      return baseConfig;
  }
};

/**
 * Export utility functions for external use
 */
export default {
  findRelatedPosts,
  findRelatedByCategory,
  findRelatedByTags,
  findRelatedByAuthor,
  findRecentPosts,
  getRelatedPostsWithFallback,
  arePostsRelated,
  getRelatedPostsConfig,
  calculatePostSimilarity,
  DEFAULT_RELATED_POSTS_CONFIG,
};
