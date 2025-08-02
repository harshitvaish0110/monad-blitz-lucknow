import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TrackCard from './TrackCard';
import { TrendingUp, Clock, Flame, Music } from 'lucide-react';

const TrendingSection = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'hot' | 'remixes'>('trending');
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  // Mock data - in real app this would come from API
  const mockTracks = [
    {
      id: '1',
      title: 'Cyber Dreams',
      artist: 'NeonSynth',
      views: 5,
      remixCount: 2,
      duration: '3:42',
      genre: 'Synthwave',
    },
    {
      id: '2',
      title: 'Digital Rain (VortexRemix)',
      artist: 'ByteBeats',
      views: 4,
      remixCount: 1,
      duration: '4:15',
      genre: 'Ambient',
      isRemix: true,
      parentTrack: 'Digital Rain',
    },
    {
      id: '3',
      title: 'Quantum Frequencies',
      artist: 'CyberPunk',
      views: 3,
      remixCount: 1,
      duration: '5:23',
      genre: 'Techno',
    },
    {
      id: '4',
      title: 'Neural Network',
      artist: 'AI_Composer',
      views: 2,
      remixCount: 0,
      duration: '3:58',
      genre: 'Electronic',
    },
    {
      id: '5',
      title: 'Matrix Glitch (Extended)',
      artist: 'GlitchMaster',
      views: 1,
      remixCount: 0,
      duration: '6:12',
      genre: 'Glitch',
      isRemix: true,
      parentTrack: 'Matrix Glitch',
    },
    {
      id: '6',
      title: 'Neon Nights',
      artist: 'RetroWave',
      views: 1,
      remixCount: 0,
      duration: '4:33',
      genre: 'Synthwave',
    },
  ];

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Clock },
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'remixes', label: 'Remixes', icon: Music },
  ] as const;

  const handlePlay = (trackId: string) => {
    setCurrentPlaying(currentPlaying === trackId ? null : trackId);
  };

  const getFilteredTracks = () => {
    switch (activeTab) {
      case 'remixes':
        return mockTracks.filter(track => track.isRemix);
      case 'new':
        return [...mockTracks].reverse(); // Simulate newest first
      case 'hot':
        return [...mockTracks].sort((a, b) => b.views - a.views);
      default:
        return mockTracks;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Card variant="cyber" className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-cyber">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Discover Music
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'cyber' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="font-cyber"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTracks().map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={handlePlay}
                isPlaying={currentPlaying === track.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Stats Bar */}
      <Card variant="neon" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-neon-cyan">
                3
              </div>
              <div className="text-xs text-muted-foreground">
                PLAYING NOW
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-neon-pink">
                2
              </div>
              <div className="text-xs text-muted-foreground">
                NEW UPLOADS
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-neon-purple">
                1
              </div>
              <div className="text-xs text-muted-foreground">
                REMIXES TODAY
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            LIVE UPDATES FROM MONAD
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TrendingSection;