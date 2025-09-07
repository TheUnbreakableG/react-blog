import React from 'react';

const LoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      fontSize: '1.25rem',
      color: '#555',
    }}
  >
    Loading...
  </div>
);

export default LoadingFallback;
