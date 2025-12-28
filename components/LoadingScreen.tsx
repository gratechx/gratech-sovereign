import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

const LoadingScreen: React.FC<{ message?: string }> = React.memo(({ message = "Initializing System..." }) => (
  <div className="h-full w-full flex flex-col items-center justify-center min-h-[600px] text-zinc-500 animate-fade-in">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-gratech-primary animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <ShieldCheck size={20} className="text-zinc-700" />
      </div>
    </div>
    <div className="mt-6 flex flex-col items-center gap-2">
      <p className="text-sm font-mono tracking-widest text-gratech-primary/80 uppercase">{message}</p>
      <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-gratech-primary/50 w-1/2 animate-[shimmer_1s_infinite]"></div>
      </div>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;