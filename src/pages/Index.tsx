import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import TrendingSection from '@/components/TrendingSection';
import MusicPlayer from '@/components/MusicPlayer';

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Mock current track for demo
  const mockCurrentTrack = {
    id: 'demo-1',
    title: 'Cyber Dreams',
    artist: 'NeonSynth',
    duration: 222, // seconds
    audioUrl: '', // Would be IPFS URL in real app
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        <HeroSection />
        <TrendingSection />
        
        {/* Additional sections would go here */}
        <div className="h-32" /> {/* Spacer for music player */}
      </main>
      
      {/* Music Player */}
      <MusicPlayer
        currentTrack={mockCurrentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={() => console.log('Next track')}
        onPrevious={() => console.log('Previous track')}
        onSeek={(time) => console.log('Seek to:', time)}
      />
    </div>
  );
};

export default Index;