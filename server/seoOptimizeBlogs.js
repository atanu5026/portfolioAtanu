require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const connectDB = require('./config/db');

const optimizeBlogs = async () => {
  try {
    await connectDB();
    const blogs = await Blog.find({});
    let updatedCount = 0;

    for (let blog of blogs) {
      let updated = false;
      
      // Auto-generate meta description if missing
      if (!blog.metaDescription && blog.content) {
        blog.metaDescription = blog.content.substring(0, 155).trim() + '...';
        updated = true;
      }
      
      // Auto-generate keywords from tags if missing
      if (!blog.keywords) {
        if (blog.tags && blog.tags.length > 0) {
          blog.keywords = blog.tags.join(', ');
        } else if (blog.category) {
          blog.keywords = blog.category;
        } else {
          blog.keywords = 'technology, development, software';
        }
        updated = true;
      }
      
      if (updated) {
        await blog.save();
        updatedCount++;
        console.log(`Optimized blog: ${blog.title}`);
      }
    }
    
    console.log(`Successfully SEO optimized ${updatedCount} existing blogs.`);
    process.exit(0);
  } catch (error) {
    console.error('Error optimizing blogs:', error);
    process.exit(1);
  }
};

optimizeBlogs();
