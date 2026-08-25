const express = require('express');
const router = express.Router();
const { getMessages, createMessage, markMessageAsRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMessages)
  .post(createMessage);

router.route('/:id')
  .put(protect, markMessageAsRead)
  .delete(protect, deleteMessage);

module.exports = router;
