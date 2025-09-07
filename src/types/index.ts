/**
 * Main type definitions for the blog application
 * This file exports all types used throughout the application
 */

// Re-export all types from individual modules
export * from './blog.ts';
export * from './seo.ts';
export * from './ui.ts';

// Global utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Environment variable types
export interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_URL: string;
  readonly VITE_APP_AUTHOR: string;
  readonly VITE_SEO_KEYWORDS: string;
  readonly VITE_TWITTER_HANDLE: string;
  readonly VITE_FACEBOOK_APP_ID: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_GOOGLE_TAG_MANAGER_ID: string;
  readonly VITE_DEV_MODE: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}