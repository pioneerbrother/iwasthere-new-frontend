// File: src/lib/posts.js
// This file uses special Vite features to read your Markdown files.

// This imports all .md files from the /posts/ directory.
const modules = import.meta.glob('../../posts/*.md', { eager: true });

// We process the files into a clean, sorted array of post data.
export const posts = Object.entries(modules).map(([path, module]) => {
  const slug = path.split('/').pop().replace('.md', '');
  return {
    slug,
    ...module.attributes, // The metadata from the top of the file
    Content: module.default, // The actual content component
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first