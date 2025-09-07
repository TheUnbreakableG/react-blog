import matter from 'gray-matter';

export interface Post {
  title: string;
  date: string;
  description: string;
  slug: string;
  content: string;
}

const postFiles = import.meta.glob('../data/posts/*.md', { eager: true, query: '?raw' });

export const getAllPosts = (): Post[] => {
  const posts: Post[] = [];

  for (const path in postFiles) {
    const postModule = postFiles[path] as { default: string };
    const rawContent = postModule.default;

    if (typeof rawContent !== 'string') {
      console.error(`Post content for ${path} is not a string`, rawContent);
      continue;
    }

    const { data, content } = matter(rawContent);

    const slugFromFile = path.split('/').pop()?.replace('.md', '') || '';

    posts.push({
      title: data.title,
      date: data.date,
      description: data.description,
      slug: data.slug || slugFromFile,
      content,
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
};

export const getPostBySlug = (slug: string): Post | undefined => {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug);
};
