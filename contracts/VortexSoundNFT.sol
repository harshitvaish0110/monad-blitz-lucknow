// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VortexSoundNFT
 * @dev Smart contract for VortexSound music NFTs on Monad blockchain
 * Handles NFT minting, remix lineage, view tracking, and royalty distribution
 */
contract VortexSoundNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // State variables
    Counters.Counter private _tokenIds;
    uint256 public maxRoyaltyBps = 10000; // 100% in basis points

    // Track data structure
    struct TrackData {
        address creator;                    // Wallet address of the original uploader/remixer
        string metadataURI;                 // IPFS URI (ipfs://CID) for the NFT metadata JSON
        uint256 parentTrackId;              // 0 for original, non-zero for remix (links to parent NFT ID)
        uint256 creatorRoyaltyBps;          // Royalty percentage in Basis Points (BPS) for this track's creator
        uint256 views;                      // On-chain counter for plays/views
        uint256 remixCount;                 // On-chain counter for how many remixes this track has generated
        uint256 directRemixRoyaltyBps;      // Optional: BPS for direct parent on any play of this track
    }

    // Mappings
    mapping(uint256 => TrackData) public trackInfo;
    mapping(uint256 => uint256[]) public trackLineage; // Maps parent trackId to array of direct childTrackIds

    // Events
    event TrackMinted(uint256 indexed trackId, address indexed creator, string metadataURI, uint256 parentTrackId);
    event TrackPlayed(uint256 indexed trackId, address indexed viewer);
    event RoyaltyDistributed(uint256 indexed trackId, address indexed recipient, uint256 amount);
    event RemixCountUpdated(uint256 indexed trackId, uint256 newRemixCount);
    event ViewCountUpdated(uint256 indexed trackId, uint256 newViewCount);

    constructor() ERC721("VortexSoundTrack", "VST") Ownable(msg.sender) {}

    /**
     * @dev Mint a new original track NFT
     * @param _to Address to mint the NFT to
     * @param _metadataURI IPFS URI for the NFT metadata
     * @param _creatorRoyaltyBps Royalty percentage in basis points
     * @return newItemId The ID of the newly minted NFT
     */
    function mintOriginal(
        address _to,
        string memory _metadataURI,
        uint256 _creatorRoyaltyBps
    ) public returns (uint256) {
        require(_creatorRoyaltyBps <= maxRoyaltyBps, "Royalty exceeds maximum");
        require(bytes(_metadataURI).length > 0, "Metadata URI cannot be empty");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(_to, newItemId);

        trackInfo[newItemId] = TrackData({
            creator: _to,
            metadataURI: _metadataURI,
            parentTrackId: 0, // Original track
            creatorRoyaltyBps: _creatorRoyaltyBps,
            views: 0,
            remixCount: 0,
            directRemixRoyaltyBps: 0
        });

        emit TrackMinted(newItemId, _to, _metadataURI, 0);
        return newItemId;
    }

    /**
     * @dev Mint a remix track NFT
     * @param _to Address to mint the NFT to
     * @param _metadataURI IPFS URI for the NFT metadata
     * @param _parentTrackId ID of the parent track being remixed
     * @param _creatorRoyaltyBps Royalty percentage in basis points
     * @return newItemId The ID of the newly minted NFT
     */
    function mintRemix(
        address _to,
        string memory _metadataURI,
        uint256 _parentTrackId,
        uint256 _creatorRoyaltyBps
    ) public returns (uint256) {
        require(_creatorRoyaltyBps <= maxRoyaltyBps, "Royalty exceeds maximum");
        require(_parentTrackId > 0, "Parent track ID must be greater than 0");
        require(trackInfo[_parentTrackId].creator != address(0), "Parent track does not exist");
        require(bytes(_metadataURI).length > 0, "Metadata URI cannot be empty");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(_to, newItemId);

        trackInfo[newItemId] = TrackData({
            creator: _to,
            metadataURI: _metadataURI,
            parentTrackId: _parentTrackId,
            creatorRoyaltyBps: _creatorRoyaltyBps,
            views: 0,
            remixCount: 0,
            directRemixRoyaltyBps: 0
        });

        // Update parent track's remix count
        trackInfo[_parentTrackId].remixCount++;
        trackLineage[_parentTrackId].push(newItemId);

        emit TrackMinted(newItemId, _to, _metadataURI, _parentTrackId);
        emit RemixCountUpdated(_parentTrackId, trackInfo[_parentTrackId].remixCount);

        return newItemId;
    }

    /**
     * @dev Record a play/view of a track and distribute royalties
     * @param _trackId ID of the track being played
     */
    function recordPlay(uint256 _trackId) public {
        require(_exists(_trackId), "Track does not exist");
        
        TrackData storage track = trackInfo[_trackId];
        track.views++;
        
        emit TrackPlayed(_trackId, msg.sender);
        emit ViewCountUpdated(_trackId, track.views);
        
        _distributeCredits(_trackId);
    }

    /**
     * @dev Internal function to distribute credits/royalties up the remix lineage
     * @param _trackId ID of the track being played
     */
    function _distributeCredits(uint256 _trackId) internal {
        TrackData storage currentTrack = trackInfo[_trackId];
        
        // Distribute to current track creator
        if (currentTrack.creatorRoyaltyBps > 0) {
            emit RoyaltyDistributed(_trackId, currentTrack.creator, currentTrack.creatorRoyaltyBps);
        }
        
        // Distribute to parent lineage
        uint256 parentId = currentTrack.parentTrackId;
        uint256 remainingBps = maxRoyaltyBps - currentTrack.creatorRoyaltyBps;
        
        while (parentId != 0) {
            TrackData storage parentTrack = trackInfo[parentId];
            if (parentTrack.creator != address(0)) {
                // Simple model: split remaining BPS among ancestors
                uint256 ancestorShare = remainingBps / 2; // 50% to immediate parent
                if (ancestorShare > 0) {
                    emit RoyaltyDistributed(_trackId, parentTrack.creator, ancestorShare);
                }
                remainingBps = remainingBps - ancestorShare;
            }
            parentId = parentTrack.parentTrackId;
        }
    }

    /**
     * @dev Get track information
     * @param _trackId ID of the track
     * @return TrackData struct containing track information
     */
    function getTrackInfo(uint256 _trackId) public view returns (TrackData memory) {
        require(_exists(_trackId), "Track does not exist");
        return trackInfo[_trackId];
    }

    /**
     * @dev Get direct remixes of a track
     * @param _trackId ID of the parent track
     * @return Array of direct remix track IDs
     */
    function getTrackLineage(uint256 _trackId) public view returns (uint256[] memory) {
        return trackLineage[_trackId];
    }

    /**
     * @dev Get all ancestor track IDs in the remix lineage
     * @param _trackId ID of the track
     * @return Array of ancestor track IDs
     */
    function getAncestorLineage(uint256 _trackId) public view returns (uint256[] memory) {
        require(_exists(_trackId), "Track does not exist");
        
        uint256[] memory ancestors = new uint256[](10); // Max 10 levels deep
        uint256 count = 0;
        uint256 currentId = trackInfo[_trackId].parentTrackId;
        
        while (currentId != 0 && count < 10) {
            ancestors[count] = currentId;
            currentId = trackInfo[currentId].parentTrackId;
            count++;
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = ancestors[i];
        }
        
        return result;
    }

    /**
     * @dev Override tokenURI to return the metadata URI
     * @param tokenId ID of the token
     * @return Metadata URI string
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return trackInfo[tokenId].metadataURI;
    }

    /**
     * @dev Get total number of tracks minted
     * @return Total count of tracks
     */
    function getTotalTracks() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Check if a track exists
     * @param _trackId ID of the track
     * @return True if track exists
     */
    function trackExists(uint256 _trackId) public view returns (bool) {
        return _exists(_trackId);
    }
} 