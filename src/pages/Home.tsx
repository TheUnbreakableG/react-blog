import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home - React Blog</title>
        <meta name="description" content="Welcome to the React Blog Home Page" />
      </Helmet>
      <section>
        <h1>Welcome to React Blog</h1>
        <p>This is the home page. Content will be here soon.</p>
      </section>
    </>
  );
};

export default Home;
