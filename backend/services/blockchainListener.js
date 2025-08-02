const { ethers } = require('ethers');
const { VortexSoundNFTAbi, VortexSoundNFTAddress } = require('../config/contracts');
const Track = require('../models/Track');
const User = require('../models/User');

let io; // Will be set by the WebSocket server

const setIo = (socketIo) => {
  io = socketIo;
};

const listenToBlockchainEvents = () => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
    const contract = new ethers.Contract(VortexSoundNFTAddress, VortexSoundNFTAbi, provider);

    console.log('Starting blockchain event listener...');

    // Listen for TrackPlayed events
    contract.on('TrackPlayed', async (trackIdBigInt, viewerAddress) => {
      try {
        const trackId = trackIdBigInt.toString();
        console.log(`Track ${trackId} played by ${viewerAddress}`);
        
        // Update MongoDB cache
        const track = await Track.findOne({ monadTrackId: parseInt(trackId) });
        if (track) {
          await track.incrementViews();
          
          // Broadcast to frontend via WebSocket
          if (io) {
            io.emit(`trackViewsUpdate_${trackId}`, track.views);
          }
        }
      } catch (error) {
        console.error('Error handling TrackPlayed event:', error);
      }
    });

    // Listen for TrackMinted events
    contract.on('TrackMinted', async (trackIdBigInt, creator, metadataURI, parentTrackIdBigInt) => {
      try {
        const trackId = trackIdBigInt.toString();
        const parentTrackId = parentTrackIdBigInt.toString();
        console.log(`Track ${trackId} minted by ${creator}, parent: ${parentTrackId}`);
        
        // Find and update the MongoDB record
        let track = await Track.findOne({ metadataURI: metadataURI });
        if (track) {
          track.monadTrackId = parseInt(trackId);
          track.status = 'minted';
          
          if (parentTrackId !== '0') {
            // Update parent track's remix count
            const parentTrack = await Track.findOne({ monadTrackId: parseInt(parentTrackId) });
            if (parentTrack) {
              await parentTrack.incrementRemixCount();
            }
          }
          
          await track.save();
          
          // Update user stats
          const user = await User.findByWallet(creator);
          if (user) {
            await user.updateStats();
          }
          
          // Broadcast to frontend via WebSocket
          if (io) {
            io.emit('newTrack', {
              id: track._id,
              monadTrackId: track.monadTrackId,
              title: track.title,
              artist: track.artist,
              genre: track.genre,
              audioUrl: track.audioUrl,
              coverUrl: track.coverUrl,
              isRemix: track.isRemix
            });
          }
        }
      } catch (error) {
        console.error('Error handling TrackMinted event:', error);
      }
    });

    // Listen for RemixCountUpdated events
    contract.on('RemixCountUpdated', async (trackIdBigInt, newRemixCount) => {
      try {
        const trackId = trackIdBigInt.toString();
        console.log(`Track ${trackId} remix count updated to ${newRemixCount}`);
        
        // Update MongoDB cache
        const track = await Track.findOne({ monadTrackId: parseInt(trackId) });
        if (track) {
          track.remixCount = parseInt(newRemixCount);
          await track.save();
          
          // Broadcast to frontend via WebSocket
          if (io) {
            io.emit(`trackRemixCountUpdate_${trackId}`, newRemixCount);
          }
        }
      } catch (error) {
        console.error('Error handling RemixCountUpdated event:', error);
      }
    });

    // Listen for ViewCountUpdated events
    contract.on('ViewCountUpdated', async (trackIdBigInt, newViewCount) => {
      try {
        const trackId = trackIdBigInt.toString();
        console.log(`Track ${trackId} view count updated to ${newViewCount}`);
        
        // Update MongoDB cache
        const track = await Track.findOne({ monadTrackId: parseInt(trackId) });
        if (track) {
          track.views = parseInt(newViewCount);
          await track.save();
          
          // Broadcast to frontend via WebSocket
          if (io) {
            io.emit(`trackViewsUpdate_${trackId}`, newViewCount);
          }
        }
      } catch (error) {
        console.error('Error handling ViewCountUpdated event:', error);
      }
    });

    // Handle provider disconnection
    provider.on('error', (error) => {
      console.error('Provider error:', error);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        console.log('Attempting to reconnect to provider...');
        listenToBlockchainEvents();
      }, 5000);
    });

    console.log('Blockchain event listener started successfully');
    
  } catch (error) {
    console.error('Failed to start blockchain event listener:', error);
    // Retry after a delay
    setTimeout(() => {
      console.log('Retrying blockchain event listener...');
      listenToBlockchainEvents();
    }, 10000);
  }
};

module.exports = {
  listenToBlockchainEvents,
  setIo
}; 