# VortexSound - Web3 Music Platform

VortexSound is a decentralized music platform built on the Monad blockchain that enables artists to mint their tracks as NFTs, create remix lineages, and earn royalties through on-chain play tracking.

## 🚀 Features

- **NFT Music Minting**: Upload and mint tracks as NFTs on Monad blockchain
- **Remix Lineage**: Create and track remix relationships between tracks
- **On-Chain Analytics**: Real-time view counting and royalty distribution
- **IPFS Storage**: Decentralized storage for audio files and metadata
- **Real-time Updates**: WebSocket integration for live data updates
- **Modern UI**: Cyberpunk-themed React frontend with shadcn/ui components

## 🏗️ Architecture

```
VortexSound/
├── contracts/           # Solidity smart contracts
├── backend/            # Node.js/Express.js API server
├── src/               # React frontend
├── scripts/           # Deployment scripts
└── docs/             # Documentation
```

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - ERC-721 NFT standard
- **Hardhat** - Development framework
- **Monad Blockchain** - High-throughput L1 blockchain

### Backend
- **Node.js/Express.js** - API server
- **MongoDB** - Database for off-chain data
- **Socket.io** - Real-time communication
- **IPFS/Pinata** - Decentralized storage
- **ethers.js** - Blockchain interaction

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Socket.io-client** - Real-time updates

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Monad testnet account with test tokens
- Pinata account for IPFS storage

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd vortex-echoes
npm install
```

### 2. Environment Setup

Create environment files:

**Backend (.env)**
```bash
# Copy from backend/env.example
cp backend/env.example backend/.env
```

**Frontend (.env)**
```bash
# Create .env in root
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### 3. Deploy Smart Contract

```bash
# Set up environment variables
export MONAD_RPC_URL=https://rpc.testnet.monad.xyz
export PRIVATE_KEY=your_private_key_here

# Compile contracts
npm run contract:compile

# Deploy to Monad testnet
npm run contract:deploy
```

### 4. Update Contract Address

After deployment, update the contract address in:
- `backend/.env` - `VORTEXSOUND_NFT_CONTRACT_ADDRESS`
- `backend/config/contracts.js` - Update address

### 5. Start Backend

```bash
cd backend
npm install
npm run dev
```

### 6. Start Frontend

```bash
# In root directory
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/vortexsound

# Blockchain
MONAD_RPC_URL=https://rpc.testnet.monad.xyz
VORTEXSOUND_NFT_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key

# IPFS
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

## 📚 API Documentation

### Track Endpoints

- `POST /api/tracks/upload` - Upload and mint track
- `POST /api/tracks/:monadTrackId/play` - Record play
- `GET /api/tracks/trending` - Get trending tracks
- `GET /api/tracks/latest` - Get latest tracks
- `GET /api/tracks/:monadTrackId` - Get track details
- `GET /api/tracks/creator/:walletAddress` - Get creator tracks

### User Endpoints

- `GET /api/users/:walletAddress/profile` - Get user profile
- `POST /api/users/profile` - Create/update profile
- `GET /api/users/creators/top` - Get top creators

## 🎵 Smart Contract Functions

### Core Functions
- `mintOriginal()` - Mint original track NFT
- `mintRemix()` - Mint remix track NFT
- `recordPlay()` - Record track play/view
- `getTrackInfo()` - Get track information
- `getTrackLineage()` - Get remix lineage

### Events
- `TrackMinted` - Track minted event
- `TrackPlayed` - Track played event
- `RoyaltyDistributed` - Royalty distribution event
- `ViewCountUpdated` - View count update event

## 🔄 Real-time Features

### WebSocket Events
- `trackViewsUpdate_${trackId}` - Track view count updates
- `trackRemixCountUpdate_${trackId}` - Remix count updates
- `newTrack` - New track minted

### Frontend Integration
```typescript
import { socketService } from '@/services/socket';

// Subscribe to track updates
socketService.subscribeToTrack(trackId, (data) => {
  console.log('Track updated:', data);
});

// Subscribe to new tracks
socketService.subscribeToNewTracks((track) => {
  console.log('New track:', track);
});
```

## 🎨 UI Components

### Core Components
- `MusicPlayer` - Audio player with controls
- `TrackCard` - Track display card
- `UploadSection` - Track upload form
- `TrendingSection` - Trending tracks display
- `Navigation` - App navigation

### Theming
The app features a cyberpunk theme with:
- Dark color scheme
- Neon accents
- Glitch effects
- Futuristic typography

## 🧪 Testing

### Smart Contract Tests
```bash
npm run contract:test
```

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm test
```

## 🚀 Deployment

### Smart Contract
```bash
# Deploy to Monad mainnet
npm run contract:deploy --network monadMainnet
```

### Backend
```bash
# Production build
cd backend
npm run build
npm start
```

### Frontend
```bash
# Production build
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

## 🔗 Links

- [Monad Documentation](https://docs.monad.xyz/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs/)

---

**VortexSound** - The future of decentralized music is here! 🎵✨
