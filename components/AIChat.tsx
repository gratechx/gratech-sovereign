import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { 
  Send, Bot, Loader2, User, ChevronDown, Sparkles, 
  Terminal as TerminalIcon, Trophy, Monitor, Maximize2, ShieldCheck, AlertCircle
} from 'lucide-react';
import { streamGraTechResponse, getAllModels, getModelConfig } from '../services/aiService';
import { GraTechModelId, Language } from '../types';
import renderMessageContent from './ChatInterface';
import ModelHealthIndicator from './ModelHealthIndicator';

const MultiModelRace = lazy(() => import('./MultiModelRace'));
const TerminalMode = lazy(() => import('./TerminalMode'));

interface AIChatProps {
  apiKey?: string;
  mode?: 'popup' | 'full';
  lang?: Language;
  onOpen?: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  modelId?: GraTechModelId;
}

const AIChat: React.FC<AIChatProps> = ({ mode = 'popup', lang = 'en', onOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<GraTechModelId>('GraTech-Genius');
  const [viewMode, setViewMode] = useState<'chat' | 'race' | 'terminal'>('chat');
  const [selectedRaceModels, setSelectedRaceModels] = useState<GraTechModelId[]>(['GraTech-Genius', 'GraTech-Reasoning', 'GraTech-Coder', 'GraTech-4.1']);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    if (viewMode === 'race') {
      setMessages(prev => [...prev, { role: 'model', text: '__RACE_MODE__' }]);
      setIsLoading(false);
      return;
    }

    try {
      let buffer = '';
      setMessages(prev => [...prev, { role: 'model', text: '', modelId: currentModel }]);
      
      await streamGraTechResponse(userMsg, currentModel, (chunk) => {
        buffer += chunk;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = buffer;
          return newMsgs;
        });
      });
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to GraTech Core.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModelIcon = (id: GraTechModelId) => {
    const config = getModelConfig(id);
    return config ? config.icon : '🤖';
  };

  return (
    <div className={`flex flex-col bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl ${mode === 'popup' ? 'h-[600px] w-[400px]' : 'h-full w-full'}`}>
      
      {/* Header */}
      <div className="px-4 py-3 bg-[#18181b] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gratech-primary/10 flex items-center justify-center text-gratech-primary border border-gratech-primary/20">
            {viewMode === 'terminal' ? <TerminalIcon size={16} /> : viewMode === 'race' ? <Trophy size={16} /> : <Bot size={16} />}
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              {viewMode === 'terminal' ? 'GraTech Terminal' : viewMode === 'race' ? 'Multi-Model Race' : 'GraTech Intelligence'}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
               {/* Sovereign Mode Indicator */}
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-900/20 border border-green-900/30">
                  <ShieldCheck size={10} className="text-green-500" />
                  <span className="text-green-400 font-medium">Sovereign Mode</span>
               </div>
            </div>
          </div>
        </div>

        {/* View Switcher & Maximize */}
        <div className="flex gap-2">
            <div className="flex bg-black/50 rounded-lg p-1 border border-white/5">
               <button 
                 onClick={() => setViewMode('chat')} 
                 className={`p-1.5 rounded transition-colors ${viewMode === 'chat' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                 title="Chat Mode"
               >
                 <Bot size={14} />
               </button>
               <button 
                 onClick={() => setViewMode('race')} 
                 className={`p-1.5 rounded transition-colors ${viewMode === 'race' ? 'bg-zinc-800 text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                 title="Race Mode"
               >
                 <Trophy size={14} />
               </button>
               <button 
                 onClick={() => setViewMode('terminal')} 
                 className={`p-1.5 rounded transition-colors ${viewMode === 'terminal' ? 'bg-zinc-800 text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                 title="Terminal Mode"
               >
                 <TerminalIcon size={14} />
               </button>
            </div>
            
            {mode === 'popup' && onOpen && (
               <button 
                  onClick={onOpen}
                  className="p-1.5 rounded-lg bg-black/50 text-zinc-500 hover:text-white border border-white/5 hover:bg-zinc-800 transition-colors"
                  title="Expand to Full View"
               >
                  <Maximize2 size={14} />
               </button>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'terminal' ? (
          <Suspense fallback={<div className="p-4 text-zinc-500">Loading Terminal...</div>}>
            <TerminalMode />
          </Suspense>
        ) : (
          <div className="h-full flex flex-col">
             {/* Model Selector (Chat Mode Only) */}
             {viewMode === 'chat' && (
                <div className="px-4 py-2 border-b border-white/5 bg-black/20 relative z-10">
                   <button 
                     onClick={() => setShowModelSelector(!showModelSelector)}
                     className="w-full flex items-center justify-between text-xs text-zinc-300 bg-zinc-900/50 hover:bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 transition-all"
                   >
                      <span className="flex items-center gap-2">
                         <span>{getModelIcon(currentModel)}</span>
                         <span>{getModelConfig(currentModel)?.displayName}</span>
                      </span>
                      <ChevronDown size={14} />
                   </button>
                   {showModelSelector && (
                      <div className="absolute top-full left-0 right-0 mx-4 mt-2 bg-[#18181b] border border-white/10 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-1">
                         {getAllModels().map(model => (
                            <button
                               key={model.id}
                               onClick={() => { setCurrentModel(model.id); setShowModelSelector(false); }}
                               className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-xs text-zinc-300 text-left"
                            >
                               <span>{model.icon}</span>
                               <span className="flex-1">{model.displayName}</span>
                               {currentModel === model.id && <Sparkles size={12} className="text-gratech-primary" />}
                            </button>
                         ))}
                      </div>
                   )}
                </div>
             )}

             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.length === 0 && viewMode === 'chat' && (
                   <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-70">
                      <AlertCircle size={48} className="mb-4 text-yellow-500/50" />
                      <p className="font-bold text-zinc-400">Local Environment Active</p>
                      <p className="text-xs max-w-xs text-center mt-2">GraTech X is running in client-mode. Backend migration is pending in the Foundry.</p>
                   </div>
                )}
                
                {messages.map((msg, i) => (
                   <div key={i}>
                      {msg.role === 'user' ? (
                         <div className="flex justify-end">
                            <div className="bg-zinc-800 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[85%] text-sm">
                               {msg.text}
                            </div>
                         </div>
                      ) : msg.text === '__RACE_MODE__' ? (
                         <Suspense fallback={<div className="p-2 text-zinc-500 text-xs">Initializing Race...</div>}>
                            <MultiModelRace 
                               query={messages[i-1]?.text || ''} 
                               models={selectedRaceModels} 
                               lang={lang}
                            />
                         </Suspense>
                      ) : (
                         <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 text-lg">
                               {getModelIcon(msg.modelId || currentModel)}
                            </div>
                            <div className="bg-transparent text-zinc-300 max-w-[90%] text-sm leading-relaxed">
                               {renderMessageContent(msg.text)}
                            </div>
                         </div>
                      )}
                   </div>
                ))}
                
                {isLoading && (
                   <div className="flex gap-3 justify-start animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                         <Bot size={16} className="text-gratech-primary" />
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500 text-xs h-8">
                         Thinking<span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 bg-[#18181b] border-t border-white/5">
                <div className="relative flex items-center">
                   <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={viewMode === 'race' ? "Enter prompt for race..." : "Ask GraTech Intelligence..."}
                      className="w-full bg-[#09090b] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-gratech-primary/50 transition-colors"
                   />
                   <button 
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className={`absolute right-2 p-1.5 rounded-lg transition-all ${input.trim() ? 'bg-gratech-primary text-black hover:bg-gratech-secondary' : 'text-zinc-600'}`}
                   >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;