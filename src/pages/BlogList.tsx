import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '@/utils/posts';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/common/Button';
import styles from './BlogList.module.scss';

const POSTS_PER_PAGE = 5;

const BlogList: React.FC = () => {
  const allPosts = getAllPosts();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);

  return (
    <>
      <Helmet>
        <title>Blog - React Blog</title>
        <meta name="description" content="Browse all blog posts on React Blog." />
      </Helmet>

      <section aria-labelledby="blog-list-heading">
        <h1 id="blog-list-heading">All Blog Posts</h1>

        <ul>
          {currentPosts.map(post => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`}>
                <h2>{post.title}</h2>
              </Link>
              <p>{post.description}</p>
              <small>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </small>
            </li>
          ))}
        </ul>

        <nav
          aria-label="Pagination" className={styles.pagination}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}
        >
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            aria-disabled={currentPage === 1}
            aria-label="Previous page"
            variant="secondary"
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                variant={currentPage === page ? 'primary' : 'secondary'}
                style={{
                  fontWeight: currentPage === page ? 'bold' : 'normal',
                  textDecoration: currentPage === page ? 'underline' : 'none',
                  minWidth: '2.5rem',
                }}
              >
                {page}
              </Button>
            );
          })}

          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-disabled={currentPage === totalPages}
            aria-label="Next page"
            variant="secondary"
          >
            Next
          </Button>
        </nav>
      </section>
    </>
  );
};

export default BlogList;
