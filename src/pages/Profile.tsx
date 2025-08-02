import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Music, 
  Eye, 
  Share2, 
  Edit3, 
  Save,
  Twitter,
  Instagram,
  Globe,
  Crown,
  TrendingUp
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'cyberpunk_dj',
    displayName: 'Cyberpunk DJ',
    bio: 'Creating futuristic beats in the digital realm. Exploring the intersection of technology and music.',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    website: 'https://cyberpunkdj.com',
    twitter: '@cyberpunk_dj',
    instagram: '@cyberpunk_dj',
    totalTracks: 3,
    totalViews: 8,
    totalRemixes: 1,
    isVerified: true,
    profilePicUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  });

  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const mockTracks = [
    {
      id: '1',
      title: 'Neon Dreams',
      artist: 'Cyberpunk DJ',
      genre: 'Synthwave',
      views: 3,
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
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
      isRemix: false,
      createdAt: '2024-01-05'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-cyan-900 p-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src={profile.profilePicUrl} />
              <AvatarFallback className="text-2xl font-cyber">
                {profile.displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-cyber font-bold text-white">
                  {profile.displayName}
                </h1>
                {profile.isVerified && (
                  <Badge variant="secondary" className="bg-yellow-500 text-black">
                    <Crown className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-white/80 mb-4">{profile.bio}</p>
              <div className="flex items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span>{profile.totalTracks} tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{profile.totalViews.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span>{profile.totalRemixes} remixes</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Profile Form */}
      {isEditing && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-cyber">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editForm.website}
                  onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={editForm.twitter}
                  onChange={(e) => setEditForm({...editForm, twitter: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={editForm.instagram}
                  onChange={(e) => setEditForm({...editForm, instagram: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="font-cyber">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-cyber font-bold">{profile.totalTracks}</p>
                <p className="text-muted-foreground">Total Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-cyber font-bold">{profile.totalViews.toLocaleString()}</p>
                <p className="text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-cyber font-bold">{profile.totalRemixes}</p>
                <p className="text-muted-foreground">Remixes Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-cyber flex items-center gap-2">
            <Music className="w-5 h-5" />
            My Tracks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTracks.map((track) => (
              <Card key={track.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  {track.isRemix && (
                    <Badge className="absolute top-2 right-2 bg-purple-500">
                      Remix
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-cyber font-semibold text-lg mb-1">{track.title}</h3>
                  <p className="text-muted-foreground mb-2">{track.artist}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{track.genre}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{track.views.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 