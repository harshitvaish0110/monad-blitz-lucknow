import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Upload, Zap, TrendingUp, Users, Music } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-primary/20" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-primary/10" />
      
      {/* Floating Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--primary-rgb), 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Hero Content */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-cyber font-black mb-6 neon-text glitch-effect">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              VORTEX
            </span>
            <br />
            <span className="bg-gradient-electric bg-clip-text text-transparent">
              SOUND
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The first <span className="text-primary font-semibold">hyper-scale Web3 music ecosystem</span> 
            {" "}powered by Monad's parallel execution. Create, remix, and earn with 
            <span className="text-accent font-semibold"> on-chain royalty distribution</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="group">
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Listening
            </Button>
            <Button variant="neon" size="xl" className="group">
              <Upload className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Upload Track
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Music, label: "Tracks", value: "50K+", color: "text-neon-cyan" },
            { icon: Users, label: "Artists", value: "12K+", color: "text-neon-pink" },
            { icon: TrendingUp, label: "Remixes", value: "25K+", color: "text-neon-purple" },
            { icon: Zap, label: "Plays/Day", value: "1M+", color: "text-cyber-yellow" },
          ].map((stat, index) => (
            <Card key={index} variant="transparent" className="p-6 text-center hover:scale-105 transition-transform">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-cyber font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="cyber" className="p-6 text-left">
            <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-cyber font-bold text-lg mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Powered by Monad's parallel execution. Sub-cent gas fees make every play, 
              remix, and transaction economically viable.
            </p>
          </Card>
          
          <Card variant="cyber" className="p-6 text-left">
            <div className="w-12 h-12 bg-gradient-electric rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-cyber font-bold text-lg mb-2">Smart Royalties</h3>
            <p className="text-muted-foreground">
              Automated on-chain royalty distribution. Every play rewards creators 
              throughout the entire remix lineage.
            </p>
          </Card>
          
          <Card variant="cyber" className="p-6 text-left">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-purple rounded-lg flex items-center justify-center mb-4">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-cyber font-bold text-lg mb-2">Remix Universe</h3>
            <p className="text-muted-foreground">
              Build upon any track. Create infinite remix chains with full 
              lineage tracking and fair compensation for all contributors.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;