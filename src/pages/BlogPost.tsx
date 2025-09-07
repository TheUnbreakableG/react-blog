import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '@/utils/posts';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/common/Button';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const navigate = useNavigate();

  if (!post) {
    return (
      <main role="main" aria-live="polite">
        <h1>Post not found</h1>
        <p>The post you requested does not exist.</p>
        <Button
          onClick={() => navigate('/blog')}
          aria-label="Go back to blog list"
          variant="secondary"
        >
          Back to Blog
        </Button>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - React Blog</title>
        <meta name="description" content={post.description || post.title} />
      </Helmet>

      <article>
        <header>
          <h1>{post.title}</h1>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        <section>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </section>

        <nav aria-label="Post navigation">
          <Link to="/blog" className="back-link" style={{ textDecoration: 'none' }}>
            <Button variant="secondary">← Back to all posts</Button>
          </Link>
        </nav>
      </article>
    </>
  );
};

export default BlogPost;
