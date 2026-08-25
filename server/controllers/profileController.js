const Profile = require('../models/Profile');

// @desc    Get profile data
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create a default profile if none exists
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

// @desc    Update profile data
// @route   PUT /api/profile
// @access  Private (Admin)
const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      // Update existing profile
      const updatedProfile = await Profile.findOneAndUpdate({}, req.body, { new: true });
      res.json(updatedProfile);
    } else {
      // Create new profile with request body
      const newProfile = await Profile.create(req.body);
      res.status(201).json(newProfile);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
