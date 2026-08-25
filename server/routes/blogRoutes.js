const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, likeBlog, incrementView, addComment } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like')
  .post(likeBlog);

router.route('/:id/view')
  .post(incrementView);

router.route('/:id/comments')
  .post(addComment);

module.exports = router;
