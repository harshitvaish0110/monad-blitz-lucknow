import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Music, 
  CheckCircle, 
  Loader2, 
  File,
  X,
  Zap
} from 'lucide-react';

const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRemix, setIsRemix] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    royaltyPercentage: '500', // 5% in BPS
    parentTrackId: '',
  });

  const genres = [
    'Synthwave', 'Techno', 'Ambient', 'Electronic', 'Glitch', 
    'Drum & Bass', 'House', 'Trance', 'Dubstep', 'Experimental'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for upload
      const uploadFormData = new FormData();
      uploadFormData.append('audio', file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('artist', formData.artist);
      uploadFormData.append('genre', formData.genre);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('royaltyPercentage', formData.royaltyPercentage);
      uploadFormData.append('parentTrackId', formData.parentTrackId);
      uploadFormData.append('creatorAddress', '0x0000000000000000000000000000000000000000'); // TODO: Get from wallet

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to backend
      const response = await fetch('http://localhost:3001/api/tracks/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      setUploadProgress(100);
      
      // Reset form
      setFile(null);
      setFormData({
        title: '',
        artist: '',
        genre: '',
        description: '',
        royaltyPercentage: '500',
        parentTrackId: '',
      });

      // Show success message
      console.log('Track uploaded successfully:', result);
      
    } catch (error) {
      console.error('Upload error:', error);
      // Show error message
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Card variant="cyber" className="overflow-hidden">
        <CardHeader className="bg-gradient-cyber text-primary-foreground">
          <CardTitle className="text-3xl font-cyber flex items-center gap-3">
            <Upload className="w-8 h-8" />
            Upload Your Track
          </CardTitle>
          <p className="text-primary-foreground/80">
            Share your music with the VortexSound community and start earning from plays and remixes
          </p>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Area */}
            <div className="space-y-4">
              <Label className="text-lg font-cyber">Audio File</Label>
              {!file ? (
                <div
                  className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Music className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                  <h3 className="text-lg font-cyber mb-2">Drop your audio file here</h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Badge variant="outline" className="mb-2">
                    Supported: MP3, WAV, FLAC, OGG
                  </Badge>
                  <br />
                  <Badge variant="outline">
                    Max size: 100MB
                  </Badge>
                </div>
              ) : (
                <Card variant="neon" className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center">
                        <File className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-cyber font-semibold">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-cyber">
                          Uploading... {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-cyber h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {uploadProgress === 100 && (
                    <div className="mt-4 flex items-center gap-2 text-primary">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-cyber">Upload complete!</span>
                    </div>
                  )}
                </Card>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Track Metadata */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-cyber">Track Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter track title"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="artist" className="font-cyber">Artist Name *</Label>
                  <Input
                    id="artist"
                    value={formData.artist}
                    onChange={(e) => setFormData({...formData, artist: e.target.value})}
                    placeholder="Your artist name"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="genre" className="font-cyber">Genre</Label>
                  <Select 
                    value={formData.genre} 
                    onValueChange={(value) => setFormData({...formData, genre: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre.toLowerCase()}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="font-cyber">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell us about your track..."
                    className="mt-2 h-24"
                  />
                </div>
                
                <div>
                  <Label htmlFor="royalty" className="font-cyber">Royalty Percentage</Label>
                  <Input
                    id="royalty"
                    type="number"
                    min="0"
                    max="10000"
                    value={formData.royaltyPercentage}
                    onChange={(e) => setFormData({...formData, royaltyPercentage: e.target.value})}
                    placeholder="500 (5%)"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    In basis points (100 = 1%)
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remix"
                    checked={isRemix}
                    onChange={(e) => setIsRemix(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="remix" className="font-cyber">
                    This is a remix
                  </Label>
                </div>
                
                {isRemix && (
                  <div>
                    <Label htmlFor="parentTrack" className="font-cyber">Original Track ID</Label>
                    <Input
                      id="parentTrack"
                      value={formData.parentTrackId}
                      onChange={(e) => setFormData({...formData, parentTrackId: e.target.value})}
                      placeholder="Enter original track ID"
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Your track will be minted as an NFT on Monad
              </div>
              <Button
                type="submit"
                variant="cyber"
                size="lg"
                disabled={!file || isUploading}
                className="font-cyber"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Upload & Mint NFT
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;