const express = require('express');
const router = express.Router();
const Guestbook = require('../models/Guestbook');

// GET all guestbook entries (limit to 50 latest)
router.get('/', async (req, res) => {
  try {
    const entries = await Guestbook.find().sort({ timestamp: -1 }).limit(50);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new guestbook entry
router.post('/', async (req, res) => {
  try {
    const { message, signature } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const newEntry = new Guestbook({
      message: message.substring(0, 100), // Limit length
      signature: signature || 'Anonymous'
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
