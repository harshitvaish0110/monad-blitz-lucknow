const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Track {
  id: string;
  monadTrackId: number;
  title: string;
  artist: string;
  genre: string;
  views: number;
  audioUrl: string;
  coverUrl?: string;
  duration: number;
  isRemix: boolean;
  createdAt: string;
}

interface User {
  walletAddress: string;
  username: string;
  displayName: string;
  bio: string;
  profilePicUrl?: string;
  totalTracks: number;
  totalViews: number;
  totalRemixes: number;
  isVerified: boolean;
}

interface UploadResponse {
  success: boolean;
  track: {
    id: string;
    monadTrackId: number;
    title: string;
    artist: string;
    genre: string;
    audioUrl: string;
    status: string;
  };
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Track API methods
  async getTrendingTracks(limit: number = 10): Promise<Track[]> {
    const response = await this.request<{ success: boolean; tracks: Track[] }>(
      `/tracks/trending?limit=${limit}`
    );
    return response.tracks;
  }

  async getLatestTracks(limit: number = 10): Promise<Track[]> {
    const response = await this.request<{ success: boolean; tracks: Track[] }>(
      `/tracks/latest?limit=${limit}`
    );
    return response.tracks;
  }

  async getTrackDetails(monadTrackId: number): Promise<any> {
    const response = await this.request<{ success: boolean; track: any }>(
      `/tracks/${monadTrackId}`
    );
    return response.track;
  }

  async getTracksByCreator(walletAddress: string, limit: number = 20): Promise<Track[]> {
    const response = await this.request<{ success: boolean; tracks: Track[] }>(
      `/tracks/creator/${walletAddress}?limit=${limit}`
    );
    return response.tracks;
  }

  async recordPlay(monadTrackId: number, viewerAddress: string): Promise<void> {
    await this.request('/tracks/play', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ monadTrackId, viewerAddress }),
    });
  }

  async uploadTrack(formData: FormData): Promise<UploadResponse> {
    const response = await fetch(`${API_BASE_URL}/tracks/upload`, {
      method: 'POST',
      body: formData, // Don't set Content-Type for FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
    }

    return await response.json();
  }

  // User API methods
  async getUserProfile(walletAddress: string): Promise<User> {
    const response = await this.request<{ success: boolean; user: User }>(
      `/users/${walletAddress}/profile`
    );
    return response.user;
  }

  async createOrUpdateProfile(userData: {
    walletAddress: string;
    username: string;
    displayName?: string;
    bio?: string;
    website?: string;
    twitter?: string;
    instagram?: string;
  }): Promise<User> {
    const response = await this.request<{ success: boolean; user: User }>(
      '/users/profile',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    return response.user;
  }

  async getTopCreators(limit: number = 10): Promise<User[]> {
    const response = await this.request<{ success: boolean; creators: User[] }>(
      `/users/creators/top?limit=${limit}`
    );
    return response.creators;
  }
}

export const apiService = new ApiService();
export type { Track, User, UploadResponse }; 