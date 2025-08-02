import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Track view count updates
    this.socket.on('trackViewsUpdate', (trackId: string, viewCount: number) => {
      this.notifyListeners(`trackViewsUpdate_${trackId}`, { trackId, viewCount });
    });

    // Track remix count updates
    this.socket.on('trackRemixCountUpdate', (trackId: string, remixCount: number) => {
      this.notifyListeners(`trackRemixCountUpdate_${trackId}`, { trackId, remixCount });
    });

    // New track minted
    this.socket.on('newTrack', (track: any) => {
      this.notifyListeners('newTrack', track);
    });

    // Join track room for specific updates
    this.socket.on('joinTrack', (trackId: string) => {
      this.socket?.emit('joinTrack', trackId);
    });

    // Leave track room
    this.socket.on('leaveTrack', (trackId: string) => {
      this.socket?.emit('leaveTrack', trackId);
    });
  }

  // Subscribe to track updates
  subscribeToTrack(trackId: string, callback: Function) {
    const eventKey = `trackViewsUpdate_${trackId}`;
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, new Set());
    }
    this.listeners.get(eventKey)?.add(callback);

    // Join the track room
    this.socket?.emit('joinTrack', trackId);
  }

  // Unsubscribe from track updates
  unsubscribeFromTrack(trackId: string, callback: Function) {
    const eventKey = `trackViewsUpdate_${trackId}`;
    this.listeners.get(eventKey)?.delete(callback);

    // Leave the track room
    this.socket?.emit('leaveTrack', trackId);
  }

  // Subscribe to new tracks
  subscribeToNewTracks(callback: Function) {
    if (!this.listeners.has('newTrack')) {
      this.listeners.set('newTrack', new Set());
    }
    this.listeners.get('newTrack')?.add(callback);
  }

  // Unsubscribe from new tracks
  unsubscribeFromNewTracks(callback: Function) {
    this.listeners.get('newTrack')?.delete(callback);
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in socket listener callback:', error);
        }
      });
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService(); 