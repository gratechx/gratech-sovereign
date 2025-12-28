import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  Shield, 
  Cpu, HardDrive, Zap, Wifi,
  Activity, Lock, Cloud, Copy, ArrowRight, Server, Rocket, FileText, AlertTriangle, Command
} from 'lucide-react';

const DownloadsHub: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [cmdCopied, setCmdCopied] = useState(false);

  const MIGRATION_BRIEFING = `
# 🛑 SYSTEM CONTEXT INJECTION (ANTI-HALLUCINATION PROTOCOL)
# PRIORITY: CRITICAL | READ CAREFULLY BEFORE EXECUTING COMMANDS

**FROM:** Frontend Architect (GraTech Local)
**TO:** Cloud Architect (Google Cloud Gemini)

**STATUS CHECK (THE TRUTH):**
1.  **PROJECT:** GraTech X (Sovereign AI Platform).
2.  **TARGET GCP PROJECT:** 511738865589 (User Provided).
3.  **CURRENT STATE:** We are running a **React SPA (Frontend)** locally. 
4.  **INFRASTRUCTURE:** There is **NO** active backend or database yet. Everything you see in the chat history about "Azure" is LEGACY context.
5.  **DATA SOURCE:** All data displayed in the UI is currently **MOCKED** in a file called \`data.ts\`.

**YOUR MISSION:**
Do NOT hallucinate existing resources. Your job is to **BUILD** the backend on Google Cloud to replace the simulation.

**EXECUTION PLAN (STEP-BY-STEP):**

1.  **BILLING:** Confirm billing is linked to project \`511738865589\`.
2.  **COMPUTE (ACTION REQUIRED):** Generate the \`gcloud\` command to create a VM named 'deepseek-server' with these specs:
    *   Zone: us-central1-a
    *   Machine Type: n1-standard-4 (or recommended for GPU)
    *   Accelerator: NVIDIA T4 (count=1)
    *   Image: Deep Learning VM (Debian/Ubuntu)

3.  **FUTURE STATE:**
    *   Replace \`data.ts\` with **Cloud SQL**.
    *   Replace \`FileManager.tsx\` with **Cloud Storage**.

**INSTRUCTION:**
Acknowledge this context. Stop apologizing. Provide the specific \`gcloud\` command to create the VM now for project 511738865589.
`;

  const GCLOUD_COMMAND = `gcloud compute instances create deepseek-server \\
    --project=511738865589 \\
    --zone=us-central1-a \\
    --machine-type=n1-standard-4 \\
    --accelerator=type=nvidia-tesla-t4,count=1 \\
    --image-family=common-cu121-debian-11 \\
    --image-project=deeplearning-platform-release \\
    --maintenance-policy=TERMINATE --restart-on-failure \\
    --boot-disk-size=50GB \\
    --boot-disk-type=pd-balanced`;

  const handleCopy = () => {
    navigator.clipboard.writeText(MIGRATION_BRIEFING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCmdCopy = () => {
    navigator.clipboard.writeText(GCLOUD_COMMAND);
    setCmdCopied(true);
    setTimeout(() => setCmdCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Rocket className="text-blue-500 fill-blue-500/20" size={40} />
            Cloud Migration Center
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Context Grounding & Handover Protocol
          </p>
        </div>
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full">
            <AlertTriangle size={16} className="text-red-500 animate-pulse" />
            <span className="text-xs font-mono text-red-400 font-bold">ANTI-HALLUCINATION MODE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Manifesto Card */}
        <div className="space-y-6">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText size={20} className="text-zinc-400" />
                        Context Injection Briefing
                    </h2>
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-lg shadow-blue-900/20"
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        {copied ? 'COPIED' : 'COPY CONTEXT'}
                    </button>
                </div>
                
                <div className="flex-1 bg-black rounded-xl border border-white/10 p-5 font-mono text-xs text-zinc-300 overflow-y-auto max-h-[300px] leading-relaxed select-all shadow-inner custom-scrollbar relative">
                    <div className="absolute top-2 right-2 text-[10px] text-zinc-600 font-bold border border-zinc-800 px-2 rounded">MD</div>
                    <pre className="whitespace-pre-wrap">{MIGRATION_BRIEFING}</pre>
                </div>

                <div className="mt-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl relative z-10">
                    <p className="text-sm text-blue-300 flex items-start gap-2">
                        <ArrowRight size={16} className="mt-0.5 shrink-0" />
                        <strong>Fix the Hallucination:</strong> Paste this into the Google Cloud Shell chat first.
                    </p>
                </div>
            </div>
        </div>

        {/* Right: Status & Execution */}
        <div className="space-y-6">
             {/* Reality Check Card */}
             <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <Activity size={120} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest">Current Reality</h3>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Frontend Prototype</h2>
                <p className="text-zinc-500 mb-6 text-sm">Running in Browser Memory. No Backend Connected.</p>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-zinc-400 border-b border-white/5 pb-1">
                        <span>Database</span>
                        <span className="text-white font-mono">data.ts (Mock)</span>
                    </div>
                    <div className="flex justify-between text-sm text-zinc-400 border-b border-white/5 pb-1">
                        <span>Storage</span>
                        <span className="text-white font-mono">LocalStorage</span>
                    </div>
                </div>
             </div>

             {/* EXECUTION CARD */}
             <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <Terminal size={20} className="text-green-500" />
                    <h3 className="text-lg font-bold text-white">Execution: Phase 1</h3>
                </div>
                <p className="text-zinc-400 text-sm mb-4">
                    Run this command in <span className="text-white font-bold">Google Cloud Shell</span> to provision the real server:
                </p>
                
                <div className="bg-black rounded-lg border border-white/10 p-4 relative group">
                    <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap break-all">{GCLOUD_COMMAND}</pre>
                    <button 
                        onClick={handleCmdCopy}
                        className="absolute top-2 right-2 p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
                        title="Copy Command"
                    >
                        {cmdCopied ? <CheckCircle2 size={14} className="text-green-500" /> : <Command size={14} />}
                    </button>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default DownloadsHub;