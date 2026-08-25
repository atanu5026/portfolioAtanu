const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String, // URL from Cloudinary
  },
  images: [{
    type: String,
  }],
  codeSnippet: {
    type: String,
  },
  codeLanguage: {
    type: String,
    default: 'javascript',
  },
  technologies: [{
    type: String,
  }],
  category: {
    type: String,
    enum: ['engineering', 'developer', 'both'],
    required: true,
  },
  year: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  liveUrl: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
