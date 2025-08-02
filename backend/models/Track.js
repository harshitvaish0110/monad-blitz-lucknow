const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  // On-chain data
  monadTrackId: {
    type: Number,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness for non-null values
  },
  creator: {
    type: String, // Wallet address
    required: true
  },
  metadataURI: {
    type: String,
    required: true
  },
  parentTrackId: {
    type: Number,
    default: 0 // 0 for original tracks
  },
  creatorRoyaltyBps: {
    type: Number,
    required: true,
    min: 0,
    max: 10000
  },
  views: {
    type: Number,
    default: 0
  },
  remixCount: {
    type: Number,
    default: 0
  },
  directRemixRoyaltyBps: {
    type: Number,
    default: 0
  },

  // Off-chain metadata
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  
  // IPFS data
  audioIpfsCid: {
    type: String,
    required: true
  },
  audioIpfsUrl: {
    type: String,
    required: true
  },
  coverIpfsCid: {
    type: String,
    default: null
  },
  coverIpfsUrl: {
    type: String,
    default: null
  },

  // Additional metadata
  duration: {
    type: Number, // in seconds
    default: 0
  },
  fileSize: {
    type: Number, // in bytes
    default: 0
  },
  fileType: {
    type: String,
    default: 'audio/mpeg'
  },

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
  isRemix: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'minted', 'error'],
    default: 'uploading'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
trackSchema.index({ monadTrackId: 1 });
trackSchema.index({ creator: 1 });
trackSchema.index({ parentTrackId: 1 });
trackSchema.index({ views: -1 });
trackSchema.index({ createdAt: -1 });
trackSchema.index({ genre: 1 });
trackSchema.index({ status: 1 });

// Virtual for getting full IPFS gateway URL
trackSchema.virtual('audioUrl').get(function() {
  return this.audioIpfsUrl;
});

// Virtual for getting cover image URL
trackSchema.virtual('coverUrl').get(function() {
  return this.coverIpfsUrl || '/default-cover.jpg';
});

// Method to update view count
trackSchema.methods.incrementViews = function() {
  this.views += 1;
  this.updatedAt = new Date();
  return this.save();
};

// Method to update remix count
trackSchema.methods.incrementRemixCount = function() {
  this.remixCount += 1;
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get trending tracks
trackSchema.statics.getTrending = function(limit = 10) {
  return this.find({ status: 'minted' })
    .sort({ views: -1 })
    .limit(limit);
};

// Static method to get latest tracks
trackSchema.statics.getLatest = function(limit = 10) {
  return this.find({ status: 'minted' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get tracks by creator
trackSchema.statics.getByCreator = function(creatorAddress, limit = 20) {
  return this.find({ 
    creator: creatorAddress,
    status: 'minted'
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get remixes of a track
trackSchema.statics.getRemixes = function(parentTrackId, limit = 20) {
  return this.find({ 
    parentTrackId: parentTrackId,
    status: 'minted'
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Track', trackSchema); 