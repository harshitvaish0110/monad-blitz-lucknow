const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  createOrUpdateProfile,
  getTopCreators
} = require('../controllers/userController');

// Get user profile by wallet address
router.get('/:walletAddress/profile', getUserProfile);

// Create or update user profile
router.post('/profile', createOrUpdateProfile);

// Get top creators
router.get('/creators/top', getTopCreators);

module.exports = router; 