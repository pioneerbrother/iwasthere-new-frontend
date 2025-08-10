import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import postsData from '../posts.json'; // Direct import

function PostPage() {
  const { slug } = useParams();
  const post = postsData.find(p => p.slug === slug);

  if (!post) {
    return <div className="p-8">Post not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/blog" className="text-blue-600 mb-8 block">&larr; Back to Briefings</Link>
      <h1 className="text-5xl font-bold">{post.title}</h1>
      <p className="text-lg text-gray-500 mt-4">By {post.author} on {post.date}</p>
      <article className="prose lg:prose-xl mt-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}
export default PostPage;