/**
 * Main App component
 * Handles routing, global layout, and error boundaries
 */

import React, { Suspense } from 'react';
// import { Routes, Route } from 'react-router-dom';

// // Import components
// import Header from '@/components/common/Header';
// import Footer from '@/components/common/Footer';
// import LoadingSpinner from '@/components/common/LoadingSpinner';

// // Import pages (using lazy loading for better performance)
// const Home = React.lazy(() => import('@/pages/Home'));
// const BlogList = React.lazy(() => import('@/pages/BlogList'));
// const BlogPost = React.lazy(() => import('@/pages/BlogPost'));
// const About = React.lazy(() => import('@/pages/About'));
// const Contact = React.lazy(() => import('@/pages/Contact'));
// const Search = React.lazy(() => import('@/pages/Search'));
// const Category = React.lazy(() => import('@/pages/Category'));
// const Author = React.lazy(() => import('@/pages/Author'));
// const NotFound = React.lazy(() => import('@/pages/NotFound'));

// TODO: Import styles when created
// import './App.scss';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>Something went wrong</h1>
            <p>We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="retry-button"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loading Fallback Component (temporary simple version)
 */
const LoadingFallback: React.FC = () => (
  <div className="loading-fallback">
    <div>Loading...</div>
  </div>
);

/**
 * Main App Component (temporary simple version)
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="app">
        {/* TODO: Add Header when component is created */}
        {/* <Header /> */}

        {/* Main content area */}
        <main className="main-content" role="main">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>React Blog</h1>
            <p>Blog is being built step by step...</p>
            {/* TODO: Add routes when pages are created */}
            {/* <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/category/:slug" element={<Category />} />
                <Route path="/author/:slug" element={<Author />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense> */}
          </div>
        </main>

        {/* TODO: Add Footer when component is created */}
        {/* <Footer /> */}
      </div>
    </ErrorBoundary>
  );
};

export default App;