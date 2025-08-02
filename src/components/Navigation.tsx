import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useLocation } from 'react-router-dom';
import VortexLogo from './VortexLogo';
import WalletConnect from './WalletConnect';
import { Play, Upload, User, Zap, TrendingUp } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <Card variant="cyber" className="fixed top-4 left-4 right-4 z-50 p-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <VortexLogo size={28} />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/">
            <Button 
              variant={location.pathname === "/" ? "default" : "ghost"} 
              className="font-cyber text-sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
          </Link>
          <Link to="/discover">
            <Button 
              variant={location.pathname === "/discover" ? "default" : "ghost"} 
              className="font-cyber text-sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Discover
            </Button>
          </Link>
          <Link to="/upload">
            <Button 
              variant={location.pathname === "/upload" ? "default" : "ghost"} 
              className="font-cyber text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </Link>
          <Link to="/profile">
            <Button 
              variant={location.pathname === "/profile" ? "default" : "ghost"} 
              className="font-cyber text-sm"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <WalletConnect />
          <Button variant="cyber" size="sm">
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Navigation;