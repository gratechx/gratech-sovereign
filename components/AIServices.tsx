import React from 'react';
import { GRA_TECH_DATA } from '../data';
import { BrainCircuit, Sparkles, MapPin, Box, ShieldCheck, Server } from 'lucide-react';

const AIServices: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <BrainCircuit className="w-8 h-8 text-pink-500" />
             AI Foundry & Cognitive Services
           </h2>
           <p className="text-gray-400 mt-1">Managed AI resources and model deployments</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-center">
             <span className="block text-xs text-gray-500 uppercase">Cloud APIs</span>
             <span className="text-xl font-bold text-white">{GRA_TECH_DATA.aiServices.length}</span>
           </div>
           <div className="px-4 py-2 bg-green-900/20 rounded-lg border border-green-500/30 text-center">
             <span className="block text-xs text-green-400 uppercase">Sovereign Models</span>
             <span className="text-xl font-bold text-green-400">3</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Local Sovereign Model Card (Added manually to emphasize local control) */}
        <div className="bg-gradient-to-br from-green-950/30 to-black border border-green-500/30 rounded-xl p-5 relative overflow-hidden group shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-24 h-24 text-green-500" />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold px-2 py-1 rounded uppercase tracking-wide bg-green-500/20 text-green-300 border border-green-500/20">
                        Local / Private
                    </span>
                    <span className="text-green-500 text-xs flex items-center gap-1 font-bold">
                        <Server className="w-3 h-3" />
                        On-Premise
                    </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Llama-3-Saudi-70B</h3>
                <p className="text-sm text-gray-400 mb-4">Running on Local GPU Cluster</p>
                <div className="bg-black/60 rounded-lg p-3 text-xs font-mono text-green-400 break-all border border-green-900/50 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    http://localhost:11434
                </div>
            </div>
        </div>

        {GRA_TECH_DATA.aiServices.map((service, idx) => {
          const isVertex = service.kind === 'Vertex AI';
          return (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-5 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${isVertex ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {isVertex ? <BrainCircuit className="w-24 h-24" /> : <Sparkles className="w-24 h-24" />}
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                   <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${isVertex ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                     {service.kind}
                   </span>
                   <span className="text-gray-500 text-xs flex items-center gap-1">
                     <MapPin className="w-3 h-3" />
                     {service.location}
                   </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 truncate" title={service.name}>{service.name}</h3>
                <p className="text-sm text-gray-400 mb-4 truncate">{service.resourceGroup}</p>

                <div className="bg-gray-900/60 rounded-lg p-3 text-xs font-mono text-gray-300 break-all border border-gray-700/50">
                  {service.endpoint.replace('https://', '')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIServices;