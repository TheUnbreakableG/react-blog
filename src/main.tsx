/**
 * Application entry point
 * Sets up React app with necessary providers and global configurations
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
// import { ThemeProvider } from '@/context/ThemeContext';
// import ScrollToTop from '@/components/common/ScrollToTop';

// Import global styles
// import '@/styles/globals.scss';

// Get root element with proper error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render application with basic setup (will add providers as we create them)
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        {/* TODO: Add ThemeProvider when created */}
        {/* <ThemeProvider> */}
          {/* TODO: Add ScrollToTop when created */}
          {/* <ScrollToTop /> */}
          <App />
        {/* </ThemeProvider> */}
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Enable hot module replacement in development
if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept();
}