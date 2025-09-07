import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '@/components/common/Header.tsx';
import Footer from '@/components/common/Footer.tsx';
import LoadingFallback from '@/components/common/LoadingFallback.tsx';

const Home = React.lazy(() => import('@/pages/Home'));
const BlogList = React.lazy(() => import('@/pages/BlogList'));
const BlogPost = React.lazy(() => import('@/pages/BlogPost'));
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Search = React.lazy(() => import('@/pages/Search'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="app">
        <Header />

        <main className="main-content" role="main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
