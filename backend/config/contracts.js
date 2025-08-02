// Contract configuration for VortexSound
const VortexSoundNFTAbi = [
  "function mintOriginal(address _to, string memory _metadataURI, uint256 _creatorRoyaltyBps) public returns (uint256)",
  "function mintRemix(address _to, string memory _metadataURI, uint256 _parentTrackId, uint256 _creatorRoyaltyBps) public returns (uint256)",
  "function recordPlay(uint256 _trackId) public",
  "function getTrackInfo(uint256 _trackId) public view returns (address creator, string memory metadataURI, uint256 parentTrackId, uint256 creatorRoyaltyBps, uint256 views, uint256 remixCount, uint256 directRemixRoyaltyBps)",
  "function getTrackLineage(uint256 _trackId) public view returns (uint256[] memory)",
  "function getAncestorLineage(uint256 _trackId) public view returns (uint256[] memory)",
  "function getTotalTracks() public view returns (uint256)",
  "function trackExists(uint256 _trackId) public view returns (bool)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "event TrackMinted(uint256 indexed trackId, address indexed creator, string metadataURI, uint256 parentTrackId)",
  "event TrackPlayed(uint256 indexed trackId, address indexed viewer)",
  "event RoyaltyDistributed(uint256 indexed trackId, address indexed recipient, uint256 amount)",
  "event RemixCountUpdated(uint256 indexed trackId, uint256 newRemixCount)",
  "event ViewCountUpdated(uint256 indexed trackId, uint256 newViewCount)"
];

const VortexSoundNFTAddress = process.env.VORTEXSOUND_NFT_CONTRACT_ADDRESS;

module.exports = {
  VortexSoundNFTAbi,
  VortexSoundNFTAddress
}; 