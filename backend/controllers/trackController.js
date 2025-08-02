const Track = require('../models/Track');
const User = require('../models/User');
const { ethers } = require('ethers');
const { VortexSoundNFTAbi, VortexSoundNFTAddress } = require('../config/contracts');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');

// Initialize Pinata
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
});

// Initialize ethers provider and contract
const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(VortexSoundNFTAddress, VortexSoundNFTAbi, wallet);

/**
 * Upload and mint a new track
 */
const uploadAndMint = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const {
      title,
      artist,
      genre,
      description,
      royaltyPercentage,
      parentTrackId,
      creatorAddress
    } = req.body;

    // Validate required fields
    if (!title || !artist || !genre || !creatorAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate royalty percentage
    const royaltyBps = parseInt(royaltyPercentage) || 500; // Default 5%
    if (royaltyBps < 0 || royaltyBps > 10000) {
      return res.status(400).json({ error: 'Invalid royalty percentage' });
    }

    // Check if parent track exists (for remixes)
    let parentTrack = null;
    if (parentTrackId && parentTrackId !== '0') {
      parentTrack = await Track.findOne({ monadTrackId: parseInt(parentTrackId) });
      if (!parentTrack) {
        return res.status(400).json({ error: 'Parent track not found' });
      }
    }

    // Upload audio file to IPFS
    console.log('Uploading audio file to IPFS...');
    const audioFileStream = fs.createReadStream(req.file.path);
    const audioPinataResponse = await pinata.pinFileToIPFS(audioFileStream, {
      pinataMetadata: { name: `${title}_audio` },
      pinataOptions: { cidVersion: 0 }
    });
    
    const audioIpfsCid = audioPinataResponse.IpfsHash;
    const audioIpfsUrl = `https://gateway.pinata.cloud/ipfs/${audioIpfsCid}`;

    // Create NFT metadata JSON
    const nftMetadata = {
      name: title,
      description: description || `A track by ${artist} on VortexSound.`,
      image: `https://gateway.pinata.cloud/ipfs/QmVortexSoundDefaultCoverArt`, // Default cover art
      animation_url: audioIpfsUrl, // Link to the IPFS audio file
      properties: {
        genre: genre,
        artist: artist,
        originalCreatorAddress: creatorAddress,
        remixOfMonadTrackId: parentTrackId || null,
        royaltySplitBps: royaltyBps,
        vortexSoundVersion: "1.0"
      }
    };

    // Upload metadata to IPFS
    console.log('Uploading metadata to IPFS...');
    const metadataPinataResponse = await pinata.pinJSONToIPFS(nftMetadata);
    const metadataIpfsUri = `ipfs://${metadataPinataResponse.IpfsHash}`;

    // Create track record in MongoDB
    const trackData = {
      creator: creatorAddress,
      metadataURI: metadataIpfsUri,
      parentTrackId: parentTrackId ? parseInt(parentTrackId) : 0,
      creatorRoyaltyBps: royaltyBps,
      title,
      artist,
      genre,
      description,
      audioIpfsCid,
      audioIpfsUrl,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      isRemix: !!parentTrackId && parentTrackId !== '0',
      status: 'processing'
    };

    const track = new Track(trackData);
    await track.save();

    // Mint NFT on blockchain
    console.log('Minting NFT on Monad blockchain...');
    let mintedTrackId;
    
    if (parentTrackId && parentTrackId !== '0') {
      // Mint remix
      const mintTx = await contract.mintRemix(
        creatorAddress,
        metadataIpfsUri,
        parseInt(parentTrackId),
        royaltyBps
      );
      const receipt = await mintTx.wait();
      
      // Extract track ID from events
      const mintEvent = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'TrackMinted'
      );
      mintedTrackId = mintEvent.args.trackId.toString();
    } else {
      // Mint original
      const mintTx = await contract.mintOriginal(
        creatorAddress,
        metadataIpfsUri,
        royaltyBps
      );
      const receipt = await mintTx.wait();
      
      // Extract track ID from events
      const mintEvent = receipt.logs.find(log => 
        log.fragment && log.fragment.name === 'TrackMinted'
      );
      mintedTrackId = mintEvent.args.trackId.toString();
    }

    // Update track with on-chain ID
    track.monadTrackId = parseInt(mintedTrackId);
    track.status = 'minted';
    await track.save();

    // Update or create user profile
    let user = await User.findByWallet(creatorAddress);
    if (!user) {
      user = new User({
        walletAddress: creatorAddress,
        username: artist.toLowerCase().replace(/\s+/g, '_'),
        displayName: artist
      });
    }
    await user.updateStats();
    await user.save();

    // Cleanup uploaded file
    const { cleanupUpload } = require('../middleware/upload');
    cleanupUpload(req.file.path);

    console.log(`Track ${mintedTrackId} minted successfully!`);

    res.status(201).json({
      success: true,
      track: {
        id: track._id,
        monadTrackId: mintedTrackId,
        title,
        artist,
        genre,
        audioUrl: audioIpfsUrl,
        status: 'minted'
      }
    });

  } catch (error) {
    console.error('Upload and mint error:', error);
    
    // Cleanup uploaded file on error
    if (req.file) {
      const { cleanupUpload } = require('../middleware/upload');
      cleanupUpload(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to upload and mint track',
      details: error.message 
    });
  }
};

/**
 * Record a play/view of a track
 */
const recordPlay = async (req, res) => {
  try {
    const { monadTrackId, viewerAddress } = req.body;

    if (!monadTrackId || !viewerAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call the smart contract to record the play
    const tx = await contract.recordPlay(parseInt(monadTrackId));
    await tx.wait();

    // Update MongoDB cache
    const track = await Track.findOne({ monadTrackId: parseInt(monadTrackId) });
    if (track) {
      await track.incrementViews();
    }

    res.json({ 
      success: true, 
      message: 'Play recorded successfully',
      trackId: monadTrackId
    });

  } catch (error) {
    console.error('Record play error:', error);
    res.status(500).json({ 
      error: 'Failed to record play',
      details: error.message 
    });
  }
};

/**
 * Get trending tracks
 */
const getTrendingTracks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const tracks = await Track.getTrending(limit);
    
    res.json({
      success: true,
      tracks: tracks.map(track => ({
        id: track._id,
        monadTrackId: track.monadTrackId,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        views: track.views,
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl,
        duration: track.duration,
        createdAt: track.createdAt
      }))
    });
  } catch (error) {
    console.error('Get trending tracks error:', error);
    res.status(500).json({ error: 'Failed to get trending tracks' });
  }
};

/**
 * Get latest tracks
 */
const getLatestTracks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const tracks = await Track.getLatest(limit);
    
    res.json({
      success: true,
      tracks: tracks.map(track => ({
        id: track._id,
        monadTrackId: track.monadTrackId,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        views: track.views,
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl,
        duration: track.duration,
        createdAt: track.createdAt
      }))
    });
  } catch (error) {
    console.error('Get latest tracks error:', error);
    res.status(500).json({ error: 'Failed to get latest tracks' });
  }
};

/**
 * Get track details by Monad track ID
 */
const getTrackDetails = async (req, res) => {
  try {
    const { monadTrackId } = req.params;
    
    const track = await Track.findOne({ monadTrackId: parseInt(monadTrackId) });
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Get on-chain data
    const onChainData = await contract.getTrackInfo(parseInt(monadTrackId));
    
    res.json({
      success: true,
      track: {
        id: track._id,
        monadTrackId: track.monadTrackId,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        description: track.description,
        views: track.views,
        remixCount: track.remixCount,
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl,
        duration: track.duration,
        isRemix: track.isRemix,
        parentTrackId: track.parentTrackId,
        creatorRoyaltyBps: track.creatorRoyaltyBps,
        createdAt: track.createdAt,
        onChainData: {
          creator: onChainData.creator,
          views: onChainData.views.toString(),
          remixCount: onChainData.remixCount.toString()
        }
      }
    });
  } catch (error) {
    console.error('Get track details error:', error);
    res.status(500).json({ error: 'Failed to get track details' });
  }
};

/**
 * Get tracks by creator
 */
const getTracksByCreator = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const tracks = await Track.getByCreator(walletAddress, limit);
    
    res.json({
      success: true,
      tracks: tracks.map(track => ({
        id: track._id,
        monadTrackId: track.monadTrackId,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        views: track.views,
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl,
        duration: track.duration,
        isRemix: track.isRemix,
        createdAt: track.createdAt
      }))
    });
  } catch (error) {
    console.error('Get tracks by creator error:', error);
    res.status(500).json({ error: 'Failed to get tracks by creator' });
  }
};

module.exports = {
  uploadAndMint,
  recordPlay,
  getTrendingTracks,
  getLatestTracks,
  getTrackDetails,
  getTracksByCreator
}; 