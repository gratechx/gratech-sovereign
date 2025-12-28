import React from 'react';
import { 
  Zap, Code, LayoutDashboard, Terminal, Shield, AlertOctagon,
  Server, Monitor
} from 'lucide-react';
import { GRA_TECH_DATA } from '../data';

const Overview: React.FC = () => {
  const { account } = GRA_TECH_DATA;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      
      {/* Honest Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-white">
            <span className="font-bold">System Overview</span>
          </h1>
          <p className="text-gray-400">
              {account.name} • <span className="text-yellow-500">React Controller (Client-Side)</span>
          </p>
        </div>
      </div>

      {/* Main Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Card 1: The App State */}
         <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
            <LayoutDashboard className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Frontend Interface</h3>
            <p className="text-zinc-400 text-sm mb-4">
              This dashboard is running locally in your browser. It orchestrates logic but holds no data.
            </p>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full">
               <div className="w-full h-full bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-right text-xs text-blue-400 mt-2">Running</p>
         </div>

         {/* Card 2: The Backend State */}
         <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl relative overflow-hidden">
            <Server className="w-8 h-8 text-zinc-600 mb-4" />
            <h3 className="text-zinc-300 font-bold text-lg mb-2">Cloud Backend</h3>
            <p className="text-zinc-500 text-sm mb-4">
              Connection to Google Cloud is waiting for you to execute the deployment scripts.
            </p>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full">
               <div className="w-[0%] h-full bg-zinc-600 rounded-full"></div>
            </div>
            <p className="text-right text-xs text-zinc-500 mt-2">Not Deployed</p>
         </div>

         {/* Card 3: The AI State */}
         <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
            <Zap className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Gemini Engine</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Connected to Google's public API. Ready to generate your backend code.
            </p>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full">
               <div className="w-full h-full bg-green-500 rounded-full"></div>
            </div>
            <p className="text-right text-xs text-green-400 mt-2">Active</p>
         </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-xl flex gap-4">
        <AlertOctagon className="w-6 h-6 text-red-500 shrink-0" />
        <div>
           <h4 className="text-white font-bold mb-2">Architecture Reality Check</h4>
           <p className="text-zinc-400 text-sm leading-relaxed">
              We are currently in <strong>Manual Migration Mode</strong>. To prevent "hallucinations" of a fake server, 
              please navigate to the <strong>Terminal</strong> tab. There you will find the real <code>gcloud</code> commands 
              needed to build the actual infrastructure on your Google Cloud project.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;