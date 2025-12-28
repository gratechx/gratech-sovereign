import React from 'react';
import { GRA_TECH_DATA } from '../data';
import { Database, Network, Globe2, AlertTriangle, Shield, Router, Laptop, ArrowRight, Cloud, Server } from 'lucide-react';

const NetworkStorage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      
      {/* Network Status - Migration View */}
      <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-xl p-6">
         <div className="flex items-center justify-between mb-6">
             <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                   <Router className="w-6 h-6 text-blue-500" />
                   Network Topology & Migration Path
                </h2>
                <p className="text-zinc-400 text-sm mt-1">Transitioning from Simulation to Production</p>
             </div>
         </div>

         <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
             {/* Client Node (Current) */}
             <div className="bg-black/30 p-5 rounded-xl border border-green-500/30 text-center relative z-10">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-900/80 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/50 uppercase font-bold">Current Reality</div>
                 <Laptop className="w-10 h-10 text-green-500 mx-auto mb-3" />
                 <h3 className="font-bold text-white">Browser Client</h3>
                 <p className="text-xs text-zinc-500 mb-2">React SPA Running Locally</p>
                 <div className="text-xs bg-zinc-800 p-2 rounded text-zinc-400 font-mono">
                    data.ts (Mock DB)
                 </div>
             </div>

             {/* Migration Arrow */}
             <div className="hidden md:flex flex-col justify-center items-center text-zinc-500 relative">
                 <div className="w-full h-0.5 bg-gradient-to-r from-green-500/50 to-blue-500/50 absolute top-1/2"></div>
                 <div className="bg-zinc-900 px-3 py-1 relative z-10 rounded border border-white/10 flex items-center gap-2 text-xs font-bold text-zinc-300">
                    <ArrowRight size={14} className="animate-pulse" />
                    MIGRATING
                 </div>
             </div>

             {/* Cloud Node (Target) */}
             <div className="bg-black/30 p-5 rounded-xl border border-blue-500/30 text-center relative z-10 opacity-75">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900/80 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/50 uppercase font-bold">Target State</div>
                 <Cloud className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                 <h3 className="font-bold text-white">Google Cloud</h3>
                 <p className="text-xs text-zinc-500 mb-2">Sovereign Backend</p>
                 <div className="text-xs bg-zinc-800 p-2 rounded text-zinc-400 font-mono">
                    DeepSeek VM (T4 GPU)
                 </div>
             </div>
         </div>
      </div>

      {/* Storage Accounts (Local) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-zinc-500" />
          <h2 className="text-xl font-bold text-white">Storage</h2>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
           <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
           <h3 className="text-white font-bold mb-2">No Persistent Storage</h3>
           <p className="text-zinc-400 text-sm max-w-md mx-auto">
             Files in the "File Manager" exist only in browser RAM. 
             <br/>
             <span className="text-blue-400">Target: Google Cloud Storage Buckets</span>
           </p>
        </div>
      </div>

      {/* DNS / Network Map */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-zinc-500" />
          <h2 className="text-xl font-bold text-white">DNS Configuration</h2>
        </div>

         <div className="grid grid-cols-1 gap-3">
            {GRA_TECH_DATA.dnsRecords.map((record, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Globe2 className="w-5 h-5 text-zinc-600" />
                        <div>
                            <div className="text-sm font-bold text-white">{record.name}</div>
                            <div className="text-xs text-zinc-500 uppercase">{record.type} Record</div>
                        </div>
                    </div>
                    <span className="font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded border border-zinc-800">{record.details}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkStorage;