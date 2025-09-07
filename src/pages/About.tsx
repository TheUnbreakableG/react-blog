import React from 'react';
import { Helmet } from 'react-helmet-async';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About - React Blog</title>
        <meta name="description" content="Learn more about React Blog" />
      </Helmet>
      <section>
        <h1>About</h1>
        <p>This is the about page. Information about the blog or author will go here.</p>
      </section>
    </>
  );
};

export default About;
