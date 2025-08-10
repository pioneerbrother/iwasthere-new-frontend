import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'posts');

function getPosts() {
    const fileNames = fs.readdirSync(postsDir);
    const allPostsData = fileNames.map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        return { slug, ...data, content };
    });
    return allPostsData;
}

const allPosts = getPosts();
const outputPath = path.join(process.cwd(), 'src/posts.json');
fs.writeFileSync(outputPath, JSON.stringify(allPosts));
console.log('✅ Blog posts successfully built into src/posts.json');
