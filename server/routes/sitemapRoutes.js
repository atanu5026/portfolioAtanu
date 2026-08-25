const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    const baseUrl = process.env.CLIENT_URL || 'https://www.atanughosh.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static routes
    const staticRoutes = ['/', '/portfolio'];
    staticRoutes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic blog routes
    blogs.forEach((blog) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${blog._id}</loc>\n`;
      xml += `    <lastmod>${blog.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
