import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Music, 
  TrendingUp, 
  Clock, 
  Heart,
  Play,
  Share2,
  Filter,
  Eye
} from 'lucide-react';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genres = [
    'All', 'Synthwave', 'Techno', 'Ambient', 'Electronic', 'Glitch', 
    'Drum & Bass', 'House', 'Trance', 'Dubstep', 'Experimental'
  ];

  const mockTracks = [
    {
      id: '1',
      title: 'Neon Dreams',
      artist: 'Cyberpunk DJ',
      genre: 'Synthwave',
      views: 3,
      likes: 2,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      isRemix: false,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Digital Rain',
      artist: 'Cyberpunk DJ',
      genre: 'Techno',
      views: 2,
      likes: 1,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
      isRemix: true,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Glitch in the Matrix',
      artist: 'Cyberpunk DJ',
      genre: 'Glitch',
      views: 1,
      likes: 1,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
      isRemix: false,
      createdAt: '2024-01-05'
    },
    {
      id: '4',
      title: 'Electric Dreams',
      artist: 'Neon Pulse',
      genre: 'Electronic',
      views: 4,
      likes: 2,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
      isRemix: false,
      createdAt: '2024-01-12'
    },
    {
      id: '5',
      title: 'Midnight Drive',
      artist: 'Synthwave Collective',
      genre: 'Synthwave',
      views: 5,
      likes: 3,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      isRemix: false,
      createdAt: '2024-01-08'
    },
    {
      id: '6',
      title: 'Quantum Beats',
      artist: 'Digital Alchemist',
      genre: 'Experimental',
      views: 2,
      likes: 1,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
      isRemix: true,
      createdAt: '2024-01-03'
    }
  ];

  const filteredTracks = mockTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-cyber font-bold mb-4">Discover Music</h1>
        <p className="text-muted-foreground text-lg">
          Explore the latest tracks from the VortexSound community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tracks, artists, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre.toLowerCase())}
              className="font-cyber"
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-cyan-900 p-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-cyber font-bold text-white">Trending Now</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mockTracks.slice(0, 3).map((track) => (
              <Card key={track.id} className="bg-white/10 border-white/20 text-white">
                <div className="aspect-square relative">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="icon" className="bg-white/20 hover:bg-white/30">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  {track.isRemix && (
                    <Badge className="absolute top-2 right-2 bg-purple-500">
                      Remix
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-cyber font-semibold text-lg mb-1">{track.title}</h3>
                  <p className="text-white/80 mb-2">{track.artist}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-white/30 text-white">
                      {track.genre}
                    </Badge>
                    <div className="flex items-center gap-3 text-white/70">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{track.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{track.likes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* All Tracks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-cyber font-bold">All Tracks</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{filteredTracks.length} tracks found</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTracks.map((track) => (
            <Card key={track.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-square relative">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Button size="icon" className="bg-white/20 hover:bg-white/30">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {track.isRemix && (
                  <Badge className="absolute top-2 right-2 bg-purple-500">
                    Remix
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-cyber font-semibold text-lg mb-1 truncate">{track.title}</h3>
                <p className="text-muted-foreground mb-2 truncate">{track.artist}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{track.genre}</Badge>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span className="text-xs">{track.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span className="text-xs">{track.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTracks.length === 0 && (
          <Card className="p-12 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-cyber mb-2">No tracks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Discover; 