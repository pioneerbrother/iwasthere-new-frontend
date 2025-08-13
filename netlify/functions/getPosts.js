// File: new-frontend/netlify/functions/getPosts.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// This function will be executed by Netlify's infrastructure.
export async function handler(event, context) {
    try {
        // Find the absolute path to the 'posts' directory.
        const postsDirectory = path.join(process.cwd(), 'posts');
        
        // Get the names of all files in that directory.
        const fileNames = fs.readdirSync(postsDirectory);

        const allPostsData = fileNames.map(fileName => {
            // Create a URL-friendly 'slug' from the file name.
            const slug = fileName.replace(/\.md$/, '');

            // Read the markdown file as a string.
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post's metadata section.
            const { data } = matter(fileContents); // We only need the metadata here

            return {
                slug,
                ...data, // Spread the metadata (title, date, author, excerpt)
            };
        });

        // Return a successful response with the list of posts as JSON.
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allPostsData),
        };
    } catch (error) {
        // In case of an error, return a server error status.
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve posts.' }),
        };
    }
}