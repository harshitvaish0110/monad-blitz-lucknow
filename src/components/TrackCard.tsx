import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Heart, Share2, TrendingUp, Volume2 } from 'lucide-react';

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    artist: string;
    views: number;
    remixCount: number;
    duration: string;
    genre: string;
    coverUrl?: string;
    isRemix?: boolean;
    parentTrack?: string;
  };
  onPlay?: (trackId: string) => void;
  isPlaying?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay, isPlaying = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handlePlayClick = () => {
    onPlay?.(track.id);
  };

  return (
    <Card 
      variant="cyber" 
      className={`group transition-all duration-300 hover:scale-105 cursor-pointer ${
        isPlaying ? 'ring-2 ring-primary shadow-glow-strong' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
              {track.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              by <span className="text-accent font-medium">{track.artist}</span>
            </p>
            {track.isRemix && (
              <p className="text-xs text-neon-pink mt-1">
                ↳ Remix of "{track.parentTrack}"
              </p>
            )}
          </div>
          <Button
            variant={isPlaying ? "default" : "ghost"}
            size="icon"
            className={`ml-2 transition-all ${
              isHovered || isPlaying ? 'scale-110' : ''
            }`}
            onClick={handlePlayClick}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="bg-secondary/50 px-2 py-1 rounded font-mono">
            {track.genre}
          </span>
          <span className="font-mono">{track.duration}</span>
        </div>
        
        {/* Waveform placeholder */}
        <div className="mt-3 h-12 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded flex items-end justify-center gap-1 p-2">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary/60 rounded-sm transition-all duration-300 hover:bg-primary"
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                animation: isPlaying ? `pulse ${Math.random() * 2 + 1}s infinite` : 'none'
              }}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/30">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              <span className="font-mono">{track.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="font-mono">{track.remixCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-neon-pink text-neon-pink' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrackCard;