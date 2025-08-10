import React from 'react';
import { Link } from 'react-router-dom';
import postsData from '../posts.json'; // Direct import

function BlogPage() {
  // We add a check to make sure postsData is an array
  if (!Array.isArray(postsData)) {
    return <div className="p-8">Error: Post data could not be loaded.</div>;
  }

  const sortedPosts = postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">Intelligence Briefings</h1>
      <div className="mt-8 space-y-8">
        {sortedPosts.map(post => (
          <div key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="text-2xl font-bold text-blue-600 hover:underline">
              {post.title}
            </Link>
            <p className="text-sm text-gray-500">By {post.author} on {post.date}</p>
            <p className="mt-2">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BlogPage;