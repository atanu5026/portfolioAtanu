const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  category: {
    type: String,
  },
  readTime: {
    type: Number, // in minutes
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  metaDescription: {
    type: String,
  },
  keywords: {
    type: String,
  },
  comments: [
    {
      name: { type: String, required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
