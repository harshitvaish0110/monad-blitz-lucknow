import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Heart,
  Share2,
  MessageCircle,
  Download,
  MoreHorizontal,
  Eye,
  Clock,
  Calendar,
  User,
  Music,
  Share
} from 'lucide-react';

const TrackDetail = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes in seconds
  const [volume, setVolume] = useState(80);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');

  const mockTrack = {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyberpunk DJ',
    genre: 'Synthwave',
    views: 3,
    likes: 2,
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    isRemix: false,
    parentTrack: null,
    description: 'A futuristic synthwave track that takes you on a journey through neon-lit cityscapes. Created with vintage synthesizers and modern production techniques.',
    createdAt: '2024-01-15',
    duration: '3:24',
    bpm: 128,
    key: 'C# minor',
    tags: ['synthwave', 'retro', 'futuristic', 'electronic']
  };

  const mockComments = [
    {
      id: '1',
      user: 'SynthwaveFan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      comment: 'This track is absolutely amazing! The retro vibes are perfect.',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: '2',
      user: 'DigitalAlchemist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      comment: 'Love the atmospheric elements and the driving bassline.',
      timestamp: '5 hours ago',
      likes: 8
    },
    {
      id: '3',
      user: 'NeonPulse',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      comment: 'Perfect for late night drives through the city!',
      timestamp: '1 day ago',
      likes: 15
    }
  ];

  const mockRemixes = [
    {
      id: '2',
      title: 'Neon Dreams (Dark Remix)',
      artist: 'Shadow Beats',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150&h=150&fit=crop',
      views: 1,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Neon Dreams (Ambient Version)',
      artist: 'Atmospheric Collective',
      coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=150&h=150&fit=crop',
      views: 1,
      createdAt: '2024-01-08'
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Track Header */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Cover Art */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={mockTrack.coverUrl}
                alt={mockTrack.title}
                className="w-full h-full object-cover"
              />
              {mockTrack.isRemix && (
                <Badge className="absolute top-4 right-4 bg-purple-500">
                  Remix
                </Badge>
              )}
            </div>
          </Card>
        </div>

        {/* Track Info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-cyber font-bold mb-2">{mockTrack.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {mockTrack.artist}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline">{mockTrack.genre}</Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{mockTrack.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>{mockTrack.likes} likes</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{mockTrack.duration}</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {mockTrack.description}
            </p>
          </div>

          {/* Player Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${volume}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{volume}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant={isLiked ? "default" : "outline"}
              onClick={handleLike}
              className="font-cyber"
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="outline" className="font-cyber">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="font-cyber">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="font-cyber">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Track Details */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Track Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cyber">Track Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">BPM</p>
                <p className="font-cyber font-semibold">{mockTrack.bpm}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Key</p>
                <p className="font-cyber font-semibold">{mockTrack.key}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-cyber font-semibold">{mockTrack.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-cyber font-semibold">{mockTrack.createdAt}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {mockTrack.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cyber flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({mockComments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-cyber font-semibold text-sm">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm mb-2">{comment.comment}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Heart className="w-3 h-3 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-2"
              />
              <Button size="sm" className="font-cyber">
                Post Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remixes */}
      {mockRemixes.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-cyber flex items-center gap-2">
              <Share className="w-5 h-5" />
              Remixes ({mockRemixes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRemixes.map((remix) => (
                <Card key={remix.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <img
                      src={remix.coverUrl}
                      alt={remix.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="icon" className="bg-white/20 hover:bg-white/30">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-purple-500">
                      Remix
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-cyber font-semibold text-lg mb-1">{remix.title}</h3>
                    <p className="text-muted-foreground mb-2">{remix.artist}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span className="text-xs">{remix.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">{remix.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackDetail; 