import React, { useState } from 'react';
import { Terminal, Copy, Check, AlertTriangle, Play, Server, Database, Shield, Code2 } from 'lucide-react';

// Real Execution Scripts for Google Cloud
const SCRIPTS = {
  'init': {
    title: 'Phase 1: Initialize Project',
    description: 'Establish connection to your specific Google Cloud Project.',
    code: `
# 1. Set Project ID (Updated to your specific project)
gcloud config set project 511738865589

# 2. Enable Required APIs (Compute Engine)
gcloud services enable compute.googleapis.com

# 3. Create Firewall Rule (Allow SSH & API Access)
gcloud compute firewall-rules create allow-gratech-access \\
    --allow tcp:22,tcp:80,tcp:443,tcp:11434 \\
    --target-tags=gratech-server \\
    --description="Allow standard ports for GraTech AI Server"
    `
  },
  'vm': {
    title: 'Phase 2: Provision DeepSeek VM',
    description: 'Create the actual Virtual Machine with T4 GPU hardware.',
    code: `
# Create the VM with NVIDIA T4 GPU
gcloud compute instances create deepseek-server \\
    --zone=us-central1-a \\
    --machine-type=n1-standard-4 \\
    --accelerator=type=nvidia-tesla-t4,count=1 \\
    --image-family=common-cu121-debian-11 \\
    --image-project=deeplearning-platform-release \\
    --maintenance-policy=TERMINATE \\
    --tags=gratech-server \\
    --boot-disk-size=100GB \\
    --boot-disk-type=pd-balanced
    `
  },
  'ollama': {
    title: 'Phase 3: Install AI Core (Ollama)',
    description: 'SSH into your new server and install the AI engine.',
    code: `
# SSH into the new server
gcloud compute ssh deepseek-server --zone=us-central1-a --command="
  # 1. Install Ollama (The AI Runner)
  curl -fsSL https://ollama.com/install.sh | sh

  # 2. Pull the DeepSeek Coder Model
  ollama pull deepseek-coder:6.7b

  # 3. Verify Installation
  ollama run deepseek-coder:6.7b 'System Check: GraTech Sovereign AI Online.'
"
    `
  }
};

const TerminalMode: React.FC = () => {
  const [activeScript, setActiveScript] = useState<keyof typeof SCRIPTS>('init');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPTS[activeScript].code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full bg-[#0d1117] flex flex-col border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      
      {/* Honest Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#161b22] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
             <Terminal size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Real Cloud Command Center</h2>
            <p className="text-xs text-zinc-500">Manual Execution Mode (No Simulations)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full border border-white/5">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-zinc-300">Ready for GCloud Shell</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* Left: Script Selector */}
        <div className="w-full md:w-64 bg-[#0d1117] border-r border-white/5 p-4 space-y-2 overflow-y-auto">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">Deployment Steps</div>
            
            <button 
                onClick={() => setActiveScript('init')}
                className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${activeScript === 'init' ? 'bg-blue-500/10 border-blue-500/50 text-white' : 'border-transparent text-zinc-400 hover:bg-white/5'}`}
            >
                <div className="font-bold flex items-center gap-2">
                    <Shield size={14} /> 1. Auth & APIs
                </div>
            </button>

            <button 
                onClick={() => setActiveScript('vm')}
                className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${activeScript === 'vm' ? 'bg-blue-500/10 border-blue-500/50 text-white' : 'border-transparent text-zinc-400 hover:bg-white/5'}`}
            >
                <div className="font-bold flex items-center gap-2">
                    <Server size={14} /> 2. Provision VM
                </div>
            </button>

            <button 
                onClick={() => setActiveScript('ollama')}
                className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${activeScript === 'ollama' ? 'bg-blue-500/10 border-blue-500/50 text-white' : 'border-transparent text-zinc-400 hover:bg-white/5'}`}
            >
                <div className="font-bold flex items-center gap-2">
                    <Code2 size={14} /> 3. Deploy Model
                </div>
            </button>

            <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                        <strong>Reality Check:</strong> Do not trust simulated terminals. Copy these commands and run them in your actual Google Cloud Console to build real infrastructure.
                    </p>
                </div>
            </div>
        </div>

        {/* Right: The Real Code */}
        <div className="flex-1 flex flex-col bg-[#000000]">
            <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white mb-2">{SCRIPTS[activeScript].title}</h3>
                <p className="text-zinc-400 text-sm">{SCRIPTS[activeScript].description}</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto relative group">
                <div className="absolute top-6 right-6 z-10">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
                
                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap leading-relaxed p-4 rounded-xl border border-white/10 bg-[#0d1117] shadow-inner select-all">
                    {SCRIPTS[activeScript].code.trim()}
                </pre>

                <div className="mt-6 flex gap-4">
                      <a 
                        href={`https://console.cloud.google.com/home/dashboard?project=511738865589`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors border border-white/10"
                      >
                        <Play size={14} /> Open Real Google Cloud Console
                      </a>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TerminalMode;