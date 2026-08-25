const mongoose = require('mongoose');

const guestbookSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    maxlength: 100
  },
  signature: {
    type: String,
    default: 'Anonymous'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Guestbook', guestbookSchema);
