const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Wallet information
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Profile information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  
  displayName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  profilePicUrl: {
    type: String,
    default: null
  },
  
  // Social links
  website: {
    type: String,
    default: ''
  },
  
  twitter: {
    type: String,
    default: ''
  },
  
  instagram: {
    type: String,
    default: ''
  },
  
  // Statistics
  totalTracks: {
    type: Number,
    default: 0
  },
  
  totalViews: {
    type: Number,
    default: 0
  },
  
  totalRemixes: {
    type: Number,
    default: 0
  },
  
  // Preferences
  favoriteGenres: [{
    type: String,
    enum: [
      'synthwave', 'techno', 'ambient', 'electronic', 'glitch',
      'drum & bass', 'house', 'trance', 'dubstep', 'experimental'
    ]
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ walletAddress: 1 });
userSchema.index({ username: 1 });
userSchema.index({ totalViews: -1 });
userSchema.index({ createdAt: -1 });

// Virtual for getting full profile picture URL
userSchema.virtual('profilePicture').get(function() {
  return this.profilePicUrl || '/default-avatar.jpg';
});

// Method to update user statistics
userSchema.methods.updateStats = function() {
  return mongoose.model('Track').aggregate([
    { $match: { creator: this.walletAddress, status: 'minted' } },
    {
      $group: {
        _id: null,
        totalTracks: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalRemixes: { $sum: { $cond: [{ $gt: ['$parentTrackId', 0] }, 1, 0] } }
      }
    }
  ]).then(results => {
    if (results.length > 0) {
      this.totalTracks = results[0].totalTracks;
      this.totalViews = results[0].totalViews;
      this.totalRemixes = results[0].totalRemixes;
      return this.save();
    }
    return this;
  });
};

// Static method to get top creators
userSchema.statics.getTopCreators = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalViews: -1 })
    .limit(limit);
};

// Static method to find user by wallet address
userSchema.statics.findByWallet = function(walletAddress) {
  return this.findOne({ 
    walletAddress: walletAddress.toLowerCase(),
    isActive: true
  });
};

// Static method to find user by username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ 
    username: username,
    isActive: true
  });
};

module.exports = mongoose.model('User', userSchema); 