const socketIo = require('socket.io');

let io;

const initWebSocket = (httpServer) => {
  io = socketIo(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite default port
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join room for specific track updates
    socket.on('joinTrack', (trackId) => {
      socket.join(`track_${trackId}`);
      console.log(`Client ${socket.id} joined track ${trackId}`);
    });
    
    // Leave room for specific track updates
    socket.on('leaveTrack', (trackId) => {
      socket.leave(`track_${trackId}`);
      console.log(`Client ${socket.id} left track ${trackId}`);
    });
    
    // Join room for user updates
    socket.on('joinUser', (walletAddress) => {
      socket.join(`user_${walletAddress}`);
      console.log(`Client ${socket.id} joined user ${walletAddress}`);
    });
    
    // Leave room for user updates
    socket.on('leaveUser', (walletAddress) => {
      socket.leave(`user_${walletAddress}`);
      console.log(`Client ${socket.id} left user ${walletAddress}`);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('WebSocket server initialized');
};

const getIo = () => io;

module.exports = {
  initWebSocket,
  getIo
}; 