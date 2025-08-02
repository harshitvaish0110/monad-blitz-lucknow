const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const {
  uploadAndMint,
  recordPlay,
  getTrendingTracks,
  getLatestTracks,
  getTrackDetails,
  getTracksByCreator
} = require('../controllers/trackController');

// Upload and mint a new track
router.post('/upload', upload.single('audio'), uploadAndMint);

// Record a play/view of a track
router.post('/:monadTrackId/play', recordPlay);

// Get trending tracks
router.get('/trending', getTrendingTracks);

// Get latest tracks
router.get('/latest', getLatestTracks);

// Get track details by Monad track ID
router.get('/:monadTrackId', getTrackDetails);

// Get tracks by creator wallet address
router.get('/creator/:walletAddress', getTracksByCreator);

module.exports = router; 