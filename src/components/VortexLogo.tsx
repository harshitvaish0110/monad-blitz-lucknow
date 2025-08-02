import React from 'react';

const VortexLogo = ({ className = "", size = 32 }: { className?: string; size?: number }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <svg width={size} height={size} viewBox="0 0 32 32" className="drop-shadow-lg">
          <defs>
            <linearGradient id="vortex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--neon-cyan))" />
              <stop offset="50%" stopColor="hsl(var(--neon-purple))" />
              <stop offset="100%" stopColor="hsl(var(--neon-pink))" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="url(#vortex-gradient)"
            strokeWidth="2"
            filter="url(#glow)"
            className="animate-spin"
            style={{ animationDuration: '8s' }}
          />
          <circle
            cx="16"
            cy="16"
            r="8"
            fill="none"
            stroke="url(#vortex-gradient)"
            strokeWidth="3"
            filter="url(#glow)"
            className="animate-spin"
            style={{ animationDuration: '4s', animationDirection: 'reverse' }}
          />
          <circle
            cx="16"
            cy="16"
            r="3"
            fill="url(#vortex-gradient)"
            filter="url(#glow)"
            className="pulse-glow"
          />
        </svg>
      </div>
      <span className="font-cyber font-bold text-xl neon-text bg-gradient-cyber bg-clip-text text-transparent">
        VortexSound
      </span>
    </div>
  );
};

export default VortexLogo;