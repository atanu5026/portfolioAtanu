const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private (Admin)
const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
// @access  Public
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.likes = (blog.likes || 0) + 1;
      await blog.save();
      res.json({ likes: blog.likes });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment view count
// @route   POST /api/blogs/:id/view
// @access  Public
const incrementView = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
      res.json({ views: blog.views });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/blogs/:id/comments
// @access  Public
const addComment = async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!name || !text) {
      return res.status(400).json({ message: 'Name and text are required' });
    }
    
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      const comment = { name, text, createdAt: Date.now() };
      blog.comments.push(comment);
      await blog.save();
      res.status(201).json(blog.comments);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  incrementView,
  addComment
};
