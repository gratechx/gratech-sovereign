import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import GraTechLandingPage from './components/GraTechLandingPage';
import { ChatBot } from './features/ChatBot';
import ModelRegistry from './features/ModelRegistry';
import CodeGenerator from './components/CodeGenerator';
import { MessageSquare, Terminal, GitPullRequest, LogOut, ShieldAlert, Cpu, Lock, PowerOff } from 'lucide-react';

const GraTechApp = () => {
  const [view, setView] = useState('chat');
  const [isTerminating, setIsTerminating] = useState(false);
  const { user, login, logout, isAuthenticated, checkPermission, isLoading, direction } = useAuth();

  const handleLogout = () => {
    setIsTerminating(true);
    setTimeout(() => {
        logout();
        setIsTerminating(false);
    }, 3000);
  };

  if (isLoading) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-black text-red-600 font-mono" dir="ltr">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm tracking-[0.3em] animate-pulse">ESTABLISHING SECURE HANDSHAKE...</span>
              </div>
          </div>
      );
  }

  if (isTerminating) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-red-600 font-mono z-50" dir="ltr">
              <div className="w-full max-w-lg space-y-2 p-8">
                  <div className="h-1 w-full bg-red-900/30 mb-8 overflow-hidden">
                      <div className="h-full bg-red-600 animate-progress-bar"></div>
                  </div>
                  <div className="text-xs space-y-1 opacity-80">
                      <p className="animate-typewriter-1">> INITIATING SHUTDOWN SEQUENCE...</p>
                      <p className="animate-typewriter-2 delay-75">> SEVERING NEURAL UPLINK [OK]</p>
                      <p className="animate-typewriter-3 delay-150">> PURGING LOCAL CACHE... [DONE]</p>
                      <p className="animate-typewriter-4 delay-300">> DISENGAGING DEEPSEEK CORE...</p>
                      <p className="text-xl font-bold mt-4 animate-pulse text-red-500">>> SESSION TERMINATED.</p>
                  </div>
              </div>
          </div>
      );
  }

  if (!isAuthenticated) {
     return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-gray-300 p-6 relative overflow-hidden font-mono" dir={direction}>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            
            <div className="z-10 text-center space-y-8 max-w-md w-full border border-red-900/30 bg-black/50 p-12 backdrop-blur-md relative">
                {/* Decorative corners */}
                <div className="absolute top-0 start-0 w-2 h-2 border-t border-s border-red-600"></div>
                <div className="absolute top-0 end-0 w-2 h-2 border-t border-e border-red-600"></div>
                <div className="absolute bottom-0 start-0 w-2 h-2 border-b border-s border-red-600"></div>
                <div className="absolute bottom-0 end-0 w-2 h-2 border-b border-e border-red-600"></div>

                <div className="space-y-4">
                    <div className="flex justify-center mb-6">
                        <PowerOff size={64} className="text-red-600 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white">SYSTEM OFFLINE</h1>
                    <p className="text-red-500 text-xs tracking-[0.2em] uppercase">Connection Severed by User</p>
                </div>
                
                <div className="space-y-4 pt-8">
                    <button 
                        onClick={() => login()}
                        className="w-full py-4 bg-red-900/20 text-red-500 hover:text-white border border-red-900 hover:bg-red-900/50 hover:border-red-500 transition-all duration-300 text-sm tracking-widest flex items-center justify-center gap-3 group"
                    >
                        <ShieldAlert size={16} className="group-hover:scale-110 transition-transform" />
                        RE-INITIALIZE PROTOCOL
                    </button>
                    <div className="text-[10px] text-gray-700 flex justify-center gap-4">
                         <span>STATUS: DISCONNECTED</span>
                         <span>::</span>
                         <span>ID: NULL</span>
                    </div>
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-gray-200 overflow-hidden font-sans selection:bg-red-900 selection:text-white" dir={direction}>
        {/* Sidebar - Used border-e (logical end) for RTL support */}
        <div className="w-16 md:w-64 border-e border-red-900/20 bg-black/40 backdrop-blur-xl flex flex-col justify-between p-4 z-20">
            <div className="space-y-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-red-600 flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <Terminal size={18} />
                    </div>
                    <div className="hidden md:block">
                        <span className="font-mono font-bold text-lg tracking-wider text-white block leading-none">SOVEREIGN</span>
                        <span className="text-[10px] text-red-500 font-mono tracking-[0.2em] block leading-none mt-1">NODE: ACTIVE</span>
                    </div>
                </div>
                
                <nav className="space-y-1">
                    <button 
                        onClick={() => setView('chat')}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm tracking-wide transition-all duration-200 group border-s-2 ${view === 'chat' ? 'border-red-500 bg-red-900/10 text-white' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        <MessageSquare size={16} />
                        <span className="hidden md:block">Neural Relay</span>
                    </button>
                    <button 
                        onClick={() => setView('code')}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm tracking-wide transition-all duration-200 group border-s-2 ${view === 'code' ? 'border-red-500 bg-red-900/10 text-white' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        <Terminal size={16} />
                        <span className="hidden md:block">Logic Core</span>
                    </button>
                    {checkPermission('ADMIN') && (
                        <button 
                            onClick={() => setView('registry')}
                            className={`w-full flex items-center gap-3 px-3 py-3 text-sm tracking-wide transition-all duration-200 group border-s-2 ${view === 'registry' ? 'border-red-500 bg-red-900/10 text-white' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                        >
                            <GitPullRequest size={16} />
                            <span className="hidden md:block">Model Matrix</span>
                        </button>
                    )}
                </nav>
            </div>

            <div className="border-t border-red-900/20 pt-4">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                    <div className="hidden md:block overflow-hidden">
                        <div className="text-xs font-bold text-gray-400">ENCRYPTED</div>
                        <div className="text-[9px] text-red-600 font-mono">{user?.role === 'admin' ? 'ROOT_ACCESS' : 'USER_NODE'}</div>
                    </div>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold tracking-widest text-red-500 hover:bg-red-950/50 hover:text-red-400 border border-red-900/30 hover:border-red-600 transition-all uppercase"
                >
                    <LogOut size={14} className="rtl:rotate-180" />
                    <span className="hidden md:block">TERMINATE</span>
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-black relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black pointer-events-none"></div>
            <div className="relative z-10 h-full">
                {view === 'chat' && <ChatBot />}
                {view === 'code' && <CodeGenerator />}
                {view === 'registry' && <ModelRegistry />}
            </div>
        </div>
    </div>
  );
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <GraTechLandingPage onEnterApp={() => setShowLanding(false)} onNavigate={() => {}} />;
  }

  return (
    <AuthProvider>
        <GraTechApp />
    </AuthProvider>
  );
}