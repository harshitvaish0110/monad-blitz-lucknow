import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VortexLogo from './VortexLogo';
import { Play, Upload, User, Zap, Wallet, TrendingUp } from 'lucide-react';

const Navigation = () => {
  return (
    <Card variant="cyber" className="fixed top-4 left-4 right-4 z-50 p-4">
      <div className="flex items-center justify-between">
        <VortexLogo size={28} />
        
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="font-cyber text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </Button>
          <Button variant="ghost" className="font-cyber text-sm">
            <Play className="w-4 h-4 mr-2" />
            Discover
          </Button>
          <Button variant="ghost" className="font-cyber text-sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button variant="ghost" className="font-cyber text-sm">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="neon" size="sm" className="hidden sm:flex">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
          <Button variant="cyber" size="sm">
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Navigation;