const express = require('express');
const router = express.Router();
const {
  authAdmin,
  registerAdmin,
  logoutAdmin,
  getAdminProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.post('/register', registerAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protect, getAdminProfile);
router.put('/password', protect, changePassword);

module.exports = router;
