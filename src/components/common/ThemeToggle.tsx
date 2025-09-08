/**
 * Theme Toggle Component
 * Provides a user interface for switching between light and dark themes
 * Uses the ThemeContext to manage theme state
 */

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.scss';

/**
 * ThemeToggle Component
 * Renders a toggle switch for changing between light and dark themes
 * Shows appropriate icon based on current theme
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      type="button"
    >
      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb} data-theme={theme}>
          {/* Sun icon for light theme */}
          <svg
            className={styles.sunIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>

          {/* Moon icon for dark theme */}
          <svg
            className={styles.moonIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      </div>
      
      {/* Screen reader only text for better accessibility */}
      <span className={styles.srOnly}>
        {theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      </span>
    </button>
  );
};

export default ThemeToggle;
