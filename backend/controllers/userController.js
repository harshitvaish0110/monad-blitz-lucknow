const User = require('../models/User');
const Track = require('../models/Track');

/**
 * Get user profile by wallet address
 */
const getUserProfile = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const user = await User.findByWallet(walletAddress);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's tracks
    const tracks = await Track.getByCreator(walletAddress, 10);
    
    res.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        profilePicUrl: user.profilePicture,
        website: user.website,
        twitter: user.twitter,
        instagram: user.instagram,
        totalTracks: user.totalTracks,
        totalViews: user.totalViews,
        totalRemixes: user.totalRemixes,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        tracks: tracks.map(track => ({
          id: track._id,
          monadTrackId: track.monadTrackId,
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          views: track.views,
          audioUrl: track.audioUrl,
          coverUrl: track.coverUrl,
          isRemix: track.isRemix,
          createdAt: track.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

/**
 * Create or update user profile
 */
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      walletAddress,
      username,
      displayName,
      bio,
      website,
      twitter,
      instagram
    } = req.body;

    if (!walletAddress || !username) {
      return res.status(400).json({ error: 'Wallet address and username are required' });
    }

    // Check if username is already taken
    const existingUser = await User.findByUsername(username);
    if (existingUser && existingUser.walletAddress !== walletAddress.toLowerCase()) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Find or create user
    let user = await User.findByWallet(walletAddress);
    if (!user) {
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        username,
        displayName: displayName || username,
        bio: bio || '',
        website: website || '',
        twitter: twitter || '',
        instagram: instagram || ''
      });
    } else {
      // Update existing user
      user.username = username;
      user.displayName = displayName || username;
      user.bio = bio || user.bio;
      user.website = website || user.website;
      user.twitter = twitter || user.twitter;
      user.instagram = instagram || user.instagram;
    }

    await user.save();
    await user.updateStats();

    res.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        profilePicUrl: user.profilePicture,
        website: user.website,
        twitter: user.twitter,
        instagram: user.instagram,
        totalTracks: user.totalTracks,
        totalViews: user.totalViews,
        totalRemixes: user.totalRemixes,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create/update user profile error:', error);
    res.status(500).json({ error: 'Failed to create/update user profile' });
  }
};

/**
 * Get top creators
 */
const getTopCreators = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const creators = await User.getTopCreators(limit);
    
    res.json({
      success: true,
      creators: creators.map(creator => ({
        walletAddress: creator.walletAddress,
        username: creator.username,
        displayName: creator.displayName,
        profilePicUrl: creator.profilePicture,
        totalTracks: creator.totalTracks,
        totalViews: creator.totalViews,
        totalRemixes: creator.totalRemixes,
        isVerified: creator.isVerified
      }))
    });
  } catch (error) {
    console.error('Get top creators error:', error);
    res.status(500).json({ error: 'Failed to get top creators' });
  }
};

module.exports = {
  getUserProfile,
  createOrUpdateProfile,
  getTopCreators
}; 