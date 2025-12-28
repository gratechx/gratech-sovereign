import React, { useState, useEffect } from 'react';
import { GRA_TECH_DATA } from '../data';
import { Server, Monitor, Globe, Power, Activity, Cpu, Zap, Info, Box, AlertTriangle } from 'lucide-react';

const Compute: React.FC = () => {
  // Real Browser Stats
  const [realStats, setRealStats] = useState({
    userAgent: '',
    cores: 0,
    platform: '',
    memory: 'Unknown',
    connection: 'Unknown'
  });

  useEffect(() => {
    // Fetch REAL data from the browser to show honesty
    const nav = window.navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    setRealStats({
      userAgent: nav.userAgent,
      cores: nav.hardwareConcurrency || 1,
      platform: nav.platform,
      // Browsers often round this or hide it for privacy
      memory: nav.deviceMemory ? `${nav.deviceMemory} GB (approx)` : 'Hidden by Browser',
      connection: conn ? `${conn.effectiveType} (${conn.downlink} Mbps)` : 'Unknown'
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Reality Check Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <Monitor className="w-8 h-8 text-blue-500" />
             Local Client Environment
           </h1>
           <p className="text-zinc-400 mt-1 font-mono text-sm">
             Displaying <span className="text-white font-bold">ACTUAL</span> telemetry from this browser session.
           </p>
        </div>
        <div className="flex gap-4 text-right">
           <div className="bg-blue-900/20 border border-blue-500/30 px-3 py-1 rounded-lg">
             <div className="text-[10px] text-blue-300 uppercase font-bold">Execution Context</div>
             <div className="text-white font-mono text-xs">Browser (Client-Side)</div>
           </div>
        </div>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CPU Info */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold">
                   <Cpu size={20} /> Local Processor
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                   Detected
                </span>
             </div>
             <div className="text-3xl font-bold text-white mb-1">
                {realStats.cores} <span className="text-lg font-normal text-zinc-500">Logical Cores</span>
             </div>
             <p className="text-xs text-zinc-500 mt-2 font-mono">{realStats.platform}</p>
          </div>

          {/* Memory Info */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold">
                   <Box size={20} /> Memory Limit
                </div>
             </div>
             <div className="text-3xl font-bold text-white mb-1">
                {realStats.memory}
             </div>
             <p className="text-xs text-zinc-500 mt-2">
               Note: This is your local device RAM available to the browser, not a cloud server.
             </p>
          </div>

           {/* Connection Info */}
           <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold">
                   <Globe size={20} /> Network
                </div>
                <Activity size={14} className="text-green-500" />
             </div>
             <div className="text-xl font-bold text-white mb-1">
                {realStats.connection}
             </div>
             <p className="text-xs text-zinc-500 mt-2 break-all font-mono">
                {window.location.hostname}
             </p>
          </div>
      </div>

      {/* Honest Technical Note */}
      <div className="bg-yellow-900/10 border border-yellow-500/20 p-6 rounded-xl flex gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
        <div>
           <h3 className="text-lg font-bold text-white mb-2">Technical Truth</h3>
           <p className="text-zinc-400 text-sm leading-relaxed mb-4">
             You are currently running a <strong>React Single Page Application</strong>. 
             There is no hidden backend server. All "files" and "terminals" you see are UI components running in your memory.
             <br /><br />
             To make this real, use the <strong>Terminal</strong> tab to generate the setup scripts for Google Cloud.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Compute;