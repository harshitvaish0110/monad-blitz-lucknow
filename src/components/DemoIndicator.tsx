import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Play, Zap } from 'lucide-react';

const DemoIndicator = () => {
  return (
    <div className="fixed top-20 right-4 z-40">
      <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <Zap className="w-3 h-3 mr-1" />
        DEMO MODE
      </Badge>
    </div>
  );
};

export default DemoIndicator; 