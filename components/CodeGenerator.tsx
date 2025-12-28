import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Code, Play, Copy, Check, Terminal, LayoutTemplate, Zap, Monitor, Eye, EyeOff, Loader2, Paperclip, Mic, ArrowUp, Lightbulb, Clipboard } from 'lucide-react';
import { streamGraTechResponse } from '../services/aiService';

const PROMPT_PATTERNS = [
  "Create a responsive SaaS dashboard with sidebar navigation and data charts.",
  "Build a modern landing page for an AI startup with hero section and feature grid.",
  "Generate a secure login form with email validation and glassmorphism styling.",
  "Implement a kanban board component with drag-and-drop functionality.",
  "Create a cryptocurrency price tracker with real-time updates styling.",
  "Build a file upload component with progress bar and drag-drop zone.",
  "Generate a pricing table with toggle for monthly/yearly billing.",
  "Create a chat interface with message bubbles and input area.",
  "Build a settings page with profile management and notification preferences.",
  "Implement a responsive data table with sorting, filtering, and pagination."
];

const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const codeEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prompt.trim() === '') {
        setSuggestions(PROMPT_PATTERNS.slice(0, 4));
    } else {
        const lower = prompt.toLowerCase();
        const filtered = PROMPT_PATTERNS.filter(p => p.toLowerCase().includes(lower) && p !== prompt);
        setSuggestions(filtered.slice(0, 4));
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedCode(''); // Clear previous code
    setShowPreview(false);
    setShowSuggestions(false);

    try {
      // Use the 'GraTech-Coder' model
      await streamGraTechResponse(
        `Generate a complete, single-file React component (using Tailwind CSS) for the following request. 
         Do not include markdown backticks like \`\`\`tsx. Just raw code.
         Request: ${prompt}`, 
        'GraTech-Coder', 
        (chunk) => {
          setGeneratedCode(prev => prev + chunk);
          // Auto-scroll to bottom of code
          if (codeEndRef.current) {
            codeEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      );
    } catch (err) {
      setGeneratedCode(`// Error: Failed to generate code. Please check your connection.`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] gap-6 p-4 lg:p-6 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="text-gratech-primary w-6 h-6" />
            GraTech Builder
          </h2>
          <p className="text-zinc-500 text-sm font-mono">Powered by GraTech Sovereign Engine</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary ${showPreview ? 'bg-gratech-primary/20 text-gratech-primary border border-gratech-primary/30' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'}`}
          >
            {showPreview ? <Eye size={16} /> : <EyeOff size={16} />}
            {showPreview ? 'Preview Mode' : 'Code Mode'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        
        {/* Left Panel: The Genius Input Square */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl p-1 flex flex-col backdrop-blur-sm shadow-xl relative overflow-hidden group input-square-glow transition-all duration-300">
            
            {/* The Input Square */}
            <div className="relative flex-1 flex flex-col">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="GraTech Builder (Unrestricted): Describe what the public AI couldn't build..."
                className="w-full h-full bg-transparent p-5 text-base text-white placeholder-zinc-600 resize-none focus:outline-none font-sans leading-relaxed z-10"
                aria-label="Code Prompt Input"
              />
              
              {/* IntelliSense Suggestions Popup */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute bottom-16 left-4 right-4 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                  <div className="px-3 py-2 bg-black/40 border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                    <Lightbulb size={12} className="text-yellow-500" />
                    Suggested Patterns
                  </div>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0 truncate flex items-center gap-2 group/btn"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover/btn:bg-gratech-primary transition-colors"></span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Attachment / Action Bar */}
              <div className="p-3 flex items-center justify-between bg-zinc-900 border-t border-white/5 z-20">
                <div className="flex items-center gap-2">
                   <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary" title="Attach File">
                      <Paperclip size={18} />
                   </button>
                   <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary" title="Voice Input">
                      <Mic size={18} />
                   </button>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className={`p-2 px-4 rounded-lg font-bold flex items-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-gratech-primary ${
                    isLoading || !prompt.trim()
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gratech-primary hover:text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                  <span className="text-sm">{isLoading ? 'Generating' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="grid grid-cols-2 gap-2">
              {['Pricing Table', 'Login Screen', 'Dashboard Grid', 'Hero Section'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setPrompt(prev => prev + (prev ? '\n' : '') + t)} 
                  className="text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 py-3 rounded-xl transition-all hover:text-white text-left px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary"
                >
                  + {t}
                </button>
              ))}
          </div>
        </div>

        {/* Right Panel: Code/Preview */}
        <div className="lg:col-span-8 bg-black border border-white/10 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
          <div className="bg-zinc-900/50 border-b border-white/5 p-3 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <span className="text-xs font-mono text-zinc-500 ml-2">result.tsx</span>
            </div>
            
            {generatedCode && (
              <button
                onClick={copyToClipboard}
                className="group flex items-center gap-2 text-sm font-bold bg-gratech-primary/10 hover:bg-gratech-primary text-gratech-primary hover:text-black px-4 py-2 rounded-lg transition-all border border-gratech-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-auto relative font-mono text-sm bg-black/80">
            {showPreview ? (
               <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-zinc-500">
                  <div className="text-center p-8 border border-white/5 rounded-2xl bg-zinc-900/20">
                    <Monitor className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-zinc-300 font-medium">Preview Mode Unavailable</p>
                    <p className="text-xs mt-2 text-zinc-500 max-w-xs mx-auto">This requires a live React runtime. Please copy the code to your local environment.</p>
                  </div>
               </div>
            ) : (
              <div className="p-6 min-h-full">
                {generatedCode ? (
                  <pre className="text-blue-300/90 whitespace-pre-wrap leading-relaxed selection:bg-blue-500/20">
                    {generatedCode}
                    <div ref={codeEndRef} />
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-800 gap-4 opacity-50">
                    <Code className="w-24 h-24" />
                    <p className="text-sm font-sans text-zinc-600">Waiting for input...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;