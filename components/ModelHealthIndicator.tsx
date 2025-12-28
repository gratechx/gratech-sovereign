import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { checkModelHealth } from '../services/aiService';
import { GraTechModelId } from '../types';

interface ModelHealthIndicatorProps {
  modelId: GraTechModelId;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const ModelHealthIndicator: React.FC<ModelHealthIndicatorProps> = ({ modelId, showLabel = false, size = 'sm' }) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    checkModelHealth(modelId).then(isOnline => setStatus(isOnline ? 'online' : 'offline'));
  }, [modelId]);

  return (
    <div className="flex items-center gap-1.5" title={`Status: ${status}`}>
      {status === 'checking' && <Loader2 size={10} className="animate-spin text-yellow-500" />}
      {status === 'online' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />}
      {status === 'offline' && <div className="w-2 h-2 rounded-full bg-red-500" />}
      
      {showLabel && (
        <span className={`text-[10px] uppercase font-bold tracking-wider ${
          status === 'online' ? 'text-green-500' : status === 'offline' ? 'text-red-500' : 'text-yellow-500'
        }`}>
          {status}
        </span>
      )}
    </div>
  );
};

export default ModelHealthIndicator;